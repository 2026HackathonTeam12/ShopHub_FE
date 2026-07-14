import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CheckIcon, StoreIcon, XIcon } from "lucide-react"
import { useSelectedStoreId } from "../../../store"
import { useFetchIntegrationsMutation } from "../../../hooks/useIntegrationMutations"
import { useSyncMockMapReviewsMutation } from "../../../hooks/useReviewMutations"

export function OAuthCallbackPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const selectedStoreId = useSelectedStoreId()
    const fetchIntegrations = useFetchIntegrationsMutation()
    const syncReviews = useSyncMockMapReviewsMutation()

    const success = searchParams.get("success") === "true"
    const type = searchParams.get("type") ?? ""
    const message = searchParams.get("message") ?? (success ? "연동이 완료되었습니다." : "연동에 실패했습니다.")

    useEffect(() => {
        if (!selectedStoreId) return

        fetchIntegrations.run(selectedStoreId)

        if (success && type === "MOCK_MAP") {
            syncReviews.run(selectedStoreId)
        }
    }, [selectedStoreId]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-[#f5f2eb] px-4 py-10">
            <section className="w-full max-w-md rounded-3xl border border-[#ded9cf] bg-white p-8 shadow-[0_20px_55px_rgba(23,43,77,0.08)]">
                <div className="flex flex-col items-center text-center">
                    <span
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${success ? "bg-[#eafaf5] text-[#168165]" : "bg-[#fdecea] text-[#d6503b]"}`}
                    >
                        {success ? <CheckIcon size={28} /> : <XIcon size={28} />}
                    </span>

                    <p className="mt-4 font-mono-label text-[10px] tracking-[0.15em] text-slate-400">
                        {type || "OAUTH"} CALLBACK
                    </p>
                    <h1 className="mt-2 text-xl font-extrabold text-[#172033]">
                        {success ? "플랫폼 연동 완료" : "플랫폼 연동 실패"}
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

                    {success && type === "MOCK_MAP" && syncReviews.loading && (
                        <p className="mt-3 text-xs font-medium text-[#168165]">MockMap 리뷰를 동기화하는 중…</p>
                    )}
                </div>

                <div className="mt-8 flex flex-col gap-2">
                    {success && type === "MOCK_MAP" && (
                        <button
                            type="button"
                            onClick={() => navigate("/reviews")}
                            className="w-full rounded-xl bg-[#172b4d] px-4 py-3 text-xs font-bold text-white hover:bg-[#223b66]"
                        >
                            리뷰 확인하기
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => navigate("/store")}
                        className="w-full rounded-xl border border-[#ded9cf] px-4 py-3 text-xs font-bold text-[#42526e] hover:bg-[#f7f5f0]"
                    >
                        가게 정보로 이동
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-xs font-bold text-slate-500 hover:bg-[#f5f2eb]"
                    >
                        <StoreIcon size={14} />
                        대시보드
                    </button>
                </div>
            </section>
        </main>
    )
}
