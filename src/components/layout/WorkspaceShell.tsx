import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Check, ChevronDown, Menu, Plus, Store, X } from "lucide-react"
import type { StoreProfile } from "../../data/store"
import { Sidebar, navigationItems } from "./Sidebar"
import { ComposeModal } from "../../features/content/components/ComposeModal"
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage"
import { ContentCenterPage } from "../../features/content/pages/ContentCenterPage"
import { InboxPage } from "../../features/reviews/pages/InboxPage"
import { StoreProfilePage } from "../../features/store/pages/StoreProfilePage"
import { MyPage } from "../../features/account/pages/Mypage"

type WorkspaceShellProps = {
    stores: StoreProfile[]
    selectedStoreId: string
    onSelectStore: (id: string) => void
    onAddStore: () => void
    onLogout: () => void
}

export function WorkspaceShell({ stores, selectedStoreId, onSelectStore, onAddStore, onLogout }: WorkspaceShellProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const activePath = location.pathname

    const [storeMenuOpen, setStoreMenuOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [composerOpen, setComposerOpen] = useState(false)

    const selectedStore = stores.find((s) => s.id === selectedStoreId) || stores[0]

    const goTo = (path: string) => {
        navigate(path)
        setMobileOpen(false)
    }

    if (!selectedStore) return null

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
                    <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setMobileOpen(true)}
                                className="rounded-xl border border-[#ded9cf] bg-white p-2.5 text-[#172033] hover:bg-[#f7f5f0] lg:hidden"
                            >
                                <Menu size={18} />
                            </button>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setStoreMenuOpen((prev) => !prev)}
                                    className="flex items-center gap-2 rounded-xl border border-[#ded9cf] bg-white px-3.5 py-2 text-sm font-bold text-[#172033] transition-colors hover:bg-[#f7f5f0]"
                                >
                                    <span
                                        className={`flex h-5 w-5 items-center justify-center rounded-md ${selectedStore.accent} text-[#172033]`}
                                    >
                                        <Store size={12} />
                                    </span>
                                    <span className="truncate max-w-[120px] sm:max-w-none">{selectedStore.name}</span>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>
                                {storeMenuOpen && (
                                    <>
                                        <div
                                            role="presentation"
                                            className="fixed inset-0 z-20"
                                            onClick={() => setStoreMenuOpen(false)}
                                        />
                                        <div className="absolute left-0 mt-1.5 z-30 w-56 origin-top-left rounded-xl border border-[#ded9cf] bg-white p-1.5 shadow-xl">
                                            <p className="px-2.5 py-2 font-mono-label text-[9px] uppercase tracking-[0.12em] text-slate-400">
                                                워크스페이스 전환
                                            </p>
                                            <div className="max-h-48 overflow-y-auto">
                                                {stores.map((s) => (
                                                    <button
                                                        key={s.id}
                                                        type="button"
                                                        onClick={() => {
                                                            onSelectStore(s.id)
                                                            setStoreMenuOpen(false)
                                                        }}
                                                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-bold text-[#172033] hover:bg-[#f5f2eb]"
                                                    >
                                                        <span
                                                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm ${s.accent}`}
                                                        >
                                                            <Store size={10} />
                                                        </span>
                                                        <span className="flex-1 truncate">{s.name}</span>
                                                        {s.id === selectedStoreId && (
                                                            <Check size={14} className="text-[#168165]" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="mt-1.5 border-t border-[#eeeae2] pt-1.5">
                                                <button
                                                    type="button"
                                                    onClick={openAddStore}
                                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-bold text-[#29425b] hover:bg-[#eafaf5]"
                                                >
                                                    <Plus size={14} />새 가게 등록하기
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setComposerOpen(true)}
                            className="flex items-center gap-1.5 rounded-xl bg-[#172b4d] px-3 py-2.5 text-xs font-bold text-white hover:bg-[#223b66] sm:px-4"
                        >
                            <Plus size={16} />
                            <span>새 콘텐츠</span>
                        </button>
                    </div>
                </header>
                <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8">{page}</div>
            </main>
            {mobileOpen && (
                <div className="fixed inset-0 z-40 flex bg-black/40 lg:hidden">
                    <div className="flex h-full w-72 flex-col bg-[#101a30] p-5 shadow-2xl">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2.5 px-1">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3dd7af] text-[#10213b]">
                                    <Store size={18} strokeWidth={2.5} />
                                </span>
                                <div>
                                    <p className="text-base font-extrabold tracking-tight">ShopHub</p>
                                    <p className="font-mono-label text-[8px] uppercase tracking-[0.14em] text-slate-500">
                                        business operations
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <nav className="mt-8 flex-1 space-y-1">
                            {navigationItems.map((item) => {
                                const Icon = item.icon
                                const active = activePath === item.path
                                return (
                                    <button
                                        key={item.path}
                                        type="button"
                                        onClick={() => goTo(item.path)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                                            active
                                                ? "bg-white/10 text-white"
                                                : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                                        }`}
                                    >
                                        <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                                        <span className="flex-1">{item.label}</span>
                                        {typeof item.badge === "number" && (
                                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff8067] px-1 text-[10px] font-bold text-[#172033]">
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>
                </div>
            )}
            <ComposeModal
                open={composerOpen}
                onClose={() => setComposerOpen(false)}
                store={{
                    name: selectedStore.name,
                    neighborhood: selectedStore.neighborhood,
                    menu: selectedStore.menu[0] || "대표 메뉴",
                    tone: selectedStore.tone,
                }}
            />
        </div>
    )
}
