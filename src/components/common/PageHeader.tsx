import type { ReactNode } from "react"

type PageHeaderProps = {
    eyebrow: string
    title: string
    description: string
    action?: ReactNode
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
    return (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div>
                {/* Eyebrow: DM Mono, muted — sets context, does not compete */}
                <p className="font-mono-label text-[10px] tracking-[0.13em] text-muted uppercase">
                    {eyebrow}
                </p>
                {/* Title: text-title (22px/700/ls-0.015em) — confident jump from eyebrow */}
                <h1 className="mt-2 text-title font-extrabold text-ink">
                    {title}
                </h1>
                {/* Description: text-body (13px/400/lh1.65) — clearly subordinate */}
                <p className="mt-1.5 text-body text-secondary">
                    {description}
                </p>
            </div>
            {action && (
                <div className="flex shrink-0 items-center gap-3">
                    {action}
                </div>
            )}
        </div>
    )
}
