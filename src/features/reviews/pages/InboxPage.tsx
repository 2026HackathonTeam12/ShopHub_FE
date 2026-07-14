import { useEffect, useMemo, useState } from "react"
import { BotIcon, SearchIcon, SendIcon, StarIcon } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"
import { useReviews, useSelectedStoreId } from "../../../store"
import { getRelativeTime } from "../../../utils/timeUtils"
import { useFetchReviewsMutation, useGenerateDraftMutation, useSendReplyMutation } from "../../../hooks/useReviewMutations"

export function InboxPage({ storeName }: { storeName: string }) {
    const selectedStoreId = useSelectedStoreId()
    const fetchReviewsMutation = useFetchReviewsMutation()
    const generateDraftMutation = useGenerateDraftMutation()
    const sendReplyMutation = useSendReplyMutation()
    const reviews = useReviews()
    const [query, setQuery] = useState("")
    const [selectedId, setSelectedId] = useState("")
    const [draft, setDraft] = useState("")

    useEffect(() => {
        if (selectedStoreId) fetchReviewsMutation.run(selectedStoreId)
    }, [selectedStoreId]) // eslint-disable-line react-hooks/exhaustive-deps

    const visible = useMemo(
        () => reviews.filter((review) => review.authorName.includes(query) || review.content.includes(query)),
        [query, reviews]
    )
    const selected = reviews.find((review) => review.id === selectedId) ?? reviews[0]

    if (fetchReviewsMutation.loading) {
        return (
            <>
                <PageHeader
                    eyebrow="Google Places reviews"
                    title="리뷰"
                    description="Google Places API로 최신 5개 리뷰를 불러왔어요. 전체 리뷰는 Google에서 확인할 수 있습니다."
                />
                <p className="mt-8 text-center text-sm text-slate-500">리뷰를 불러오는 중…</p>
            </>
        )
    }

    if (fetchReviewsMutation.error) {
        return (
            <>
                <PageHeader
                    eyebrow="Google Places reviews"
                    title="리뷰"
                    description="Google Places API로 최신 5개 리뷰를 불러왔어요. 전체 리뷰는 Google에서 확인할 수 있습니다."
                />
                <p className="mt-8 text-center text-sm text-[#d6503b]">{fetchReviewsMutation.error}</p>
            </>
        )
    }

    const handleCreateDraft = async () => {
        if (!selected) return
        const content = await generateDraftMutation.run(selected.id)
        if (content !== null) {
            setDraft(content)
        }
    }
    return (
        <>
            <PageHeader
                eyebrow="Customer reviews"
                title="리뷰"
                description="고객 리뷰를 확인하고 AI로 답글 초안을 작성하세요."
            />

            <div className="grid min-h-[620px] overflow-hidden rounded-2xl border border-[#ded9cf] bg-white shadow-sm lg:grid-cols-[330px_minmax(0,1fr)]">
                <aside className="border-b border-[#eeeae2] lg:border-b-0 lg:border-r">
                    <div className="border-b border-[#eeeae2] p-4">
                        <label className="relative block">
                            <SearchIcon size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                className="w-full rounded-lg border border-[#ded9cf] py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#3dd7af]"
                                placeholder="리뷰 검색"
                            />
                        </label>
                        <p className="mt-3 text-[11px] font-semibold text-slate-500">최신 동기화 · {reviews.length}개</p>
                    </div>
                    <div className="divide-y divide-[#eeeae2]">
                        {visible.map((review) => (
                            <button
                                key={review.id}
                                type="button"
                                onClick={() => {
                                    setSelectedId(review.id)
                                    setDraft("")
                                }}
                                className={`w-full px-4 py-4 text-left ${selectedId === review.id ? "bg-[#f1f7f6]" : "hover:bg-[#faf9f6]"}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#172033]">{review.authorName}</span>
                                    <span className="text-[10px] text-slate-400">{getRelativeTime(review.reviewedAt)}</span>
                                </div>
                                <div className="mt-1 flex gap-0.5">
                                    {Array.from({
                                        length: review.rating,
                                    }).map((_, index) => (
                                        <StarIcon key={index} size={11} className="fill-[#f4b840] text-[#f4b840]" />
                                    ))}
                                </div>
                                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-600">{review.content}</p>
                            </button>
                        ))}
                    </div>
                </aside>
                {selected && (
                    <section className="flex min-w-0 flex-col">
                        <div className="border-b border-[#eeeae2] px-5 py-4">
                            <h2 className="text-sm font-bold text-[#172033]">{selected.authorName}</h2>
                            <p className="mt-1 text-[11px] text-slate-500">{getRelativeTime(selected.reviewedAt)}</p>
                        </div>
                        <div className="flex-1 bg-[#faf9f6] p-5">
                            <article className="max-w-xl rounded-2xl border border-[#e6e1d8] bg-white p-5">
                                <div className="flex gap-0.5">
                                    {Array.from({
                                        length: selected.rating,
                                    }).map((_, index) => (
                                        <StarIcon key={index} size={14} className="fill-[#f4b840] text-[#f4b840]" />
                                    ))}
                                </div>
                                <p className="mt-4 text-sm leading-7 text-slate-700">{selected.content}</p>
                            </article>
                            {selected.reply && (
                                <div className="ml-auto mt-5 max-w-xl rounded-2xl bg-[#172b4d] p-4 text-sm leading-6 text-white">
                                    {selected.reply}
                                </div>
                            )}
                        </div>
                        <div className="border-t border-[#eeeae2] p-4">
                            <button
                                type="button"
                                onClick={handleCreateDraft}
                                disabled={generateDraftMutation.loading}
                                className="flex items-center gap-1.5 rounded-lg border border-[#b9dcd1] bg-[#eafaf5] px-3 py-2 text-xs font-bold text-[#168165] disabled:opacity-60"
                            >
                                <BotIcon size={15} />
                                {generateDraftMutation.loading ? "초안 생성 중…" : "AI 답글 초안"}
                            </button>
                            {generateDraftMutation.error && (
                                <p className="mt-2 text-[11px] font-medium text-[#d6503b]">{generateDraftMutation.error}</p>
                            )}
                            <textarea
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                className="mt-3 min-h-[84px] w-full rounded-xl border border-[#ded9cf] p-3 text-sm leading-6 outline-none focus:border-[#3dd7af]"
                                placeholder="답글을 직접 작성하거나 AI 초안을 받아보세요."
                            />
                            {sendReplyMutation.error && (
                                <p className="mt-2 text-[11px] font-medium text-[#d6503b]">{sendReplyMutation.error}</p>
                            )}
                            <div className="mt-2 flex justify-end">
                                <button
                                    type="button"
                                    disabled={!draft || sendReplyMutation.loading}
                                    onClick={() => {
                                        if (!selected) return
                                        sendReplyMutation.run({ reviewId: selected.id, content: draft })
                                    }}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40"
                                >
                                    <SendIcon size={15} />
                                    {sendReplyMutation.loading ? "게시 중…" : "답글 게시"}
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    )
}
