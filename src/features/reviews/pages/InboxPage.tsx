import { useMemo, useState } from "react"
import { BotIcon, ExternalLinkIcon, SearchIcon, SendIcon, StarIcon } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"
import { useReviews } from "../../../store"

export function InboxPage({ storeName }: { storeName: string }) {
    const { reviews } = useReviews()
    const [query, setQuery] = useState("")
    const [selectedId, setSelectedId] = useState(reviews[0]?.id ?? 1)
    const [draft, setDraft] = useState("")
    const [sent, setSent] = useState(false)
    const visible = useMemo(
        () => reviews.filter((review) => review.name.includes(query) || review.text.includes(query)),
        [query, reviews]
    )
    const selected = reviews.find((review) => review.id === selectedId) ?? reviews[0]
    const createDraft = () => {
        setDraft(
            `안녕하세요, ${selected.name}님. ${storeName}를 찾아주시고 따뜻한 후기를 남겨주셔서 감사합니다. 다음 방문에도 편안한 시간을 보내실 수 있도록 정성껏 준비하겠습니다.`
        )
        setSent(false)
    }
    return (
        <>
            <PageHeader
                eyebrow="Google Places reviews"
                title="리뷰"
                description="Google Places API로 최신 5개 리뷰를 불러왔어요. 전체 리뷰는 Google에서 확인할 수 있습니다."
            />
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d8e9e1] bg-[#effaf6] px-5 py-4">
                <div>
                    <p className="text-sm font-bold text-[#172033]">Google 리뷰 총 128개 · 동기화된 최신 리뷰 5개</p>
                    <p className="mt-1 text-xs text-slate-600">
                        API 제한으로 최근 5개만 이곳에서 답글 초안을 만들 수 있어요.
                    </p>
                </div>
                <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-[#172b4d] px-3 py-2 text-xs font-bold text-white hover:bg-[#223b66]"
                >
                    <ExternalLinkIcon size={14} />
                    Google에서 전체 보기
                </a>
            </div>
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
                        <p className="mt-3 text-[11px] font-semibold text-slate-500">최신 동기화 · 5개</p>
                    </div>
                    <div className="divide-y divide-[#eeeae2]">
                        {visible.map((review) => (
                            <button
                                key={review.id}
                                type="button"
                                onClick={() => {
                                    setSelectedId(review.id)
                                    setDraft("")
                                    setSent(false)
                                }}
                                className={`w-full px-4 py-4 text-left ${selectedId === review.id ? "bg-[#f1f7f6]" : "hover:bg-[#faf9f6]"}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#172033]">{review.name}</span>
                                    <span className="text-[10px] text-slate-400">{review.time}</span>
                                </div>
                                <div className="mt-1 flex gap-0.5">
                                    {Array.from({
                                        length: review.rating,
                                    }).map((_, index) => (
                                        <StarIcon key={index} size={11} className="fill-[#f4b840] text-[#f4b840]" />
                                    ))}
                                </div>
                                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-600">{review.text}</p>
                            </button>
                        ))}
                    </div>
                </aside>
                <section className="flex min-w-0 flex-col">
                    <div className="border-b border-[#eeeae2] px-5 py-4">
                        <h2 className="text-sm font-bold text-[#172033]">{selected.name}</h2>
                        <p className="mt-1 text-[11px] text-slate-500">Google 리뷰 · {selected.time}</p>
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
                            <p className="mt-4 text-sm leading-7 text-slate-700">{selected.text}</p>
                        </article>
                        {sent && (
                            <div className="ml-auto mt-5 max-w-xl rounded-2xl bg-[#172b4d] p-4 text-sm leading-6 text-white">
                                {draft || `안녕하세요, ${selected.name}님. 소중한 후기 감사합니다.`}
                            </div>
                        )}
                    </div>
                    <div className="border-t border-[#eeeae2] p-4">
                        <button
                            type="button"
                            onClick={createDraft}
                            className="flex items-center gap-1.5 rounded-lg border border-[#b9dcd1] bg-[#eafaf5] px-3 py-2 text-xs font-bold text-[#168165]"
                        >
                            <BotIcon size={15} />
                            AI 답글 초안
                        </button>
                        <textarea
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            className="mt-3 min-h-[84px] w-full rounded-xl border border-[#ded9cf] p-3 text-sm leading-6 outline-none focus:border-[#3dd7af]"
                            placeholder="답글을 직접 작성하거나 AI 초안을 받아보세요."
                        />
                        <div className="mt-2 flex justify-end">
                            <button
                                type="button"
                                disabled={!draft}
                                onClick={() => {
                                    setSent(true)
                                }}
                                className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40"
                            >
                                <SendIcon size={15} />
                                답글 게시
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
