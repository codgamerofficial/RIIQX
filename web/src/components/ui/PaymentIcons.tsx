export function VisaIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M10.748 16.712l1.666-10.27h-2.668l-2.825 6.78-1.049-5.45c-.183-.895-.717-1.328-1.566-1.33H.08l.3.848c.95.228 1.95.834 2.516 1.834.133.24.533 1.933.533 1.933l-2.316 10.95h2.816l4.2-10.45 1.766 8.125h2.853zM18.815 6.442h-2.033c-.633 0-1.116.183-1.383.849l-4.833 11.453h2.8l.95-2.633h3.45l.333 1.566.216.734h2.483l-1.983-9.25-.15-.719zm-3.833 8.3l1.834-5.066 1.05 5.066h-2.884zM24 6.442h-2.583c-.766 0-1.35.433-1.683 1.25L17.2 16.712h2.916l.583-1.616h3.583l.317 1.616H27l-2.05-9.27-.15-.719zM20.982 13.91l1.5-4.116.85 4.116h-2.35z" transform="scale(0.8) translate(1,3)" />
        </svg>
    );
}

export function MastercardIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="12" r="7" fill="#EB001B" fillOpacity="0.8" />
            <circle cx="17" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8" />
            <path d="M12 16.857C10.6667 15.6667 9.8 13.9 9.8 12C9.8 10.1 10.6667 8.33333 12 7.14286C13.3333 8.33333 14.2 10.1 14.2 12C14.2 13.9 13.3333 15.6667 12 16.857Z" fill="#FF5F00" />
        </svg>
    );
}

export function AmexIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M0 2h24v20H0V2zm3.67 14.33h3.07l.38-2.3h1.88l-1.59 2.3h7.62l1.69-4.22h-1.89l-.51 1.27h-1.98l.68-1.72h2.24l.58-1.45h-6.22l-1.67 4.22h1.66l.39-1h1.96l-.54 1.34h-1.01l-.22.54H8.7l.84-2.12H7.9l-.69 2.12H5.45l.95-2.88H2.4l.2 2.88zm15.65 0h2.28l1.7-4.22H21.2l-1.01 2.5-1.04-2.5h-2.14l1.67 4.22zM6.9 7.67H3.6l-.37 3.23h1.95l.13-1.09h1.36l.16-1.35H5.4l.11-.79h2.08l.18-1.5zm6.54 0h-2.31l-1.39 4.73h2.15l.23-.78h1.49l.66 2.28 2.31-.01-1.12-3.32 1.25-2.92h-2.1l-.54 1.27-.63-1.25zm.5 2.16l.36 1.05h-.95l.59-1.05zm7.39-2.16h-3.32l.79 3.23h-2.07l.15-2.14h-1.39l-.16 2.14h-2.05l.26-4.73H11.5l-1.99 4.73h2.3l.38-1.13h1.79l-.26 1.13h4.63l-.79-4.73z" />
        </svg>
    );
}

export function RuPayIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 15.5l5.5-8h-3l-2.5 3.5h-2L4 9h3.5l2.5-3.5h5L12 10l-2 3h4l2 3h-5l1.5-2h-3l-1.5 2H4.5z" />
            {/* Geometric representation of the > shape in RuPay */}
            <path d="M16 6h4l-6 12h-4l6-12z" fillOpacity="0.8" />
            <path d="M12 6h-8l3 4h5l-3 4h4l3-4h-5l3-4z" clipRule="evenodd" />
        </svg>
    );
}
