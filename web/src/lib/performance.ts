/**
 * Performance optimization utilities
 * Debounce, throttle, intersection observer, and GPU acceleration helpers
 */

/**
 * Debounce function - delays execution until after wait time has elapsed
 * since the last call
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function - ensures function is called at most once per specified time
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Request animation frame wrapper for smooth animations
 */
export function rafThrottle<T extends (...args: any[]) => any>(
    func: T
): (...args: Parameters<T>) => void {
    let rafId: number | null = null;

    return function executedFunction(...args: Parameters<T>) {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
            func(...args);
            rafId = null;
        });
    };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Intersection Observer wrapper with cleanup
 */
export function createIntersectionObserver(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
): IntersectionObserver | null {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
        return null;
    }

    return new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: "0px",
        ...options,
    });
}

/**
 * GPU acceleration helper - adds transform3d to trigger GPU
 */
export function enableGPUAcceleration(element: HTMLElement): void {
    element.style.transform = "translate3d(0, 0, 0)";
    element.style.willChange = "transform";
}

/**
 * Disable GPU acceleration (cleanup)
 */
export function disableGPUAcceleration(element: HTMLElement): void {
    element.style.transform = "";
    element.style.willChange = "";
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
    if (typeof window === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Get device pixel ratio
 */
export function getDevicePixelRatio(): number {
    if (typeof window === "undefined") return 1;
    return window.devicePixelRatio || 1;
}

/**
 * Check if browser supports WebGL
 */
export function supportsWebGL(): boolean {
    if (typeof window === "undefined") return false;

    try {
        const canvas = document.createElement("canvas");
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
    } catch (e) {
        return false;
    }
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(
    img: HTMLImageElement,
    options?: IntersectionObserverInit
): () => void {
    const observer = createIntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target as HTMLImageElement;
                const src = target.dataset.src;

                if (src) {
                    target.src = src;
                    target.removeAttribute("data-src");
                    observer?.unobserve(target);
                }
            }
        });
    }, options);

    if (observer) {
        observer.observe(img);
    }

    // Return cleanup function
    return () => {
        if (observer) {
            observer.unobserve(img);
            observer.disconnect();
        }
    };
}

/**
 * Measure FPS (frames per second)
 */
export function measureFPS(callback: (fps: number) => void, duration = 1000): () => void {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const measureFrame = () => {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime >= lastTime + duration) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            callback(fps);
            frameCount = 0;
            lastTime = currentTime;
        }

        rafId = requestAnimationFrame(measureFrame);
    };

    rafId = requestAnimationFrame(measureFrame);

    // Return cleanup function
    return () => {
        cancelAnimationFrame(rafId);
    };
}

/**
 * Preload images
 */
export function preloadImages(urls: string[]): Promise<void[]> {
    return Promise.all(
        urls.map(
            (url) =>
                new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = reject;
                    img.src = url;
                })
        )
    );
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions(): { width: number; height: number } {
    if (typeof window === "undefined") {
        return { width: 0, height: 0 };
    }

    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight,
    };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, offset = 0): boolean {
    const rect = element.getBoundingClientRect();
    const viewport = getViewportDimensions();

    return (
        rect.top >= -offset &&
        rect.left >= -offset &&
        rect.bottom <= viewport.height + offset &&
        rect.right <= viewport.width + offset
    );
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(
    element: HTMLElement | string,
    options?: ScrollIntoViewOptions
): void {
    const target = typeof element === "string" ? document.querySelector(element) : element;

    if (target) {
        target.scrollIntoView({
            behavior: "smooth",
            block: "start",
            ...options,
        });
    }
}

/**
 * Lock body scroll (useful for modals)
 */
export function lockScroll(): void {
    if (typeof document === "undefined") return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
}

/**
 * Unlock body scroll
 */
export function unlockScroll(): void {
    if (typeof document === "undefined") return;

    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
}
