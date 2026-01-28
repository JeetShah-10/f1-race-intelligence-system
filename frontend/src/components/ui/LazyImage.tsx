import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    webpSrc?: string;
}

/**
 * LazyImage - Optimized image component with lazy loading and WebP support
 * Features:
 * - Intersection Observer for lazy loading
 * - WebP format with fallback
 * - Fade-in animation on load
 * - Placeholder blur effect
 */
export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYTFhMWEiLz48L3N2Zz4=',
    webpSrc
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Generate WebP source if not provided
    const webpSource = webpSrc || src.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    return (
        <picture>
            {isInView && <source srcSet={webpSource} type="image/webp" />}
            <img
                ref={imgRef}
                src={isInView ? src : placeholder}
                alt={alt}
                className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
                decoding="async"
            />
        </picture>
    );
};

interface LazyBackgroundProps {
    src: string;
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

/**
 * LazyBackground - Optimized background image with lazy loading
 */
export const LazyBackground: React.FC<LazyBackgroundProps> = ({
    src,
    className = '',
    children,
    style = {}
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (divRef.current) {
            observer.observe(divRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isInView) {
            const img = new Image();
            img.src = src;
            img.onload = () => setIsLoaded(true);
        }
    }, [isInView, src]);

    // Try WebP version first
    const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    return (
        <div
            ref={divRef}
            className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
            style={{
                ...style,
                backgroundImage: isLoaded ? `url('${webpSrc}'), url('${src}')` : 'none'
            }}
        >
            {children}
        </div>
    );
};

export default LazyImage;
