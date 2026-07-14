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
import { useSelectedStoreId } from "../../../store"
import { startOAuth } from "../../../api"
import type { PlatformId } from "../../../data/platforms"
import { PLATFORM_META, isOAuthPlatform } from "../../../data/platforms"

const SNS_PLATFORM_IDS: PlatformId[] = ["INSTAGRAM", "FACEBOOK", "X"]

type Step = 1 | 2 | 3 | 4
type StoreOnboardingProps = {
    initialStep?: Step
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
const tones = [
    "따뜻하고 담백한",
    "경쾌하고 친근한",
    "전문적이고 신뢰감 있는",
    "정갈하고 차분한",
]

export function StoreOnboarding({
    initialStep = 1,
    onComplete,
    onCancel,
}: StoreOnboardingProps) {
    const createStoreMutation = useCreateStoreMutation()
    const selectedStoreId = useSelectedStoreId()
    const [step, setStep] = useState<Step>(initialStep)
    const [isPendingConfirm, setIsPendingConfirm] = useState(false)
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
    const [oauthLoading, setOauthLoading] = useState(false)
    const [oauthError, setOauthError] = useState<string | null>(null)
    const steps = useMemo(
        () => ["기본 정보", "운영 정보", "확인", "가게 연동"],
        [],
    )

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "")
        if (digits.startsWith("02")) {
            if (digits.length <= 2) return digits
            if (digits.length <= 5)
                return `${digits.slice(0, 2)}-${digits.slice(2)}`
            if (digits.length <= 9)
                return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
            return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`
        } else {
            if (digits.length <= 3) return digits
            if (digits.length <= 6)
                return `${digits.slice(0, 3)}-${digits.slice(3)}`
            if (digits.length <= 10)
                return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
            return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
        }
    }

    const update = (key: keyof StoreForm, value: string) => {
        const finalValue = key === "phone" ? formatPhone(value) : value
        setForm((current) => ({ ...current, [key]: finalValue }))
        setErrors((current) => ({ ...current, [key]: undefined }))
    }

    const validate = (currentStep: number) => {
        const nextErrors: FieldErrors = {}
        if (currentStep === 1) {
            if (form.name.trim().length < 2)
                nextErrors.name = "가게 이름을 2자 이상 입력해 주세요."
            if (!form.address.trim())
                nextErrors.address = "고객이 찾을 수 있는 주소를 입력해 주세요."
        }
        if (currentStep === 2) {
            if (!/^[0-9-]{9,14}$/.test(form.phone.replace(/\s/g, "")))
                nextErrors.phone = "대표 전화번호를 확인해 주세요."
            if (!form.hours.trim())
                nextErrors.hours = "기본 영업시간을 입력해 주세요."
            if (!form.menu.trim())
                nextErrors.menu = "대표 메뉴 또는 서비스를 하나 이상 입력해 주세요."
        }
        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const next = () => {
        if (!validate(step)) return
        setStep((current) => Math.min(current + 1, 4) as Step)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!validate(1)) { setStep(1); setIsPendingConfirm(false); return }
        if (!validate(2)) { setStep(2); setIsPendingConfirm(false); return }
        if (!isPendingConfirm) { setIsPendingConfirm(true); return }
        const ok = await createStoreMutation.run(form)
        if (ok) setStep(4)
    }

    const handleSnsOAuth = async (platformId: PlatformId) => {
        if (!selectedStoreId) return
        setOauthLoading(true)
        setOauthError(null)
        try {
            const url = await startOAuth(platformId, selectedStoreId)
            window.location.href = url
        } catch (err) {
            setOauthLoading(false)
            setOauthError(err instanceof Error ? err.message : "연동을 시작할 수 없습니다.")
        }
    }

    const handleMockMapOAuth = async () => {
        if (!selectedStoreId) return
        setOauthLoading(true)
        setOauthError(null)
        try {
            const url = await startOAuth("MOCK_MAP", selectedStoreId)
            window.location.href = url
        } catch (err) {
            setOauthLoading(false)
            setOauthError(err instanceof Error ? err.message : "연동을 시작할 수 없습니다.")
        }
    }
    const OAUTH_SNS_PLATFORMS = new Set<PlatformId>(["X"])

    const inputClass = (key: keyof StoreForm) =>
        `mt-1.5 w-full rounded-xl border bg-surface px-3 py-3 text-body text-ink outline-none placeholder:text-muted focus:border-accent ${errors[key] ? "border-error" : "border-border"}`

    return (
        <main className="min-h-screen w-full bg-canvas px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-3xl">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-panel text-accent-on-dark">
                            <StoreIcon size={18} />
                        </span>
                        <span className="text-lg font-extrabold tracking-tight text-ink">
                            ShopHub
                        </span>
                    </div>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-xl px-3 py-2 text-caption font-bold text-muted hover:bg-border-subtle"
                        >
                            나중에 하기
                        </button>
                    )}
                </header>

                <section className="mt-8 overflow-hidden rounded-[20px] border border-border bg-surface">
                    {/* Dark header */}
                    <div className="border-b border-border-subtle bg-panel px-5 py-6 text-white sm:px-8">
                        <p className="font-mono-label text-[10px] tracking-[0.15em] text-accent-on-dark">
                            STORE SETUP
                        </p>
                        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
                            가게 정보를 등록해 주세요.
                        </h1>
                        <p className="mt-2 text-body leading-6 text-white/60">
                            입력한 정보는 콘텐츠 초안과 리뷰 응대의 기본 맥락으로 사용됩니다.
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="border-b border-border-subtle px-5 py-4 sm:px-8">
                        <ol className="grid grid-cols-4 gap-2" aria-label="가게 등록 단계">
                            {steps.map((label, index) => {
                                const number = index + 1
                                const active = step === number
                                const complete = step > number
                                return (
                                    <li key={label} className="flex min-w-0 items-center gap-2">
                                        <span
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${complete ? "bg-accent text-white" : active ? "bg-accent text-white" : "bg-border text-muted"}`}
                                        >
                                            {complete ? <CheckIcon size={13} /> : number}
                                        </span>
                                        <span
                                            className={`truncate text-caption font-bold ${active || complete ? "text-ink" : "text-muted"}`}
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
                                    <StoreIcon size={18} className="text-secondary" />
                                    <div>
                                        <h2 className="text-heading font-bold text-ink">
                                            가게의 기본 정보를 입력해 주세요.
                                        </h2>
                                        <p className="mt-1 text-caption text-muted">
                                            이 정보는 콘텐츠 초안과 운영 화면에 사용됩니다.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <InlineField label="가게 이름" error={errors.name} className="sm:col-span-2">
                                        <input
                                            value={form.name}
                                            onChange={(e) => update("name", e.target.value)}
                                            className={inputClass("name")}
                                            placeholder="예: 모모 커피"
                                        />
                                    </InlineField>
                                    <InlineField label="업종">
                                        <input
                                            value={form.category}
                                            onChange={(e) => update("category", e.target.value)}
                                            className={inputClass("category")}
                                            placeholder="예: 카페 · 디저트"
                                        />
                                    </InlineField>
                                    <InlineField label="주소" error={errors.address}>
                                        <input
                                            value={form.address}
                                            onChange={(e) => update("address", e.target.value)}
                                            className={inputClass("address")}
                                            placeholder="예: 서울 마포구 연남동"
                                        />
                                    </InlineField>
                                    <fieldset className="sm:col-span-2">
                                        <legend className="text-caption font-bold text-secondary">
                                            가게의 말투
                                        </legend>
                                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                            {tones.map((tone) => (
                                                <label
                                                    key={tone}
                                                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-caption font-bold ${form.tone === tone ? "border-accent bg-accent-muted text-accent" : "border-border text-secondary"}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="tone"
                                                        value={tone}
                                                        checked={form.tone === tone}
                                                        onChange={(e) => update("tone", e.target.value)}
                                                        className="h-4 w-4 accent-[#3E87F4]"
                                                    />
                                                    {tone}
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <Clock3Icon size={18} className="text-secondary" />
                                    <div>
                                        <h2 className="text-heading font-bold text-ink">
                                            운영의 기준을 알려주세요.
                                        </h2>
                                        <p className="mt-0.5 text-caption text-muted">
                                            바로 쓰기 좋은 콘텐츠 초안을 위해 필요한 정보예요.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <InlineField label="대표 전화" error={errors.phone}>
                                        <span className="relative mt-1.5 block">
                                            <PhoneIcon
                                                size={18}
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                                                aria-hidden="true"
                                            />
                                            <input
                                                value={form.phone}
                                                onChange={(e) => update("phone", e.target.value)}
                                                className={`${inputClass("phone")} pl-11`}
                                                placeholder="02-0000-0000"
                                                inputMode="tel"
                                            />
                                        </span>
                                    </InlineField>
                                    <InlineField label="기본 영업시간" error={errors.hours}>
                                        <input
                                            value={form.hours}
                                            onChange={(e) => update("hours", e.target.value)}
                                            className={inputClass("hours")}
                                            placeholder="예: 매일 10:00 - 20:00"
                                        />
                                    </InlineField>
                                    <InlineField
                                        label="대표 메뉴 또는 서비스"
                                        error={errors.menu}
                                        hint="쉼표로 구분해 여러 개를 입력할 수 있어요."
                                        className="sm:col-span-2"
                                    >
                                        <input
                                            value={form.menu}
                                            onChange={(e) => update("menu", e.target.value)}
                                            className={inputClass("menu")}
                                            placeholder="예: 바질 파스타, 제철 샐러드, 와인 페어링"
                                        />
                                    </InlineField>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <SparklesIcon size={18} className="text-accent" />
                                    <div>
                                        <h2 className="text-heading font-bold text-ink">
                                            이 정보로 시작할게요.
                                        </h2>
                                        <p className="mt-0.5 text-caption text-muted">
                                            등록 후 바로 이 가게에 맞춘 AI 콘텐츠 초안을 만들 수 있어요.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 rounded-[20px] border border-accent/20 bg-accent-muted p-5">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-panel text-accent-on-dark">
                                            <StoreIcon size={20} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-heading font-extrabold text-ink">
                                                {form.name}
                                            </p>
                                            <p className="mt-1 text-caption text-secondary">
                                                {form.category} · {form.address}
                                            </p>
                                        </div>
                                    </div>
                                    <dl className="mt-5 grid gap-3 border-t border-border-subtle pt-4 text-caption sm:grid-cols-2">
                                        <InlineDetail label="주소" value={form.address} />
                                        <InlineDetail label="대표 전화" value={form.phone} />
                                        <InlineDetail label="영업시간" value={form.hours} />
                                        <InlineDetail label="가게 말투" value={form.tone} />
                                        <InlineDetail label="대표 메뉴" value={form.menu} className="sm:col-span-2" />
                                    </dl>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <StoreIcon size={18} className="text-secondary" />
                                    <div>
                                        <h2 className="text-heading font-bold text-ink">
                                            가게 운영 플랫폼을 연결해주세요.
                                        </h2>
                                        <p className="mt-1 text-caption text-muted">
                                            MockMap 점주 OAuth로 가게를 연결합니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col gap-5">
                                    <button
                                        type="button"
                                        disabled={oauthLoading || !selectedStoreId}
                                        onClick={handleMockMapOAuth}
                                        className="w-full rounded-[20px] border border-border p-5 text-left transition hover:border-accent disabled:cursor-default disabled:opacity-60"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-body font-bold text-ink">
                                                    {PLATFORM_META.MOCK_MAP.name}
                                                </p>
                                                <p className="mt-1 text-caption text-muted">
                                                    MockMap에서 로그인·허용을 확인한 뒤 리뷰를 연동합니다.
                                                </p>
                                            </div>
                                            <span className="rounded-xl bg-accent px-4 py-2 text-caption font-bold text-white">
                                                {oauthLoading ? "연결 중…" : "연동"}
                                            </span>
                                        </div>
                                    </button>

                                    <div className="w-full border-t border-border" />

                                    <div className="flex flex-col gap-2">
                                        <p className="text-body font-semibold text-muted">
                                            SNS 연동
                                        </p>
                                        <div className="grid gap-3 sm:grid-cols-3">
                                            {SNS_PLATFORM_IDS.map((id) =>
                                                OAUTH_SNS_PLATFORMS.has(id) ? (
                                                    <button
                                                        key={id}
                                                        type="button"
                                                        disabled={oauthLoading || !selectedStoreId}
                                                        onClick={() => handleSnsOAuth(id)}
                                                        className="rounded-xl border border-border p-4 text-left transition hover:border-accent disabled:opacity-60"
                                                    >
                                                        <p className="text-body font-semibold text-ink">
                                                            {PLATFORM_META[id].name}
                                                        </p>
                                                        <p className="mt-1 text-caption text-muted">
                                                            {oauthLoading ? "연결 중…" : "OAuth 로그인"}
                                                        </p>
                                                    </button>
                                                ) : isOAuthPlatform(id) ? null : (
                                                    <div key={id} className="rounded-xl border border-border bg-canvas p-4">
                                                        <p className="text-body font-semibold text-ink">
                                                            {PLATFORM_META[id].name}
                                                        </p>
                                                        <p className="mt-1 text-caption text-muted">
                                                            공용 계정 (서버 설정)
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                        {oauthError && (
                                            <p className="text-caption font-medium text-error">{oauthError}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex items-center justify-between border-t border-border-subtle pt-5">
                            {step > 1 && step < 4 ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPendingConfirm(false)
                                        setStep((current) => Math.max(current - 1, 1) as Step)
                                    }}
                                    className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-caption font-bold text-muted hover:bg-canvas"
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
                                    className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-caption font-bold text-white hover:bg-accent-hover"
                                >
                                    다음 <ArrowRightIcon size={15} />
                                </button>
                            ) : step === 3 ? (
                                <button
                                    type="submit"
                                    disabled={createStoreMutation.loading}
                                    className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-caption font-bold text-white hover:bg-accent-hover disabled:opacity-60"
                                >
                                    {createStoreMutation.loading
                                        ? "가게 만드는 중…"
                                        : isPendingConfirm
                                          ? "정말 등록하시겠습니까?"
                                          : "가게 등록 완료"}{" "}
                                    {!createStoreMutation.loading && <CheckIcon size={15} />}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onComplete}
                                    className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-caption font-bold text-white hover:bg-accent-hover"
                                >
                                    완료 <CheckIcon size={15} />
                                </button>
                            )}
                        </div>
                        {createStoreMutation.error && (
                            <p className="mt-3 text-center text-caption font-medium text-error">
                                {createStoreMutation.error}
                            </p>
                        )}
                    </form>
                </section>
            </div>
        </main>
    )
}

function InlineField({
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
        <label className={`block text-caption font-bold text-secondary ${className ?? ""}`}>
            {label}
            {children}
            {error ? (
                <span className="mt-1.5 block text-caption font-medium text-error">{error}</span>
            ) : hint ? (
                <span className="mt-1.5 block text-caption font-medium text-muted">{hint}</span>
            ) : null}
        </label>
    )
}

function InlineDetail({
    label,
    value,
    className,
}: {
    label: string
    value: string
    className?: string
}) {
    return (
        <div className={className}>
            <dt className="font-bold text-muted">{label}</dt>
            <dd className="mt-1 break-keep font-semibold leading-5 text-ink">{value}</dd>
        </div>
    )
}
