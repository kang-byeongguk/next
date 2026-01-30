'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";
import { formatAddress } from "@/app/lib/utils";
import { Address } from "@/app/lib/definitions";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelect: (address: Address) => void;
}

export default function AddressSelector({ 
  addresses, 
  selectedAddress, 
  onSelect 
}: AddressSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기 기능
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (event.target instanceof Node && dropdownRef.current) {
        if (!dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (address: Address) => {
    onSelect(address);
    setIsOpen(false);
  };

  return (
    <div className="mb-8 relative" ref={dropdownRef}>
      <label htmlFor="address" className="text-xs font-bold text-base-content/60 uppercase mb-2 block tracking-wide">
        Select Address
      </label>

      {/* 드롭다운 트리거 버튼 */}
      <button
        id="address"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(`w-full flex justify-between items-center p-3 border rounded-full bg-base-100 text-left transition-all`,
          {
            'border-primary ring-1 ring-primary': isOpen,
            'border-base-content/80 hover:border-base-content/40': !isOpen,
            'border-error/50': !selectedAddress
          }
        )}
      >
        <span className="text-sm font-medium text-base-content truncate">
          {selectedAddress ? formatAddress(selectedAddress) : "Select an address"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-base-content/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 드롭다운 메뉴 리스트 */}
      {isOpen && (
        <div className="absolute z-50 top-full w-full mt-1 bg-base-100 border border-base-200 rounded-lg shadow-xl overflow-hidden duration-100">
          <ul className="max-h-60 overflow-y-auto">
            {addresses.map((addr) => (
              <li className="select-none" key={addr.id}>
                <button
                  onClick={() => handleSelect(addr)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-base-200 flex items-center justify-between group"
                >
                  <span className={`truncate mr-2 ${selectedAddress?.id === addr.id ? 'font-bold text-primary' : 'text-base-content'}`}>
                    {formatAddress(addr)}
                  </span>
                  {selectedAddress?.id === addr.id && (
                    <Check className="w-4 h-4 text-primary flex-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-base-200 ">
            <Link
              href="/add-address"
              className="w-full flex items-center justify-center py-3 text-sm font-bold text-base-content/70 hover:text-primary hover:bg-base-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              + Add New Address
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}