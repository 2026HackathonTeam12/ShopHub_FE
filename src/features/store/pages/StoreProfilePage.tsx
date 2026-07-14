import { useRef, useState, useCallback } from "react"
import {
    CheckIcon,
    Clock3Icon,
    PlusIcon,
    Store,
    CameraIcon,
    AtSignIcon,
    UsersIcon,
    MapPinIcon,
    Trash2Icon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"
import { Button } from "../../../components/ui"
import type { BusinessHour, StoreProfile } from "../../../data/store"
import type { PlatformId } from "../../../data/platforms"
import { PLATFORM_META, isOAuthPlatform } from "../../../data/platforms"
import { useIntegrations, useConnectablePlatforms } from "../../../store"
import {
    useAddMenuMutation,
    useDeleteMenuMutation,
    useUpdateBasicMutation,
    useUpdateHoursMutation,
} from "../../../hooks/useStoreMutations"
import {
    useDisconnectOAuthMutation,
    useFetchIntegrationsMutation,
} from "../../../hooks/useIntegrationMutations"
import { useFetchReviewsMutation } from "../../../hooks/useReviewMutations"
import { startOAuth } from "../../../api"

const PLATFORM_ICONS: Partial<Record<PlatformId, LucideIcon>> = {
    MOCK_MAP:  MapPinIcon,
    INSTAGRAM: CameraIcon,
    X:         AtSignIcon,
    FACEBOOK:  UsersIcon,
}

const DISPLAY_PLATFORM_IDS: PlatformId[] = ["MOCK_MAP", "INSTAGRAM", "X", "FACEBOOK"]

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
    const connectablePlatforms = useConnectablePlatforms()
    const [saved, setSaved] = useState(false)
    const [businessHours, setBusinessHours] = useState<BusinessHour[]>(store.businessHours)
    const menuItems = store.menuItems
    const [newMenu, setNewMenu] = useState("")
    const basicFormRef = useRef<HTMLFormElement>(null)
    const updateBasicMutation = useUpdateBasicMutation()
    const updateHoursMutation = useUpdateHoursMutation()
    const addMenuMutation = useAddMenuMutation()
    const deleteMenuMutation = useDeleteMenuMutation()
    const fetchIntegrations = useFetchIntegrationsMutation()
    const fetchReviews = useFetchReviewsMutation()
    const disconnectOAuth = useDisconnectOAuthMutation()
    const [oauthLoading, setOauthLoading] = useState(false)
    const [oauthError, setOauthError] = useState<string | null>(null)
    const saving = updateBasicMutation.loading || updateHoursMutation.loading

    const handleConnect = useCallback(
        async (platformId: PlatformId) => {
            setOauthLoading(true)
            setOauthError(null)
            try {
                const url = await startOAuth(platformId, store.id)
                window.location.href = url
            } catch (err) {
                setOauthLoading(false)
                setOauthError(err instanceof Error ? err.message : "연동을 시작할 수 없습니다.")
            }
        },
        [store.id],
    )

    const handleDisconnect = async (platformId: PlatformId) => {
        const ok = await disconnectOAuth.run({ platformId, storeId: store.id })
        if (ok) {
            await fetchIntegrations.run(store.id)
            if (platformId === "MOCK_MAP") {
                await fetchReviews.run(store.id)
            }
        }
    }

    const handleSave = async () => {
        if (!basicFormRef.current) return
        const els = basicFormRef.current.elements
        const [basicOk, hoursOk] = await Promise.all([
            updateBasicMutation.run({
                storeId: store.id,
                name: (els.namedItem("name") as HTMLInputElement).value,
                phone: (els.namedItem("phone") as HTMLInputElement).value,
                introduction: (els.namedItem("introduction") as HTMLTextAreaElement).value,
                address: (els.namedItem("address") as HTMLInputElement).value,
                category: (els.namedItem("category") as HTMLInputElement).value,
                toneOfVoice: (els.namedItem("toneOfVoice") as HTMLInputElement).value,
            }),
            updateHoursMutation.run({ storeId: store.id, businessHours }),
        ])
        if (basicOk && hoursOk) {
            setSaved(true)
            window.setTimeout(() => setSaved(false), 2800)
        }
    }

    const handleAddMenu = async () => {
        const trimmed = newMenu.trim()
        if (!trimmed) return
        const ok = await addMenuMutation.run({ storeId: store.id, name: trimmed, description: "" })
        if (ok) setNewMenu("")
    }

    return (
        <>
            <PageHeader
                eyebrow="Store information"
                title="가게 정보"
                description="콘텐츠 AI와 고객 응대에 사용하는 가게의 기준 정보입니다."
                action={
                    <Button
                        variant="primary"
                        size="sm"
                        icon={<CheckIcon size={15} />}
                        loading={saving}
                        onClick={handleSave}
                    >
                        {saving ? "저장 중…" : "변경사항 저장"}
                    </Button>
                }
            />

            {/* Success toast */}
            {saved && (
                <div
                    role="status"
                    className="mb-5 flex items-center justify-between rounded-lg border border-success-border bg-success-bg px-4 py-3 text-body font-semibold text-success"
                >
                    가게 정보가 저장되었어요. 다음 AI 초안부터 반영됩니다.
                    <CheckIcon size={16} />
                </div>
            )}
            {updateBasicMutation.error && (
                <p className="mb-5 text-body font-medium text-error">
                    {updateBasicMutation.error}
                </p>
            )}
            {updateHoursMutation.error && (
                <p className="mb-5 text-body font-medium text-error">
                    {updateHoursMutation.error}
                </p>
            )}

            <div className="mx-auto max-w-3xl space-y-8">
                {/* Basic info */}
                <section className="rounded-[20px] border border-border bg-surface p-5">
                    <div className="flex items-center gap-2">
                        <Store size={17} className="text-secondary" />
                        <div>
                            <h2 className="text-heading font-semibold text-ink">기본 정보</h2>
                            <p className="mt-0.5 text-caption text-muted">
                                고객 응대와 AI 콘텐츠의 기본 맥락으로 사용됩니다.
                            </p>
                        </div>
                    </div>
                    <form ref={basicFormRef} onSubmit={(e) => e.preventDefault()}>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <Field label="가게 이름"    defaultValue={store.name}         name="name" />
                            <Field label="대표 전화"    defaultValue={store.phone}        name="phone" />
                            <div className="sm:col-span-2">
                                <Field label="소개글"   defaultValue={store.introduction} name="introduction" textarea />
                            </div>
                            <div className="sm:col-span-2">
                                <Field label="주소"     defaultValue={store.address}      name="address" />
                            </div>
                            <Field label="업종"         defaultValue={store.category}     name="category" />
                            <Field label="가게의 말투"  defaultValue={store.toneOfVoice}  name="toneOfVoice" />
                        </div>
                    </form>
                </section>

                {/* Platform integrations */}
                <section className="rounded-[20px] border border-border bg-surface p-5">
                    <h2 className="text-heading font-semibold text-ink">연동된 플랫폼</h2>
                    <p className="mt-0.5 text-caption text-muted">
                        리뷰와 콘텐츠를 관리할 플랫폼을 연동합니다.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {DISPLAY_PLATFORM_IDS.map((id) => {
                            const Icon = PLATFORM_ICONS[id]!
                            const meta = PLATFORM_META[id]
                            const connected = integrations.includes(id)
                            const connectable = connectablePlatforms.includes(id)
                            const oauthPlatform = isOAuthPlatform(id)

                            return (
                                <div
                                    key={id}
                                    className="flex items-center justify-between rounded-lg border border-border p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas">
                                            <Icon size={17} className="text-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-body font-semibold text-ink">
                                                {meta.name}
                                            </p>
                                            <p className="text-caption text-muted">
                                                {connected ? "연동 완료" : "아직 연동되지 않았습니다."}
                                            </p>
                                        </div>
                                    </div>

                                    {connected ? (
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-success-bg px-3 py-1 text-caption font-semibold text-success">
                                                연동됨
                                            </span>
                                            {oauthPlatform && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDisconnect(id)}
                                                    disabled={disconnectOAuth.loading}
                                                    className="text-caption font-semibold text-muted hover:text-error"
                                                >
                                                    해제
                                                </button>
                                            )}
                                        </div>
                                    ) : oauthPlatform && meta.available && connectable ? (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            loading={oauthLoading}
                                            onClick={() => handleConnect(id)}
                                        >
                                            연동
                                        </Button>
                                    ) : (
                                        <span className="text-caption font-semibold text-muted">
                                            준비 중
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {oauthError && (
                        <p className="mt-3 text-caption font-medium text-error">{oauthError}</p>
                    )}
                </section>

                {/* Business hours */}
                <section className="rounded-[20px] border border-border bg-surface p-5">
                    <div className="flex items-center gap-2">
                        <Clock3Icon size={17} className="text-secondary" />
                        <div>
                            <h2 className="text-heading font-semibold text-ink">영업시간</h2>
                            <p className="mt-0.5 text-caption text-muted">
                                AI가 콘텐츠와 리뷰 답글에 참고하는 최신 운영 시간입니다.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 divide-y divide-border-subtle">
                        {businessHours.map((hour) => (
                            <div key={hour.dayOfWeek} className="flex items-center gap-3 py-3">
                                <span className="w-14 text-body font-semibold text-ink">
                                    {dayLabels[hour.dayOfWeek] ?? hour.dayOfWeek}
                                </span>
                                <input
                                    value={hour.openTime}
                                    onChange={(e) =>
                                        setBusinessHours((cur) =>
                                            cur.map((h) =>
                                                h.dayOfWeek === hour.dayOfWeek
                                                    ? { ...h, openTime: e.target.value }
                                                    : h,
                                            ),
                                        )
                                    }
                                    className="w-20 rounded-lg border border-border px-2 py-1.5 text-body outline-none transition-colors focus:border-accent"
                                    aria-label={`${dayLabels[hour.dayOfWeek] ?? hour.dayOfWeek} 시작 시간`}
                                />
                                <span className="text-muted">–</span>
                                <input
                                    value={hour.closeTime}
                                    onChange={(e) =>
                                        setBusinessHours((cur) =>
                                            cur.map((h) =>
                                                h.dayOfWeek === hour.dayOfWeek
                                                    ? { ...h, closeTime: e.target.value }
                                                    : h,
                                            ),
                                        )
                                    }
                                    className="w-20 rounded-lg border border-border px-2 py-1.5 text-body outline-none transition-colors focus:border-accent"
                                    aria-label={`${dayLabels[hour.dayOfWeek] ?? hour.dayOfWeek} 종료 시간`}
                                />
                                <span className="ml-auto text-caption font-semibold text-success">
                                    {hour.open ? "영업" : "휴무"}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Menu & services */}
                <section className="rounded-[20px] border border-border bg-surface p-5">
                    <h2 className="text-heading font-semibold text-ink">대표 메뉴 · 서비스</h2>
                    <p className="mt-0.5 text-caption text-muted">
                        게시물 초안에 자연스럽게 활용할 수 있는 항목입니다.
                    </p>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <label className="sr-only" htmlFor="new-menu">
                            대표 메뉴 또는 서비스 추가
                        </label>
                        <input
                            id="new-menu"
                            value={newMenu}
                            onChange={(e) => setNewMenu(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleAddMenu()
                                }
                            }}
                            className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-body outline-none transition-colors focus:border-accent"
                            placeholder="대표 메뉴 또는 서비스를 추가하세요"
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<PlusIcon size={14} />}
                            loading={addMenuMutation.loading}
                            onClick={handleAddMenu}
                        >
                            {addMenuMutation.loading ? "추가 중…" : "메뉴 추가"}
                        </Button>
                    </div>

                    {addMenuMutation.error && (
                        <p className="mt-2 text-body font-medium text-error">
                            {addMenuMutation.error}
                        </p>
                    )}

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {menuItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg bg-canvas px-4 py-3"
                            >
                                <span className="text-body font-semibold text-ink">{item.name}</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        deleteMenuMutation.run({ storeId: store.id, menuId: item.id })
                                    }
                                    disabled={deleteMenuMutation.loading}
                                    className="rounded-lg p-1 text-muted transition-colors hover:bg-border hover:text-error"
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
    const inputClass =
        "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-body text-ink outline-none transition-colors focus:border-accent"
    return (
        <label className="block text-caption font-semibold text-secondary">
            {label}
            {textarea ? (
                <textarea
                    className={`${inputClass} min-h-[96px] resize-y leading-relaxed`}
                    defaultValue={defaultValue}
                    name={name}
                />
            ) : (
                <input className={inputClass} defaultValue={defaultValue} name={name} />
            )}
        </label>
    )
}
