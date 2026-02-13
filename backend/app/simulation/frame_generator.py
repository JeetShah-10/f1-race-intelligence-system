# backend/app/simulation/frame_generator.py
"""
Frame Generator - Converts lap-by-lap simulation output into
0.1s interpolated position frames for frontend playback.

The Master Plan specifies a pre-calculated frame format where every 0.1s,
each driver has: position, gap, trackProgress (0-1), tyre info, and status.
"""

import uuid
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from app.simulation.lap_snapshot import LapSnapshot


FRAME_INTERVAL = 0.1  # seconds between frames


@dataclass
class DriverFrame:
    """State of one driver at a single time frame."""
    id: str
    position: int
    gap: float
    track_progress: float   # 0.0 -> 1.0 within current lap
    compound: str
    tyre_age: int
    pit_stops: int
    status: str              # "RUNNING" | "PIT" | "DNF"

    def to_dict(self) -> dict:
        """Serialize to guide-spec format with x/y progress coordinates."""
        return {
            "id": self.id,
            "pos": self.position,
            "x": round(self.track_progress, 4),    # Normalized track position
            "y": 0.0,                                # Lateral offset (future: racing line)
            "gap": round(self.gap, 3),
            "tyre": self.compound,
            "age": self.tyre_age,
            "pits": self.pit_stops,
            "status": self.status,
        }


@dataclass
class SimFrame:
    """One time-slice of the entire race."""
    t: float                     # timestamp in race seconds
    positions: List[dict]        # List of DriverFrame dicts
    sc_status: str = "CLEAR"

    def to_dict(self) -> dict:
        return {
            "t": round(self.t, 1),
            "cars": self.positions,
            "scStatus": self.sc_status,
        }


@dataclass
class SimEvent:
    """A notable event during the race."""
    time: float
    type: str
    description: str
    drivers: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "time": round(self.time, 1),
            "type": self.type,
            "description": self.description,
            "drivers": self.drivers,
        }


class FrameGenerator:
    """
    Converts RaceEngine snapshots into pre-calculated 0.1s frames.
    
    The interpolation works by treating each lap as a time span equal
    to the leader's lap time. Within that span, each driver's track
    progress is linearly interpolated from 0.0 to 1.0.
    """

    def __init__(self, snapshots: List[LapSnapshot], driver_events: Dict[str, List[dict]], track_id: str = "unknown"):
        """
        Args:
            snapshots: List of LapSnapshot from RaceEngine (one per lap)
            driver_events: Dict of driver_id -> list of event dicts from DriverState
        """
        self.snapshots = snapshots
        self.driver_events = driver_events
        self.track_id = track_id

    def generate(self) -> Dict[str, Any]:
        """
        Main entry: produces the full pre-calculated result.
        
        Returns dict with:
            simulationId, totalDuration, events[], frames[]
        """
        if not self.snapshots:
            return {
                "simulationId": str(uuid.uuid4()),
                "totalDuration": 0,
                "events": [],
                "frames": [],
            }

        # Build timeline
        events = self._extract_events()
        frames = self._interpolate_frames()

        total_duration = frames[-1]["t"] if frames else 0

        return {
            "simulationId": f"sim_{uuid.uuid4().hex[:12]}",
            "trackId": self.track_id,
            "totalDuration": round(total_duration, 1),
            "events": [e.to_dict() for e in events],
            "frames": frames,
        }

    def _extract_events(self) -> List[SimEvent]:
        """Extract all notable events into a flat timeline."""
        events: List[SimEvent] = []
        race_time = 0.0

        for snap in self.snapshots:
            # Approximate race time at start of this lap
            leader_id = snap.driver_positions[0] if snap.driver_positions else None
            leader_lap_time = snap.lap_times.get(leader_id, 90.0) if leader_id else 90.0

            lap_start_time = race_time

            # DNFs this lap
            for dnf_id in snap.dnf_this_lap:
                driver_evts = self.driver_events.get(dnf_id, [])
                for ev in driver_evts:
                    if ev.get("lap") == snap.lap_number:
                        events.append(SimEvent(
                            time=lap_start_time + leader_lap_time * 0.5,
                            type=ev.get("type", "DNF"),
                            description=ev.get("description", f"{dnf_id} retired"),
                            drivers=[dnf_id],
                        ))

            # Safety car
            if snap.sc_status != "CLEAR":
                events.append(SimEvent(
                    time=lap_start_time,
                    type=snap.sc_status,
                    description=f"{snap.sc_status} deployed on lap {snap.lap_number}",
                    drivers=[],
                ))

            race_time += leader_lap_time

        # Overtakes from driver events
        for driver_id, evts in self.driver_events.items():
            for ev in evts:
                if ev.get("type") == "OVERTAKE":
                    lap = ev.get("lap", 0)
                    # Estimate time based on lap
                    est_time = self._estimate_time_at_lap(lap) + 45.0
                    events.append(SimEvent(
                        time=est_time,
                        type="OVERTAKE",
                        description=ev.get("description", f"{driver_id} overtakes"),
                        drivers=[driver_id, ev.get("defender", "")],
                    ))

        # Pit stops from driver events
        for driver_id, evts in self.driver_events.items():
            for ev in evts:
                if ev.get("type") == "PIT_STOP":
                    lap = ev.get("lap", 0)
                    est_time = self._estimate_time_at_lap(lap) + 80.0
                    events.append(SimEvent(
                        time=est_time,
                        type="PIT_STOP",
                        description=ev.get("description", f"{driver_id} pits"),
                        drivers=[driver_id],
                    ))

        # Sort by time
        events.sort(key=lambda e: e.time)
        return events

    def _estimate_time_at_lap(self, lap: int) -> float:
        """Estimate race clock at the start of a given lap."""
        t = 0.0
        for snap in self.snapshots:
            if snap.lap_number >= lap:
                break
            leader_id = snap.driver_positions[0] if snap.driver_positions else None
            t += snap.lap_times.get(leader_id, 90.0) if leader_id else 90.0
        return t

    def _interpolate_frames(self) -> List[dict]:
        """
        Generate one frame every FRAME_INTERVAL seconds.
        
        For each frame, we determine which lap we're in, how far through
        that lap we are, and compute each driver's interpolated state.
        """
        if not self.snapshots:
            return []

        # Build lap boundaries: cumulative race time at END of each lap
        lap_end_times: List[float] = []
        cumulative = 0.0
        leader_lap_times: List[float] = []

        for snap in self.snapshots:
            leader_id = snap.driver_positions[0] if snap.driver_positions else None
            lt = snap.lap_times.get(leader_id, 90.0) if leader_id else 90.0
            leader_lap_times.append(lt)
            cumulative += lt
            lap_end_times.append(cumulative)

        total_race_time = cumulative
        frames: List[dict] = []

        t = 0.0
        while t <= total_race_time:
            # Find which lap we're in
            lap_idx = 0
            for i, end_t in enumerate(lap_end_times):
                if t <= end_t:
                    lap_idx = i
                    break
            else:
                lap_idx = len(self.snapshots) - 1

            snap = self.snapshots[lap_idx]
            lap_start = lap_end_times[lap_idx - 1] if lap_idx > 0 else 0.0
            lap_duration = leader_lap_times[lap_idx]
            progress_in_lap = (t - lap_start) / lap_duration if lap_duration > 0 else 0.0
            progress_in_lap = max(0.0, min(1.0, progress_in_lap))

            # Build driver frames
            driver_frames = []
            for pos_idx, driver_id in enumerate(snap.driver_positions):
                gap = snap.gaps_to_leader.get(driver_id, 0.0)
                compound = snap.tyre_compounds.get(driver_id, "MEDIUM")
                tyre_age = snap.tyre_ages.get(driver_id, 0)
                pits = snap.pit_stop_counts.get(driver_id, 0)

                # Determine status
                status = "RUNNING"
                if driver_id in snap.dnf_this_lap:
                    status = "DNF"

                # Per-driver track progress: leader is at `progress_in_lap`,
                # others are behind based on gap relative to lap time
                gap_fraction = gap / lap_duration if lap_duration > 0 else 0.0
                driver_progress = max(0.0, progress_in_lap - gap_fraction)

                df = DriverFrame(
                    id=driver_id,
                    position=pos_idx + 1,
                    gap=gap,
                    track_progress=driver_progress,
                    compound=compound,
                    tyre_age=tyre_age,
                    pit_stops=pits,
                    status=status,
                )
                driver_frames.append(df.to_dict())

            frame = SimFrame(
                t=t,
                positions=driver_frames,
                sc_status=snap.sc_status,
            )
            frames.append(frame.to_dict())

            t += FRAME_INTERVAL

        return frames
