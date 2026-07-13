import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import { CheckIcon, ChevronDownIcon, MenuIcon, PlusIcon, StoreIcon, UserRoundIcon, XIcon } from "lucide-react"
import { ComposeModal } from "../../features/content/components/ComposeModal"
import { navigationItems, Sidebar } from "./Sidebar"
import type { StoreProfile } from "../../data/store"
import { MyPage } from "../../features/account/pages/Mypage"
import { ContentCenterPage } from "../../features/content/pages/ContentCenterPage"
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage"
import { InboxPage } from "../../features/reviews/pages/InboxPage"
import { StoreProfilePage } from "../../features/store/pages/StoreProfilePage"

type WorkspaceShellProps = {
    stores: StoreProfile[]
    selectedStoreId: string
    onSelectStore: (storeId: string) => void
    onAddStore: () => void
    onLogout: () => void
}
const viewLabels: Record<string, string> = {
    "/dashboard": "대시보드",
    "/content": "콘텐츠 센터",
    "/reviews": "리뷰",
    "/store": "가게 정보",
    "/account": "마이페이지",
}
export function WorkspaceShell({ stores, selectedStoreId, onSelectStore, onAddStore, onLogout }: WorkspaceShellProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [composerOpen, setComposerOpen] = useState(false)
    const [storeMenuOpen, setStoreMenuOpen] = useState(false)
    const activePath = viewLabels[location.pathname] ? location.pathname : "/dashboard"
    // const activeItem = viewLabels[activePath]
    const selectedStore = stores.find((store) => store.id === selectedStoreId) ?? stores[0]
    const goTo = (path: string) => {
        navigate(path)
        setMobileOpen(false)
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }
    if (!selectedStore) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f2eb] p-5">
                <section className="max-w-md rounded-3xl border border-[#ded9cf] bg-white p-8 text-center shadow-sm">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#172b4d] text-[#3dd7af]">
                        <StoreIcon size={22} />
                    </span>
                    <h1 className="mt-5 text-xl font-extrabold text-[#172033]">운영할 가게를 등록해 주세요.</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        가게 정보가 있어야 콘텐츠 초안과 운영 화면을 준비할 수 있어요.
                    </p>
                    <button
                        type="button"
                        onClick={onAddStore}
                        className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-4 py-3 text-sm font-bold text-white hover:bg-[#223b66]"
                    >
                        <PlusIcon size={16} /> 첫 가게 등록하기
                    </button>
                </section>
            </div>
        )
    }
    const composeStore = {
        name: selectedStore.name,
        neighborhood: selectedStore.neighborhood,
        menu: selectedStore.menu.join(" · "),
        tone: selectedStore.tone,
    }
    const page =
        activePath === "/content" ? (
            <ContentCenterPage onCompose={() => setComposerOpen(true)} />
        ) : activePath === "/reviews" ? (
            <InboxPage storeName={selectedStore.name} />
        ) : activePath === "/store" ? (
            <StoreProfilePage store={selectedStore} />
        ) : activePath === "/account" ? (
            <MyPage store={selectedStore} storeCount={stores.length} onAddStore={onAddStore} onLogout={onLogout} />
        ) : (
            <DashboardPage
                onNavigate={(label) => {
                    const target = navigationItems.find((item) => item.label === label)
                    goTo(target?.path ?? "/dashboard")
                }}
                onCompose={() => setComposerOpen(true)}
            />
        )
    const openAddStore = () => {
        setStoreMenuOpen(false)
        setMobileOpen(false)
        onAddStore()
    }
    return (
        <div className="min-h-screen w-full bg-[#f5f2eb]">
            <Sidebar activePath={activePath} onNavigate={goTo} />

            <main className="min-h-screen min-w-0 lg:ml-64">
                <header className="sticky top-0 z-20 border-b border-[#ded9cf] bg-[#f5f2eb]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileOpen(true)}
                                className="rounded-lg p-2 text-[#172033] hover:bg-[#e9e5dc]"
                                aria-label="메뉴 열기"
                            >
                                <MenuIcon size={20} />
                            </button>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#172b4d] text-[#3dd7af]">
                                <StoreIcon size={16} />
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setStoreMenuOpen((open) => !open)}
                                aria-expanded={storeMenuOpen}
                                className="flex min-w-0 items-center gap-2 rounded-xl border border-[#ded9cf] bg-white px-3 py-2 text-left shadow-sm hover:border-[#aab3c2]"
                                aria-label="운영 가게 선택"
                            >
                                <span
                                    className={`flex h-7 w-7 items-center justify-center rounded-md ${selectedStore.accent} text-[10px] font-extrabold text-[#3b2c22]`}
                                >
                                    {selectedStore.initials}
                                </span>
                                <span className="hidden sm:block">
                                    <span className="block text-xs font-bold text-[#172033]">{selectedStore.name}</span>
                                    <span className="block text-[10px] text-slate-500">
                                        {selectedStore.neighborhood}
                                    </span>
                                </span>
                                <ChevronDownIcon size={15} className="text-slate-400" />
                            </button>

                            <AnimatePresence>
                                {storeMenuOpen && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -6,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -6,
                                        }}
                                        className="absolute left-0 top-[calc(100%+8px)] z-30 w-80 overflow-hidden rounded-xl border border-[#ded9cf] bg-white p-2 shadow-xl"
                                    >
                                        <p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            내 가게 · {stores.length}곳
                                        </p>
                                        {stores.map((store) => (
                                            <button
                                                key={store.id}
                                                type="button"
                                                onClick={() => {
                                                    onSelectStore(store.id)
                                                    setStoreMenuOpen(false)
                                                }}
                                                className={`flex w-full items-center gap-3 rounded-lg p-2.5 text-left ${store.id === selectedStore.id ? "bg-[#f0faf6]" : "hover:bg-[#f7f5f0]"}`}
                                            >
                                                <span
                                                    className={`flex h-8 w-8 items-center justify-center rounded-md ${store.accent} text-[10px] font-extrabold text-[#3b2c22]`}
                                                >
                                                    {store.initials}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-xs font-bold text-[#172033]">
                                                        {store.name}
                                                    </span>
                                                    <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                                                        {store.neighborhood}
                                                    </span>
                                                </span>
                                                {store.id === selectedStore.id && (
                                                    <CheckIcon size={15} className="text-[#168165]" />
                                                )}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={openAddStore}
                                            className="mt-1 flex w-full items-center gap-2 border-t border-[#eeeae2] px-2 py-3 text-xs font-bold text-[#29425b] hover:bg-[#f7f5f0]"
                                        >
                                            <PlusIcon size={14} /> 새 가게 추가
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="button"
                            onClick={() => setComposerOpen(true)}
                            className="ml-auto flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-3 py-2.5 text-xs font-bold text-white hover:bg-[#223b66] sm:px-4"
                        >
                            <PlusIcon size={16} />
                            <span>새 콘텐츠</span>
                        </button>
                    </div>
                </header>

                <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8">{page}</div>
            </main>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="fixed inset-0 z-40 bg-[#101a30]/50 lg:hidden"
                    >
                        <motion.div
                            initial={{
                                x: -288,
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: -288,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="flex h-full w-72 flex-col bg-[#101a30] p-5 shadow-2xl"
                        >
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3dd7af] text-[#101a30]">
                                        <StoreIcon size={16} />
                                    </span>
                                    <span className="font-bold">ShopHub</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-lg p-2 text-slate-300 hover:bg-white/10"
                                    aria-label="메뉴 닫기"
                                >
                                    <XIcon size={19} />
                                </button>
                            </div>

                            <div className="mt-6 rounded-xl bg-white/5 p-3">
                                <p className="text-[10px] font-bold text-slate-500">현재 가게</p>
                                <p className="mt-1 text-sm font-bold text-white">{selectedStore.name}</p>
                                <button
                                    type="button"
                                    onClick={openAddStore}
                                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#9edcc9]"
                                >
                                    <PlusIcon size={13} /> 새 가게 추가
                                </button>
                            </div>

                            <nav className="mt-6 space-y-1" aria-label="모바일 메뉴">
                                {navigationItems.map((item) => (
                                    <button
                                        key={item.path}
                                        type="button"
                                        onClick={() => goTo(item.path)}
                                        aria-current={activePath === item.path ? "page" : undefined}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold ${activePath === item.path ? "bg-white/10 text-white" : "text-slate-400"}`}
                                    >
                                        <span>{item.label}</span>
                                        {typeof item.badge === "number" && (
                                            <span className="rounded-full bg-[#ff8067] px-2 py-0.5 text-[10px] font-bold text-[#172033]">
                                                {item.badge > 9 ? "9+" : item.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>

                            <button
                                type="button"
                                onClick={() => goTo("/account")}
                                className={`mt-auto flex items-center gap-3 rounded-xl p-3 text-left ${activePath === "/account" ? "bg-white/10" : "bg-white/5"}`}
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7c8a0] text-xs font-extrabold text-[#392d24]">
                                    JI
                                </span>
                                <span className="flex-1">
                                    <span className="block text-xs font-bold text-white">김지인</span>
                                    <span className="block text-[11px] text-slate-400">내 계정 관리</span>
                                </span>
                                <UserRoundIcon size={16} className="text-slate-400" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ComposeModal open={composerOpen} onClose={() => setComposerOpen(false)} store={composeStore} />
        </div>
    )
}
