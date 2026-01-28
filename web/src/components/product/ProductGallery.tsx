"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import { cn } from "@/lib/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";

interface ProductGalleryProps {
    images: { url: string; altText?: string }[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    if (!images.length) {
        return (
            <div className="aspect-[3/4] bg-white/5 flex items-center justify-center rounded-sm">
                <span className="text-white/20 font-mono text-xs uppercase">No Image Available</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Carousel */}
            <div className="relative group">
                <Swiper
                    loop={true}
                    spaceBetween={10}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    thumbs={{ swiper: thumbsSwiper }}
                    effect="fade"
                    modules={[FreeMode, Navigation, Thumbs, EffectFade]}
                    className="aspect-[3/4] w-full bg-white/5"
                >
                    {images.map((image, idx) => (
                        <SwiperSlide key={idx} className="relative w-full h-full">
                            <div className="relative w-full h-full cursor-zoom-in group/slide">
                                <Image
                                    src={image.url}
                                    alt={image.altText || `${title} - Image ${idx + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover/slide:scale-105"
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    priority={idx === 0}
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/slide:opacity-100 transition-opacity" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Arrows - Aggressive */}
                <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-16 flex items-center justify-center bg-black/80 text-white hover:bg-accent hover:text-black transition-all -translate-x-full group-hover:translate-x-0 clip-path-slant-right">
                    <ChevronLeft className="w-8 h-8 font-bold" />
                </button>
                <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-16 flex items-center justify-center bg-black/80 text-white hover:bg-accent hover:text-black transition-all translate-x-full group-hover:translate-x-0 clip-path-slant-left">
                    <ChevronRight className="w-8 h-8 font-bold" />
                </button>

                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <span className="flex items-center gap-2 px-3 py-1 bg-black/80 text-white border border-white/20 text-[10px] uppercase tracking-[0.2em] font-black backdrop-blur-md">
                        <Maximize2 className="w-3 h-3 text-accent" /> Zoom
                    </span>
                </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="thumbs-swiper w-full"
                >
                    {images.map((image, idx) => (
                        <SwiperSlide key={idx} className="cursor-pointer">
                            <div className="relative aspect-square overflow-hidden border-2 border-transparent transition-all opacity-50 hover:opacity-100 [&.swiper-slide-thumb-active]:border-accent [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:scale-95">
                                <Image
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${idx}`}
                                    fill
                                    className="object-cover"
                                    sizes="100px"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
