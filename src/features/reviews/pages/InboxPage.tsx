import { useState } from "react"
import { Bot, CheckCheck, Send, Star } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"

const sampleReviews = [
    {
        name: "김민지",
        rating: 5,
        date: "2시간 전",
        text: "커피가 향긋하고 버터 휘낭시에가 진짜 겉바속촉 맛있어요! 연남동 올 때마다 들를 정도록 좋을 것 같아요. 조용하고 따뜻한 분위기도 마음에 듭니다.",
        source: "네이버 플레이스",
        color: "text-[#168165] bg-[#eafaf5] border-[#bce8ce]",
    },
    {
        name: "Lee Dongwook",
        rating: 4,
        date: "어제",
        text: "Every single thing was great, especially the momo latte. Cozy vibe inside.",
        source: "Google Business",
        color: "text-[#29425b] bg-[#cbdcf6] border-[#cbdcf6]",
    },
]

type InboxPageProps = {
    storeName: string
}

export function InboxPage({ storeName }: InboxPageProps) {
    const [replied, setReplied] = useState<string[]>([])
    const [draft, setDraft] = useState("")
    const [sent, setSent] = useState(false)

    return (
        <>
            <PageHeader
                eyebrow="Review operations"
                title="리뷰 관리"
                description="다양한 채널로 유입된 고객 리뷰를 모아보고 AI 초안을 활용해 답변합니다."
            />
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                    {sampleReviews.map((review) => {
                        const hasDraft = replied.includes(review.name)
                        return (
                            <article
                                key={review.name}
                                className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-sm font-bold text-[#172033]">{review.name}</h2>
                                            <span className="text-xs text-slate-400">{review.date}</span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-0.5 text-[#ff8067]">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <Star
                                                    key={index}
                                                    size={13}
                                                    fill={index < review.rating ? "currentColor" : "none"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${review.color}`}
                                    >
                                        {review.source}
                                    </span>
                                </div>
                                <p className="mt-3.5 text-xs leading-6 text-slate-600">{review.text}</p>
                                <div className="mt-4 border-t border-[#eeeae2] pt-3.5">
                                    <div className="flex items-center justify-between">
                                        {hasDraft ? (
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-[#168165]">
                                                <CheckCheck size={14} aria-hidden="true" />
                                                답글 초안을 저장했어요
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setReplied((current) => [...current, review.name])
                                                    setDraft(
                                                        `안녕하세요 ${review.name} 고객님! ${storeName}을 찾아주시고 정성스러운 후기를 남겨주셔서 진심으로 감사드립니다. 말씀해 주신 덕분에 큰 힘이 됩니다. 앞으로도 편안한 공간과 맛있는 메뉴로 만족을 드릴 수 있도록 정성을 다하겠습니다. 다음에 또 따뜻한 한 잔 하러 들러주세요!`
                                                    )
                                                }}
                                                className="flex items-center gap-1.5 rounded-lg border border-[#d8dcd9] px-2.5 py-1.5 text-[11px] font-bold text-[#29425b] transition-colors hover:border-[#3dd7af] hover:bg-[#eafaf5]"
                                            >
                                                <Bot size={14} className="text-[#168165]" aria-hidden="true" />
                                                AI 답글 만들기
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="text-[11px] font-semibold text-slate-500 hover:text-[#172033]"
                                        >
                                            직접 답글
                                        </button>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>

                <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm flex flex-col h-fit">
                    <h2 className="text-sm font-bold text-[#172033]">답글 에디터</h2>
                    <div className="mt-4 flex-1">
                        {sent ? (
                            <div role="status" className="text-center py-8">
                                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#eafaf5] text-[#168165]">
                                    <CheckCheck size={20} />
                                </span>
                                <p className="mt-3 text-xs font-bold text-[#172033]">
                                    답글이 정상적으로 게시되었습니다.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <textarea
                                    value={draft}
                                    onChange={(event) => setDraft(event.target.value)}
                                    className="min-h-[120px] w-full rounded-xl border border-[#ded9cf] p-3 text-sm leading-6 outline-none focus:border-[#3dd7af]"
                                    placeholder="답글을 직접 작성하거나 AI 초안을 받아보세요."
                                />
                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="button"
                                        disabled={!draft}
                                        onClick={() => setSent(true)}
                                        className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40"
                                    >
                                        <Send size={15} />
                                        답글 게시
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    )
}
