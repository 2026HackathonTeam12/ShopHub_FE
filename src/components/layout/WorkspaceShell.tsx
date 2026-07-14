import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import {
    CheckIcon,
    ChevronDownIcon,
    MenuIcon,
    PlusIcon,
    StoreIcon,
    UserRoundIcon,
    XIcon,
} from "lucide-react"
import { ComposeModal } from "../../features/content/components/ComposeModal"
import { navigationItems, Sidebar } from "./Sidebar"
import { getAccent, getInitials } from "../../utils/storeUtils"
import { useFetchStoresMutation } from "../../hooks/useStoreMutations"
import { useFetchReviewsMutation } from "../../hooks/useReviewMutations"
import { useFetchContentsMutation } from "../../hooks/useContentMutations"
import { useFetchUserMutation } from "../../hooks/useAuthMutations"
import { useFetchIntegrationsMutation } from "../../hooks/useIntegrationMutations"
import {
    useStores,
    useSelectedStoreId,
    useSetSelectedStoreId,
    useSetReviews,
    useUser,
} from "../../store"
import { MyPage } from "../../features/account/pages/Mypage"
import { ContentCenterPage } from "../../features/content/pages/ContentCenterPage"
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage"
import { InboxPage } from "../../features/reviews/pages/InboxPage"
import { StoreProfilePage } from "../../features/store/pages/StoreProfilePage"

type WorkspaceShellProps = {
    onAddStore: () => void
    onLogout: () => void
}

export function WorkspaceShell({ onAddStore, onLogout }: WorkspaceShellProps) {
    const syncUser = useFetchUserMutation()
    const syncStores = useFetchStoresMutation()
    const [bootstrapped, setBootstrapped] = useState(false)

    useEffect(() => {
        Promise.all([syncUser.run(), syncStores.run()]).then(() => {
            setBootstrapped(true)
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!bootstrapped) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-canvas">
                <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-[20px] bg-panel text-accent-on-dark">
                    <StoreIcon size={22} />
                </span>
            </div>
        )
    }

    return <WorkspaceLayout onAddStore={onAddStore} onLogout={onLogout} />
}

// ── Inner UI ──────────────────────────────────────────────────────────────────

type WorkspaceLayoutProps = {
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

function WorkspaceLayout({ onAddStore, onLogout }: WorkspaceLayoutProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const stores = useStores()
    const selectedStoreId = useSelectedStoreId()
    const setSelectedStoreId = useSetSelectedStoreId()
    const user = useUser()
    const fetchReviews = useFetchReviewsMutation()
    const fetchContents = useFetchContentsMutation()
    const fetchIntegrations = useFetchIntegrationsMutation()
    const setReviews = useSetReviews()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [composerOpen, setComposerOpen] = useState(false)
    const [storeMenuOpen, setStoreMenuOpen] = useState(false)

    useEffect(() => {
        if (!stores.length) return
        const stillValid = stores.some((store) => store.id === selectedStoreId)
        if (!stillValid) {
            setSelectedStoreId(stores[0].id)
        }
    }, [stores, selectedStoreId, setSelectedStoreId])

    useEffect(() => {
        if (!selectedStoreId) return

        // Clear previous store's reviews immediately to avoid cross-store bleed.
        setReviews([])
        fetchReviews.run(selectedStoreId)
        fetchContents.run(selectedStoreId)
        fetchIntegrations.run(selectedStoreId)
    }, [selectedStoreId]) // eslint-disable-line react-hooks/exhaustive-deps

    const activePath = viewLabels[location.pathname]
        ? location.pathname
        : "/dashboard"
    const selectedStore = stores.find((store) => store.id === selectedStoreId)

    const goTo = (path: string) => {
        navigate(path)
        setMobileOpen(false)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (stores.length === 0) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-canvas p-5">
                <section className="max-w-md rounded-[20px] border border-border bg-surface p-8 text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-panel text-accent-on-dark">
                        <StoreIcon size={22} />
                    </span>
                    <h1 className="mt-5 text-xl font-extrabold text-ink">
                        운영할 가게를 등록해 주세요.
                    </h1>
                    <p className="mt-2 text-body leading-6 text-muted">
                        가게 정보가 있어야 콘텐츠 초안과 운영 화면을 준비할 수 있어요.
                    </p>
                    <button
                        type="button"
                        onClick={onAddStore}
                        className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-3 text-body font-bold text-white hover:bg-accent-hover"
                    >
                        <PlusIcon size={16} /> 첫 가게 등록하기
                    </button>
                </section>
            </div>
        )
    }

    if (!selectedStore) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-canvas">
                <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-[20px] bg-panel text-accent-on-dark">
                    <StoreIcon size={22} />
                </span>
            </div>
        )
    }

    const composeStore = {
        id: selectedStore.id,
        name: selectedStore.name,
        address: selectedStore.address,
        menu: selectedStore.menuItems.map((i) => i.name).join(" · "),
        toneOfVoice: selectedStore.toneOfVoice,
    }

    const page =
        activePath === "/content" ? (
            <ContentCenterPage onCompose={() => setComposerOpen(true)} />
        ) : activePath === "/reviews" ? (
            <InboxPage storeName={selectedStore.name} />
        ) : activePath === "/store" ? (
            <StoreProfilePage key={selectedStore.id} store={selectedStore} />
        ) : activePath === "/account" ? (
            <MyPage
                store={selectedStore}
                storeCount={stores.length}
                onAddStore={onAddStore}
                onLogout={onLogout}
            />
        ) : (
            <DashboardPage
                onNavigate={(label) => {
                    const target = navigationItems.find(
                        (item) => item.label === label,
                    )
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
        <div className="min-h-screen w-full bg-canvas">
            <Sidebar activePath={activePath} onNavigate={goTo} />

            <main className="min-h-screen min-w-0 lg:ml-64">
                <header className="sticky top-0 z-20 border-b border-border bg-canvas/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileOpen(true)}
                                className="rounded-xl p-2 text-ink hover:bg-border-subtle"
                                aria-label="메뉴 열기"
                            >
                                <MenuIcon size={20} />
                            </button>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-panel text-accent-on-dark">
                                <StoreIcon size={16} />
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setStoreMenuOpen((open) => !open)}
                                aria-expanded={storeMenuOpen}
                                className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-left hover:border-[#C8CDD8]"
                                aria-label="운영 가게 선택"
                            >
                                <span
                                    className={`flex h-7 w-7 items-center justify-center rounded-md ${getAccent(selectedStore.id)} text-[10px] font-extrabold text-ink`}
                                >
                                    {getInitials(selectedStore.name)}
                                </span>
                                <span className="hidden sm:block">
                                    <span className="block text-caption font-bold text-ink">
                                        {selectedStore.name}
                                    </span>
                                    <span className="block text-[10px] text-muted">
                                        {selectedStore.address}
                                    </span>
                                </span>
                                <ChevronDownIcon size={15} className="text-muted" />
                            </button>

                            <AnimatePresence>
                                {storeMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        className="absolute left-0 top-[calc(100%+8px)] z-30 w-80 overflow-hidden rounded-[20px] border border-border bg-surface p-2 shadow-xl"
                                    >
                                        <p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                                            내 가게 · {stores.length}곳
                                        </p>
                                        {stores.map((store) => (
                                            <button
                                                key={store.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedStoreId(store.id)
                                                    setStoreMenuOpen(false)
                                                }}
                                                className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left ${store.id === selectedStore.id ? "bg-accent-muted" : "hover:bg-canvas"}`}
                                            >
                                                <span
                                                    className={`flex h-8 w-8 items-center justify-center rounded-md ${getAccent(store.id)} text-[10px] font-extrabold text-ink`}
                                                >
                                                    {getInitials(store.name)}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-caption font-bold text-ink">
                                                        {store.name}
                                                    </span>
                                                    <span className="mt-0.5 block truncate text-[10px] text-muted">
                                                        {store.address}
                                                    </span>
                                                </span>
                                                {store.id === selectedStore.id && (
                                                    <CheckIcon size={15} className="text-success" />
                                                )}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={openAddStore}
                                            className="mt-1 flex w-full items-center gap-2 border-t border-border-subtle px-2 py-3 text-caption font-bold text-ink hover:bg-canvas"
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
                            className="ml-auto flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-caption font-bold text-white hover:bg-accent-hover sm:px-4"
                        >
                            <PlusIcon size={16} />
                            <span>새 콘텐츠</span>
                        </button>
                    </div>
                </header>

                <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8">
                    {page}
                </div>
            </main>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-panel/60 lg:hidden"
                    >
                        <motion.div
                            initial={{ x: -288 }}
                            animate={{ x: 0 }}
                            exit={{ x: -288 }}
                            transition={{ duration: 0.2 }}
                            className="flex h-full w-72 flex-col bg-panel p-5 shadow-2xl"
                        >
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-white">
                                        <StoreIcon size={16} />
                                    </span>
                                    <span className="font-bold">ShopHub</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-xl p-2 text-white/60 hover:bg-white/10"
                                    aria-label="메뉴 닫기"
                                >
                                    <XIcon size={19} />
                                </button>
                            </div>

                            <div className="mt-6 rounded-xl bg-white/5 p-3">
                                <p className="text-[10px] font-bold text-white/30">
                                    현재 가게
                                </p>
                                <p className="mt-1 text-body font-bold text-white">
                                    {selectedStore.name}
                                </p>
                                <button
                                    type="button"
                                    onClick={openAddStore}
                                    className="mt-2 flex items-center gap-1 text-caption font-semibold text-accent-on-dark"
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
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-body font-semibold ${activePath === item.path ? "bg-white/10 text-white" : "text-white/50"}`}
                                    >
                                        <span>{item.label}</span>
                                        {typeof item.badge === "number" && (
                                            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
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
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7c8a0] text-caption font-extrabold text-[#392d24]">
                                    {getInitials(user?.name ?? "")}
                                </span>
                                <span className="flex-1">
                                    <span className="block text-caption font-bold text-white">
                                        {user?.name ?? ""}
                                    </span>
                                    <span className="block text-[11px] text-white/40">
                                        내 계정 관리
                                    </span>
                                </span>
                                <UserRoundIcon size={16} className="text-white/30" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ComposeModal
                open={composerOpen}
                onClose={() => setComposerOpen(false)}
                store={composeStore}
            />
        </div>
    )
}
