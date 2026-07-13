import { useEffect, useState, useId } from "react"
import { CalendarClock, Check, ImagePlus, MapPin, Send, Sparkles, WandSparkles, X, Camera } from "lucide-react"

type StoreContext = {
    name: string
    neighborhood: string
    menu: string
    tone: string
}

const channels = [
    {
        name: "Instagram",
        icon: Camera,
        color: "bg-[#f4c8d3]",
    },
    {
        name: "네이버 플레이스",
        icon: MapPin,
        color: "bg-[#bce8ce]",
    },
    {
        name: "Google Business",
        icon: MapPin,
        color: "bg-[#cbdcf6]",
    },
]

type ComposeModalProps = {
    open: boolean
    onClose: () => void
    store: StoreContext
}

export function ComposeModal({ open, onClose, store }: ComposeModalProps) {
    const dialogTitleId = useId()
    const [intent, setIntent] = useState("")
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [selectedChannels, setSelectedChannels] = useState<string[]>(["Instagram", "네이버 플레이스"])
    const [schedule, setSchedule] = useState("지금 게시")
    const [imageAdded, setImageAdded] = useState(false)
    const [published, setPublished] = useState(false)
    const [generating, setGenerating] = useState(false)

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
            setPublished(false)
            setGenerating(false)
            setIntent("")
            setTitle("")
            setBody("")
            setImageAdded(false)
            setSchedule("지금 게시")
        }
    }, [open])

    if (!open) return null

    const generateDraft = () => {
        setGenerating(true)
        window.setTimeout(() => {
            const focus = intent.trim() || "비 오는 날, 따뜻한 음료와 오늘의 공간"
            setTitle(`${store.name}의 오늘 이야기`)
            setBody(
                `${store.neighborhood}에 머무는 오후, ${store.menu}과 함께 잠깐 쉬어가세요.\n\n${focus}를 담아 오늘도 편안한 한 잔을 준비했습니다. ${store.name}에서 천천히 만나 뵐게요.`
            )
            setGenerating(false)
        }, 700)
    }

    const toggleChannel = (channel: string) => {
        setSelectedChannels((current) =>
            current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel]
        )
    }

    const publish = () => {
        if (!body.trim() || selectedChannels.length === 0) return
        setPublished(true)
        window.setTimeout(onClose, 1500)
    }

    return (
        <div
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
            className="fixed inset-0 z-50 flex items-end bg-[#101a30]/55 sm:items-center sm:justify-center sm:p-5"
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={dialogTitleId}
                className="w-full max-w-3xl rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl"
            >
                <header className="flex items-center justify-between border-b border-[#eeeae2] px-5 py-4 sm:px-6">
                    <div>
                        <p className="font-mono-label text-[9px] uppercase tracking-[0.12em] text-slate-400">
                            Content assistant
                        </p>
                        <h2 id={dialogTitleId} className="mt-0.5 text-sm font-bold text-[#172033]">
                            새 마케팅 콘텐츠 만들기
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 hover:bg-[#f5f2eb] hover:text-[#172033]"
                        aria-label="닫기"
                    >
                        <X size={18} />
                    </button>
                </header>

                <div className="grid divide-y divide-[#eeeae2] md:grid-cols-[1.1fr_0.9fr] md:divide-x md:divide-y-0">
                    <div className="p-5 sm:p-6">
                        <label htmlFor="content-intent" className="block text-xs font-bold text-[#42526e]">
                            무엇에 대해 쓰고 싶으신가요?
                            <span className="relative mt-1.5 block">
                                <input
                                    id="content-intent"
                                    value={intent}
                                    onChange={(event) => setIntent(event.target.value)}
                                    className="w-full rounded-xl border border-[#ded9cf] bg-white pl-3 pr-10 py-3 text-sm text-[#172033] outline-none transition-colors focus:border-[#3dd7af]"
                                    placeholder="예: 비 오는 날 어울리는 따뜻한 라떼 추천"
                                />
                                <button
                                    type="button"
                                    disabled={generating}
                                    onClick={generateDraft}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#172b4d] p-1.5 text-[#3dd7af] transition-colors hover:bg-[#223b66] disabled:opacity-50"
                                    aria-label="AI 초안 생성"
                                >
                                    <WandSparkles size={15} />
                                </button>
                            </span>
                        </label>

                        <div className="mt-5 rounded-xl border border-[#ded9cf] bg-[#f7f5f0] p-4">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#172b4d] text-[#3dd7af]">
                                <Sparkles size={12} />
                            </span>
                            <p className="mt-2 text-[11px] leading-5 text-slate-600">
                                가게 정보(<strong>{store.name}</strong> · {store.neighborhood} · 대표 메뉴 {store.menu}{" "}
                                · 목소리: {store.tone})를 기준으로 작성됩니다.
                            </p>
                        </div>

                        <div className="mt-5">
                            <label htmlFor="post-title" className="block text-xs font-bold text-[#42526e]">
                                제목
                                <input
                                    id="post-title"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-[#ded9cf] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3dd7af]"
                                    placeholder="초안을 생성하면 제목이 여기에 표시됩니다."
                                />
                            </label>
                            <label htmlFor="post-body" className="mt-4 block text-xs font-bold text-[#42526e]">
                                본문 내용
                                <textarea
                                    id="post-body"
                                    value={body}
                                    onChange={(event) => setBody(event.target.value)}
                                    className="mt-1.5 h-36 w-full resize-none rounded-xl border border-[#ded9cf] bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#3dd7af]"
                                    placeholder="고객에게 전할 이야기를 작성해 주세요."
                                />
                            </label>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6 bg-[#fcfbfa] flex flex-col justify-between">
                        {published ? (
                            <div role="status" className="my-auto text-center py-12">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eafaf5] text-[#168165]">
                                    <Check size={24} strokeWidth={2.5} />
                                </span>
                                <h3 className="mt-4 text-sm font-bold text-[#172033]">게시물이 발행되었습니다</h3>
                                <p className="mt-1.5 text-xs text-slate-500">선택한 채널로 전송을 완료했어요.</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <fieldset>
                                    <legend className="text-xs font-bold text-[#172033]">게시할 채널</legend>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {channels.map((channel) => {
                                            const Icon = channel.icon
                                            const selected = selectedChannels.includes(channel.name)
                                            return (
                                                <button
                                                    key={channel.name}
                                                    type="button"
                                                    onClick={() => toggleChannel(channel.name)}
                                                    aria-pressed={selected}
                                                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-bold ${
                            selected
                              ? 'border-[#20365b] bg-white text-[#172033]'
                              : 'border-transparent bg-[#ebe7df] text-slate-500'
                          }`}
                                                >
                                                    <span
                                                        className={`flex h-4 w-4 items-center justify-center rounded-sm ${channel.color}`}
                                                    >
                                                        <Icon size={10} />
                                                    </span>
                                                    {channel.name}
                                                    {selected && <Check size={12} className="text-[#168165]" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </fieldset>

                                <div>
                                    <span className="block text-xs font-bold text-[#172033]">이미지 첨부</span>
                                    <button
                                        type="button"
                                        onClick={() => setImageAdded((prev) => !prev)}
                                        className={`mt-2 flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed transition-colors text-slate-400 ${
                      imageAdded
                        ? 'border-[#168165] bg-[#eafaf5] text-[#168165]'
                        : 'border-[#ded9cf] bg-white hover:bg-[#f7f5f0]'
                    }`}
                                    >
                                        {imageAdded ? (
                                            <>
                                                <Check size={18} />
                                                <span className="text-[10px] font-bold">첨부 완료</span>
                                            </>
                                        ) : (
                                            <>
                                                <ImagePlus size={18} />
                                                <span className="text-[10px] font-medium">이미지 추가</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <fieldset>
                                    <legend className="text-xs font-bold text-[#172033]">발행 일정</legend>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {["지금 게시", "예약 발행"].map((item) => {
                                            const selected = schedule === item
                                            return (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() => setSchedule(item)}
                                                    aria-pressed={selected}
                                                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition-colors ${
                            selected
                              ? 'border-[#172b4d] bg-white text-[#172033]'
                              : 'border-[#ded9cf] bg-white text-slate-500 hover:bg-[#f7f5f0]'
                          }`}
                                                >
                                                    {item === "예약 발행" && <CalendarClock size={13} />}
                                                    {item}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </fieldset>
                            </div>
                        )}

                        {!published && (
                            <footer className="mt-6 flex items-center justify-between border-t border-[#eeeae2] pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-xl border border-[#ded9cf] bg-white px-4 py-2.5 text-xs font-bold text-[#42526e] hover:bg-[#f7f5f0]"
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    disabled={!body.trim() || selectedChannels.length === 0}
                                    onClick={publish}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#223b66] disabled:opacity-40"
                                >
                                    <Send size={13} />
                                    발행하기
                                </button>
                            </footer>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
