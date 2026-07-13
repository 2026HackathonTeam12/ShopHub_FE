import { FileText, MessageSquareCode, Store } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"
import { AIRecommendation } from "../components/AIRecommendation"
import { ContentComposer } from "../../content/components/ContentComposer"

type DashboardPageProps = {
    onNavigate: (label: string) => void
    onCompose: () => void
}

export function DashboardPage({ onNavigate, onCompose }: DashboardPageProps) {
    return (
        <>
            <PageHeader
                eyebrow="Overview"
                title="대시보드"
                description="오늘 가게의 일과 흐름을 확인하고 바로 처리해 보세요."
            />
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <section className="grid gap-4 sm:grid-cols-3">
                        {[
                            { label: "콘텐츠 센터", count: "12개", icon: FileText, text: "발행 완료 소식" },
                            {
                                label: "리뷰 관리",
                                count: "3개",
                                icon: MessageSquareCode,
                                text: "미답변 리뷰",
                                alert: true,
                            },
                            { label: "가게 정보", count: "100%", icon: Store, text: "정보 완성도" },
                        ].map((card) => {
                            const Icon = card.icon
                            return (
                                <button
                                    key={card.label}
                                    type="button"
                                    onClick={() => onNavigate(card.label)}
                                    className="flex flex-col rounded-2xl border border-[#ded9cf] bg-white p-5 text-left transition-all hover:border-slate-400 shadow-sm"
                                >
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f0e9] text-[#172033]`}
                                    >
                                        <Icon size={16} />
                                    </span>
                                    <span className="mt-4 text-xs font-bold text-slate-500">{card.label}</span>
                                    <span className="mt-1 flex items-baseline gap-1.5">
                                        <span className="text-2xl font-extrabold text-[#172033]">{card.count}</span>
                                        {card.alert && <span className="h-2 w-2 rounded-full bg-[#ff8067]" />}
                                    </span>
                                    <span className="mt-1 text-[11px] text-slate-400">{card.text}</span>
                                </button>
                            )
                        })}
                    </section>

                    <ContentComposer />
                </div>

                <div>
                    <AIRecommendation onCompose={onCompose} />
                </div>
            </div>
        </>
    )
}
