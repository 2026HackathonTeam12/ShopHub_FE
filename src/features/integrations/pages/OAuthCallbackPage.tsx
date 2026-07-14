import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CheckIcon, StoreIcon, XIcon } from "lucide-react"
import { useSelectedStoreId, useSetSelectedStoreId } from "../../../store"
import { useFetchUserMutation } from "../../../hooks/useAuthMutations"
import { useFetchStoresMutation } from "../../../hooks/useStoreMutations"
import { useFetchIntegrationsMutation } from "../../../hooks/useIntegrationMutations"
import { useFetchReviewsMutation } from "../../../hooks/useReviewMutations"

export function OAuthCallbackPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const selectedStoreId = useSelectedStoreId()
    const setSelectedStoreId = useSetSelectedStoreId()
    const fetchUser = useFetchUserMutation()
    const fetchStores = useFetchStoresMutation()
    const fetchIntegrations = useFetchIntegrationsMutation()
    const fetchReviews = useFetchReviewsMutation()

    const success = searchParams.get("success") === "true"
    const type = searchParams.get("type") ?? ""
    const storeIdFromCallback = searchParams.get("storeId")
    const message = searchParams.get("message") ?? (success ? "연동이 완료되었습니다." : "연동에 실패했습니다.")
    const targetStoreId = storeIdFromCallback || selectedStoreId

    useEffect(() => {
        void Promise.all([fetchUser.run(), fetchStores.run()]).then(() => {
            if (storeIdFromCallback) {
                setSelectedStoreId(storeIdFromCallback)
            }
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!targetStoreId) return
        fetchIntegrations.run(targetStoreId)
        if (success && type === "MOCK_MAP") {
            fetchReviews.run(targetStoreId)
        }
    }, [targetStoreId, success, type]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-canvas px-4 py-10">
            <section className="w-full max-w-md rounded-[20px] border border-border bg-surface p-8">
                <div className="flex flex-col items-center text-center">
                    <span
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${success ? "bg-success-bg text-success" : "bg-error-bg text-error"}`}
                    >
                        {success ? <CheckIcon size={28} /> : <XIcon size={28} />}
                    </span>

                    <p className="mt-4 font-mono-label text-[10px] tracking-[0.15em] text-muted">
                        {type || "OAUTH"} CALLBACK
                    </p>
                    <h1 className="mt-2 text-xl font-extrabold text-ink">
                        {success ? "플랫폼 연동 완료" : "플랫폼 연동 실패"}
                    </h1>
                    <p className="mt-3 text-body leading-6 text-secondary">{message}</p>

                    {success && type === "MOCK_MAP" && fetchReviews.loading && (
                        <p className="mt-3 text-caption font-medium text-success">연동된 리뷰를 불러오는 중…</p>
                    )}
                </div>

                <div className="mt-8 flex flex-col gap-2">
                    {success && type === "MOCK_MAP" && (
                        <button
                            type="button"
                            onClick={() => navigate("/reviews")}
                            className="w-full rounded-xl bg-accent px-4 py-3 text-caption font-bold text-white hover:bg-accent-hover"
                        >
                            리뷰 확인하기
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => navigate("/store")}
                        className="w-full rounded-xl border border-border px-4 py-3 text-caption font-bold text-secondary hover:bg-canvas"
                    >
                        가게 정보로 이동
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-caption font-bold text-muted hover:bg-canvas"
                    >
                        <StoreIcon size={14} />
                        대시보드
                    </button>
                </div>
            </section>
        </main>
    )
}
