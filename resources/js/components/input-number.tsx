'use client'

import { I18nProvider, Input, NumberField, NumberFieldProps } from 'react-aria-components'

type InputNumberProps = {
    locale?: string
    placeholder?: string
    value?: number | string
    onChange?: (value: string) => void
} & Omit<NumberFieldProps, 'onChange' | 'value'>

const InputNumber = ({ locale, placeholder, value, onChange, ...rest }: InputNumberProps) => {
    return (
        <I18nProvider locale={locale}>
            <NumberField
                {...rest}
                value={value === '' ? undefined : Number(value)} // ensure it accepts string/number
                onChange={(val) => {
                    if (onChange) {
                        onChange(val === null ? '' : String(val))
                    }
                }}
                className="w-full max-w-xs space-y-2"
            >
                <Input
                    placeholder={placeholder}
                    className="selection:bg-primary selection:text-primary-foreground w-full rounded-md border border-input bg-transparent px-3 py-2 text-center tabular-nums shadow-xs outline-none transition-[color,box-shadow] focus:border-ring focus:ring-[3px] focus:ring-ring/50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 md:text-sm no-spinner"
                />
            </NumberField>
        </I18nProvider>
    )
}

export default InputNumber
