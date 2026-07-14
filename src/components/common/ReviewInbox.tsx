import { useState } from "react"
import { BotIcon, CheckCheckIcon, StarIcon } from "lucide-react"
import { useReviews } from "../../store"
import { getAccent, getInitials } from "../../utils/storeUtils"
import { getRelativeTime } from "../../utils/timeUtils"

export function ReviewInbox() {
    const reviews = useReviews()
    const [filter, setFilter] = useState<"all" | "pending">("pending")
    const [replied, setReplied] = useState<string[]>([])
    const visibleReviews = reviews.filter((review) => filter === "all" || review.reply === null)
    return (
        <section
            className="rounded-2xl border border-[#ded9cf] bg-white shadow-[0_8px_24px_rgba(23,32,51,0.05)]"
            aria-labelledby="reviews-heading"
        >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeae2] px-5 py-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 id="reviews-heading" className="text-base font-bold text-[#172033]">
                            최근 리뷰
                        </h2>
                        {reviews.length > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffede9] px-1 text-[10px] font-extrabold text-[#d6503b]">
                                {reviews.filter((r) => r.reply === null).length}
                            </span>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                        최신 동기화된 리뷰 중 답글이 필요한 내용을 확인하세요.
                    </p>
                </div>
                <div className="flex rounded-lg bg-[#f3f0e9] p-1" role="tablist" aria-label="리뷰 보기">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={filter === "pending"}
                        onClick={() => setFilter("pending")}
                        className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold ${filter === "pending" ? "bg-white text-[#172033] shadow-sm" : "text-slate-500"}`}
                    >
                        미답변
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={filter === "all"}
                        onClick={() => setFilter("all")}
                        className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold ${filter === "all" ? "bg-white text-[#172033] shadow-sm" : "text-slate-500"}`}
                    >
                        전체
                    </button>
                </div>
            </div>
            <div className="divide-y divide-[#eeeae2]">
                {visibleReviews.map((review) => {
                    const hasReplied = replied.includes(review.id)
                    return (
                        <article key={review.id} className="px-5 py-4">
                            <div className="flex gap-3">
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getAccent(review.id)} text-[11px] font-extrabold text-[#172033]`}
                                >
                                    {getInitials(review.authorName)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <h3 className="text-xs font-bold text-[#172033]">{review.authorName}</h3>
                                        <span className="text-[10px] text-slate-400">
                                            {review.platform} · {getRelativeTime(review.reviewedAt)}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex gap-0.5" aria-label={`평점 ${review.rating}점`}>
                                        {Array.from({ length: review.rating }).map((_, index) => (
                                            <StarIcon
                                                key={index}
                                                size={12}
                                                className="fill-[#f4b840] text-[#f4b840]"
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-2 text-xs leading-5 text-slate-600">{review.content}</p>
                                    {review.reply === null && (
                                        <div className="mt-3 flex items-center gap-2">
                                            {hasReplied ? (
                                                <span className="flex items-center gap-1 text-[11px] font-bold text-[#168165]">
                                                    <CheckCheckIcon size={14} aria-hidden="true" />
                                                    답글 초안을 저장했어요
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setReplied((current) => [...current, review.id])}
                                                    className="flex items-center gap-1.5 rounded-lg border border-[#d8dcd9] px-2.5 py-1.5 text-[11px] font-bold text-[#29425b] transition-colors hover:border-[#3dd7af] hover:bg-[#eafaf5]"
                                                >
                                                    <BotIcon size={14} className="text-[#168165]" aria-hidden="true" />
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
                                    )}
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}
