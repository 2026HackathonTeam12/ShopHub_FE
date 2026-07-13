import { CloudRain, Lightbulb, Sparkles } from "lucide-react"

type AIRecommendationProps = {
    onCompose: () => void
}

export function AIRecommendation({ onCompose }: AIRecommendationProps) {
    return (
        <section
            className="overflow-hidden h-full rounded-2xl flex flex-col justify-between bg-[#172b4d] p-5 text-white shadow-[0_10px_26px_rgba(23,43,77,0.2)]"
            aria-labelledby="ai-heading"
        >
            <div>
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3dd7af] text-[#10213b]">
                        <Sparkles size={16} strokeWidth={2.4} />
                    </span>
                    <div>
                        <p className="font-mono-label text-[9px] uppercase tracking-[0.12em] text-[#9edcc9]">
                            AI marketing manager
                        </p>
                        <h2 id="ai-heading" className="mt-0.5 text-sm font-bold">
                            오늘의 운영 제안
                        </h2>
                    </div>
                </div>
                <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.06] p-3.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#c5d3eb]">
                        <CloudRain size={14} className="text-[#8fd9c4]" />
                        연남동 · 비 · 18°C
                    </div>
                    <p className="mt-2 text-sm font-bold leading-6 text-white">
                        "비 오는 오후, 따뜻한 한 잔"을 지금 올려보세요.
                    </p>
                    <p className="mt-1.5 text-[11px] leading-5 text-[#c5d3eb]">
                        따뜻한 음료 게시물은 이 날씨에 저장률이 더 높았어요.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onCompose}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3dd7af] px-3 py-2.5 text-xs font-bold text-[#10213b] transition-colors hover:bg-[#72e6c5]"
            >
                <Lightbulb size={14} />이 주제로 콘텐츠 만들기
            </button>
        </section>
    )
}
