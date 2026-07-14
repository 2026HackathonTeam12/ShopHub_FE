type DetailProps = {
    label: string
    value: string
    className?: string
}

export function Detail({ label, value, className }: DetailProps) {
    return (
        <div className={className}>
            <dt className="font-bold text-muted">{label}</dt>
            <dd className="mt-1 break-keep font-semibold leading-5 text-ink">{value}</dd>
        </div>
    )
}
