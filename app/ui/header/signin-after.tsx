"use client";
import { LogOut, ShoppingBag, ShoppingCart } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function UserDropdown() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative flex items-center">
            {isOpen && (
                <div
                    className="fixed inset-0 z-999 cursor-default"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <button
                className={`hover:ring-4 hover:ring-offset-0 hover:ring-base-content/20 cursor-pointer w-7 h-7 rounded-full overflow-hidden relative z-1000 ${isOpen && "ring-4 ring-offset-0 ring-base-content/20"}`}
                onClick={() => { setIsOpen(!isOpen) }}
            >
                <UserIcon user={session?.user} />
            </button>

            {isOpen && <UserMenu user={session?.user} setIsOpen={setIsOpen} />}
        </div>
    );
}

function UserIcon({ user }: {
    user?: {
        name?: string | null;
        image?: string | null;
    }
}) {
    return (
        <>
            {user?.image ? (
                <Image
                    src={user.image}
                    alt={`${user.name ?? '유저'} 프로필`}
                    fill
                    className="object-cover"
                    sizes="32px"
                />
            ) : (
                <div className="w-full h-full bg-base-300 flex items-center justify-center text-sm font-bold text-base-content/70">
                    {user?.name?.charAt(0) || "U"}
                </div>
            )}
        </>
    );
}

function UserMenu({ user, setIsOpen }: {
    user?: { name?: string | null; email?: string | null; image?: string | null },
    setIsOpen: (v: boolean) => void
}) {
    return (
        <div className="absolute overflow-hidden bg-base-100 shadow-2xl rounded-2xl border border-base-200 z-1000 top-10 right-0 w-80 flex flex-col">

            <div className="px-6 py-4 border-b border-base-content/10 flex items-center gap-x-6 bg-base-100">
                <div className="relative w-7 h-7 transform -translate-x-1/6 rounded-full overflow-hidden shrink-0 border border-base-content/10">
                    <UserIcon user={user} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-bold text-sm text-base-content truncate">
                        {user?.name ?? '사용자'}
                    </p>
                    <p className="text-xs text-base-content/60 truncate">
                        {user?.email ?? '이메일 없음'}
                    </p>
                </div>
            </div>

            <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="px-6 hover:bg-base-200/50 py-4 border-b border-base-content/10 font-semibold text-xs text-base-content/80 flex items-center gap-x-10 cursor-pointer transition-colors"
            >
                <ShoppingCart size={16} strokeWidth={2.75} />
                <p>Cart</p>
            </Link>

            <Link
                href="/my-orders"
                onClick={() => setIsOpen(false)}
                className="px-6 hover:bg-base-200/50 py-4 border-b border-base-content/10 font-semibold text-xs text-base-content/80 flex items-center gap-x-10 cursor-pointer transition-colors"
            >
                <ShoppingBag size={16} strokeWidth={2.75} />
                <p>My Orders</p>
            </Link>

            <button
                onClick={() => signOut()}
                className="px-6 hover:bg-red-50 py-4 font-semibold text-xs text-error flex items-center gap-x-10 cursor-pointer w-full text-left transition-colors"
            >
                <LogOut size={16} strokeWidth={2.75} />
                <p>Sign Out</p>
            </button>
        </div>
    )
}