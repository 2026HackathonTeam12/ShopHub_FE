import { useEffect, useState } from "react"
import { CloudRain, Lightbulb, LoaderIcon, Sparkles } from "lucide-react"
import { useSelectedStoreId } from "../../../store"
import { fetchDashboard, UnauthorizedError, type DashboardSuggestionCard } from "../../../api"
import { useExitApp } from "../../../hooks/useExitApp"

type AIRecommendationProps = {
    onCompose: () => void
}

export function AIRecommendation({ onCompose }: AIRecommendationProps) {
    const storeId = useSelectedStoreId()
    const exitApp = useExitApp()
    const [card, setCard] = useState<DashboardSuggestionCard | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!storeId) {
            setCard(null)
            setLoading(false)
            return
        }
        setLoading(true)
        setCard(null)
        fetchDashboard(storeId)
            .then((data) => setCard(data.suggestionCard))
            .catch((err) => {
                if (err instanceof UnauthorizedError) exitApp()
            })
            .finally(() => setLoading(false))
    }, [storeId, exitApp])

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
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <LoaderIcon size={24} className="animate-spin text-[#8fd9c4]" aria-label="운영 제안 불러오는 중" />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-[11px] text-[#c5d3eb]">
                                <CloudRain size={14} className="text-[#8fd9c4]" />
                                {card?.title ?? "—"}
                            </div>
                            <p className="mt-2 text-sm font-bold leading-6 text-white">
                                {card?.message ?? ""}
                            </p>
                        </>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={onCompose}
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3dd7af] px-3 py-2.5 text-xs font-bold text-[#10213b] transition-colors hover:bg-[#72e6c5] disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Lightbulb size={14} />{card?.actionLabel ?? "이 주제로 콘텐츠 만들기"}
            </button>
        </section>
    )
}
