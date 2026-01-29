/**
 * Custom hook for scroll-triggered animations using GSAP ScrollTrigger
 * Auto-registers and cleans up ScrollTrigger instances
 */

import { useEffect, useRef, MutableRefObject } from "react";
import { gsap } from "gsap";

// Dynamically import ScrollTrigger to avoid SSR issues
if (typeof window !== "undefined") {
    import("gsap/ScrollTrigger").then((module) => {
        gsap.registerPlugin(module.ScrollTrigger);
    });
}

export interface ScrollAnimationConfig {
    /**
     * Animation properties to animate from
     */
    from?: gsap.TweenVars;

    /**
     * Animation properties to animate to
     */
    to?: gsap.TweenVars;

    /**
     * ScrollTrigger configuration
     */
    scrollTrigger?: {
        start?: string;
        end?: string;
        scrub?: boolean | number;
        pin?: boolean;
        markers?: boolean;
        toggleActions?: string;
        onEnter?: () => void;
        onLeave?: () => void;
        onEnterBack?: () => void;
        onLeaveBack?: () => void;
    };

    /**
     * Animation duration (if not using scrub)
     */
    duration?: number;

    /**
     * Animation easing
     */
    ease?: string;

    /**
     * Delay before animation starts
     */
    delay?: number;
}

/**
 * Hook for scroll-triggered animations
 * 
 * @example
 * const ref = useScrollAnimation({
 *   from: { opacity: 0, y: 50 },
 *   to: { opacity: 1, y: 0 },
 *   scrollTrigger: {
 *     start: "top 80%",
 *     end: "bottom 20%",
 *   }
 * });
 * 
 * return <div ref={ref}>Animated content</div>
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    config: ScrollAnimationConfig
): MutableRefObject<T | null> {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;
        const { from, to, scrollTrigger, duration = 1, ease = "power3.out", delay = 0 } = config;

        // Create animation
        const animation = gsap.fromTo(
            element,
            from || {},
            {
                ...to,
                duration,
                ease,
                delay,
                scrollTrigger: scrollTrigger ? {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                    ...scrollTrigger,
                } : undefined,
            }
        );

        // Cleanup
        return () => {
            animation.kill();
        };
    }, [config]);

    return ref;
}

/**
 * Hook for batch scroll animations (multiple elements)
 * 
 * @example
 * const refs = useScrollAnimationBatch(3, {
 *   from: { opacity: 0, y: 30 },
 *   to: { opacity: 1, y: 0 },
 *   stagger: 0.1
 * });
 * 
 * return (
 *   <>
 *     <div ref={refs[0]}>Item 1</div>
 *     <div ref={refs[1]}>Item 2</div>
 *     <div ref={refs[2]}>Item 3</div>
 *   </>
 * );
 */
export function useScrollAnimationBatch<T extends HTMLElement = HTMLDivElement>(
    count: number,
    config: ScrollAnimationConfig & { stagger?: number }
): MutableRefObject<T | null>[] {
    const refs = useRef<(T | null)[]>(Array(count).fill(null));

    useEffect(() => {
        const elements = refs.current.filter(Boolean) as T[];
        if (elements.length === 0) return;

        const { from, to, scrollTrigger, duration = 1, ease = "power3.out", stagger = 0.1 } = config;

        // Create batch animation
        const animation = gsap.fromTo(
            elements,
            from || {},
            {
                ...to,
                duration,
                ease,
                stagger,
                scrollTrigger: scrollTrigger ? {
                    trigger: elements[0],
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                    ...scrollTrigger,
                } : undefined,
            }
        );

        // Cleanup
        return () => {
            animation.kill();
        };
    }, [config, count]);

    // Return array of ref setters
    return Array.from({ length: count }, (_, i) => ({
        current: null,
        get current() {
            return refs.current[i];
        },
        set current(value: T | null) {
            refs.current[i] = value;
        },
    })) as MutableRefObject<T | null>[];
}

/**
 * Hook for pinned scroll sections
 * 
 * @example
 * const ref = usePinnedScroll({
 *   pin: true,
 *   scrub: 1,
 *   start: "top top",
 *   end: "+=100%"
 * });
 */
export function usePinnedScroll<T extends HTMLElement = HTMLDivElement>(
    config: {
        pin?: boolean;
        scrub?: boolean | number;
        start?: string;
        end?: string;
        markers?: boolean;
    } = {}
): MutableRefObject<T | null> {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current) return;
        if (typeof window === "undefined") return;

        import("gsap/ScrollTrigger").then((module) => {
            const ScrollTrigger = module.ScrollTrigger;

            const trigger = ScrollTrigger.create({
                trigger: ref.current,
                pin: config.pin ?? true,
                scrub: config.scrub ?? true,
                start: config.start ?? "top top",
                end: config.end ?? "+=100%",
                markers: config.markers ?? false,
            });

            return () => {
                trigger.kill();
            };
        });
    }, [config]);

    return ref;
}

/**
 * Hook for horizontal scroll sections
 * 
 * @example
 * const { containerRef, scrollRef } = useHorizontalScroll();
 * 
 * return (
 *   <div ref={containerRef}>
 *     <div ref={scrollRef} style={{ display: 'flex' }}>
 *       <div>Item 1</div>
 *       <div>Item 2</div>
 *     </div>
 *   </div>
 * );
 */
export function useHorizontalScroll<
    TContainer extends HTMLElement = HTMLDivElement,
    TScroll extends HTMLElement = HTMLDivElement
>() {
    const containerRef = useRef<TContainer>(null);
    const scrollRef = useRef<TScroll>(null);

    useEffect(() => {
        if (!containerRef.current || !scrollRef.current) return;
        if (typeof window === "undefined") return;

        import("gsap/ScrollTrigger").then((module) => {
            const ScrollTrigger = module.ScrollTrigger;

            const scrollWidth = scrollRef.current!.scrollWidth;
            const containerWidth = containerRef.current!.offsetWidth;

            const animation = gsap.to(scrollRef.current, {
                x: -(scrollWidth - containerWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 1,
                    end: () => `+=${scrollWidth - containerWidth}`,
                    invalidateOnRefresh: true,
                },
            });

            return () => {
                animation.kill();
            };
        });
    }, []);

    return { containerRef, scrollRef };
}
