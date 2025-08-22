import { SearchInput } from '@/components/search-input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { useDebouncedValue } from '@/hooks/use-debounced';
import { Game } from '@/types';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function Search() {
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const [inputWidth, setInputWidth] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebouncedValue(searchValue, 500);
    const [fetchIsLoading, setFetchIsLoading] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState<Game[]>([]);

    useEffect(() => {
        if (inputRef.current) {
            setInputWidth(inputRef.current.offsetWidth);
        }
    }, [openDropdown]);

    useEffect(() => {
        if (debouncedSearchValue && openDropdown) {
            setFetchIsLoading(true);
            axios
                .get<{ games: Game[] }>(route('search'), {
                    params: {
                        q: debouncedSearchValue,
                    },
                    headers: {
                        Accept: 'application/json',
                    },
                })
                .then((response) => {
                    setSearchResult(response.data.games);
                })
                .catch((error) => {
                    console.error('Search error:', error);
                })
                .finally(() => {
                    setFetchIsLoading(false);
                });
        }
    }, [debouncedSearchValue, openDropdown]);

    const inputChangeHandler = (value: string) => {
        setSearchValue(value);
        if (value) {
            setOpenDropdown(true);
            setFetchIsLoading(true);
        } else {
            setOpenDropdown(false);
            setFetchIsLoading(false);
        }
    };

    return (
        <div ref={inputRef} className="flex w-full flex-col gap-1">
            <SearchInput
                autoComplete="off"
                spellCheck={false}
                isLoading={fetchIsLoading}
                onBlur={() => setSearchValue('')}
                onChange={(content) => inputChangeHandler(content)}
                value={searchValue}
                placeholder="Search voucher or game"
            />
            <Popover open={!fetchIsLoading && openDropdown} modal={false} onOpenChange={setOpenDropdown}>
                <PopoverAnchor />
                <PopoverContent
                    align="start"
                    className="w-full max-w-xs"
                    style={{ width: inputWidth ?? 'auto' }}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="scrollbar-thin max-h-80 space-y-2 overflow-y-auto">
                        {/*<div className="flex h-full w-full items-center justify-center p-3">*/}
                        {/*    <LoaderCircleIcon className="size-4 animate-spin" />*/}
                        {/*    <span className="sr-only">Loading...</span>*/}
                        {/*</div>*/}
                        {!fetchIsLoading && searchResult.length === 0 && (
                            <div className="flex h-full w-full items-center justify-center p-3">
                                <span>No results found</span>
                            </div>
                        )}
                        {!fetchIsLoading &&
                            searchResult.length > 0 &&
                            searchResult.map((game: Game) => (
                                <Link href={route('detail-voucher', game.slug)} key={game.slug}>
                                    <div className="w-full p-2 transition-colors hover:bg-accent hover:text-accent-foreground">
                                        <span>{game.name}</span>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
