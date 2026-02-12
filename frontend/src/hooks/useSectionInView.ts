import { useInView } from 'framer-motion';
import { useRef, type RefObject } from 'react';

interface SectionInViewOptions {
    threshold?: number;
    once?: boolean;
    margin?: string;
}

export function useSectionInView(
    options: SectionInViewOptions = {}
): [RefObject<HTMLElement>, boolean] {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, {
        once: options.once ?? false,
        amount: options.threshold ?? 0.3,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        margin: options.margin as any
    });

    return [ref as unknown as RefObject<HTMLElement>, isInView];
}
