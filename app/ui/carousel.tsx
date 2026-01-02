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
  const [transition, setTransition] = useState(true);
  const extendedHeroSlides = [...heroSlides, heroSlides[0]];
  const SLIDE_DURATION = 700;

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentPage((prev) => {
        if (prev >= extendedHeroSlides.length - 1) return prev;
        setTransition(true);
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [currentPage, extendedHeroSlides.length]);

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
      {/* 캐러셀 컨테이너: 데스크톱 높이 md:h-96 유지 */}
      <div className="w-full overflow-hidden rounded-xl h-auto md:h-96 shadow-sm">
        <div
          className={`flex h-full ${
            transition ? "transition-transform duration-700 ease-in-out" : "transition-none"
          }`}
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {extendedHeroSlides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              /* 모바일: flex-col (세로 정렬), p-6 padding
                 데스크톱: flex-row (가로 정렬), justify-center, gap-20으로 중앙 밀착
              */
              className={`w-full shrink-0 h-full flex flex-col md:flex-row items-center justify-center p-6 md:px-20 md:gap-20 ${slide.bgColor}`}
            >
              {/* 텍스트 영역 
                  모바일: order-2 (이미지 아래 위치)
                  데스크톱: order-1 (왼쪽 위치)
              */}
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-2 md:gap-3 order-2 md:order-1 max-w-md md:max-w-lg w-full">
                <span className="text-primary font-bold text-xs md:text-sm tracking-widest uppercase">
                  {slide.title}
                </span>
                
                {/* 모바일 헤드라인 크기 약간 조절 (text-3xl) */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-base-content leading-tight">
                  {slide.headline}
                </h2>
                
                <p className="text-base-content/70 text-sm hidden md:line-clamp-2">
                  {slide.description}
                </p>

                <div className="flex items-center gap-4 pt-4 md:pt-4">
                  <button className="btn btn-primary btn-md rounded-full px-8 shadow-md">
                    Order Now
                  </button>
                  
                  <Link
                    href="/product"
                    className="flex items-center gap-2 text-base text-base-content font-semibold hover:text-primary transition-colors"
                  >
                    Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 이미지 영역
                  모바일: order-1 (텍스트 위 위치), mb-8 (텍스트와 간격), h-auto (높이 자동)
                  데스크톱: order-2 (오른쪽 위치), mb-0, h-72 w-72 (고정 크기)
              */}
              <div className="flex-none flex justify-center items-center order-1 md:order-2 w-full md:w-72 h-auto md:h-72 p-4 mb-8 md:mb-0">
                {/* 모바일에서 이미지가 보이지 않던 문제 해결:
                    Image fill을 사용하기 위해 부모 relative div에 모바일용 고정 높이(h-52)를 부여.
                    데스크톱에서는 h-full로 부모 높이를 따라감.
                */}
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

      {/* 페이지네이션 */}
      <div className="flex gap-2">
        {heroSlides.map((_, index) => {
          const isActive =
            currentPage === index ||
            (currentPage === extendedHeroSlides.length - 1 && index === 0);

          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive ? "bg-primary w-8" : "bg-base-300 hover:bg-base-content/20 w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}