import { useRef, useState, useCallback } from "react"
import {
    CheckIcon,
    Clock3Icon,
    PlusIcon,
    Store,
    CameraIcon,
    BookTextIcon,
    UsersIcon,
    MapPinIcon,
    Trash2Icon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"
import type { BusinessHour, StoreProfile } from "../../../data/store"
import type { PlatformId } from "../../../data/platforms"
import { PLATFORM_META } from "../../../data/platforms"
import { useIntegrations } from "../../../store"
import { useAddMenuMutation, useDeleteMenuMutation, useUpdateBasicMutation, useUpdateHoursMutation } from "../../../hooks/useStoreMutations"
import { startOAuth } from "../../../api"

const PLATFORM_ICONS: Partial<Record<PlatformId, LucideIcon>> = {
    MOCK_MAP: MapPinIcon,
    INSTAGRAM: CameraIcon,
    NAVER_BLOG: BookTextIcon,
    FACEBOOK: UsersIcon,
}

const DISPLAY_PLATFORM_IDS: PlatformId[] = ["MOCK_MAP", "INSTAGRAM", "NAVER_BLOG", "FACEBOOK"]

const dayLabels: Record<string, string> = {
    MON: "월요일",
    TUE: "화요일",
    WED: "수요일",
    THU: "목요일",
    FRI: "금요일",
    SAT: "토요일",
    SUN: "일요일",
}

export function StoreProfilePage({ store }: { store: StoreProfile }) {
    const integrations = useIntegrations()
    const [saved, setSaved] = useState(false)
    const [businessHours, setBusinessHours] = useState<BusinessHour[]>(store.businessHours)
    const menuItems = store.menuItems
    const [newMenu, setNewMenu] = useState("")
    const basicFormRef = useRef<HTMLFormElement>(null)
    const updateBasicMutation = useUpdateBasicMutation()
    const updateHoursMutation = useUpdateHoursMutation()
    const addMenuMutation = useAddMenuMutation()
    const deleteMenuMutation = useDeleteMenuMutation()
    const [oauthLoading, setOauthLoading] = useState(false)
    const saving = updateBasicMutation.loading || updateHoursMutation.loading

    const handleConnect = useCallback(async (platformId: PlatformId) => {
        setOauthLoading(true)
        try {
            const url = await startOAuth(platformId, store.id)
            window.location.href = url
        } catch {
            setOauthLoading(false)
        }
    }, [store.id])

    const handleSave = async () => {
        if (!basicFormRef.current) return
        const els = basicFormRef.current.elements
        const [basicOk, hoursOk] = await Promise.all([
            updateBasicMutation.run({
                storeId: store.id,
                name: (els.namedItem("name") as HTMLInputElement).value,
                phone: (els.namedItem("phone") as HTMLInputElement).value,
                introduction: (
                    els.namedItem("introduction") as HTMLTextAreaElement
                ).value,
                address: (els.namedItem("address") as HTMLInputElement).value,
                category: (els.namedItem("category") as HTMLInputElement).value,
                toneOfVoice: (els.namedItem("toneOfVoice") as HTMLInputElement)
                    .value,
            }),
            updateHoursMutation.run({
                storeId: store.id,
                businessHours,
            }),
        ])
        if (basicOk && hoursOk) {
            setSaved(true)
            window.setTimeout(() => setSaved(false), 2800)
        }
    }

    const handleAddMenu = async () => {
        const trimmed = newMenu.trim()
        if (!trimmed) return
        const ok = await addMenuMutation.run({
            storeId: store.id,
            name: trimmed,
            description: "",
        })
        if (ok) {
            setNewMenu("")
        }
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
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#223b66] disabled:opacity-60"
                    >
                        <CheckIcon size={16} />{" "}
                        {saving ? "저장 중…" : "변경사항 저장"}
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
            {updateBasicMutation.error && (
                <p className="mb-5 text-sm font-medium text-[#d6503b]">
                    {updateBasicMutation.error}
                </p>
            )}
            {updateHoursMutation.error && (
                <p className="mb-5 text-sm font-medium text-[#d6503b]">
                    {updateHoursMutation.error}
                </p>
            )}

            <div className="mx-auto max-w-4xl space-y-6">
                <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Store size={18} className="text-[#42526e]" />
                        <div>
                            <h2 className="text-base font-bold">기본 정보</h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                고객 응대와 AI 콘텐츠의 기본 맥락으로
                                사용됩니다.
                            </p>
                        </div>
                    </div>
                    <form
                        ref={basicFormRef}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <Field
                                label="가게 이름"
                                defaultValue={store.name}
                                name="name"
                            />
                            <Field
                                label="대표 전화"
                                defaultValue={store.phone}
                                name="phone"
                            />
                            <div className="sm:col-span-2">
                                <Field
                                    label="소개글"
                                    defaultValue={store.introduction}
                                    textarea
                                    name="introduction"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Field
                                    label="주소"
                                    defaultValue={store.address}
                                    name="address"
                                />
                            </div>
                            <Field
                                label="업종"
                                defaultValue={store.category}
                                name="category"
                            />
                            <Field
                                label="가게의 말투"
                                defaultValue={store.toneOfVoice}
                                name="toneOfVoice"
                            />
                        </div>
                    </form>
                </section>

                <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
                    <div>
                        <h2 className="text-base font-bold">연동된 플랫폼</h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            리뷰와 콘텐츠를 관리할 플랫폼을 연동합니다.
                        </p>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {DISPLAY_PLATFORM_IDS.map((id) => {
                            const Icon = PLATFORM_ICONS[id]!
                            const meta = PLATFORM_META[id]
                            const connected = integrations.includes(id)

                            return (
                                <div
                                    key={id}
                                    className="flex items-center justify-between rounded-xl border border-[#ded9cf] p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f5f0]">
                                            <Icon
                                                size={18}
                                                className="text-[#42526e]"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold text-[#172033]">
                                                {meta.name}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {connected
                                                    ? "연동 완료"
                                                    : "아직 연동되지 않았습니다."}
                                            </p>
                                        </div>
                                    </div>

                                    {connected ? (
                                        <span className="rounded-full bg-[#eafaf5] px-3 py-1 text-xs font-bold text-[#168165]">
                                            연동됨
                                        </span>
                                    ) : meta.available ? (
                                        <button
                                            onClick={() => handleConnect(id)}
                                            disabled={oauthLoading}
                                            className="rounded-lg bg-[#172b4d] px-3 py-2 text-xs font-bold text-white hover:bg-[#223b66] disabled:opacity-60"
                                        >
                                            연동
                                        </button>
                                    ) : (
                                        <span className="text-xs font-semibold text-slate-400">
                                            준비 중
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>

                <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Clock3Icon size={18} className="text-[#42526e]" />
                        <div>
                            <h2 className="text-base font-bold">영업시간</h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                AI가 콘텐츠와 리뷰 답글에 참고하는 최신 운영
                                시간입니다.
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 divide-y divide-[#eeeae2]">
                        {businessHours.map((hour) => (
                            <div key={hour.dayOfWeek} className="flex items-center gap-3 py-3">
                                <span className="w-14 text-xs font-bold text-[#172033]">
                                    {dayLabels[hour.dayOfWeek] ?? hour.dayOfWeek}
                                </span>
                                <input
                                    value={hour.openTime}
                                    onChange={(event) =>
                                        setBusinessHours((current) =>
                                            current.map((item) =>
                                                item.dayOfWeek === hour.dayOfWeek
                                                    ? { ...item, openTime: event.target.value }
                                                    : item
                                            )
                                        )
                                    }
                                    className="w-20 rounded-lg border border-[#ded9cf] px-2 py-1.5 text-xs outline-none focus:border-[#3dd7af]"
                                    aria-label={`${dayLabels[hour.dayOfWeek] ?? hour.dayOfWeek} 시작 시간`}
                                />
                                <span className="text-slate-400">–</span>
                                <input
                                    value={hour.closeTime}
                                    onChange={(event) =>
                                        setBusinessHours((current) =>
                                            current.map((item) =>
                                                item.dayOfWeek === hour.dayOfWeek
                                                    ? { ...item, closeTime: event.target.value }
                                                    : item
                                            )
                                        )
                                    }
                                    className="w-20 rounded-lg border border-[#ded9cf] px-2 py-1.5 text-xs outline-none focus:border-[#3dd7af]"
                                    aria-label={`${dayLabels[hour.dayOfWeek] ?? hour.dayOfWeek} 종료 시간`}
                                />
                                <span className="ml-auto text-[11px] font-semibold text-[#168165]">
                                    {hour.open ? "영업" : "휴무"}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-base font-bold">
                                대표 메뉴 · 서비스
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                게시물 초안에 자연스럽게 활용할 수 있는
                                항목입니다.
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
                            disabled={addMenuMutation.loading}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#ded9cf] px-3 py-2.5 text-xs font-bold text-[#29425b] hover:bg-[#f7f5f0] disabled:opacity-60"
                        >
                            <PlusIcon size={15} />{" "}
                            {addMenuMutation.loading ? "추가 중…" : "메뉴 추가"}
                        </button>
                    </div>
                    {addMenuMutation.error && (
                        <p className="mt-2 text-sm font-medium text-[#d6503b]">
                            {addMenuMutation.error}
                        </p>
                    )}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {menuItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-xl bg-[#f7f5f0] px-4 py-3"
                            >
                                <span className="text-xs font-bold text-[#172033]">
                                    {item.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => deleteMenuMutation.run({ storeId: store.id, menuId: item.id })}
                                    disabled={deleteMenuMutation.loading}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-[#ebe7df] hover:text-[#d6503b]"
                                    aria-label={`${item.name} 삭제`}
                                >
                                    <Trash2Icon size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    )
}
function Field({
    label,
    defaultValue,
    name,
    textarea = false,
}: {
    label: string
    defaultValue: string
    name: string
    textarea?: boolean
}) {
    const className =
        "mt-1.5 w-full rounded-xl border border-[#ded9cf] bg-white px-3 py-2.5 text-sm text-[#172033] outline-none focus:border-[#3dd7af]"
    return (
        <label className="block text-xs font-bold text-[#42526e]">
            {label}
            {textarea ? (
                <textarea
                    className={`${className} min-h-[96px] resize-y leading-6`}
                    defaultValue={defaultValue}
                    name={name}
                />
            ) : (
                <input
                    className={className}
                    defaultValue={defaultValue}
                    name={name}
                />
            )}
        </label>
    )
}
