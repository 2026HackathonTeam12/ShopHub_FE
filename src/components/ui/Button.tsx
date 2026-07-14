import type { ButtonHTMLAttributes, ReactNode } from "react"
import { LoaderIcon } from "lucide-react"

export type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger" | "success"
export type ButtonSize = "sm" | "md" | "lg"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    icon?: ReactNode
    trailingIcon?: ReactNode
}

const VARIANT: Record<ButtonVariant, string> = {
    primary:
        "bg-accent text-white hover:bg-accent-hover active:bg-[#2565D3] disabled:opacity-40",
    secondary:
        "bg-surface border border-border text-secondary hover:bg-canvas hover:border-[#C8CDD8] active:bg-border disabled:opacity-40",
    accent:
        "bg-accent text-white hover:bg-accent-hover active:bg-[#2565D3] disabled:opacity-40",
    ghost:
        "text-secondary hover:bg-canvas active:bg-border disabled:opacity-40",
    danger:
        "border border-border text-error hover:bg-error-bg hover:border-error-border active:bg-[#FBDCDA] disabled:opacity-40",
    success:
        "border border-success-border bg-success-bg text-success hover:border-success hover:bg-[#D5EFE8] disabled:opacity-40",
}

const SIZE: Record<ButtonSize, string> = {
    sm: "h-7 gap-1 px-3 text-caption font-semibold",
    md: "h-9 gap-2 px-4 text-body  font-semibold",
    lg: "h-10 gap-2 px-5 text-body  font-bold",
}

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    trailingIcon,
    children,
    disabled,
    className = "",
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading

    return (
        <button
            type="button"
            disabled={isDisabled}
            className={[
                "inline-flex items-center justify-center rounded-xl",
                "transition-colors duration-150",
                VARIANT[variant],
                SIZE[size],
                loading ? "cursor-wait" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...props}
        >
            {loading ? (
                <LoaderIcon
                    size={size === "sm" ? 12 : 14}
                    className="animate-spin"
                    aria-hidden="true"
                />
            ) : icon ? (
                <span className="shrink-0" aria-hidden="true">
                    {icon}
                </span>
            ) : null}

            {children}

            {!loading && trailingIcon && (
                <span className="shrink-0" aria-hidden="true">
                    {trailingIcon}
                </span>
            )}
        </button>
    )
}
