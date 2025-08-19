import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button, Group, I18nProvider, Input, Label, NumberField, NumberFieldProps } from 'react-aria-components';

type InputWithPlusMinusButtonsProps = {
    locale?: string;
    label?: string;
} & NumberFieldProps &
    React.RefAttributes<HTMLDivElement>;

const InputWithPlusMinusButtons = ({ locale, label, ...rest }: InputWithPlusMinusButtonsProps) => {
    return (
        <I18nProvider locale={locale}>
            <NumberField {...rest} className="w-full max-w-xs space-y-2">
                <Label className="flex items-center gap-2 text-sm leading-none font-medium select-none">{label}</Label>
                <Group className="relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:data-focus-within:has-aria-invalid:ring-destructive/40">
                    <Button
                        slot="decrement"
                        className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <MinusIcon className="size-4" />
                        <span className="sr-only">Decrement</span>
                    </Button>
                    <Input className="w-full grow px-3 py-2 text-center tabular-nums outline-none selection:bg-primary selection:text-primary-foreground" />
                    <Button
                        slot="increment"
                        className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <PlusIcon className="size-4" />
                        <span className="sr-only">Increment</span>
                    </Button>
                </Group>
            </NumberField>
        </I18nProvider>
    );
};
export default InputWithPlusMinusButtons;
