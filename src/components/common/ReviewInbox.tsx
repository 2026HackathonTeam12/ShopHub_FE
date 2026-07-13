import { useState } from "react"
import { ArrowRightIcon, BotIcon, CheckCheckIcon, StarIcon } from "lucide-react"
const reviews = [
    {
        initials: "HS",
        name: "하은 서",
        platform: "네이버 플레이스",
        rating: 5,
        time: "32분 전",
        text: "커피도 정말 맛있고, 직원분이 메뉴를 친절하게 설명해주셨어요. 비 오는 날 창가 자리가 특히 좋네요.",
        color: "bg-[#f0c99c]",
        unanswered: true,
    },
    {
        initials: "MJ",
        name: "민준 김",
        platform: "Google",
        rating: 4,
        time: "2시간 전",
        text: "조용히 일하기 좋은 카페입니다. 디카페인 옵션이 더 많아지면 좋겠어요.",
        color: "bg-[#9dc8b8]",
        unanswered: true,
    },
    {
        initials: "YR",
        name: "예린 박",
        platform: "Instagram",
        rating: 5,
        time: "어제",
        text: "휘낭시에 선물 포장도 너무 예뻐요! 다음에 또 올게요.",
        color: "bg-[#b8b4e9]",
        unanswered: false,
    },
]
export function ReviewInbox() {
    const [filter, setFilter] = useState<"all" | "pending">("pending")
    const [replied, setReplied] = useState<string[]>([])
    const visibleReviews = reviews.filter((review) => filter === "all" || review.unanswered)
    return (
        <section
            className="rounded-2xl border border-[#ded9cf] bg-white shadow-[0_8px_24px_rgba(23,32,51,0.05)]"
            aria-labelledby="reviews-heading"
        >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeae2] px-5 py-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 id="reviews-heading" className="text-base font-bold text-[#172033]">
                            최근 Google 리뷰
                        </h2>
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffede9] px-1 text-[10px] font-extrabold text-[#d6503b]">
                            8
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                        최신 동기화된 5개 리뷰 중 답글이 필요한 내용을 확인하세요.
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
                    const hasReplied = replied.includes(review.name)
                    return (
                        <article key={review.name} className="px-5 py-4">
                            <div className="flex gap-3">
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${review.color} text-[11px] font-extrabold text-[#172033]`}
                                >
                                    {review.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <h3 className="text-xs font-bold text-[#172033]">{review.name}</h3>
                                        <span className="text-[10px] text-slate-400">
                                            {review.platform} · {review.time}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex gap-0.5" aria-label={`평점 ${review.rating}점`}>
                                        {Array.from({
                                            length: review.rating,
                                        }).map((_, index) => (
                                            <StarIcon
                                                key={index}
                                                size={12}
                                                className="fill-[#f4b840] text-[#f4b840]"
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-2 text-xs leading-5 text-slate-600">{review.text}</p>
                                    {review.unanswered && (
                                        <div className="mt-3 flex items-center gap-2">
                                            {hasReplied ? (
                                                <span className="flex items-center gap-1 text-[11px] font-bold text-[#168165]">
                                                    <CheckCheckIcon size={14} aria-hidden="true" />
                                                    답글 초안을 저장했어요
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setReplied((current) => [...current, review.name])}
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
            <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-1.5 border-t border-[#eeeae2] px-5 py-3.5 text-xs font-bold text-[#29425b] transition-colors hover:bg-[#faf9f6]"
            >
                Google에서 전체 128개 리뷰 보기 <ArrowRightIcon size={14} aria-hidden="true" />
            </a>
        </section>
    )
}
