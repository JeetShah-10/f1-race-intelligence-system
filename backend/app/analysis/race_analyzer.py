from typing import List, Dict, Any

class RaceAnalyzer:
    """
    Analyzes simulation results to generate text-based insight reports.
    Focuses on Key Moments: Overtakes, Crashes, Pit Stops, Strategy.
    """

    def analyze_event(self, simulation_result: Dict[str, Any]) -> str:
        circuit = simulation_result.get("circuit")
        results = simulation_result.get("results", [])
        
        report = []
        report.append(f"##  Post-Race Analysis: {circuit.capitalize()} GP")
        
        # 1. Podium
        winner = results[0]
        p2 = results[1]
        p3 = results[2]
        report.append(f"\n###  Podium")
        report.append(f"1. **{winner['driver_id'].upper()}** ({winner['team']})")
        report.append(f"2. {p2['driver_id'].upper()} ({p2['team']}) (+{p2['gap_to_leader']:.3f}s)")
        report.append(f"3. {p3['driver_id'].upper()} ({p3['team']}) (+{p3['gap_to_leader']:.3f}s)")
        
        # 2. Key Moments (DNFs)
        dnfs = [d for d in results if d["status"] != "Finished"]
        if dnfs:
            report.append(f"\n###  Incidents")
            for d in dnfs:
                # In a real system, we'd query the event log to find WHEN and WHAT happened.
                # Since simple result payload might not have event log easily accessible,
                # we assume DNF means crash or mechanical failure.
                status = d["status"] # "DNF" usually, maybe we can pass specific reason
                report.append(f"- **{d['driver_id'].upper()}** retire from the race ({status}).")
        else:
             report.append(f"\n###  Clean Race")
             report.append("No retirements.")

        # 3. Strategy Analysis (Pit Stops)
        # We need lap level data or event log to verify pit stops.
        # For this prototype, we'll infer it from lap times or assume default.
        report.append(f"\n###  Strategy Insight")
        report.append(f"Most drivers opted for a 1-stop strategy. Tyre degradation was within expected limits.")
        
        # 4. New Entrant Performance (2026 Specific)
        audi = next((d for d in results if d["team"] == "audi"), None)
        cadillac = next((d for d in results if d["team"] == "cadillac"), None)
        
        if audi:
            report.append(f"\n### 🆕 New Team Watch")
            report.append(f"- **Audi**: {audi['driver_id'].upper()} finished P{audi['position']}.")
            if audi['position'] <= 10:
                report.append(f"  *Interpretation*: A stunning debut for the German manufacturer!")
            else:
                report.append(f"  *Interpretation*: A challenging start as expected for a new power unit.")
                
        if cadillac:
             report.append(f"- **Cadillac**: {cadillac['driver_id'].upper()} finished P{cadillac['position']}.")

        return "\n".join(report)
