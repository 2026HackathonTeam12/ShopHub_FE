import type { ReactNode } from "react"

type PageHeaderProps = {
    eyebrow: string
    title: string
    description: string
    action?: ReactNode
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
    return (
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[#ded9cf] pb-5">
            <div>
                <p className="font-mono-label text-[10px] tracking-[0.14em] text-[#64748b] uppercase">{eyebrow}</p>
                <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[#172033]">{title}</h1>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>
            </div>
            {action && <div className="flex items-center gap-2.5">{action}</div>}
        </div>
    )
}
