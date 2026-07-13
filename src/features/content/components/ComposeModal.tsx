import { useEffect, useState, useId } from "react"
import {
    CalendarClockIcon,
    CheckIcon,
    ImagePlusIcon,
    Focus,
    MapPinIcon,
    SendIcon,
    SparklesIcon,
    WandSparklesIcon,
    XIcon,
} from "lucide-react"
type StoreContext = {
    name: string
    neighborhood: string
    menu: string
    tone: string
}
const channels = [
    {
        name: "Instagram",
        icon: Focus,
        color: "bg-[#f4c8d3]",
    },
    {
        name: "네이버 플레이스",
        icon: MapPinIcon,
        color: "bg-[#bce8ce]",
    },
    {
        name: "Google Business",
        icon: MapPinIcon,
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
                        <p className="font-mono-label text-[10px] tracking-[0.14em] text-[#64748b]">AI ASSISTED POST</p>
                        <h2 id={dialogTitleId} className="mt-1 text-lg font-extrabold text-[#172033]">
                            새 콘텐츠 작성
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-[#f5f2eb]"
                        aria-label="작성 창 닫기"
                    >
                        <XIcon size={20} />
                    </button>
                </header>

                {published ? (
                    <div className="flex min-h-[390px] flex-col items-center justify-center px-6 text-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eafaf5] text-[#168165]">
                            <CheckIcon size={27} />
                        </span>
                        <h3 className="mt-5 text-lg font-extrabold text-[#172033]">게시 요청을 보냈어요</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            {selectedChannels.join(" · ")}에 맞춰 콘텐츠를 준비하고 있습니다.
                        </p>
                    </div>
                ) : (
                    <div className="max-h-[calc(100vh-105px)] overflow-y-auto px-5 py-5 sm:max-h-[76vh] sm:px-6">
                        <div className="rounded-xl border border-[#d7e6df] bg-[#f0faf6] p-4">
                            <div className="flex items-center gap-2 text-[#168165]">
                                <SparklesIcon size={16} />
                                <p className="text-xs font-extrabold">AI가 가져오는 가게 정보</p>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-[#42526e]">
                                <strong>{store.name}</strong> · {store.neighborhood} · 대표 메뉴 {store.menu} · 목소리:{" "}
                                {store.tone}
                            </p>
                        </div>

                        <div className="mt-4 rounded-xl bg-[#172b4d] p-4 text-white">
                            <div className="flex items-center gap-2">
                                <WandSparklesIcon size={16} className="text-[#3dd7af]" />
                                <p className="text-xs font-bold">어떤 게시물을 만들까요?</p>
                            </div>
                            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <input
                                    value={intent}
                                    onChange={(event) => setIntent(event.target.value)}
                                    placeholder="예: 오늘 비가 오니 라떼와 휘낭시에를 알리고 싶어"
                                    className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-300 focus:border-[#3dd7af]"
                                />
                                <button
                                    type="button"
                                    onClick={generateDraft}
                                    disabled={generating}
                                    className="flex items-center justify-center gap-1.5 rounded-lg bg-[#3dd7af] px-4 py-2.5 text-xs font-bold text-[#10213b] disabled:opacity-60"
                                >
                                    <WandSparklesIcon size={14} />
                                    {generating ? "초안 작성 중…" : "AI 초안 만들기"}
                                </button>
                            </div>
                        </div>

                        <label className="mt-5 block text-xs font-bold text-[#42526e]">
                            제목
                            <input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="AI 초안을 만들거나 직접 제목을 입력하세요"
                                className="mt-2 w-full rounded-xl border border-[#ded9cf] px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#3dd7af]"
                            />
                        </label>
                        <label className="mt-4 block text-xs font-bold text-[#42526e]">
                            내용
                            <textarea
                                value={body}
                                onChange={(event) => setBody(event.target.value)}
                                placeholder="AI가 가게 정보와 요청을 바탕으로 초안을 작성합니다."
                                className="mt-2 min-h-[130px] w-full resize-y rounded-xl border border-[#ded9cf] p-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-[#3dd7af]"
                            />
                        </label>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setImageAdded(true)}
                                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold ${imageAdded ? "border-[#91d9c4] bg-[#eafaf5] text-[#168165]" : "border-[#ded9cf] text-[#42526e] hover:bg-[#f7f5f0]"}`}
                            >
                                {imageAdded ? <CheckIcon size={15} /> : <ImagePlusIcon size={15} />}
                                {imageAdded ? "사진 1장 추가됨" : "사진 추가"}
                            </button>
                            <label className="flex items-center gap-1.5 rounded-lg border border-[#ded9cf] px-3 py-2 text-xs font-bold text-[#42526e]">
                                <CalendarClockIcon size={15} />
                                <span className="sr-only">게시 시간</span>
                                <select
                                    value={schedule}
                                    onChange={(event) => setSchedule(event.target.value)}
                                    className="bg-transparent outline-none"
                                >
                                    <option>지금 게시</option>
                                    <option>오늘 18:00 예약</option>
                                    <option>내일 10:00 예약</option>
                                </select>
                            </label>
                        </div>

                        <fieldset className="mt-5 rounded-xl bg-[#f7f5f0] p-4">
                            <legend className="px-1 text-xs font-bold text-[#172033]">게시할 채널</legend>
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
                                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-bold ${selected ? "border-[#20365b] bg-white text-[#172033]" : "border-transparent bg-[#ebe7df] text-slate-500"}`}
                                        >
                                            <span
                                                className={`flex h-4 w-4 items-center justify-center rounded-sm ${channel.color}`}
                                            >
                                                <Icon size={10} />
                                            </span>
                                            {channel.name}
                                            {selected && <CheckIcon size={12} className="text-[#168165]" />}
                                        </button>
                                    )
                                })}
                            </div>
                        </fieldset>
                    </div>
                )}

                {!published && (
                    <footer className="flex items-center justify-between border-t border-[#eeeae2] px-5 py-4 sm:px-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 hover:bg-[#f5f2eb]"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={publish}
                            disabled={!body.trim() || selectedChannels.length === 0}
                            className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#223b66] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <SendIcon size={15} />
                            {schedule === "지금 게시" ? "게시하기" : "예약하기"}
                        </button>
                    </footer>
                )}
            </section>
        </div>
    )
}
