import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { forwardRef, useEffect, useId, useState } from 'react';

type SearchInputProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    isLoading?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ value: controlledValue, onChange, placeholder, isLoading: loadingProp, className, ...rest }, ref) => {
        const [uncontrolledValue, setUncontrolledValue] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const id = useId();

        const isControlled = controlledValue !== undefined;
        const value = isControlled ? controlledValue : uncontrolledValue;

        useEffect(() => {
            if (loadingProp !== undefined) {
                setIsLoading(loadingProp);
                return;
            }

            if (value) {
                setIsLoading(true);
                const timer = setTimeout(() => setIsLoading(false), 500);
                return () => clearTimeout(timer);
            }
            setIsLoading(false);
        }, [value, loadingProp]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            if (!isControlled) {
                setUncontrolledValue(newValue);
            }
            onChange?.(newValue);
        };

        return (
            <div className="w-full max-w-xs space-y-2">
                <div className="relative">
                    {/* Search icon */}
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        <SearchIcon className="size-4" />
                        <span className="sr-only">{placeholder}</span>
                    </div>

                    {/* Input */}
                    <Input
                        ref={ref}
                        id={id}
                        type="search"
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        className={cn(
                            'peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
                            className,
                        )}
                        {...rest}
                    />

                    {/* Loading spinner */}
                    {isLoading && (
                        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                            <LoaderCircleIcon className="size-4 animate-spin" />
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}
                </div>
            </div>
        );
    },
);
