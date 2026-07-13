import { LayoutDashboardIcon, MegaphoneIcon, MessageSquareTextIcon, StoreIcon, UserRoundIcon } from "lucide-react"
export const navigationItems = [
    {
        label: "대시보드",
        path: "/dashboard",
        icon: LayoutDashboardIcon,
    },
    {
        label: "콘텐츠 센터",
        path: "/content",
        icon: MegaphoneIcon,
    },
    {
        label: "리뷰",
        path: "/reviews",
        icon: MessageSquareTextIcon,
        badge: 8,
    },
    {
        label: "가게 정보",
        path: "/store",
        icon: StoreIcon,
    },
]
type SidebarProps = {
    activePath: string
    onNavigate: (path: string) => void
}
export function Sidebar({ activePath, onNavigate }: SidebarProps) {
    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#101a30] px-4 py-5 lg:flex">
            <button
                type="button"
                onClick={() => onNavigate("/dashboard")}
                className="flex items-center gap-2.5 px-2 text-left"
                aria-label="대시보드로 이동"
            >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3dd7af] text-[#101a30]">
                    <StoreIcon size={19} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span>
                    <span className="block text-lg font-extrabold tracking-tight text-white">ShopHub</span>
                    <span className="font-mono-label block text-[9px] uppercase tracking-[0.16em] text-slate-500">
                        business operations
                    </span>
                </span>
            </button>

            <nav className="mt-10 space-y-1" aria-label="주요 메뉴">
                <p className="font-mono-label mb-2 px-3 text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Workspace
                </p>
                {navigationItems.map((item) => (
                    <NavigationButton key={item.path} item={item} activePath={activePath} onNavigate={onNavigate} />
                ))}
            </nav>

            <div className="mt-auto border-t border-white/10 pt-4">
                <button
                    type="button"
                    onClick={() => onNavigate("/account")}
                    aria-current={activePath === "/account" ? "page" : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${activePath === "/account" ? "bg-white/10" : "hover:bg-white/5"}`}
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e7c8a0] text-xs font-extrabold text-[#392d24]">
                        JI
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-white">김지인</span>
                        <span className="block truncate text-[11px] text-slate-500">내 계정 관리</span>
                    </span>
                    <UserRoundIcon size={16} className="text-slate-400" aria-hidden="true" />
                </button>
            </div>
        </aside>
    )
}
type NavigationButtonProps = {
    item: (typeof navigationItems)[number]
    activePath: string
    onNavigate: (path: string) => void
}
function NavigationButton({ item, activePath, onNavigate }: NavigationButtonProps) {
    const Icon = item.icon
    const active = activePath === item.path
    return (
        <button
            type="button"
            onClick={() => onNavigate(item.path)}
            aria-current={active ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"}`}
        >
            <Icon size={18} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
            <span className="flex-1">{item.label}</span>
            {typeof item.badge === "number" && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff8067] px-1 text-[10px] font-bold text-[#172033]">
                    {item.badge > 9 ? "9+" : item.badge}
                </span>
            )}
        </button>
    )
}
