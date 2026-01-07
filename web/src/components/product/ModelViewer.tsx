"use client";

import { useEffect, useRef } from "react";
import "@google/model-viewer";

interface ModelViewerProps {
    src: string;
    poster?: string;
    alt: string;
}

export function ModelViewer({ src, poster, alt }: ModelViewerProps) {
    const viewerRef = useRef<any>(null);

    useEffect(() => {
        // Force a resize check on mount to ensure proper rendering
        if (viewerRef.current) {
            setTimeout(() => {
                viewerRef.current.dispatchEvent(new Event('resize'));
            }, 500);
        }
    }, []);

    return (
        <div className="w-full h-full relative group">
            <model-viewer
                ref={viewerRef}
                src={src}
                poster={poster}
                alt={alt}
                auto-rotate
                camera-controls
                shadow-intensity="1"
                camera-orbit="0deg 75deg 105%"
                interaction-prompt="auto"
                ar
                ar-modes="webxr scene-viewer quick-look"
                style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
                loading="lazy"
                reveal="auto"
            >
                <div slot="progress-bar"></div>
                <button slot="ar-button" className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    View in AR
                </button>
            </model-viewer>

            {/* Cinematic Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
    );
}
