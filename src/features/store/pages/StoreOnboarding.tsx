import React, { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { StoreProfile } from '../../../data/store'

type StoreOnboardingProps = {
  initialStep?: number
  onComplete: (store: StoreProfile) => void
  onCancel?: () => void
}

type StoreForm = {
  name: string
  category: string
  neighborhood: string
  address: string
  phone: string
  hours: string
  menu: string
  tone: string
}

const steps = ['기본 정보', '운영 상세', 'AI 맥락 설정']
const accentOptions = ['bg-[#ebd7cd]', 'bg-[#b9d9cf]', 'bg-[#cbdcf6]', 'bg-[#e9e2d5]']

export function StoreOnboarding({ initialStep = 1, onComplete, onCancel }: StoreOnboardingProps) {
  const [step, setStep] = useState(initialStep)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<StoreForm>({
    name: '',
    category: '카페 · 디저트',
    neighborhood: '',
    address: '',
    phone: '',
    hours: '',
    menu: '',
    tone: '따뜻하고 담백한 동네 카페의 말투',
  })
  const [errors, setErrors] = useState<Partial<StoreForm>>({})

  const validate = (currentStep: number) => {
    const nextErrors: Partial<StoreForm> = {}
    if (currentStep === 1) {
      if (!form.name.trim()) nextErrors.name = '가게 이름을 입력해 주세요.'
      if (!form.neighborhood.trim()) nextErrors.neighborhood = '지역(시/구/동)을 입력해 주세요.'
    }
    if (currentStep === 2) {
      if (!form.address.trim()) nextErrors.address = '상세 주소를 입력해 주세요.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const next = () => {
    if (!validate(step)) return
    setStep((current) => Math.min(current + 1, 3))
  }

  const prev = () => {
    setStep((current) => Math.max(current - 1, 1))
  }

  const createStore = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate(3)) return
    setIsCreating(true)
    window.setTimeout(() => {
      const cleanName = form.name.trim()
      const initials = cleanName.slice(0, 2).toUpperCase()
      const id = `\${cleanName.toLowerCase().replace(/\\s+/g, '-')}-\${Date.now()}`
      onComplete({
        id,
        name: cleanName,
        category: form.category,
        neighborhood: form.neighborhood.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        hours: form.hours.trim(),
        initials,
        accent: accentOptions[Math.floor(Math.random() * accentOptions.length)],
        description: `\${form.neighborhood.trim()}의 \${form.category}입니다.`,
        menu: form.menu.split(',').map((item) => item.trim()).filter(Boolean),
        tone: form.tone,
        reviewCount: 0,
      })
      setIsCreating(false)
    }, 700)
  }

  const inputClass = (key: keyof StoreForm) =>
    `mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-[#172033] outline-none transition-colors focus:border-[#3dd7af] \${
      errors[key] ? 'border-[#d6503b]' : 'border-[#ded9cf]'
    }`

  return (
    <main className="h-screen w-full bg-[#f5f2eb] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-3xl border border-[#ded9cf] bg-white shadow-xl overflow-hidden">
        <header className="border-b border-[#eeeae2] px-5 py-4 sm:px-8 bg-[#fcfbfa]">
          <h1 className="text-base font-bold text-[#172033]">새 가게 워크스페이스 등록</h1>
          <p className="mt-1 text-xs text-slate-500">
            가게 기본 정보를 바탕으로 맞춤형 마케팅 글과 답변 가이드를 생성합니다.
          </p>
        </header>
        <div className="border-b border-[#eeeae2] px-5 py-4 sm:px-8">
          <ol className="grid grid-cols-3 gap-2" aria-label="가게 등록 단계">
            {steps.map((label, index) => {
              const number = index + 1
              const active = step === number
              const complete = step > number
              return (
                <li key={label} className="flex min-w-0 items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold \${
                      complete
                        ? 'bg-[#3dd7af] text-[#10213b]'
                        : active
                        ? 'bg-[#172b4d] text-white'
                        : 'bg-[#ebe7df] text-slate-400'
                    }`}
                  >
                    {complete ? <Check size={12} strokeWidth={2.5} /> : number}
                  </span>
                  <span
                    className={`truncate text-xs font-bold \${
                      active ? 'text-[#172033]' : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
        <form onSubmit={createStore} className="p-5 sm:p-8 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-[#42526e]">
                가게 이름 *
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className={inputClass('name')}
                  placeholder="예: 모모커피 연남점"
                />
                {errors.name && (
                  <span className="mt-1 block text-[11px] font-medium text-[#d6503b]">
                    {errors.name}
                  </span>
                )}
              </label>
              <label className="block text-xs font-bold text-[#42526e]">
                업종 카테고리
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-[#ded9cf] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3dd7af]"
                >
                  <option>카페 · 디저트</option>
                  <option>식당 · 요리</option>
                  <option>생활 · 쇼핑</option>
                  <option>미용 · 뷰티</option>
                </select>
              </label>
              <label className="block text-xs font-bold text-[#42526e]">
                행정구역 주소 (시/구/동) *
                <input
                  value={form.neighborhood}
                  onChange={(e) => setForm((prev) => ({ ...prev, neighborhood: e.target.value }))}
                  className={inputClass('neighborhood')}
                  placeholder="예: 서울 마포구 연남동"
                />
                {errors.neighborhood && (
                  <span className="mt-1 block text-[11px] font-medium text-[#d6503b]">
                    {errors.neighborhood}
                  </span>
                )}
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-[#42526e]">
                상세 주소 *
                <input
                  value={form.address}
                  onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                  className={inputClass('address')}
                  placeholder="지번 혹은 도로명 주소 상세 입력"
                />
                {errors.address && (
                  <span className="mt-1 block text-[11px] font-medium text-[#d6503b]">
                    {errors.address}
                  </span>
                )}
              </label>
              <label className="block text-xs font-bold text-[#42526e]">
                전화번호
                <input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className={inputClass('phone')}
                  placeholder="예: 02-123-4567"
                />
              </label>
              <label className="block text-xs font-bold text-[#42526e]">
                영업시간
                <input
                  value={form.hours}
                  onChange={(e) => setForm((prev) => ({ ...prev, hours: e.target.value }))}
                  className={inputClass('hours')}
                  placeholder="예: 매일 10:00 - 22:00"
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-[#42526e]">
                대표 메뉴 / 서비스 (쉼표로 구분)
                <input
                  value={form.menu}
                  onChange={(e) => setForm((prev) => ({ ...prev, menu: e.target.value }))}
                  className={inputClass('menu')}
                  placeholder="예: 모모 라떼, 버터 휘낭시에, 드립 커피"
                />
              </label>
              <label className="block text-xs font-bold text-[#42526e]">
                브랜드 어조 / 말투
                <select
                  value={form.tone}
                  onChange={(e) => setForm((prev) => ({ ...prev, tone: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-[#ded9cf] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3dd7af]"
                >
                  <option>따뜻하고 담백한 동네 카페의 말투</option>
                  <option>정중하고 전문적인 비즈니스 말투</option>
                  <option>친근하고 활기찬 트렌디한 말투</option>
                </select>
              </label>
            </div>
          )}

          <footer className="flex items-center justify-between border-t border-[#eeeae2] pt-5">
            {step > 1 ? (
              <button
                type="button"
                onClick={prev}
                className="flex items-center gap-1.5 rounded-xl border border-[#ded9cf] bg-white px-4 py-2.5 text-xs font-bold text-[#42526e] hover:bg-[#f7f5f0]"
              >
                <ArrowLeft size={14} />
                이전
              </button>
            ) : onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-[#ded9cf] bg-white px-4 py-2.5 text-xs font-bold text-[#42526e] hover:bg-[#f7f5f0]"
              >
                취소
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#223b66]"
              >
                다음
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isCreating}
                className="flex items-center gap-1.5 rounded-xl bg-[#168165] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#126b53] disabled:opacity-50"
              >
                {isCreating ? '생성 중…' : '가게 만들기'}
                {!isCreating && <Check size={14} strokeWidth={2.5} />}
              </button>
            )}
          </footer>
        </form>
      </div>
    </main>
  )
}
