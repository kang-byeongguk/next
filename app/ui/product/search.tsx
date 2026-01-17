'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search() {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <label className="input input-primary flex items-center gap-2">
            
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                >
                    <circle cx="11" cy="11" r="8" ></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            
            <input 
                type="search" 
                required 
                placeholder="Search" 
                className="grow text-base-content placeholder:text-base-content/60"
                onChange={e => { handleSearch(e.target.value) }}
                defaultValue={searchParams.get('query') || ''} 
            />
        </label>
    )
}