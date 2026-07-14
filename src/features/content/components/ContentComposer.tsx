import { useRef, useState } from "react"
import { CheckIcon, ChevronDownIcon, ImagePlusIcon, Focus, MapPinIcon, SendIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useSelectedStoreId, useIntegrations } from "../../../store"
import { usePublishContentMutation, useUploadImagesMutation } from "../../../hooks/useContentMutations"
import type { PlatformId } from "../../../data/platforms"
import { PLATFORM_META, isContentChannel } from "../../../data/platforms"

const PLATFORM_DISPLAY: Partial<Record<PlatformId, { icon: LucideIcon; color: string }>> = {
    INSTAGRAM: { icon: Focus, color: "bg-[#f2b0bf]" },
    NAVER_MAP: { icon: MapPinIcon, color: "bg-[#76d1a0]" },
    GOOGLE_MAP: { icon: MapPinIcon, color: "bg-[#6f9df2]" },
    MOCK_MAP: { icon: MapPinIcon, color: "bg-[#76d1a0]" },
    X: { icon: MapPinIcon, color: "bg-[#dbeafe]" },
    FACEBOOK: { icon: MapPinIcon, color: "bg-[#cbdcf6]" },
    KAKAO_MAP: { icon: MapPinIcon, color: "bg-[#f9e090]" },
}

export function ContentComposer() {
    const selectedStoreId = useSelectedStoreId()
    const integrations = useIntegrations()
    const publishMutation = usePublishContentMutation()
    const uploadImagesMutation = useUploadImagesMutation()
    const titleRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [body, setBody] = useState(
        "비가 오는 오늘, 따뜻한 라떼 한 잔으로 잠깐 쉬어가세요.\n오후 2시부터는 갓 구운 휘낭시에가 함께 나옵니다."
    )
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [selectedTargets, setSelectedTargets] = useState<PlatformId[]>([])
    const [published, setPublished] = useState(false)
    const toggleTarget = (id: PlatformId) =>
        setSelectedTargets((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        )
    const targets = integrations.flatMap((id) => {
        if (!isContentChannel(id)) return []
        const display = PLATFORM_DISPLAY[id]
        return display ? [{ id, ...display }] : []
    })
    return (
        <section
            className="overflow-hidden rounded-2xl border border-[#ded9cf] bg-white shadow-[0_8px_24px_rgba(23,32,51,0.05)]"
            aria-labelledby="composer-heading"
        >
            <div className="flex items-center justify-between border-b border-[#eeeae2] px-5 py-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 id="composer-heading" className="text-base font-bold text-[#172033]">
                            새 콘텐츠
                        </h2>
                        <span className="rounded-md bg-[#e5f8f1] px-1.5 py-0.5 text-[10px] font-bold text-[#168165]">
                            AI 준비됨
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">한 번 작성하고, 채널마다 알맞게 전하세요.</p>
                </div>
                <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#f5f2eb] hover:text-[#172033]"
                    aria-label="작성 옵션 열기"
                >
                    <ChevronDownIcon size={18} aria-hidden="true" />
                </button>
            </div>
            <div className="p-5">
                <label htmlFor="post-title" className="sr-only">
                    게시물 제목
                </label>
                <input
                    ref={titleRef}
                    id="post-title"
                    className="w-full border-0 p-0 text-base font-bold text-[#172033] placeholder:text-slate-400 focus:outline-none"
                    placeholder="게시물 제목을 입력하세요"
                    defaultValue="오늘의 비 오는 날 메뉴"
                />
                <label htmlFor="post-body" className="sr-only">
                    게시물 내용
                </label>
                <textarea
                    id="post-body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    className="mt-3 min-h-[106px] w-full resize-none border-0 p-0 text-sm leading-6 text-slate-600 placeholder:text-slate-400 focus:outline-none"
                    placeholder="고객에게 전할 이야기를 작성해 주세요."
                />
                <div className="mt-3 flex items-center justify-between border-t border-[#eeeae2] pt-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={async (event) => {
                            if (!selectedStoreId) return
                            const files = Array.from(event.target.files ?? [])
                            if (files.length === 0) return
                            const result = await uploadImagesMutation.run(selectedStoreId, files)
                            if (result) {
                                setImageUrls((current) => [...current, ...result.img_urls])
                            }
                            event.target.value = ""
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!selectedStoreId || uploadImagesMutation.loading}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${imageUrls.length > 0 ? "text-[#168165]" : "text-slate-500 hover:text-[#172033]"}`}
                    >
                        {imageUrls.length > 0 ? <CheckIcon size={16} aria-hidden="true" /> : <ImagePlusIcon size={16} aria-hidden="true" />}
                        {uploadImagesMutation.loading
                            ? "업로드 중…"
                            : imageUrls.length > 0
                              ? `사진 ${imageUrls.length}장 추가됨`
                              : "사진 추가"}
                    </button>
                    <span className="font-mono-label text-[10px] text-slate-400">{body.length} / 2,200</span>
                </div>
                {uploadImagesMutation.error && (
                    <p className="mt-2 text-[11px] font-medium text-[#d6503b]">{uploadImagesMutation.error}</p>
                )}
                <div className="mt-4 rounded-xl bg-[#f7f5f0] p-3.5">
                    <p className="text-xs font-bold text-[#172033]">게시할 채널</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {targets.map((target) => {
                            const Icon = target.icon
                            const selected = selectedTargets.includes(target.id)
                            return (
                                <button
                                    key={target.id}
                                    type="button"
                                    onClick={() => toggleTarget(target.id)}
                                    aria-pressed={selected}
                                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-semibold transition-colors ${selected ? "border-[#20365b] bg-white text-[#172033]" : "border-transparent bg-[#ede9e1] text-slate-400"}`}
                                >
                                    <span
                                        className={`flex h-4 w-4 items-center justify-center rounded-sm ${target.color}`}
                                    >
                                        <Icon size={10} className="text-[#172033]" aria-hidden="true" />
                                    </span>
                                    {PLATFORM_META[target.id].name}
                                    {selected && <CheckIcon size={12} className="text-[#168165]" aria-hidden="true" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
                {publishMutation.error && (
                    <p className="mt-4 text-[11px] font-medium text-[#d6503b]">{publishMutation.error}</p>
                )}
                <div className="mt-4 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={async () => {
                            if (!selectedStoreId) return
                            const ok = await publishMutation.run({
                                storeId: selectedStoreId,
                                title: titleRef.current?.value ?? "",
                                body,
                                channels: selectedTargets,
                                imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
                            })
                            if (ok) {
                                setPublished(true)
                                setImageUrls([])
                            }
                        }}
                        disabled={!selectedStoreId || selectedTargets.length === 0 || publishMutation.loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#172b4d] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#223b66] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {published ? (
                            <CheckIcon size={17} aria-hidden="true" />
                        ) : (
                            <SendIcon size={16} aria-hidden="true" />
                        )}
                        {published ? "게시 요청을 보냈어요" : publishMutation.loading ? "게시 중…" : "지금 게시하기"}
                    </button>
                </div>
            </div>
        </section>
    )
}
