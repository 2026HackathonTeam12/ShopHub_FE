import { type FormEvent, useEffect, useState } from "react"
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Store } from "lucide-react"
import { useLoginMutation, useSignupMutation } from "../../../hooks/useAuthMutations"

type AuthMode = "login" | "signup"

type AuthPageProps = {
    initialMode?: AuthMode
    onLogin: () => void
    onSignup: () => void
    onModeChange?: (mode: AuthMode) => void
}

type FormErrors = {
    name?: string
    email?: string
    password?: string
    terms?: string
}

export function AuthPage({ initialMode = "login", onLogin, onSignup, onModeChange }: AuthPageProps) {
    const [mode, setMode] = useState<AuthMode>(initialMode)
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        terms: false,
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [showPassword, setShowPassword] = useState(false)
    const loginMutation = useLoginMutation()
    const signupMutation = useSignupMutation()
    const isSubmitting = loginMutation.loading || signupMutation.loading
    const apiError = mode === "login" ? loginMutation.error : signupMutation.error

    const switchMode = (nextMode: AuthMode) => {
        setMode(nextMode)
        setErrors({})
        onModeChange?.(nextMode)
    }

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const nextErrors: FormErrors = {}
        if (mode === "signup" && values.name.trim().length < 2) {
            nextErrors.name = "이름을 2자 이상 입력해 주세요."
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            nextErrors.email = "이메일 형식을 확인해 주세요."
        }
        if (values.password.length < 8) {
            nextErrors.password = "비밀번호는 8자 이상이어야 해요."
        }
        if (mode === "signup" && !values.terms) {
            nextErrors.terms = "서비스 이용약관에 동의해 주세요."
        }
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) return

        if (mode === "login") {
            const ok = await loginMutation.run({ email: values.email, password: values.password })
            if (ok) onLogin()
        } else {
            const ok = await signupMutation.run({ email: values.email, password: values.password, name: values.name })
            if (ok) onSignup()
        }
    }

    const inputClass = (hasError: boolean) =>
        `w-full rounded-xl border bg-white px-3 py-3 text-sm text-[#172033] outline-none transition-colors placeholder:text-slate-400 focus:border-[#3dd7af] ${
            hasError ? "border-[#d6503b]" : "border-[#ded9cf]"
        }`

    return (
        <main className="h-screen w-full overflow-hidden bg-[#f5f2eb] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto grid h-full max-w-6xl overflow-hidden rounded-3xl border border-[#ded9cf] bg-white shadow-[0_24px_70px_rgba(23,43,77,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
                <section className="relative hidden overflow-hidden bg-[#101a30] p-10 text-white lg:flex lg:flex-col">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3dd7af] text-[#10213b]">
                            <Store size={21} strokeWidth={2.5} />
                        </span>
                        <div>
                            <p className="text-xl font-extrabold tracking-tight">ShopHub</p>
                            <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-slate-400">
                                business operations
                            </p>
                        </div>
                    </div>
                    <div className="my-auto max-w-md">
                        <p className="font-mono-label text-[10px] tracking-[0.16em] text-[#9edcc9]">
                            LOCAL BUSINESS WORKSPACE
                        </p>
                        <h1 className="mt-4 text-4xl font-extrabold leading-[1.25] tracking-tight">
                            가게의 오늘을
                            <br />더 단단하게 운영하세요.
                        </h1>
                        <p className="mt-5 text-sm leading-7 text-[#c5d3eb]">
                            콘텐츠 작성부터 리뷰 응대까지, 가게 정보에 맞춘 일상의 운영 흐름을 한곳에서 관리할 수
                            있어요.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                        <p className="text-xs font-bold text-white">시작은 가게 정보 한 번이면 충분해요.</p>
                        <p className="mt-2 text-xs leading-5 text-[#c5d3eb]">
                            대표 메뉴와 말투를 입력하면 ShopHub가 콘텐츠 초안에 자연스럽게 반영합니다.
                        </p>
                    </div>
                </section>
                <section className="flex min-h-full items-center justify-center px-5 py-10 sm:px-10">
                    <div className="w-full max-w-md">
                        <div className="flex items-center gap-2 lg:hidden">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172b4d] text-[#3dd7af]">
                                <Store size={18} />
                            </span>
                            <span className="text-lg font-extrabold text-[#172033]">ShopHub</span>
                        </div>
                        <div className="mt-10 lg:mt-0">
                            <p className="font-mono-label text-[10px] tracking-[0.14em] text-[#64748b]">
                                {mode === "login" ? "WELCOME BACK" : "START YOUR WORKSPACE"}
                            </p>
                            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#172033]">
                                {mode === "login" ? "다시 만나 반가워요." : "가게 운영을 시작해 볼까요?"}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {mode === "login"
                                    ? "ShopHub 계정으로 로그인해 주세요."
                                    : "계정을 만들고 첫 가게 정보를 등록해 주세요."}
                            </p>
                        </div>
                        <div
                            className="mt-7 grid grid-cols-2 rounded-xl bg-[#f3f0e9] p-1"
                            role="tablist"
                            aria-label="인증 방식"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={mode === "login"}
                                onClick={() => switchMode("login")}
                                className={`rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${
                                    mode === "login" ? "bg-white text-[#172033] shadow-sm" : "text-slate-500"
                                }`}
                            >
                                로그인
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={mode === "signup"}
                                onClick={() => switchMode("signup")}
                                className={`rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${
                                    mode === "signup" ? "bg-white text-[#172033] shadow-sm" : "text-slate-500"
                                }`}
                            >
                                회원가입
                            </button>
                        </div>
                        <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
                            {mode === "signup" && (
                                <label className="block text-xs font-bold text-[#42526e]">
                                    운영자 이름
                                    <input
                                        value={values.name}
                                        onChange={(event) =>
                                            setValues((current) => ({
                                                ...current,
                                                name: event.target.value,
                                            }))
                                        }
                                        className={`mt-1.5 ${inputClass(Boolean(errors.name))}`}
                                        placeholder="이름을 입력해 주세요"
                                        autoComplete="name"
                                        aria-invalid={Boolean(errors.name)}
                                        aria-describedby={errors.name ? "name-error" : undefined}
                                    />
                                    {errors.name && (
                                        <span
                                            id="name-error"
                                            className="mt-1.5 block text-[11px] font-medium text-[#d6503b]"
                                        >
                                            {errors.name}
                                        </span>
                                    )}
                                </label>
                            )}
                            <label className="block text-xs font-bold text-[#42526e]">
                                이메일
                                <span className="relative mt-1.5 block">
                                    <Mail
                                        size={18}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        type="email"
                                        value={values.email}
                                        onChange={(event) =>
                                            setValues((current) => ({
                                                ...current,
                                                email: event.target.value,
                                            }))
                                        }
                                        className={`${inputClass(Boolean(errors.email))} pl-11`}
                                        placeholder="name@business.kr"
                                        autoComplete="email"
                                        aria-invalid={Boolean(errors.email)}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                    />
                                </span>
                                {errors.email && (
                                    <span
                                        id="email-error"
                                        className="mt-1.5 block text-[11px] font-medium text-[#d6503b]"
                                    >
                                        {errors.email}
                                    </span>
                                )}
                            </label>
                            <label className="block text-xs font-bold text-[#42526e]">
                                비밀번호
                                <span className="relative mt-1.5 block">
                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={values.password}
                                        onChange={(event) =>
                                            setValues((current) => ({
                                                ...current,
                                                password: event.target.value,
                                            }))
                                        }
                                        className={`${inputClass(Boolean(errors.password))} pl-11 pr-12`}
                                        placeholder="8자 이상 입력해 주세요"
                                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                                        aria-invalid={Boolean(errors.password)}
                                        aria-describedby={errors.password ? "password-error" : undefined}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((visible) => !visible)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-[#f5f2eb] hover:text-[#172033]"
                                        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </span>
                                {errors.password ? (
                                    <span
                                        id="password-error"
                                        className="mt-1.5 block text-[11px] font-medium text-[#d6503b]"
                                    >
                                        {errors.password}
                                    </span>
                                ) : (
                                    <span className="mt-1.5 block text-[11px] font-medium text-slate-400">
                                        영문, 숫자, 특수문자 중 2가지 이상을 권장해요.
                                    </span>
                                )}
                            </label>
                            {mode === "signup" && (
                                <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-[#f7f5f0] px-3 py-3 text-xs leading-5 text-[#42526e]">
                                    <input
                                        type="checkbox"
                                        checked={values.terms}
                                        onChange={(event) =>
                                            setValues((current) => ({
                                                ...current,
                                                terms: event.target.checked,
                                            }))
                                        }
                                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#168165]"
                                        aria-describedby={errors.terms ? "terms-error" : undefined}
                                    />
                                    <span>
                                        서비스 이용약관 및 개인정보 처리방침에 동의합니다.
                                        {errors.terms && (
                                            <span id="terms-error" className="mt-1 block font-medium text-[#d6503b]">
                                                {errors.terms}
                                            </span>
                                        )}
                                    </span>
                                </label>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#172b4d] px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#223b66] disabled:cursor-wait disabled:opacity-60"
                            >
                                {isSubmitting ? "확인 중…" : mode === "login" ? "로그인하기" : "계정 만들기"}
                                {!isSubmitting && <ArrowRight size={17} />}
                            </button>
                        </form>
                        {apiError && (
                            <p className="mt-4 text-center text-[11px] font-medium text-[#d6503b]">{apiError}</p>
                        )}
                        <p className="mt-6 text-center text-xs text-slate-500">
                            {mode === "login" ? "처음이신가요?" : "이미 ShopHub 계정이 있으신가요?"}{" "}
                            <button
                                type="button"
                                onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                                className="font-bold text-[#29425b] hover:underline"
                            >
                                {mode === "login" ? "회원가입" : "로그인"}
                            </button>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}
