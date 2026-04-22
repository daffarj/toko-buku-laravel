import React from "react";
import { useState, ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    BookOpen,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Menu,
    ChevronRight,
} from "lucide-react";

interface NavItem {
    path: string;
    label: string;
    icon: React.ElementType;
    ready: boolean;
}

const navItems: NavItem[] = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/products", label: "Kelola Produk", icon: BookOpen },
    { path: "/admin/orders", label: "Pesanan", icon: ShoppingBag },
    { path: "/admin/users", label: "Pengguna", icon: Users },
    { path: "/admin/settings", label: "Pengaturan", icon: Settings },
];

interface Props {
    children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === "/admin") return url === "/admin";
        return url.startsWith(path);
    };

    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-60 bg-[#1E3A5F] z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto flex flex-col ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="px-4 py-5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                            <BookOpen size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">
                                Toko Buku
                            </p>
                            <p className="text-white/50 text-xs">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-2 space-y-1">
                    {navItems.map((item) =>
                        item.ready ? (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                                    isActive(item.path)
                                        ? "bg-white/10 text-white"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {isActive(item.path) && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#F59E0B] rounded-r" />
                                )}
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        ) : (
                            <div
                                key={item.path}
                                title="Segera hadir"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/25 cursor-not-allowed relative"
                            >
                                <item.icon size={18} />
                                {item.label}
                                <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40">
                                    Soon
                                </span>
                            </div>
                        ),
                    )}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors w-full"
                    >
                        <LogOut size={16} />
                        Keluar Admin
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-[#6B7280] hover:text-[#1F2937]"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:flex items-center gap-1 text-xs text-[#6B7280]">
                            <Link href="/" className="hover:text-[#1E3A5F]">
                                Beranda
                            </Link>
                            <ChevronRight size={12} />
                            <span className="text-[#1F2937] font-medium">
                                Admin
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-[#1F2937]">
                                {auth?.user?.name ?? "Admin"}
                            </p>
                            <p className="text-xs text-[#6B7280]">
                                Administrator
                            </p>
                        </div>
                        <div className="w-9 h-9 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {(auth?.user?.name ?? "A").charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
