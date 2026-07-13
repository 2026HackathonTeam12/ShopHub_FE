import { LayoutDashboard, FileText, MessageSquareCode, Store, UserRound } from "lucide-react"

export const navigationItems = [
    { path: "/dashboard", label: "대시보드", icon: LayoutDashboard },
    { path: "/content", label: "콘텐츠 센터", icon: FileText },
    { path: "/reviews", label: "리뷰 관리", icon: MessageSquareCode, badge: 3 },
    { path: "/store", label: "가게 정보", icon: Store },
    { path: "/account", label: "마이페이지", icon: UserRound },
]

type SidebarProps = {
    activePath: string
    onNavigate: (path: string) => void
}

export function Sidebar({ activePath, onNavigate }: SidebarProps) {
    return (
        <aside className="fixed bottom-0 top-0 left-0 hidden w-64 border-r border-[#ded9cf] bg-[#101a30] p-5 text-slate-400 lg:flex lg:flex-col">
            <div className="flex items-center gap-2.5 px-3 text-white">
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
            <nav className="mt-8 flex-1 space-y-1">
                {navigationItems.map((item) => {
                    const Icon = item.icon
                    const active = activePath === item.path
                    return (
                        <button
                            key={item.path}
                            type="button"
                            onClick={() => onNavigate(item.path)}
                            aria-current={active ? "page" : undefined}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                                active
                                    ? "bg-white/10 text-white"
                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                            }`}
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
                })}
            </nav>
        </aside>
    )
}
