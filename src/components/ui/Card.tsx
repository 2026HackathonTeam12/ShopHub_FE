import type { HTMLAttributes, ReactNode } from "react"

export type CardVariant = "default" | "dark" | "inset"
export type CardPadding = "none" | "sm" | "md" | "lg"

type CardProps = HTMLAttributes<HTMLDivElement> & {
    variant?: CardVariant
    padding?: CardPadding
    children: ReactNode
}

// Elevation via bg contrast (surface/white on canvas/gray), no shadow.
// Shadow reserved for floating elements (modals, dropdowns).
const VARIANT: Record<CardVariant, string> = {
    default: "bg-surface border border-border",
    dark:    "bg-panel text-white border-0",
    inset:   "bg-canvas border border-border-subtle",
}

const PADDING: Record<CardPadding, string> = {
    none: "",
    sm:   "p-4",
    md:   "p-5",
    lg:   "p-6",
}

export function Card({
    variant = "default",
    padding = "md",
    children,
    className = "",
    ...props
}: CardProps) {
    return (
        <div
            className={[
                "rounded-card overflow-hidden",
                VARIANT[variant],
                PADDING[padding],
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...props}
        >
            {children}
        </div>
    )
}
