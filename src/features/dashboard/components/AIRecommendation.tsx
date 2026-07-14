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
            className="flex h-full flex-col justify-between overflow-hidden rounded-[20px] bg-panel p-5 text-white"
            aria-labelledby="ai-heading"
        >
            <div>
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-white">
                        <Sparkles size={16} strokeWidth={2.4} />
                    </span>
                    <div>
                        <p className="font-mono-label text-[9px] uppercase tracking-[0.12em] text-accent-on-dark">
                            AI marketing manager
                        </p>
                        <h2 id="ai-heading" className="mt-0.5 text-body font-bold">
                            오늘의 운영 제안
                        </h2>
                    </div>
                </div>
                <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.06] p-3.5">
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <LoaderIcon size={24} className="animate-spin text-accent-on-dark" aria-label="운영 제안 불러오는 중" />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-caption text-white/60">
                                <CloudRain size={14} className="text-accent-on-dark" />
                                {card?.title ?? "—"}
                            </div>
                            <p className="mt-2 text-body font-bold leading-6 text-white">
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
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2.5 text-caption font-bold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Lightbulb size={14} />{card?.actionLabel ?? "이 주제로 콘텐츠 만들기"}
            </button>
        </section>
    )
}
