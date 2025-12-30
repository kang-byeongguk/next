"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; 
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "Exclusive Deal 40% Off",
    headline: "Power Meets Elegance - Apple MacBook Pro",
    description: "MacBook Pro is Here for you!",
    imgSrc: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "New Arrival",
    headline: "Experience the Future - Samsung Galaxy",
    description: "Innovation at your fingertips.",
    imgSrc: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    bgColor: "bg-orange-50",
  },
  {
    id: 3,
    title: "Best Seller",
    headline: "Sound of Silence - Sony WH-1000XM5",
    description: "Immerse yourself in music.",
    imgSrc: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    bgColor: "bg-blue-50",
  },
  {
    id: 4,
    title: "Best Seller",
    headline: "Sound of Silence - Sony WH-1000XM5",
    description: "Immerse yourself in music.",
    imgSrc: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    bgColor: "bg-blue-50",
  },
];

export default function Carousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const extendedHeroSlides = [...heroSlides, heroSlides[0]]; 
  const SLIDE_DURATION = 700;

  //5000ms 간격으로 페이지를 전환하는 기능
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentPage((prev) => {
        if (prev >= extendedHeroSlides.length - 1) return prev;
        setIsTransitioning(true);
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [currentPage, extendedHeroSlides.length]); 

  // 마지막 슬라이드 도달 시 첫 번쨰 슬라이드로 순간이동하는 기능
  useEffect(() => {
    if (currentPage === extendedHeroSlides.length - 1) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentPage(0);
      }, SLIDE_DURATION);

      return () => clearTimeout(timeout);
    }
  }, [currentPage, extendedHeroSlides.length, SLIDE_DURATION]);

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentPage(index);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div
        className={`flex h-100 md:h-125 ${
          isTransitioning
            ? "transition-transform duration-700 ease-in-out"
            : "transition-none"
        }`}
        style={{ transform: `translateX(-${currentPage * 100}%)` }}
      >
        {extendedHeroSlides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className={`w-full shrink-0 flex flex-col md:flex-row items-center justify-center p-8 md:p-20 ${slide.bgColor}`}
          >
            {/* 텍스트 영역 */}
            <div className="flex-1 flex flex-col items-center md:items-start  md:text-left text-center gap-4 md:gap-6 order-2 md:order-1">
              <span className="text-orange-500 font-bold text-sm md:text-base">
                {slide.title}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight">
                {slide.headline}
              </h2>
              <p className="text-slate-600 text-lg hidden md:block">
                {slide.description}
              </p>

              <div className="flex items-center gap-4 pt-4">
                <button className="btn btn-primary rounded-full px-8 text-white border-none bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200">
                  Order Now
                </button>
                <Link
                  href="/product"
                  className="flex items-center gap-2 text-slate-600 font-medium hover:text-slate-900 transition"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 이미지 영역: Next/Image 적용 */}
            <div className="flex-1 flex justify-center items-center order-1 md:order-2 mb-8 md:mb-0">
              <div className="relative w-full max-w-sm aspect-video drop-shadow-2xl">
                <Image
                  src={slide.imgSrc}
                  alt={slide.headline}
                  width={500}
                  height={500}
                  className="object-contain hover:scale-105 transition-transform duration-500"
                  priority={index === 0} // 첫 번째 이미지는 우선 로딩 (LCP 최적화)
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {heroSlides.map((_, index) => {
          const isActive =
            currentPage === index ||
            (currentPage === extendedHeroSlides.length - 1 && index === 0);

          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-orange-500 w-8"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}