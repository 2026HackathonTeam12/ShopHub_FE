import { LogOut, Plus, ShieldCheck, Store } from "lucide-react"
import type { StoreProfile } from "../../../data/store"
import { PageHeader } from "../../../components/common/PageHeader"

type MyPageProps = {
    store: StoreProfile
    storeCount: number
    onAddStore: () => void
    onLogout: () => void
}

export function MyPage({ store, storeCount, onAddStore, onLogout }: MyPageProps) {
    return (
        <>
            <PageHeader
                eyebrow="Account management"
                title="마이페이지"
                description="운영자 계정 정보와 구독 상태를 관리합니다."
            />
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                <section className="rounded-2xl border border-[#ded9cf] bg-[#101a30] p-6 text-white shadow-sm">
                    <p className="font-mono-label text-[9px] tracking-[0.14em] text-[#9edcc9]">MY STORES</p>
                    <div className="mt-4 flex items-center gap-3">
                        <span
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${store.accent} text-[#172033]`}
                        >
                            <Store size={20} />
                        </span>
                        <div className="min-w-0">
                            <h2 className="truncate text-base font-bold">{store.name}</h2>
                            <p className="mt-1 text-xs text-[#c5d3eb]">사업자 계정 · Owner</p>
                        </div>
                    </div>
                    <div className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-[#c5d3eb]">
                        {store.address}
                        <br />
                        운영 중인 가게 {storeCount}곳
                    </div>
                    <button
                        type="button"
                        onClick={onAddStore}
                        className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3dd7af] py-2.5 text-xs font-bold text-[#10213b] hover:bg-[#72e6c5]"
                    >
                        <Plus size={15} />새 워크스페이스 추가
                    </button>
                </section>
                <div className="space-y-6">
                    <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 sm:p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-[#172033]">기본 정보</h2>
                        <div className="mt-5 space-y-4">
                            <div className="grid gap-2 border-b border-[#eeeae2] pb-4 sm:grid-cols-[120px_1fr]">
                                <span className="text-xs font-bold text-slate-500">계정 이메일</span>
                                <span className="text-sm font-semibold text-[#172033]">owner@business.kr</span>
                            </div>
                            <div className="grid gap-2 border-b border-[#eeeae2] pb-4 sm:grid-cols-[120px_1fr]">
                                <span className="text-xs font-bold text-slate-500">비밀번호</span>
                                <button
                                    type="button"
                                    className="w-fit text-xs font-bold text-[#29425b] hover:underline"
                                >
                                    비밀번호 변경하기
                                </button>
                            </div>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 sm:p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-[#172033]">멤버십 & 구독</h2>
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f7f5f0] p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#bce8ce] text-[#168165]">
                                    <ShieldCheck size={18} />
                                </span>
                                <div>
                                    <p className="text-xs font-bold text-[#172033]">ShopHub Starter</p>
                                    <p className="mt-0.5 text-[11px] text-slate-500">다음 결제일: 2026. 08. 12</p>
                                </div>
                            </div>
                            <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-[#168165] border border-[#bce8ce]">
                                이용 중
                            </span>
                        </div>
                    </section>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex items-center gap-1.5 rounded-xl border border-[#ded9cf] bg-white px-4 py-3 text-xs font-bold text-[#d6503b] transition-colors hover:bg-[#fff5f4] hover:border-[#f3cac3]"
                    >
                        <LogOut size={14} />
                        로그아웃
                    </button>
                </div>
            </div>
        </>
    )
}
