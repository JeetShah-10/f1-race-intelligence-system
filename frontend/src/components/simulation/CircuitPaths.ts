export interface CircuitSVG {
    id: string;
    viewBox: string;
    path: string;
    length: number;
    mapImage?: string;
}

// ─── Circuit Image Lookup ─────────────────────────────────────────────────
// Maps circuit IDs to their asset filenames in /assets/circuits/
const CIRCUIT_IMAGES: Record<string, { map: string; photo: string }> = {
    bahrain: { map: 'bahrain-grand-prix-map.png', photo: 'bahrain-grand-prix-circuit.webp' },
    jeddah: { map: 'saudi-arabia-grand-prix-map.png', photo: 'saudi-arabia-grand-prix-circuit.webp' },
    melbourne: { map: 'australian-grand-prix-map.png', photo: 'australian-grand-prix-circuit.jpeg' },
    suzuka: { map: 'suzuka-map.png', photo: 'suzuka-circuit.webp' },
    shanghai: { map: 'shanghai-grand-prix-map.png', photo: 'shanghai-grand-prix-circuit.webp' },
    miami: { map: 'miami-grand-prix-map.png', photo: 'miami-grand-prix-circuit.webp' },
    monaco: { map: 'monaco-map.png', photo: 'monaco-circuit.webp' },
    canada: { map: 'canadian-grand-prix-map.png', photo: 'canadian-grand-prix-circuit.webp' },
    barcelona: { map: 'barcelona-map.png', photo: 'barcelona-circuit.webp' },
    austria: { map: 'austrian-grand-prix-map.png', photo: 'austrian-grand-prix-circuit.webp' },
    silverstone: { map: 'silverstone-map.png', photo: 'silverstone-circuit.webp' },
    hungary: { map: 'hungarian-grand-prix-map.png', photo: 'hungarian-grand-prix-circuit.webp' },
    spa: { map: 'spa-map.png', photo: 'spa-circuit.webp' },
    zandvoort: { map: 'zandvoort-map.png', photo: 'zandvoort-circuit.webp' },
    monza: { map: 'monza-map.png', photo: 'monza-circuit.webp' },
    baku: { map: 'baku-map.png', photo: 'baku-circuit.webp' },
    singapore: { map: 'singapore-map.png', photo: 'singapore-circuit.webp' },
    austin: { map: 'austin-map.png', photo: 'austin-circuit.webp' },
    mexico: { map: 'mexico-grand-prix-map.png', photo: 'mexico-grand-prix-circuit.webp' },
    brazil: { map: 'sao-paulo-grand-prix-map.png', photo: 'sao-paulo-grand-prix-circuit.webp' },
    las_vegas: { map: 'las-vegas-grand-prix-map.png', photo: 'las-vegas-grand-prix-circuit.webp' },
    qatar: { map: 'qatar-grand-prix-map.png', photo: 'qatar-grand-prix-circuit.webp' },
    abu_dhabi: { map: 'abu-dhabi-grand-prix-map.png', photo: 'abu-dhabi-grand-prix-circuit.webp' },
    madrid: { map: 'madrid-grand-prix-map.png', photo: 'madrid-grand-prix-circuit.webp' },
};

export function getCircuitImage(id: string): { map: string; photo: string } {
    const entry = CIRCUIT_IMAGES[id];
    if (entry) return { map: `/assets/circuits/${entry.map}`, photo: `/assets/circuits/${entry.photo}` };
    return { map: '', photo: '' };
}

// ─── SVG Paths ────────────────────────────────────────────────────────────
// Each path is an approximate layout for driver dot animation.
// These will be replaced by accurate FastF1 track coordinates from the backend.
export const CIRCUIT_PATHS: Record<string, CircuitSVG> = {
    bahrain: {
        id: 'bahrain', viewBox: '0 0 500 350', length: 5412,
        path: 'M 190 290 L 350 290 C 370 290 380 280 380 260 L 380 180 C 380 160 390 150 410 150 L 440 150 C 460 150 470 140 470 120 C 470 100 460 80 440 80 L 380 80 C 360 80 350 90 350 110 L 350 130 L 320 130 C 300 130 290 120 290 100 L 290 60 C 290 40 280 30 260 30 L 180 30 C 160 30 150 40 150 60 C 150 80 140 90 120 90 L 80 90 C 60 90 50 100 50 120 C 50 140 60 150 80 150 L 120 150 L 120 200 C 120 220 110 230 90 230 L 60 230 C 40 230 30 240 30 260 C 30 280 40 290 60 290 L 190 290 Z',
        mapImage: '/assets/circuits/bahrain-grand-prix-map.png',
    },
    jeddah: {
        id: 'jeddah', viewBox: '0 0 300 600', length: 6174,
        path: 'M 100 550 C 120 580 180 580 200 550 L 220 400 C 230 350 220 300 240 250 C 260 200 270 150 250 100 C 230 50 180 20 150 20 C 120 20 70 50 50 100 C 30 150 40 200 60 250 C 80 300 70 350 80 400 L 100 550 Z',
        mapImage: '/assets/circuits/saudi-arabia-grand-prix-map.png',
    },
    melbourne: {
        id: 'melbourne', viewBox: '0 0 500 400', length: 5278,
        path: 'M 150 330 L 350 330 C 380 330 400 310 400 280 L 400 200 C 400 180 420 160 440 160 C 460 160 470 150 470 130 C 470 110 450 100 430 100 L 300 100 C 280 100 270 90 270 70 C 270 50 260 40 240 40 L 180 40 C 150 40 130 60 130 90 L 130 150 C 130 170 110 180 90 180 L 60 180 C 40 180 30 200 30 230 C 30 260 50 280 80 280 L 120 280 C 140 280 150 300 150 330 Z',
        mapImage: '/assets/circuits/australian-grand-prix-map.png',
    },
    suzuka: {
        id: 'suzuka', viewBox: '0 0 500 400', length: 5807,
        path: 'M 150 350 L 350 350 C 380 350 400 330 400 300 L 400 250 C 400 230 380 220 360 220 L 300 220 L 250 150 L 300 80 L 350 80 C 370 80 380 70 380 50 C 380 30 370 20 350 20 L 250 20 C 220 20 200 40 200 70 L 200 100 C 200 120 180 130 160 130 L 100 130 C 80 130 60 150 60 180 L 60 250 C 60 280 80 300 110 300 L 130 300 C 140 300 150 310 150 350 Z',
        mapImage: '/assets/circuits/suzuka-map.png',
    },
    monaco: {
        id: 'monaco', viewBox: '0 0 400 400', length: 3337,
        path: 'M 180 350 L 220 350 C 240 350 250 340 250 320 L 250 280 C 250 260 260 250 280 250 L 320 250 C 340 250 350 240 350 220 L 350 150 C 350 130 340 120 320 120 L 280 120 C 260 120 250 110 250 90 L 250 60 C 250 40 240 30 220 30 L 150 30 C 130 30 120 40 120 60 L 120 100 C 120 120 110 130 90 130 L 60 130 C 40 130 30 140 30 160 C 30 180 40 190 60 190 L 100 190 C 120 190 130 200 130 220 L 130 280 C 130 300 140 310 160 310 L 180 350 Z',
        mapImage: '/assets/circuits/monaco-map.png',
    },
    shanghai: {
        id: 'shanghai', viewBox: '0 0 500 500', length: 5451,
        path: 'M 250 450 C 280 450 350 440 380 400 L 420 300 C 430 250 420 200 380 150 C 360 120 300 100 250 120 L 200 140 C 180 150 160 140 160 120 L 160 80 C 160 60 180 50 200 50 L 300 50 C 350 50 380 80 400 120 L 400 400 C 400 450 250 450 200 450 Z',
        mapImage: '/assets/circuits/shanghai-grand-prix-map.png',
    },
    miami: {
        id: 'miami', viewBox: '0 0 500 500', length: 5412,
        path: 'M 200 450 L 250 450 C 300 450 350 400 350 350 L 350 150 C 350 100 300 50 250 50 L 200 50 C 150 50 100 100 100 150 L 100 350 C 100 400 150 450 200 450 Z',
        mapImage: '/assets/circuits/miami-grand-prix-map.png',
    },
    canada: {
        id: 'canada', viewBox: '0 0 500 500', length: 4361,
        path: 'M 100 400 L 400 400 C 450 400 450 350 400 350 L 200 350 C 150 350 100 300 100 250 C 100 200 150 150 200 150 L 350 150 C 400 150 450 100 400 50 L 100 50 C 50 50 50 100 50 150 L 50 350 C 50 400 50 400 100 400 Z',
        mapImage: '/assets/circuits/canadian-grand-prix-map.png',
    },
    barcelona: {
        id: 'barcelona', viewBox: '0 0 500 500', length: 4657,
        path: 'M 100 450 L 400 450 C 450 450 450 400 400 350 L 350 300 C 300 250 350 200 400 150 C 450 100 400 50 350 50 L 150 50 C 100 50 50 100 50 150 L 50 350 C 50 400 80 450 100 450 Z',
        mapImage: '/assets/circuits/barcelona-map.png',
    },
    austria: {
        id: 'austria', viewBox: '0 0 400 500', length: 4318,
        path: 'M 200 450 L 350 450 C 380 450 380 400 350 380 L 280 300 C 260 270 280 240 300 210 L 350 140 C 370 100 350 60 300 50 L 150 50 C 100 50 80 80 80 120 L 80 350 C 80 400 120 450 200 450 Z',
        mapImage: '/assets/circuits/austrian-grand-prix-map.png',
    },
    silverstone: {
        id: 'silverstone', viewBox: '0 0 500 500', length: 5891,
        path: 'M 250 450 L 400 400 C 450 380 450 320 400 300 L 350 200 L 400 100 C 450 50 400 50 350 50 L 150 50 C 100 50 100 100 150 150 L 150 350 C 150 400 200 450 250 450 Z',
        mapImage: '/assets/circuits/silverstone-map.png',
    },
    hungary: {
        id: 'hungary', viewBox: '0 0 500 500', length: 4381,
        path: 'M 150 450 C 100 450 80 400 80 350 L 80 150 C 80 100 120 60 180 60 L 350 60 C 400 60 420 100 420 150 L 420 200 C 420 250 380 270 340 250 L 280 220 C 240 200 200 230 200 280 L 200 350 C 200 400 180 450 150 450 Z',
        mapImage: '/assets/circuits/hungarian-grand-prix-map.png',
    },
    spa: {
        id: 'spa', viewBox: '0 0 500 600', length: 7004,
        path: 'M 250 550 L 400 550 C 450 550 450 500 400 480 L 320 440 C 280 420 300 380 340 360 L 420 300 C 460 260 440 200 400 180 L 340 140 C 300 120 320 80 360 60 L 400 50 C 430 40 430 60 400 80 L 200 200 C 150 240 120 300 140 360 L 180 440 C 200 500 220 550 250 550 Z',
        mapImage: '/assets/circuits/spa-map.png',
    },
    zandvoort: {
        id: 'zandvoort', viewBox: '0 0 500 400', length: 4259,
        path: 'M 180 350 C 130 350 100 300 100 250 L 100 150 C 100 100 140 70 200 70 L 350 70 C 400 70 420 110 420 160 L 420 250 C 420 300 380 340 330 340 L 260 340 C 220 340 210 350 180 350 Z',
        mapImage: '/assets/circuits/zandvoort-map.png',
    },
    monza: {
        id: 'monza', viewBox: '0 0 500 500', length: 5793,
        path: 'M 100 450 L 400 450 C 450 450 460 400 440 350 L 400 250 C 380 200 400 150 420 100 C 440 50 400 30 350 30 L 150 30 C 100 30 60 70 60 120 L 60 350 C 60 400 80 450 100 450 Z',
        mapImage: '/assets/circuits/monza-map.png',
    },
    baku: {
        id: 'baku', viewBox: '0 0 300 600', length: 6003,
        path: 'M 150 550 L 200 550 C 230 550 250 530 250 500 L 250 120 C 250 80 220 50 180 50 L 120 50 C 80 50 50 80 50 120 L 50 450 C 50 500 80 550 150 550 Z',
        mapImage: '/assets/circuits/baku-map.png',
    },
    singapore: {
        id: 'singapore', viewBox: '0 0 500 500', length: 4940,
        path: 'M 150 450 L 350 450 C 400 450 430 400 430 350 L 430 200 C 430 150 400 120 350 120 L 200 120 C 150 120 120 90 120 60 C 120 30 100 20 80 40 L 60 80 C 40 120 50 200 60 250 L 80 350 C 90 400 120 450 150 450 Z',
        mapImage: '/assets/circuits/singapore-map.png',
    },
    austin: {
        id: 'austin', viewBox: '0 0 500 500', length: 5513,
        path: 'M 250 450 L 400 450 C 440 450 460 420 440 380 L 380 280 C 360 240 380 200 400 160 L 440 100 C 460 60 430 30 380 30 L 150 30 C 100 30 70 60 70 110 L 70 350 C 70 400 110 450 160 450 L 250 450 Z',
        mapImage: '/assets/circuits/austin-map.png',
    },
    mexico: {
        id: 'mexico', viewBox: '0 0 500 500', length: 4304,
        path: 'M 200 450 L 350 450 C 400 450 430 400 430 350 L 430 200 C 430 150 400 100 350 80 L 200 80 C 150 80 100 120 100 180 L 100 250 C 100 300 80 330 100 380 C 120 430 160 450 200 450 Z',
        mapImage: '/assets/circuits/mexico-grand-prix-map.png',
    },
    brazil: {
        id: 'brazil', viewBox: '0 0 500 400', length: 4309,
        path: 'M 150 350 L 350 350 C 400 350 420 310 400 270 L 350 180 C 320 130 340 80 380 60 L 400 50 C 420 40 420 60 380 90 L 200 200 C 160 230 120 280 120 320 C 120 350 130 350 150 350 Z',
        mapImage: '/assets/circuits/sao-paulo-grand-prix-map.png',
    },
    las_vegas: {
        id: 'las_vegas', viewBox: '0 0 600 400', length: 6201,
        path: 'M 100 350 L 500 350 C 540 350 550 320 550 280 L 550 150 C 550 100 520 60 470 60 L 150 60 C 100 60 60 100 60 150 L 60 280 C 60 320 80 350 100 350 Z',
        mapImage: '/assets/circuits/las-vegas-grand-prix-map.png',
    },
    qatar: {
        id: 'qatar', viewBox: '0 0 500 400', length: 5419,
        path: 'M 200 350 L 400 350 C 440 350 460 310 440 270 L 400 200 C 380 160 400 120 420 80 C 440 40 400 20 360 20 L 150 20 C 100 20 70 60 70 110 L 70 280 C 70 320 100 350 200 350 Z',
        mapImage: '/assets/circuits/qatar-grand-prix-map.png',
    },
    abu_dhabi: {
        id: 'abu_dhabi', viewBox: '0 0 500 500', length: 5281,
        path: 'M 200 450 L 350 450 C 400 450 430 400 430 350 L 430 150 C 430 100 400 60 350 60 L 150 60 C 100 60 70 100 70 150 L 70 350 C 70 400 100 450 200 450 Z',
        mapImage: '/assets/circuits/abu-dhabi-grand-prix-map.png',
    },
    madrid: {
        id: 'madrid', viewBox: '0 0 500 500', length: 5474,
        path: 'M 200 450 L 350 450 C 400 450 430 400 430 350 L 430 200 C 430 150 400 100 350 80 L 200 80 C 150 80 100 120 100 180 L 100 350 C 100 400 130 450 200 450 Z',
        mapImage: '/assets/circuits/madrid-grand-prix-map.png',
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────

export function getCircuitPath(id: string): CircuitSVG {
    if (CIRCUIT_PATHS[id]) return CIRCUIT_PATHS[id];

    // Fallback oval
    return {
        id: 'fallback',
        viewBox: '0 0 500 450',
        length: 5000,
        path: 'M 180 50 C 320 50 420 80 450 180 C 480 280 420 380 320 400 L 180 400 C 80 380 20 280 50 180 C 80 80 120 50 180 50 Z',
        mapImage: undefined,
    };
}
