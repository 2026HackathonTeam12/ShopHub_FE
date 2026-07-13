import { useState } from "react"
import { CheckIcon, Clock3Icon, PlusIcon, StoreIcon } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"
import { useStoreSettings } from "../../../store"
import type { StoreProfile } from "../../../data/store"

export function StoreProfilePage({ store }: { store: StoreProfile }) {
    const [saved, setSaved] = useState(false)
    const { hours, menus, updateHours, addMenu } = useStoreSettings()
    const [newMenu, setNewMenu] = useState("")

    const handleAddMenu = () => {
        addMenu(newMenu)
        setNewMenu("")
    }

    return (
        <>
            <PageHeader
                eyebrow="Store information"
                title="가게 정보"
                description="콘텐츠 AI와 고객 응대에 사용하는 가게의 기준 정보입니다."
                action={
                    <button
                        type="button"
                        onClick={() => {
                            setSaved(true)
                            window.setTimeout(() => setSaved(false), 2800)
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#223b66]"
                    >
                        <CheckIcon size={16} /> 변경사항 저장
                    </button>
                }
            />
            {saved && (
                <div
                    role="status"
                    className="mb-5 flex items-center justify-between rounded-xl border border-[#9bdcc8] bg-[#eafaf5] px-4 py-3 text-sm font-semibold text-[#168165]"
                >
                    가게 정보가 저장되었어요. 다음 AI 초안부터 반영됩니다.
                    <CheckIcon size={17} />
                </div>
            )}

            <div className="mx-auto max-w-4xl space-y-6">
                <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <StoreIcon size={18} className="text-[#42526e]" />
                        <div>
                            <h2 className="text-base font-bold">기본 정보</h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                고객 응대와 AI 콘텐츠의 기본 맥락으로 사용됩니다.
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Field label="가게 이름" defaultValue={store.name} />
                        <Field label="대표 전화" defaultValue={store.phone} />
                        <div className="sm:col-span-2">
                            <Field label="소개글" defaultValue={store.description} textarea />
                        </div>
                        <div className="sm:col-span-2">
                            <Field label="주소" defaultValue={store.address} />
                        </div>
                        <Field label="업종" defaultValue={store.category} />
                        <Field label="가게의 말투" defaultValue={store.tone} />
                    </div>
                </section>

                <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Clock3Icon size={18} className="text-[#42526e]" />
                        <div>
                            <h2 className="text-base font-bold">영업시간</h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                AI가 콘텐츠와 리뷰 답글에 참고하는 최신 운영 시간입니다.
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 rounded-xl bg-[#f7f5f0] px-3 py-2 text-xs font-semibold text-[#42526e]">
                        등록한 기본 시간: {store.hours}
                    </p>
                    <div className="mt-3 divide-y divide-[#eeeae2]">
                        {hours.map((row, index) => (
                            <div key={row[0]} className="flex items-center gap-3 py-3">
                                <span className="w-14 text-xs font-bold text-[#172033]">{row[0]}</span>
                                <input
                                    value={row[1]}
                                    onChange={(event) => updateHours(index, 1, event.target.value)}
                                    className="w-20 rounded-lg border border-[#ded9cf] px-2 py-1.5 text-xs outline-none focus:border-[#3dd7af]"
                                    aria-label={`${row[0]} 시작 시간`}
                                />
                                <span className="text-slate-400">–</span>
                                <input
                                    value={row[2]}
                                    onChange={(event) => updateHours(index, 2, event.target.value)}
                                    className="w-20 rounded-lg border border-[#ded9cf] px-2 py-1.5 text-xs outline-none focus:border-[#3dd7af]"
                                    aria-label={`${row[0]} 종료 시간`}
                                />
                                <span className="ml-auto text-[11px] font-semibold text-[#168165]">영업</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-base font-bold">대표 메뉴 · 서비스</h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                게시물 초안에 자연스럽게 활용할 수 있는 항목입니다.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <label className="sr-only" htmlFor="new-menu">
                            대표 메뉴 또는 서비스 추가
                        </label>
                        <input
                            id="new-menu"
                            value={newMenu}
                            onChange={(event) => setNewMenu(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault()
                                    handleAddMenu()
                                }
                            }}
                            className="min-w-0 flex-1 rounded-xl border border-[#ded9cf] px-3 py-2.5 text-sm outline-none focus:border-[#3dd7af]"
                            placeholder="대표 메뉴 또는 서비스를 추가하세요"
                        />
                        <button
                            type="button"
                            onClick={handleAddMenu}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#ded9cf] px-3 py-2.5 text-xs font-bold text-[#29425b] hover:bg-[#f7f5f0]"
                        >
                            <PlusIcon size={15} /> 메뉴 추가
                        </button>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {menus.map((menu) => (
                            <div
                                key={menu}
                                className="flex items-center justify-between rounded-xl bg-[#f7f5f0] px-4 py-3"
                            >
                                <span className="text-xs font-bold text-[#172033]">{menu}</span>
                                <span className="text-[11px] font-semibold text-[#168165]">AI 활용</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    )
}
function Field({ label, defaultValue, textarea = false }: { label: string; defaultValue: string; textarea?: boolean }) {
    const className =
        "mt-1.5 w-full rounded-xl border border-[#ded9cf] bg-white px-3 py-2.5 text-sm text-[#172033] outline-none focus:border-[#3dd7af]"
    return (
        <label className="block text-xs font-bold text-[#42526e]">
            {label}
            {textarea ? (
                <textarea className={`${className} min-h-[96px] resize-y leading-6`} defaultValue={defaultValue} />
            ) : (
                <input className={className} defaultValue={defaultValue} />
            )}
        </label>
    )
}
