"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { name: "Newest", value: "newest" },
  { name: "Price: Low", value: "price_asc" },
  { name: "Price: High", value: "price_desc" },
  { name: "Oldest", value: "oldest" },
];

export default function Filter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortValue = searchParams.get("sort") || "newest";
  const selectedOption = sortOptions.find((o) => o.value === currentSortValue) || sortOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && event.target instanceof Node) {
        if (!dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-40 text-sm" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-full border bg-base-100 px-4 py-2.5 text-left transition-all
          ring-offset-2 border-primary 
          ${isOpen
            ? "ring-2 ring-primary" 
            : "" 
          }
        `}
      >
        <span className="block truncate font-normal text-base-content/60">
          {selectedOption.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-base-content/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-base-200 bg-base-100 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none duration-100">
          {sortOptions.map((option) => {
            const isSelected = option.value === currentSortValue;

            return (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`relative cursor-pointer select-none py-2.5 pl-4 pr-4 transition-colors text-center hover:bg-primary/5 hover:text-primary
                  ${isSelected ? "font-bold text-primary bg-primary/5" : "text-base-content font-normal"}
                `}
              >
                <span className="block truncate">{option.name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}