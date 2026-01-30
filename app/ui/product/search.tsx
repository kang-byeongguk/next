'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { MagnifyingIcon } from '../icons';

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
            <MagnifyingIcon/>
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