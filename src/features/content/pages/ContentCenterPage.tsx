import { useEffect, useState } from "react"
import { FileTextIcon, PlusIcon, SparklesIcon, XIcon } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"
import { usePosts, useSelectedStoreId, type Post } from "../../../store"
import { useFetchDashboardMutation } from "../../../hooks/useDashboardMutations"


export function ContentCenterPage({ onCompose }: { onCompose: () => void }) {
    const posts = usePosts()
    const selectedStoreId = useSelectedStoreId()
    const dashboardMutation = useFetchDashboardMutation()
    const [viewPost, setViewPost] = useState<Post | null>(null)

    useEffect(() => {
        if (selectedStoreId) dashboardMutation.run(selectedStoreId)
    }, [selectedStoreId]) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <PageHeader
                eyebrow="Content operations"
                title="콘텐츠 센터"
                description="AI와 함께 아이디어를 가게다운 게시물로 완성하세요."
                action={
                    <button
                        type="button"
                        onClick={onCompose}
                        className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#223b66]"
                    >
                        <PlusIcon size={16} />새 콘텐츠
                    </button>
                }
            />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
                <section className="overflow-hidden rounded-2xl border border-[#ded9cf] bg-white shadow-sm">
                    <div className="divide-y divide-[#eeeae2]">
                        {posts.map((post) => (
                            <article key={post.id} className="flex items-center gap-4 px-5 py-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9e2d5] text-[#6b5037]">
                                    <FileTextIcon size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-sm font-bold text-[#172033]">{post.title}</h2>
                                        {post.channels.split(" · ").map((ch) => (
                                            <span key={ch} className="rounded-md bg-[#eef1f7] px-2 py-0.5 text-xs font-bold text-[#42526e]">
                                                {ch}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">{post.date}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setViewPost(post)}
                                    className="shrink-0 rounded-lg border border-[#ded9cf] px-2.5 py-1.5 text-[11px] font-bold text-[#42526e] hover:bg-[#f7f5f0]"
                                >
                                    보기
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
                <aside>
                    <section className="rounded-2xl bg-[#172b4d] p-5 text-white">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3dd7af] text-[#10213b]">
                                <SparklesIcon size={16} />
                            </span>
                            <div>
                                <p className="font-mono-label text-[9px] tracking-wider text-[#9edcc9]">AI IDEA</p>
                                <h2 className="text-sm font-bold">오늘의 콘텐츠 주제</h2>
                            </div>
                        </div>
                        <p className="mt-5 text-sm font-bold leading-6">
                            {dashboardMutation.card?.message ?? ""}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#c5d3eb]">
                            가게 정보와 오늘의 맥락을 이용해 초안을 만들 수 있어요.
                        </p>
                        <button
                            type="button"
                            onClick={onCompose}
                            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3dd7af] py-2.5 text-xs font-bold text-[#10213b]"
                        >
                            <SparklesIcon size={14} />
                            AI 초안으로 시작하기
                        </button>
                    </section>
                </aside>
            </div>
            {viewPost && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setViewPost(null)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-[#ded9cf] bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <h2 className="text-base font-bold text-[#172033]">{viewPost.title}</h2>
                            <div className="flex shrink-0 items-center gap-2">
                                <span className="text-xs text-slate-400">{viewPost.date}</span>
                                <button
                                    type="button"
                                    onClick={() => setViewPost(null)}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-[#f7f5f0]"
                                >
                                    <XIcon size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {viewPost.channels.split(" · ").map((ch) => (
                                <span key={ch} className="rounded-md bg-[#eef1f7] px-2 py-0.5 text-xs font-bold text-[#42526e]">
                                    {ch}
                                </span>
                            ))}
                        </div>
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#42526e]">
                            {viewPost.body}
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
