import { useState } from "react"
import {
    CheckIcon,
    LogOutIcon,
    MailIcon,
    PlusIcon,
    ShieldCheckIcon,
    StoreIcon,
    UserRoundIcon,
} from "lucide-react"
import { PageHeader } from "../../../components/common/PageHeader"
import type { StoreProfile } from "../../../data/store"
import { getAccent, getInitials } from "../../../utils/storeUtils"
import { useUser } from "../../../store"

type MyPageProps = {
    store: StoreProfile
    storeCount: number
    onAddStore: () => void
    onLogout: () => void
}
export function MyPage({
    store,
    storeCount,
    onAddStore,
    onLogout,
}: MyPageProps) {
    const user = useUser()
    const [saved, setSaved] = useState(false)
    const save = () => {
        setSaved(true)
        window.setTimeout(() => setSaved(false), 2500)
    }
    return (
        <>
            <PageHeader
                eyebrow="My account"
                title="마이페이지"
                description="운영자 정보와 비즈니스 계정을 관리하세요."
                action={
                    <button
                        type="button"
                        onClick={save}
                        className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#223b66]"
                    >
                        <CheckIcon size={16} /> 변경사항 저장
                    </button>
                }
            />
            {saved && (
                <div
                    role="status"
                    className="mb-5 flex items-center justify-between rounded-xl border border-[#9bdcc8] bg-[#eafaf5] px-4 py-3 text-sm font-semibold text-[#168165]"
                >
                    내 계정 정보가 저장되었어요.
                    <CheckIcon size={17} />
                </div>
            )}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_380px]">
                <div className="space-y-6">
                    <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <UserRoundIcon
                                size={18}
                                className="text-[#42526e]"
                            />
                            <div>
                                <h2 className="text-base font-bold">
                                    운영자 프로필
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    ShopHub에서 사용하는 개인 정보입니다.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e7c8a0] text-xl font-extrabold text-[#392d24]">
                                {getInitials(user?.name ?? "")}
                            </span>
                            <button
                                type="button"
                                className="w-fit rounded-lg border border-[#ded9cf] px-3 py-2 text-xs font-bold text-[#42526e] hover:bg-[#f7f5f0]"
                            >
                                프로필 이미지 변경
                            </button>
                        </div>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <Field
                                label="이름"
                                defaultValue={user?.name ?? ""}
                            />
                            <Field
                                label="이메일"
                                defaultValue={user?.email ?? ""}
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <ShieldCheckIcon
                                size={18}
                                className="text-[#42526e]"
                            />
                            <div>
                                <h2 className="text-base font-bold">
                                    계정 보안
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    로그인과 인증 방식을 관리합니다.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 divide-y divide-[#eeeae2]">
                            <Row
                                label="로그인 이메일"
                                value={user?.email ?? ""}
                                action="변경"
                            />
                            <Row
                                label="비밀번호"
                                value="마지막 변경 2026. 05. 12"
                                action="변경"
                            />
                            <Row
                                label="2단계 인증"
                                value="사용 안 함"
                                action="설정"
                            />
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="rounded-2xl bg-[#172b4d] p-5 text-white">
                        <p className="font-mono-label text-[9px] tracking-[0.14em] text-[#9edcc9]">
                            MY STORES
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <span
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${getAccent(store.id)} text-[#172033]`}
                            >
                                <StoreIcon size={20} />
                            </span>
                            <div className="min-w-0">
                                <h2 className="truncate text-base font-bold">
                                    {store.name}
                                </h2>
                                <p className="mt-1 text-xs text-[#c5d3eb]">
                                    사업자 계정 · Owner
                                </p>
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
                            <PlusIcon size={15} /> 가게 추가하기
                        </button>
                    </section>

                    <section className="rounded-2xl border border-[#ded9cf] bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <MailIcon size={18} className="text-[#42526e]" />
                            <div>
                                <h2 className="text-base font-bold">
                                    소식 받기
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    서비스 안내 수신 설정
                                </p>
                            </div>
                        </div>
                        <label className="mt-5 flex items-center justify-between rounded-xl bg-[#f7f5f0] px-4 py-3 text-sm font-semibold text-[#42526e]">
                            <span>운영 팁 이메일</span>
                            <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 accent-[#168165]"
                            />
                        </label>
                    </section>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8c9c2] bg-white px-4 py-3 text-xs font-bold text-[#bd503f] transition-colors hover:bg-[#fff4f1]"
                    >
                        <LogOutIcon size={16} aria-hidden="true" />
                        로그아웃
                    </button>
                </aside>
            </div>
        </>
    )
}
function Field({
    label,
    defaultValue,
}: {
    label: string
    defaultValue: string
}) {
    return (
        <label className="block text-xs font-bold text-[#42526e]">
            {label}
            <input
                defaultValue={defaultValue}
                className="mt-1.5 w-full rounded-xl border border-[#ded9cf] px-3 py-2.5 text-sm text-[#172033] outline-none focus:border-[#3dd7af]"
            />
        </label>
    )
}
function Row({
    label,
    value,
    action,
}: {
    label: string
    value: string
    action: string
}) {
    return (
        <div className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#172033]">{label}</p>
                <p className="mt-1 text-[11px] text-slate-500">{value}</p>
            </div>
            <button
                type="button"
                className="text-xs font-bold text-[#29425b] hover:underline"
            >
                {action}
            </button>
        </div>
    )
}
