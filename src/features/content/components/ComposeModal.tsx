import { useEffect, useState, useId, useRef } from "react"
import { useGenerateContentDraftMutation, usePublishContentMutation, useUploadImagesMutation } from "../../../hooks/useContentMutations"
import {
    CheckIcon,
    ImagePlusIcon,
    Focus,
    MapPinIcon,
    SendIcon,
    SparklesIcon,
    WandSparklesIcon,
    XIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useIntegrations } from "../../../store"
import type { PlatformId } from "../../../data/platforms"
import { PLATFORM_META, isContentChannel } from "../../../data/platforms"

const PLATFORM_DISPLAY: Partial<Record<PlatformId, { icon: LucideIcon; color: string }>> = {
    INSTAGRAM: { icon: Focus, color: "bg-[#f4c8d3]" },
    NAVER_MAP: { icon: MapPinIcon, color: "bg-[#bce8ce]" },
    GOOGLE_MAP: { icon: MapPinIcon, color: "bg-[#cbdcf6]" },
    MOCK_MAP: { icon: MapPinIcon, color: "bg-[#bce8ce]" },
    X: { icon: MapPinIcon, color: "bg-[#dbeafe]" },
    FACEBOOK: { icon: MapPinIcon, color: "bg-[#cbdcf6]" },
    KAKAO_MAP: { icon: MapPinIcon, color: "bg-[#f9e090]" },
}

type StoreContext = {
    id: string
    name: string
    address: string
    menu: string
    toneOfVoice: string
}
type ComposeModalProps = {
    open: boolean
    onClose: () => void
    store: StoreContext
}
export function ComposeModal({ open, onClose, store }: ComposeModalProps) {
    const dialogTitleId = useId()
    const integrations = useIntegrations()
    const [intent, setIntent] = useState("")
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [selectedChannels, setSelectedChannels] = useState<PlatformId[]>([])
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [published, setPublished] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const generateDraftMutation = useGenerateContentDraftMutation()
    const uploadImagesMutation = useUploadImagesMutation()
    const publishMutation = usePublishContentMutation()
    const channels = integrations.flatMap((id) => {
        if (!isContentChannel(id)) return []
        const display = PLATFORM_DISPLAY[id]
        return display ? [{ id, ...display }] : []
    })

    useEffect(() => {
        if (!open) return
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
    }, [onClose, open])

    useEffect(() => {
        if (!open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPublished(false)
            setIntent("")
            setTitle("")
            setBody("")
            setImageUrls([])
        }
    }, [open])

    if (!open) return null

    const generateDraft = async () => {
        const result = await generateDraftMutation.run({ storeId: store.id, eventText: intent.trim() })
        if (result) {
            setTitle(result.title)
            setBody(result.body)
        }
    }
    const toggleChannel = (id: PlatformId) => {
        setSelectedChannels((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        )
    }
    const publish = async () => {
        if (!body.trim() || selectedChannels.length === 0) return
        const ok = await publishMutation.run({ storeId: store.id, title, body, channels: selectedChannels, imageUrls: imageUrls.length > 0 ? imageUrls : undefined })
        if (ok) {
            setPublished(true)
            window.setTimeout(onClose, 1500)
        }
    }
    return (
        <div
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
            className="fixed inset-0 z-50 flex items-end bg-panel/60 sm:items-center sm:justify-center sm:p-5"
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={dialogTitleId}
                className="w-full max-w-3xl rounded-t-[20px] bg-surface shadow-2xl sm:rounded-[20px]"
            >
                <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4 sm:px-6">
                    <div>
                        <p className="font-mono-label text-[10px] tracking-[0.14em] text-muted">AI ASSISTED POST</p>
                        <h2 id={dialogTitleId} className="mt-1 text-lg font-extrabold text-ink">
                            새 콘텐츠 작성
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-muted hover:bg-canvas"
                        aria-label="작성 창 닫기"
                    >
                        <XIcon size={20} />
                    </button>
                </header>

                {published ? (
                    <div className="flex min-h-[390px] flex-col items-center justify-center px-6 text-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-bg text-success">
                            <CheckIcon size={27} />
                        </span>
                        <h3 className="mt-5 text-lg font-extrabold text-ink">게시 요청을 보냈어요</h3>
                        <p className="mt-2 text-body text-muted">
                            {selectedChannels.map((id) => PLATFORM_META[id].name).join(" · ")}에 맞춰 콘텐츠를 준비하고 있습니다.
                        </p>
                    </div>
                ) : (
                    <div className="max-h-[calc(100vh-105px)] overflow-y-auto px-5 py-5 sm:max-h-[76vh] sm:px-6">
                        <div className="rounded-xl border border-success-border bg-success-bg p-4">
                            <div className="flex items-center gap-2 text-success">
                                <SparklesIcon size={16} />
                                <p className="text-caption font-extrabold">AI가 가져오는 가게 정보</p>
                            </div>
                            <p className="mt-2 text-caption leading-5 text-secondary">
                                <strong>{store.name}</strong> · {store.address} · 대표 메뉴 {store.menu} · 목소리:{" "}
                                {store.toneOfVoice}
                            </p>
                        </div>

                        <div className="mt-4 rounded-xl bg-panel p-4 text-white">
                            <div className="flex items-center gap-2">
                                <WandSparklesIcon size={16} className="text-accent-on-dark" />
                                <p className="text-caption font-bold">어떤 게시물을 만들까요?</p>
                            </div>
                            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <input
                                    value={intent}
                                    onChange={(event) => setIntent(event.target.value)}
                                    placeholder="예: 오늘 비가 오니 라떼와 휘낭시에를 알리고 싶어"
                                    className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-body text-white outline-none placeholder:text-white/40 focus:border-accent-on-dark"
                                />
                                <button
                                    type="button"
                                    onClick={generateDraft}
                                    disabled={generateDraftMutation.loading}
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-caption font-bold text-white hover:bg-accent-hover disabled:opacity-60"
                                >
                                    <WandSparklesIcon size={14} />
                                    {generateDraftMutation.loading ? "초안 작성 중…" : "AI 초안 만들기"}
                                </button>
                            </div>
                        </div>
                        {generateDraftMutation.error && (
                            <p className="mt-2 text-body font-medium text-error">{generateDraftMutation.error}</p>
                        )}

                        <label className="mt-5 block text-caption font-bold text-secondary">
                            제목
                            <input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="AI 초안을 만들거나 직접 제목을 입력하세요"
                                className="mt-2 w-full rounded-xl border border-border px-3 py-3 text-body outline-none placeholder:text-muted focus:border-accent"
                            />
                        </label>
                        <label className="mt-4 block text-caption font-bold text-secondary">
                            내용
                            <textarea
                                value={body}
                                onChange={(event) => setBody(event.target.value)}
                                placeholder="AI가 가게 정보와 요청을 바탕으로 초안을 작성합니다."
                                className="mt-2 min-h-[130px] w-full resize-y rounded-xl border border-border p-3 text-body leading-6 outline-none placeholder:text-muted focus:border-accent"
                            />
                        </label>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={async (event) => {
                                    const files = Array.from(event.target.files ?? [])
                                    if (files.length === 0) return
                                    const result = await uploadImagesMutation.run(store.id, files)
                                    if (result) setImageUrls(result.img_urls)
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadImagesMutation.loading}
                                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-caption font-bold ${imageUrls.length > 0 ? "border-success-border bg-success-bg text-success" : "border-border text-secondary hover:bg-canvas"} disabled:opacity-60`}
                            >
                                {imageUrls.length > 0 ? <CheckIcon size={15} /> : <ImagePlusIcon size={15} />}
                                {uploadImagesMutation.loading ? "업로드 중…" : imageUrls.length > 0 ? `사진 ${imageUrls.length}장 추가됨` : "사진 추가"}
                            </button>
                            {uploadImagesMutation.error && (
                                <p className="text-caption font-medium text-error">{uploadImagesMutation.error}</p>
                            )}
                        </div>

                        <fieldset className="mt-5 rounded-xl bg-canvas p-4">
                            <legend className="px-1 text-caption font-bold text-ink">게시할 채널</legend>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {channels.map((channel) => {
                                    const Icon = channel.icon
                                    const selected = selectedChannels.includes(channel.id)
                                    return (
                                        <button
                                            key={channel.id}
                                            type="button"
                                            onClick={() => toggleChannel(channel.id)}
                                            aria-pressed={selected}
                                            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-caption font-bold ${selected ? "border-accent bg-surface text-ink" : "border-transparent bg-border-subtle text-muted"}`}
                                        >
                                            <span
                                                className={`flex h-4 w-4 items-center justify-center rounded-sm ${channel.color}`}
                                            >
                                                <Icon size={10} />
                                            </span>
                                            {PLATFORM_META[channel.id].name}
                                            {selected && <CheckIcon size={12} className="text-success" />}
                                        </button>
                                    )
                                })}
                            </div>
                        </fieldset>
                    </div>
                )}

                {!published && (
                    <footer className="flex items-center justify-between border-t border-border-subtle px-5 py-4 sm:px-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-3 py-2 text-caption font-bold text-muted hover:bg-canvas"
                        >
                            취소
                        </button>
                        <div className="flex flex-col items-end gap-1">
                            {publishMutation.error && (
                                <p className="text-caption font-medium text-error">{publishMutation.error}</p>
                            )}
                            <button
                                type="button"
                                onClick={publish}
                                disabled={!body.trim() || selectedChannels.length === 0 || publishMutation.loading}
                                className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-caption font-bold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <SendIcon size={15} />
                                {publishMutation.loading ? "게시 중…" : "게시하기"}
                            </button>
                        </div>
                    </footer>
                )}
            </section>
        </div>
    )
}
