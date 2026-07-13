import { useState } from "react"
import { FileText, Layers3 } from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"

const historyData = [
    {
        title: "비 오는 오후, 따뜻한 한 잔",
        channels: "Instagram · 네이버 플레이스",
        date: "방금 전 발행",
        status: "발행 완료",
        style: "bg-[#eafaf5] text-[#168165]",
    },
    {
        title: "주말 특별 디저트 출시 안내",
        channels: "네이버 플레이스 · Google",
        date: "어제 발행",
        status: "발행 완료",
        style: "bg-[#eafaf5] text-[#168165]",
    },
    {
        title: "여름 시즌 원두 안내",
        channels: "Instagram · Google Business",
        date: "3일 전 예약",
        status: "예약 중",
        style: "bg-[#cbdcf6] text-[#29425b]",
    },
]

type ContentCenterPageProps = {
    onCompose: () => void
}

export function ContentCenterPage({ onCompose }: ContentCenterPageProps) {
    const [filter, setFilter] = useState("전체")

    const filtered = filter === "전체" ? historyData : historyData.filter((item) => item.status === filter)

    return (
        <>
            <PageHeader
                eyebrow="Content management"
                title="콘텐츠 센터"
                description="가게 소식을 전하는 피드 게시물을 작성하고 발행 이력을 확인합니다."
            />
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <section className="rounded-2xl border border-[#ded9cf] bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#eeeae2] px-5 py-4">
                        <h2 className="text-sm font-bold text-[#172033]">콘텐츠 발행 내역</h2>
                        <div className="flex gap-1.5 rounded-lg bg-[#f3f0e9] p-1">
                            {["전체", "발행 완료", "예약 중"].map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setFilter(tab)}
                                    className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                    filter === tab ? 'bg-white text-[#172033] shadow-sm' : 'text-slate-500'
                  }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="divide-y divide-[#eeeae2]">
                        {filtered.map((post) => (
                            <article key={post.title} className="flex flex-wrap items-center gap-4 px-5 py-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9e2d5] text-[#6b5037]">
                                    <FileText size={20} />
                                </div>
                                <div className="min-w-[180px] flex-1">
                                    <h2 className="text-sm font-bold text-[#172033]">{post.title}</h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {post.channels} · {post.date}
                                    </p>
                                </div>
                                <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${post.style}`}>
                                    {post.status}
                                </span>
                                <button
                                    type="button"
                                    onClick={onCompose}
                                    className="rounded-lg border border-[#ded9cf] px-2.5 py-1.5 text-[11px] font-bold text-[#42526e] hover:bg-[#f7f5f0]"
                                >
                                    복사 후 새 편집
                                </button>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="rounded-2xl border border-[#ded9cf] bg-[#172b4d] p-5 text-white shadow-sm">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3dd7af] text-[#10213b]">
                            <Layers3 size={16} />
                        </span>
                        <h2 className="mt-3 text-sm font-bold">다채널 동시 발행</h2>
                        <p className="mt-1.5 text-xs leading-5 text-[#c5d3eb]">
                            다양한 소셜 미디어 플랫폼과 지도 앱을 선택해 하나의 글로 동시 업데이트하세요.
                        </p>
                    </div>
                </section>
            </div>
        </>
    )
}
