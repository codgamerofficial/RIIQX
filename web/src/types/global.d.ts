export { };

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "model-viewer": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    src?: string;
                    poster?: string;
                    alt?: string;
                    "auto-rotate"?: boolean;
                    "camera-controls"?: boolean;
                    "shadow-intensity"?: string;
                    "camera-orbit"?: string;
                    "interaction-prompt"?: string;
                    ar?: boolean;
                    "ar-modes"?: string;
                    loading?: "auto" | "lazy" | "eager";
                    reveal?: "auto" | "manual";
                    slot?: string;
                    ref?: any;
                },
                HTMLElement
            >;
        }
    }
}
