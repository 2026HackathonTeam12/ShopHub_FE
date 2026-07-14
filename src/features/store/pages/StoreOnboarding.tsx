import React, { useMemo, useState, type FormEvent } from "react"
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    Clock3Icon,
    PhoneIcon,
    SparklesIcon,
    StoreIcon,
} from "lucide-react"
import { useCreateStoreMutation } from "../../../hooks/useStoreMutations"

type StoreOnboardingProps = {
    initialStep?: 1 | 2 | 3
    onComplete: () => void
    onCancel?: () => void
}
type StoreForm = {
    name: string
    category: string
    address: string
    phone: string
    hours: string
    menu: string
    tone: string
}
type FieldErrors = Partial<Record<keyof StoreForm, string>>
const tones = ["따뜻하고 담백한", "경쾌하고 친근한", "전문적이고 신뢰감 있는", "정갈하고 차분한"]
const accentOptions = ["bg-[#e9c7a7]", "bg-[#b9d9cf]", "bg-[#efd59d]", "bg-[#d7c5ea]"]

export function StoreOnboarding({ initialStep = 1, onComplete, onCancel }: StoreOnboardingProps) {
    const createStoreMutation = useCreateStoreMutation()
    const [step, setStep] = useState(initialStep)
    const [isPendingConfirm, setIsPendingConfirm] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState<FieldErrors>({})
    const [form, setForm] = useState<StoreForm>({
        name: "",
        category: "카페 · 디저트",
        address: "",
        phone: "",
        hours: "매일 10:00 - 20:00",
        menu: "",
        tone: tones[0],
    })
    const steps = useMemo(() => ["기본 정보", "운영 정보", "확인"], [])

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "")
        if (digits.startsWith("02")) {
            if (digits.length <= 2) return digits
            if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`
            if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
            return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`
        } else {
            if (digits.length <= 3) return digits
            if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
            if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
            return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
        }
    }

    const update = (key: keyof StoreForm, value: string) => {
        const finalValue = key === "phone" ? formatPhone(value) : value

        setForm((current) => ({
            ...current,
            [key]: finalValue,
        }))
        setErrors((current) => ({
            ...current,
            [key]: undefined,
        }))
    }

    const validate = (currentStep: number) => {
        const nextErrors: FieldErrors = {}
        if (currentStep === 1) {
            if (form.name.trim().length < 2) nextErrors.name = "가게 이름을 2자 이상 입력해 주세요."
            if (!form.address.trim()) nextErrors.address = "고객이 찾을 수 있는 주소를 입력해 주세요."
        }
        if (currentStep === 2) {
            if (!/^[0-9-]{9,14}$/.test(form.phone.replace(/\s/g, "")))
                nextErrors.phone = "대표 전화번호를 확인해 주세요."
            if (!form.hours.trim()) nextErrors.hours = "기본 영업시간을 입력해 주세요."
            if (!form.menu.trim()) nextErrors.menu = "대표 메뉴 또는 서비스를 하나 이상 입력해 주세요."
        }
        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const next = () => {
        if (!validate(step)) return
        setStep((current) => Math.min(current + 1, 3) as 1 | 2 | 3)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!validate(1)) {
            setStep(1)
            setIsPendingConfirm(false)
            return
        }
        if (!validate(2)) {
            setStep(2)
            setIsPendingConfirm(false)
            return
        }

        if (!isPendingConfirm) {
            setIsPendingConfirm(true)
            return
        }

        const ok = await createStoreMutation.run(form)
        if (ok) setSubmitted(true)
    }

    const inputClass = (key: keyof StoreForm) =>
        `mt-1.5 w-full rounded-xl border bg-white px-3 py-3 text-sm text-[#172033] outline-none placeholder:text-slate-400 focus:border-[#3dd7af] ${errors[key] ? "border-[#d6503b]" : "border-[#ded9cf]"}`

    if (submitted) {
        const menuNames = form.menu.split(",").map((m) => m.trim()).filter(Boolean)
        return (
            <main className="flex min-h-screen w-full items-center justify-center bg-[#f5f2eb] p-5">
                <section className="w-full max-w-lg rounded-3xl border border-[#ded9cf] bg-white p-8 text-center shadow-[0_20px_55px_rgba(23,43,77,0.08)] sm:p-10">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eafaf5] text-[#168165]">
                        <CheckIcon size={30} />
                    </span>
                    <p className="font-mono-label mt-6 text-[10px] tracking-[0.15em] text-[#64748b]">STORE READY</p>
                    <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#172033]">
                        가게 등록을 완료했어요.
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        <strong className="text-[#172033]">{form.name.trim()}</strong>의 기본 정보를 저장했어요. 이제
                        이 가게의 메뉴와 말투를 담은 콘텐츠 초안을 바로 만들 수 있습니다.
                    </p>
                    <div className="mt-6 rounded-2xl bg-[#f0faf6] p-4 text-left">
                        <p className="text-xs font-bold text-[#168165]">AI 초안에 반영되는 정보</p>
                        <p className="mt-2 text-xs leading-5 text-[#42526e]">
                            {form.address.trim()} · {menuNames.join(" · ")} · {form.tone}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onComplete}
                        className="mt-7 inline-flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-5 py-3 text-sm font-bold text-white hover:bg-[#223b66]"
                    >
                        내 가게로 시작하기 <ArrowRightIcon size={17} />
                    </button>
                </section>
            </main>
        )
    }
    return (
        <main className="min-h-screen w-full bg-[#f5f2eb] px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-3xl">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172b4d] text-[#3dd7af]">
                            <StoreIcon size={18} />
                        </span>
                        <span className="text-lg font-extrabold tracking-tight text-[#172033]">ShopHub</span>
                    </div>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 hover:bg-[#ebe7df]"
                        >
                            나중에 하기
                        </button>
                    )}
                </header>

                <section className="mt-8 overflow-hidden rounded-3xl border border-[#ded9cf] bg-white shadow-[0_20px_55px_rgba(23,43,77,0.08)]">
                    <div className="border-b border-[#eeeae2] bg-[#101a30] px-5 py-6 text-white sm:px-8">
                        <p className="font-mono-label text-[10px] tracking-[0.15em] text-[#9edcc9]">STORE SETUP</p>
                        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">가게 정보를 등록해 주세요.</h1>
                        <p className="mt-2 text-sm leading-6 text-[#c5d3eb]">
                            입력한 정보는 콘텐츠 초안과 리뷰 응대의 기본 맥락으로 사용됩니다.
                        </p>
                    </div>

                    <div className="border-b border-[#eeeae2] px-5 py-4 sm:px-8">
                        <ol className="grid grid-cols-3 gap-2" aria-label="가게 등록 단계">
                            {steps.map((label, index) => {
                                const number = index + 1
                                const active = step === number
                                const complete = step > number
                                return (
                                    <li key={label} className="flex min-w-0 items-center gap-2">
                                        <span
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${complete ? "bg-[#3dd7af] text-[#10213b]" : active ? "bg-[#172b4d] text-white" : "bg-[#e9e5dc] text-slate-500"}`}
                                        >
                                            {complete ? <CheckIcon size={13} /> : number}
                                        </span>
                                        <span
                                            className={`truncate text-xs font-bold ${active || complete ? "text-[#172033]" : "text-slate-400"}`}
                                        >
                                            {label}
                                        </span>
                                    </li>
                                )
                            })}
                        </ol>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-8">
                        {step === 1 && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <StoreIcon size={18} className="text-[#42526e]" />
                                    <div>
                                        <h2 className="text-base font-bold text-[#172033]">어떤 가게인가요?</h2>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            고객에게 보이는 기본 정보를 먼저 알려주세요.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <Field label="가게 이름" error={errors.name} className="sm:col-span-2">
                                        <input
                                            value={form.name}
                                            onChange={(event) => update("name", event.target.value)}
                                            className={inputClass("name")}
                                            placeholder="예: 오월의 식탁"
                                            autoFocus
                                        />
                                    </Field>
                                    <Field label="업종" error={errors.category}>
                                        <select
                                            value={form.category}
                                            onChange={(event) => update("category", event.target.value)}
                                            className={inputClass("category")}
                                        >
                                            <option>카페 · 디저트</option>
                                            <option>음식점 · 주점</option>
                                            <option>뷰티 · 웰니스</option>
                                            <option>소매 · 편집숍</option>
                                            <option>생활 서비스</option>
                                        </select>
                                    </Field>
                                    <Field label="상세 주소" error={errors.address} className="sm:col-span-2">
                                        <input
                                            value={form.address}
                                            onChange={(event) => update("address", event.target.value)}
                                            className={inputClass("address")}
                                            placeholder="예: 서울 용산구 이태원로 00, 1층"
                                        />
                                    </Field>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <Clock3Icon size={18} className="text-[#42526e]" />
                                    <div>
                                        <h2 className="text-base font-bold text-[#172033]">
                                            운영의 기준을 알려주세요.
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            바로 쓰기 좋은 콘텐츠 초안을 위해 필요한 정보예요.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <Field label="대표 전화" error={errors.phone}>
                                        <span className="relative mt-1.5 block">
                                            <PhoneIcon
                                                size={18}
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                aria-hidden="true"
                                            />
                                            <input
                                                value={form.phone}
                                                onChange={(event) => update("phone", event.target.value)}
                                                className={`${inputClass("phone")} pl-11`}
                                                placeholder="02-0000-0000"
                                                inputMode="tel"
                                            />
                                        </span>
                                    </Field>
                                    <Field label="기본 영업시간" error={errors.hours}>
                                        <input
                                            value={form.hours}
                                            onChange={(event) => update("hours", event.target.value)}
                                            className={inputClass("hours")}
                                            placeholder="예: 매일 10:00 - 20:00"
                                        />
                                    </Field>
                                    <Field
                                        label="대표 메뉴 또는 서비스"
                                        error={errors.menu}
                                        className="sm:col-span-2"
                                        hint="쉼표로 구분해 여러 개를 입력할 수 있어요."
                                    >
                                        <input
                                            value={form.menu}
                                            onChange={(event) => update("menu", event.target.value)}
                                            className={inputClass("menu")}
                                            placeholder="예: 바질 파스타, 제철 샐러드, 와인 페어링"
                                        />
                                    </Field>
                                    <fieldset className="sm:col-span-2">
                                        <legend className="text-xs font-bold text-[#42526e]">가게의 말투</legend>
                                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                            {tones.map((tone) => (
                                                <label
                                                    key={tone}
                                                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold ${form.tone === tone ? "border-[#91d9c4] bg-[#eafaf5] text-[#168165]" : "border-[#ded9cf] text-[#42526e]"}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="tone"
                                                        value={tone}
                                                        checked={form.tone === tone}
                                                        onChange={(event) => update("tone", event.target.value)}
                                                        className="h-4 w-4 accent-[#168165]"
                                                    />
                                                    {tone}
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <SparklesIcon size={18} className="text-[#168165]" />
                                    <div>
                                        <h2 className="text-base font-bold text-[#172033]">이 정보로 시작할게요.</h2>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            등록 후 바로 이 가게에 맞춘 AI 콘텐츠 초안을 만들 수 있어요.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 rounded-2xl border border-[#d7e6df] bg-[#f0faf6] p-5">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172b4d] text-[#3dd7af]">
                                            <StoreIcon size={20} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-base font-extrabold text-[#172033]">{form.name}</p>
                                            <p className="mt-1 text-xs text-[#42526e]">
                                                {form.category} · {form.address}
                                            </p>
                                        </div>
                                    </div>
                                    <dl className="mt-5 grid gap-3 border-t border-[#cfe8df] pt-4 text-xs sm:grid-cols-2">
                                        <Detail label="주소" value={form.address} />
                                        <Detail label="대표 전화" value={form.phone} />
                                        <Detail label="영업시간" value={form.hours} />
                                        <Detail label="가게 말투" value={form.tone} />
                                        <Detail label="대표 메뉴" value={form.menu} className="sm:col-span-2" />
                                    </dl>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex items-center justify-between border-t border-[#eeeae2] pt-5">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPendingConfirm(false) // 이전 단계 이동 시 확인 상태 초기화
                                        setStep((current) => Math.max(current - 1, 1) as 1 | 2 | 3)
                                    }}
                                    className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold text-slate-500 hover:bg-[#f5f2eb]"
                                >
                                    <ArrowLeftIcon size={15} /> 이전
                                </button>
                            ) : (
                                <span />
                            )}
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={next}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#223b66]"
                                >
                                    다음 <ArrowRightIcon size={15} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={createStoreMutation.loading}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#223b66] disabled:opacity-60"
                                >
                                    {createStoreMutation.loading
                                        ? "가게 만드는 중…"
                                        : isPendingConfirm
                                          ? "정말 등록하시겠습니까?"
                                          : "가게 등록 완료"}{" "}
                                    {!createStoreMutation.loading && <CheckIcon size={15} />}
                                </button>
                            )}
                        </div>
                        {createStoreMutation.error && (
                            <p className="mt-3 text-center text-[11px] font-medium text-[#d6503b]">
                                {createStoreMutation.error}
                            </p>
                        )}
                    </form>
                </section>
            </div>
        </main>
    )
}

function Field({
    label,
    error,
    hint,
    className,
    children,
}: {
    label: string
    error?: string
    hint?: string
    className?: string
    children: React.ReactNode
}) {
    return (
        <label className={`block text-xs font-bold text-[#42526e] ${className ?? ""}`}>
            {label}
            {children}
            {error ? (
                <span className="mt-1.5 block text-[11px] font-medium text-[#d6503b]">{error}</span>
            ) : hint ? (
                <span className="mt-1.5 block text-[11px] font-medium text-slate-400">{hint}</span>
            ) : null}
        </label>
    )
}

function Detail({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <div className={className}>
            <dt className="font-bold text-slate-500">{label}</dt>
            <dd className="mt-1 break-keep font-semibold leading-5 text-[#172033]">{value}</dd>
        </div>
    )
}
