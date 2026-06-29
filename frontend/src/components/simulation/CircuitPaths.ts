export interface CircuitSVG {
    id: string;
    viewBox: string;
    path: string;
    length: number;
    mapImage?: string;
    hasAccuratePath?: boolean;
}

//  Circuit Image Lookup 
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

//  SVG Paths 
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
        id: 'monaco', viewBox: '0 0 411.72235 343.69802', length: 3337,
        path: 'm352.8 4.1504c-13.81 0.8243-23.48 12.177-34.76 18.75-15.132 10.842-32.937 19.166-44.42 34.236-3.8081 11.918 7.2143 21.834 7.6992 33.469 2.3799 12.877-3.9727 27.691-17.039 31.797-21.608 7.9502-44.019-3.3155-66.164-0.58398-15.249 1.2564-30.576 4.4208-45.71 1.0769-13.872-2.7824-28.009-3.0697-42.061-3.0837-20.279-0.65526-40.401-4.4655-60.107-8.5499-9.8358 3.4808-9.1748 16.051-15.302 23.046-9.2645 14.858-16.918 30.931-19.749 48.338-10.382 42.601-16.335 87.914-5.9935 131.09 2.9845 6.9487-1.9927 16.823 5.5254 21.516 8.5182 5.6162 19.511 4.4647 29.15 4.5723 6.3627-3.221 3.5124-12.152-0.89324-15.875-6.8457-7.1679-11.759-15.961-14.144-25.596-4.1818-13.935-6.0953-29.779-0.05469-43.404 4.8274-5.2939 10.31-10.783 10.423-18.477 2.5399-11.575 5.598-24.511-0.11424-35.558-6.7172-18.477 1.3628-38.363 12.014-53.545 5.3451-6.2228 10.439-14.267 18.566-16.574 12.2-1.5865 24.011 3.4785 36.021 4.8867 20.127 4.04 40.985 5.4105 60.521 11.713 5.4989 3.2393 13.36 5.9094 18.477 0.5171 10.835-5.0042 22.484 1.5092 33.75 0.85938 45.376 3.648 94.373-5.7234 129.19-36.775 23.603-21.125 44.441-46.111 58.145-74.801 3.2737-6.3889 3.6047-17.129-4.7976-19.494-8.795-2.811-18.662-1.7299-27.287 1.0391-6.7679 3.5504-5.7201 12.534-1.7773 17.836 2.2246 4.0916 6.7494 10.278 2.7715 14.559-5.2639 1.897-12.792-1.8673-11.882-8.136-1.2118-9.6578-5.9329-20.115-0.9949-29.337 1.655-3.8575-0.53501-8.6517-4.8828-9.2363 2.5888 1.5696-3.0196-1.1724-4.1191-0.27539z',
        mapImage: '/assets/circuits/monaco-map.png',
        hasAccuratePath: true,
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
        id: 'abu_dhabi', viewBox: '0 0 439.41938 499.4953', length: 5281,
        path: 'm431.61 6.6182c-3.3477-4.0298-8.3958-2.341-41.441 9.8359-18.537 6.8309-39.522 14.534-46.634 17.116-7.1116 2.5826-13.552 5.0006-14.311 5.3739-0.75942 0.37338-21.89 8.2536-46.957 17.512-25.067 9.2579-62.517 23.092-83.223 30.742-20.706 7.6502-48.358 18.562-61.451 24.248-13.092 5.686-41.603 16.913-63.357 24.949-38.402 14.186-45.609 17.506-45.246 20.839 0.08851 0.81344 2.6604 4.3766 5.7142 7.9192 6.9717 8.0874 7.9848 11.134 5.0395 15.148-1.2214 1.6647-5.0006 6.7421-8.3986 11.284-19.024 25.427-25.312 40.312-26.306 62.281-0.93897 20.75-0.02187 110.59 1.2621 123.6 2.1666 21.963 3.0438 26.465 13.644 70.052 5.738 23.595 10.863 42.438 11.915 43.806 2.1716 2.8235 6.5319 4.3237 8.3297 2.8654 3.1293-2.5383 13.696-6.7883 15.911-6.3999 1.3467 0.2362 3.926 1.7796 5.7325 3.4305 2.0346 1.8595 4.5342 3.0918 6.5688 3.24 3.274 0.23845 3.3364 0.19418 19.903-14.184 15.838-13.746 16.628-14.566 16.839-17.468 0.4085-5.6089-1.4735-8.2319-14.155-19.727-20.688-18.752-52.986-48.829-54.687-50.927-2.4108-2.9722-3.8486-11.029-5.5777-31.265-1.2039-14.09-1.162-18.968 0.19135-22.233 1.9318-4.6602 17.809-25.225 22.204-28.759 1.5517-1.2483 3.5471-2.3552 4.4332-2.4592 1.0647-0.12495 5.2707 3.3344 12.403 10.2 12.627 12.155 16.401 14.979 19.278 14.426 2.4039-0.46254 26.683-21.342 28.631-24.621 1.7699-2.9798-0.14855-10.06-4.881-18.013-3.9813-6.691-5.4372-8.184-31.765-32.549-28.74-26.597-28.893-26.77-28.038-32.282 0.68926-4.4478 19.548-51.7 21.972-55.052 1.4532-2.0099 3.951-4.147 6.4612-5.5275 3.4946-1.9219 4.6021-2.0059 7.5817-0.57428 2.1302 1.0235 16.013 13.334 35.645 31.605 77.013 71.677 95.226 88.463 97.895 90.222 4.1039 2.7043 11.606 2.5116 15.183-0.38976 3.1204-2.531 37.322-46.725 43.104-55.697 5.5106-8.5514 5.4379-11.111-0.78195-27.56-2.9716-7.8583-5.9137-16.604-6.5392-19.434-2.3841-10.786 0.12005-23.821 6.5801-34.243 5.1419-8.295 10.915-12.391 27.932-19.822 24.28-10.603 36.497-19.201 54.123-38.088 5.2939-5.6728 10.884-11.62 12.422-13.216 25.575-26.551 24.555-24.949 21.171-33.26-1.4859-3.6501-2.5296-7.4967-2.3204-8.547 0.48007-2.4105 1.8869-3.0654 20.674-9.6272 20.249-7.0722 23.08-9.5947 18.738-16.705-0.48551-0.79518-0.92968-1.4887-1.4079-2.0644z',
        mapImage: '/assets/circuits/abu-dhabi-grand-prix-map.png',
        hasAccuratePath: true,
    },
    madrid: {
        id: 'madrid', viewBox: '0 0 500 500', length: 5474,
        path: 'M 200 450 L 350 450 C 400 450 430 400 430 350 L 430 200 C 430 150 400 100 350 80 L 200 80 C 150 80 100 120 100 180 L 100 350 C 100 400 130 450 200 450 Z',
        mapImage: '/assets/circuits/madrid-grand-prix-map.png',
    },
};

//  Helpers 

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
