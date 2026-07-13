import { useState } from "react"
import { Check, ChevronDown, ImagePlus, Camera, MapPin, Sparkles } from "lucide-react"

const targets = [
    {
        name: "Instagram",
        icon: Camera,
        color: "bg-[#f2b0bf]",
    },
    {
        name: "네이버 플레이스",
        icon: MapPin,
        color: "bg-[#76d1a0]",
    },
    {
        name: "Google Business",
        icon: MapPin,
        color: "bg-[#6f9df2]",
    },
]

export function ContentComposer() {
    const [body, setBody] = useState(
        "비가 오는 오늘, 따뜻한 라떼 한 잔으로 잠깐 쉬어가세요.\n오후 2시부터는 갓 구운 휘낭시에가 함께 나옵니다."
    )
    const [selectedTargets, setSelectedTargets] = useState(["Instagram", "네이버 플레이스"])

    const toggleTarget = (target: string) =>
        setSelectedTargets((current) =>
            current.includes(target) ? current.filter((item) => item !== target) : [...current, target]
        )

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
                    <ChevronDown size={18} aria-hidden="true" />
                </button>
            </div>
            <div className="p-5">
                <label htmlFor="post-title" className="sr-only">
                    게시물 제목
                </label>
                <input
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
                    <button
                        type="button"
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#172033]"
                    >
                        <ImagePlus size={16} aria-hidden="true" />
                        사진 추가
                    </button>
                    <span className="font-mono-label text-[10px] text-slate-400">{body.length} / 2,200</span>
                </div>
                <div className="mt-4 rounded-xl bg-[#f7f5f0] p-3.5">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#172033]">게시할 채널</p>
                        <button
                            type="button"
                            className="flex items-center gap-1 text-[11px] font-semibold text-[#168165] hover:underline"
                        >
                            <Sparkles size={13} aria-hidden="true" />
                            채널별 최적화
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {targets.map((target) => {
                            const Icon = target.icon
                            const selected = selectedTargets.includes(target.name)
                            return (
                                <button
                                    key={target.name}
                                    type="button"
                                    onClick={() => toggleTarget(target.name)}
                                    aria-pressed={selected}
                                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-semibold transition-colors ${
                    selected
                      ? 'border-[#20365b] bg-white text-[#172033]'
                      : 'border-transparent bg-[#ede9e1] text-slate-400'
                  }`}
                                >
                                    <span
                                        className={`flex h-4 w-4 items-center justify-center rounded-sm ${target.color}`}
                                    >
                                        <Icon size={10} className="text-[#172033]" aria-hidden="true" />
                                    </span>
                                    {target.name}
                                    {selected && <Check size={12} className="text-[#168165]" aria-hidden="true" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
