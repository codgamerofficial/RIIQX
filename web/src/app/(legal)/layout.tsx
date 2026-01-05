export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <article className="prose prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
                    {children}
                </article>
            </div>
        </div>
    );
}
