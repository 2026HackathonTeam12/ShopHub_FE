import { AIRecommendation } from "../components/AIRecommendation"
import { PageHeader } from "../../../components/common/PageHeader"
import { ContentComposer } from "../../content/components/ContentComposer"
import { ReviewInbox } from "../../../components/common/ReviewInbox"

type DashboardPageProps = {
    onNavigate: (view: string) => void
    onCompose: () => void
}

export function DashboardPage({ onCompose }: DashboardPageProps) {
    return (
        <>
            <PageHeader
                eyebrow="Monday · 2026. 07. 13"
                title="안녕하세요, 지인님."
                description="오늘 고객에게 전할 이야기와 답해야 할 리뷰를 먼저 살펴보세요."
            />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_340px]">
                <div className="space-y-6">
                    <ContentComposer />
                </div>
                <aside className="space-y-6">
                    <AIRecommendation onCompose={onCompose} />
                </aside>
            </div>
            <section className="mt-6">
                <ReviewInbox />
            </section>
        </>
    )
}
