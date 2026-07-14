import { useMemo, useState } from "react"
import { BotIcon, SendIcon, StarIcon } from "lucide-react"
import { useReviews, useSelectedStoreId, useStores } from "../../store"
import { getAccent, getInitials } from "../../utils/storeUtils"
import { getRelativeTime } from "../../utils/timeUtils"
import { useGenerateDraftMutation, useSendReplyMutation } from "../../hooks/useReviewMutations"
import { buildMockMapReviewReplyUrl } from "../../config/env"

export function ReviewInbox() {
    const reviews = useReviews()
    const stores = useStores()
    const selectedStoreId = useSelectedStoreId()
    const selectedStore = stores.find((store) => store.id === selectedStoreId)
    const generateDraftMutation = useGenerateDraftMutation()
    const sendReplyMutation = useSendReplyMutation()
    const [filter, setFilter] = useState<"all" | "pending">("pending")
    const [activeReviewId, setActiveReviewId] = useState<string | null>(null)
    const [drafts, setDrafts] = useState<Record<string, string>>({})
    const [redirectError, setRedirectError] = useState<string | null>(null)

    const storeReviews = useMemo(
        () => reviews.filter((review) => !selectedStoreId || review.storeId === selectedStoreId),
        [reviews, selectedStoreId]
    )
    const visibleReviews = storeReviews.filter((review) => filter === "all" || review.reply === null)

    const handleCreateDraft = async (reviewId: string) => {
        setActiveReviewId(reviewId)
        const content = await generateDraftMutation.run(reviewId)
        if (content !== null) {
            setDrafts((current) => ({ ...current, [reviewId]: content }))
        }
    }

    const handleManualReply = (review: (typeof reviews)[number]) => {
        setRedirectError(null)
        const placeId = selectedStore?.googlePlaceId
        const sourceReviewId = review.sourceReviewId

        if (!placeId) {
            setRedirectError("가게 place_id가 없습니다. MockMap 연동 후 가게 정보를 확인해 주세요.")
            return
        }
        if (!sourceReviewId) {
            setRedirectError("MockMap 리뷰 ID가 없습니다. 리뷰 동기화 후 다시 시도해 주세요.")
            return
        }

        window.location.href = buildMockMapReviewReplyUrl(placeId, sourceReviewId)
    }

    const handleSendReply = async (reviewId: string) => {
        const content = drafts[reviewId]?.trim()
        if (!content) return

        const ok = await sendReplyMutation.run({ reviewId, content })
        if (ok) {
            setActiveReviewId(null)
            setDrafts((current) => {
                const next = { ...current }
                delete next[reviewId]
                return next
            })
        }
    }

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
                        {storeReviews.length > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffede9] px-1 text-[10px] font-extrabold text-[#d6503b]">
                                {storeReviews.filter((r) => r.reply === null).length}
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
            {redirectError && (
                <p className="border-b border-[#eeeae2] px-5 py-3 text-xs font-medium text-[#d6503b]">{redirectError}</p>
            )}
            <div className="divide-y divide-[#eeeae2]">
                {visibleReviews.length === 0 ? (
                    <p className="px-5 py-8 text-center text-xs text-slate-500">표시할 리뷰가 없습니다.</p>
                ) : (
                    visibleReviews.map((review) => {
                        const isActive = activeReviewId === review.id
                        const draft = drafts[review.id] ?? ""
                        const isWorking =
                            (generateDraftMutation.loading && isActive) ||
                            (sendReplyMutation.loading && isActive)

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
                                        {review.reply && (
                                            <p className="mt-3 rounded-xl bg-[#f1f7f6] px-3 py-2 text-xs leading-5 text-[#29425b]">
                                                {review.reply}
                                            </p>
                                        )}
                                        {review.reply === null && !isActive && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    disabled={generateDraftMutation.loading}
                                                    onClick={() => handleCreateDraft(review.id)}
                                                    className="flex items-center gap-1.5 rounded-lg border border-[#d8dcd9] px-2.5 py-1.5 text-[11px] font-bold text-[#29425b] transition-colors hover:border-[#3dd7af] hover:bg-[#eafaf5] disabled:opacity-60"
                                                >
                                                    <BotIcon size={14} className="text-[#168165]" aria-hidden="true" />
                                                    AI 답글 만들기
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleManualReply(review)}
                                                    className="text-[11px] font-semibold text-slate-500 hover:text-[#172033]"
                                                >
                                                    직접 답글
                                                </button>
                                            </div>
                                        )}
                                        {review.reply === null && isActive && (
                                            <div className="mt-3 space-y-2">
                                                {generateDraftMutation.error && (
                                                    <p className="text-[11px] font-medium text-[#d6503b]">
                                                        {generateDraftMutation.error}
                                                    </p>
                                                )}
                                                {sendReplyMutation.error && (
                                                    <p className="text-[11px] font-medium text-[#d6503b]">
                                                        {sendReplyMutation.error}
                                                    </p>
                                                )}
                                                <textarea
                                                    value={draft}
                                                    onChange={(event) =>
                                                        setDrafts((current) => ({
                                                            ...current,
                                                            [review.id]: event.target.value,
                                                        }))
                                                    }
                                                    disabled={isWorking}
                                                    className="min-h-[72px] w-full rounded-xl border border-[#ded9cf] p-3 text-xs leading-5 outline-none focus:border-[#3dd7af] disabled:opacity-60"
                                                    placeholder="답글을 작성하거나 AI 초안을 생성하세요."
                                                />
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={!draft.trim() || isWorking}
                                                        onClick={() => handleSendReply(review.id)}
                                                        className="flex items-center gap-1 rounded-lg bg-[#172b4d] px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-40"
                                                    >
                                                        <SendIcon size={12} />
                                                        {sendReplyMutation.loading ? "게시 중…" : "답글 게시"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isWorking}
                                                        onClick={() => handleCreateDraft(review.id)}
                                                        className="text-[11px] font-semibold text-[#168165] hover:underline disabled:opacity-60"
                                                    >
                                                        {generateDraftMutation.loading ? "초안 생성 중…" : "AI 다시 생성"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isWorking}
                                                        onClick={() => setActiveReviewId(null)}
                                                        className="text-[11px] font-semibold text-slate-400 hover:text-[#172033]"
                                                    >
                                                        취소
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        )
                    })
                )}
            </div>
        </section>
    )
}
