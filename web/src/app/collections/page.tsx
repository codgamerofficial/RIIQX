import { getCollections } from "@/lib/shopify";
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Collections | RIIQX',
    description: 'Explore our curated collections.',
};

export default async function CollectionsPage() {
    const collections = await getCollections();

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tighter">
                    CURATED <span className="text-primary">SERIES.</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections.map((c) => (
                        <Link
                            key={c.handle}
                            href={`/collections/${c.handle}`}
                            className="group relative h-[400px] rounded-3xl overflow-hidden border border-white/5 bg-card"
                        >
                            {c.image?.url ? (
                                <Image
                                    src={c.image.url}
                                    alt={c.image.altText || c.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                                    <span className="text-white/20 font-bold text-xl">No Image</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <h2 className="text-3xl font-bold text-white mb-2">{c.title}</h2>
                                <p className="text-white/70 line-clamp-2">{c.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                {collections.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-white/50">No collections found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
