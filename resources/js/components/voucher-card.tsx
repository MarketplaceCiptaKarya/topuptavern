import { currencyFormatter } from '@/lib/global';
import { cn } from '@/lib/utils';

type VoucherCardProps = {
    voucherName?: string;
    voucherPrice?: number;
    isSelected?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function VoucherCard({
    voucherName = 'Nama voucher asdasd Lorem ipsum dolor sit amet.',
    voucherPrice = 1000000,
    isSelected,
    disabled,
    ...rest
}: VoucherCardProps) {
    return (
        <>
            <div className={cn('h-full w-full bg-background transition-all', disabled ? '' : 'group hover:scale-110')}>
                <button
                    disabled={disabled}
                    data-selected={isSelected}
                    {...rest}
                    className={cn(
                        'h-full w-full',
                        'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
                        'flex cursor-pointer items-center justify-center rounded-md border text-sm font-medium shadow-sm transition-all',
                        // Base color styles
                        'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400',
                        // Hover & active states
                        'group-hover:bg-sky-600/10 group-hover:shadow-lg group-hover:shadow-sky-600/20 dark:group-hover:bg-sky-400/10',
                        'active:scale-100 active:shadow-none',
                        // Focus state
                        'focus-visible:border-sky-600 focus-visible:ring-2 focus-visible:ring-sky-600/20 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:border-sky-400 dark:focus-visible:ring-sky-400/40',
                        // Disabled state
                        'disabled:pointer-events-none disabled:opacity-50',
                        // Selected state
                        'data-[selected=true]:border-sky-600 data-[selected=true]:ring-4 data-[selected=true]:ring-sky-600/30 dark:data-[selected=true]:border-sky-400 dark:data-[selected=true]:ring-sky-400/30',
                    )}
                >
                    <div className="inline-flex flex-col items-center">
                        <span className="text-center font-semibold text-foreground transition-colors group-hover:text-sky-600 dark:group-hover:text-sky-400">
                            {voucherName}
                        </span>
                        <span className="text-center font-black group-hover:text-primary">{currencyFormatter.format(voucherPrice)}</span>
                    </div>
                </button>
            </div>
        </>
    );
}
