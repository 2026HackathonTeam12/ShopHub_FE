import { useEffect, useMemo, useState } from "react"
import { BotIcon, SearchIcon, SendIcon, StarIcon } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"
import { Button } from "../../../components/ui"
import { useReviews, useSelectedStoreId } from "../../../store"
import { getRelativeTime } from "../../../utils/timeUtils"
import {
    useGenerateDraftMutation,
    useSendReplyMutation,
} from "../../../hooks/useReviewMutations"

export function InboxPage({ storeName }: { storeName: string }) {
    const selectedStoreId = useSelectedStoreId()
    const generateDraftMutation = useGenerateDraftMutation()
    const sendReplyMutation = useSendReplyMutation()
    const reviews = useReviews()
    const [query, setQuery] = useState("")
    const [selectedId, setSelectedId] = useState("")
    const [draft, setDraft] = useState("")

    const storeReviews = useMemo(
        () => reviews.filter((review) => !selectedStoreId || review.storeId === selectedStoreId),
        [reviews, selectedStoreId],
    )

    useEffect(() => {
        setSelectedId("")
        setDraft("")
    }, [selectedStoreId])

    // Reviews are loaded by WorkspaceShell for the selected store only.

    const visible = useMemo(
        () =>
            storeReviews.filter(
                (review) =>
                    review.authorName.includes(query) || review.content.includes(query),
            ),
        [query, storeReviews],
    )
    const selected = storeReviews.find((review) => review.id === selectedId) ?? storeReviews[0]

    const header = (
        <PageHeader
            eyebrow="Customer reviews"
            title="리뷰"
            description="고객 리뷰를 확인하고 AI로 답글 초안을 작성하세요."
        />
    )

    const handleCreateDraft = async () => {
        if (!selected) return
        const content = await generateDraftMutation.run(selected.id)
        if (content !== null) setDraft(content)
    }

    return (
        <>
            {header}

            {/* Split-panel layout — border-only elevation */}
            <div className="grid min-h-[620px] overflow-hidden rounded-[20px] border border-border bg-surface lg:grid-cols-[300px_minmax(0,1fr)]">

                {/* Left: review list */}
                <aside className="border-b border-border-subtle lg:border-b-0 lg:border-r lg:border-border-subtle">
                    {/* Search */}
                    <div className="border-b border-border-subtle p-4">
                        <label className="relative block">
                            <SearchIcon
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                            />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full rounded-lg border border-border py-2 pl-9 pr-3 text-body outline-none transition-colors focus:border-accent"
                                placeholder="리뷰 검색"
                            />
                        </label>
                        <p className="mt-3 text-caption font-semibold text-muted">
                            최신 동기화 · {storeReviews.length}개
                        </p>
                    </div>

                    {/* Review rows */}
                    <div className="divide-y divide-border-subtle">
                        {visible.map((review) => (
                            <button
                                key={review.id}
                                type="button"
                                onClick={() => {
                                    setSelectedId(review.id)
                                    setDraft("")
                                }}
                                className={`w-full px-4 py-4 text-left transition-colors ${
                                    selectedId === review.id || (!selectedId && review === selected)
                                        ? "bg-accent-muted"
                                        : "hover:bg-canvas"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-body font-semibold text-ink">
                                        {review.authorName}
                                    </span>
                                    <span className="text-caption text-muted">
                                        {getRelativeTime(review.reviewedAt)}
                                    </span>
                                </div>
                                <div className="mt-1 flex gap-0.5">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            size={11}
                                            className="fill-star-gold text-star-gold"
                                        />
                                    ))}
                                </div>
                                <p className="mt-1.5 line-clamp-2 text-caption leading-relaxed text-secondary">
                                    {review.content}
                                </p>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Right: review detail + reply */}
                {selected && (
                    <section className="flex min-w-0 flex-col">
                        {/* Detail header */}
                        <div className="border-b border-border-subtle px-5 py-4">
                            <h2 className="text-body font-bold text-ink">{selected.authorName}</h2>
                            <p className="mt-1 text-caption text-muted">
                                {getRelativeTime(selected.reviewedAt)}
                            </p>
                        </div>

                        {/* Review content */}
                        <div className="flex-1 bg-canvas p-5">
                            <article className="max-w-xl rounded-2xl border border-border bg-surface p-5">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: selected.rating }).map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            size={14}
                                            className="fill-star-gold text-star-gold"
                                        />
                                    ))}
                                </div>
                                <p className="mt-4 text-body leading-relaxed text-secondary">
                                    {selected.content}
                                </p>
                            </article>

                            {selected.reply && (
                                <div className="ml-auto mt-5 max-w-xl rounded-[20px] bg-panel p-4 text-body leading-relaxed text-white">
                                    {selected.reply}
                                </div>
                            )}
                        </div>

                        {/* Reply composer */}
                        <div className="border-t border-border-subtle p-4">
                            <Button
                                variant="success"
                                size="sm"
                                icon={<BotIcon size={14} />}
                                loading={generateDraftMutation.loading}
                                onClick={handleCreateDraft}
                            >
                                {generateDraftMutation.loading ? "초안 생성 중…" : "AI 답글 초안"}
                            </Button>

                            {generateDraftMutation.error && (
                                <p className="mt-2 text-caption font-medium text-error">
                                    {generateDraftMutation.error}
                                </p>
                            )}

                            <textarea
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                className="mt-3 min-h-[84px] w-full rounded-lg border border-border p-3 text-body leading-relaxed outline-none transition-colors focus:border-accent"
                                placeholder="답글을 직접 작성하거나 AI 초안을 받아보세요."
                            />

                            {sendReplyMutation.error && (
                                <p className="mt-2 text-caption font-medium text-error">
                                    {sendReplyMutation.error}
                                </p>
                            )}

                            <div className="mt-2 flex justify-end">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={<SendIcon size={14} />}
                                    loading={sendReplyMutation.loading}
                                    disabled={!draft}
                                    onClick={() => {
                                        if (!selected) return
                                        sendReplyMutation.run({
                                            reviewId: selected.id,
                                            content: draft,
                                        })
                                    }}
                                >
                                    {sendReplyMutation.loading ? "게시 중…" : "답글 게시"}
                                </Button>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    )
}
