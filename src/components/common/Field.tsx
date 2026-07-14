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
        <label htmlFor={htmlFor} className="block text-caption font-bold text-secondary">
            {label}
            {children}
            {error ? (
                <span id={`${htmlFor}-error`} className="mt-1.5 block text-caption font-medium text-error">
                    {error}
                </span>
            ) : hint ? (
                <span className="mt-1.5 block text-caption font-medium text-muted">{hint}</span>
            ) : null}
        </label>
    )
}
