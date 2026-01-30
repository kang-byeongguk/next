import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
    return (
        <main className="w-full flex min-h-[85vh] flex-col items-center justify-center gap-2">
            <FaceFrownIcon className="w-10 text-base-content/40" />
            <h2 className="text-xl font-semibold">404 Not Found</h2>
            <p>Could not find the requested item.</p>
            <Link
                href="/product"
                className="font-semibold mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-content transition-colors hover:bg-primary/80"
            >
                Go Back
            </Link>
        </main>
    );
}