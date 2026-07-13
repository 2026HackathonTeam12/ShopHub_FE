type DetailProps = {
    label: string
    value: string
    className?: string
}

export function Detail({ label, value, className }: DetailProps) {
    return (
        <div className={className}>
            <dt className="font-bold text-slate-500">{label}</dt>
            <dd className="mt-1 break-keep font-semibold leading-5 text-[#172033]">{value}</dd>
        </div>
    )
}
