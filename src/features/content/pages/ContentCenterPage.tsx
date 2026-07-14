import { useEffect, useState } from "react"
import { FileTextIcon, PlusIcon, SparklesIcon } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"
import { usePosts, useSelectedStoreId } from "../../../store"
import { useFetchDashboardMutation } from "../../../hooks/useDashboardMutations"

const statusStyle: Record<string, string> = {
    예약됨: "bg-[#edf8f4] text-[#168165]",
    초안: "bg-[#eef1f7] text-[#42526e]",
    실패: "bg-[#ffede9] text-[#d6503b]",
    게시됨: "bg-[#edf8f4] text-[#168165]",
}

export function ContentCenterPage({ onCompose }: { onCompose: () => void }) {
    const posts = usePosts()
    const selectedStoreId = useSelectedStoreId()
    const dashboardMutation = useFetchDashboardMutation()
    const [tab, setTab] = useState("전체")
    const filtered = posts.filter((post) => tab === "전체" || post.status === tab)

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
                    <div className="border-b border-[#eeeae2] px-5 py-4">
                        <div className="flex gap-1 overflow-x-auto rounded-lg bg-[#f3f0e9] p-1" role="tablist">
                            {["전체", "초안", "예약됨", "게시됨", "실패"].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    role="tab"
                                    aria-selected={tab === item}
                                    onClick={() => setTab(item)}
                                    className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-bold ${tab === item ? "bg-white text-[#172033] shadow-sm" : "text-slate-500"}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="divide-y divide-[#eeeae2]">
                        {filtered.map((post) => (
                            <article key={post.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9e2d5] text-[#6b5037]">
                                    <FileTextIcon size={20} />
                                </div>
                                <div className="min-w-[180px] flex-1">
                                    <h2 className="text-sm font-bold text-[#172033]">{post.title}</h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {post.channels} · {post.date}
                                    </p>
                                </div>
                                <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${statusStyle[post.status] ?? ""}`}>
                                    {post.status}
                                </span>
                                <button
                                    type="button"
                                    onClick={onCompose}
                                    className="rounded-lg border border-[#ded9cf] px-2.5 py-1.5 text-[11px] font-bold text-[#42526e] hover:bg-[#f7f5f0]"
                                >
                                    다시 작성
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
        </>
    )
}
