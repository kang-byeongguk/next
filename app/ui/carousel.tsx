"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "Exclusive Deal 40% Off",
    headline: "Power Meets Elegance - Apple MacBook Pro",
    description: "MacBook Pro is Here for you!",
    imgSrc: "/pngfind.com-macbook-pro-png-113035.png",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "New Arrival",
    headline: "Experience the Future - Samsung Galaxy",
    description: "Innovation at your fingertips.",
    imgSrc: "/Samsung-Galaxy-S25-Ultra-Titanium-Black-Premium-Smartphone-1.png",
    bgColor: "bg-orange-50",
  },
  {
    id: 3,
    title: "Best Seller",
    headline: "Sound of Silence - Sony WH-1000XM5",
    description: "Immerse yourself in music.",
    imgSrc: "/microphone-noise-cancelling-headphones-bluetooth-headset-sony-headphones-c160ed638c4c9ec12def8e77b0cb8c53.png",
    bgColor: "bg-blue-50",
  },
];

export default function Carousel() {
  //  이미지 슬라이딩에 시각적 통일성을 주기 위해 
  //  1. 0번째 이미지를 복사 후 마지막 이미지로 추가
  //  2. currentPage가 마지막 이미지(0번째 이미지 복사본)이면 transition효과 없이 0번째 이미지로 순간이동하여 자연스러운 애니메이션 구현
  const [currentPage, setCurrentPage] = useState(0);
  const [transition, setTransition] = useState(true);
  const extendedHeroSlides = useMemo(() => [...heroSlides, heroSlides[0]], []);
  const SLIDE_DURATION = 700;
  const AUTO_SLIDE_INTERVAL = 5000;


  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentPage((prev) => {
        //에러방지
        if (prev >= extendedHeroSlides.length - 1) return prev;
        setTransition(true);
        return prev + 1;
      });
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(slideInterval);
  }, [currentPage, extendedHeroSlides.length,AUTO_SLIDE_INTERVAL]);

  useEffect(() => {
    if (currentPage === extendedHeroSlides.length - 1) {
      const timeout = setTimeout(() => {
        setTransition(false);
        setCurrentPage(0);
      }, SLIDE_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [currentPage, extendedHeroSlides.length, SLIDE_DURATION]);

  const goToSlide = (index: number) => {
    setTransition(true);
    setCurrentPage(index);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      {/* 캐러셀 이미지 영역 */}
      <div className="w-full overflow-hidden rounded-xl h-auto md:h-96 shadow-sm ">
        <div
          className={`flex h-auto md:h-full ${transition ? `transition-transform ease-in-out` : "transition-none"
            }`}
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
            transitionDuration: transition ? `${SLIDE_DURATION}ms` : '0ms'
          }}
        >
          {extendedHeroSlides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className={`w-full shrink-0 h-auto md:h-full flex flex-col md:flex-row items-center justify-center p-6 md:px-8 lg:px-20 md:gap-1 lg:gap-15 ${slide.bgColor}`}
            >
              {/* 텍스트 영역 */}
              <div className=" flex flex-col items-center  md:items-start text-center md:text-left gap-2 md:gap-3 order-2 md:order-1 md:w-sm  shrink-0 w-full">
                <span className="text-primary font-bold text-xs md:text-sm tracking-widest uppercase">
                  {slide.title}
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">
                  {slide.headline}
                </h2>

                <p className="text-slate-800/70 text-sm hidden md:line-clamp-2">
                  {slide.description}
                </p>

                <div className="flex items-center gap-4 pt-4 md:pt-4">
                  <button className="btn px-10 btn-primary">
                    Order Now
                  </button>

                  <Link
                    href="/product"
                    className="flex items-center gap-2 text-base text-slate-800 font-semibold hover:text-primary transition-colors"
                  >
                    Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              {/*아이템 이미지 영역 */}
              <div className=" flex justify-center items-center order-1 md:order-2 w-full md:w-72 h-auto md:h-72 p-4 mb-8 md:mb-0">

                <div className="relative w-full h-52 md:h-full drop-shadow-xl">
                  <Image
                    src={slide.imgSrc}
                    alt={slide.headline}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-contain hover:scale-105 transition-transform duration-500"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*캐러셀 페이지네이션 영역*/}
      <div className="flex gap-2">
        {heroSlides.map((_, index) => {
          const isActive =
            currentPage === index ||
            (currentPage === extendedHeroSlides.length - 1 && index === 0);

          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all  ${isActive ? "bg-primary w-4" : "bg-base-300 hover:bg-base-content/20 w-2"
                }`}
              aria-label={`Go to slide ${index + 1}`}
              style={{ transitionDuration: `${SLIDE_DURATION}ms` }}
            />
          );
        })}
      </div>
    </div>
  );
}