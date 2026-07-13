import type { ReactNode } from "react"

type FieldProps = {
    label: string
    htmlFor: string
    error?: string
    hint?: string
    children: ReactNode
}

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
    return (
        <label htmlFor={htmlFor} className="block text-xs font-bold text-[#42526e]">
            {label}
            {children}
            {error ? (
                <span id={`${htmlFor}-error`} className="mt-1.5 block text-[11px] font-medium text-[#d6503b]">
                    {error}
                </span>
            ) : hint ? (
                <span className="mt-1.5 block text-[11px] font-medium text-slate-400">{hint}</span>
            ) : null}
        </label>
    )
}
