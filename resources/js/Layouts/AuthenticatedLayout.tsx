import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-[#1E3A5F] shadow-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <Link
                                href="/"
                                className="flex items-center flex-shrink-0"
                            >
                                <img
                                    src="/logo.svg"
                                    alt="Toko Buku"
                                    className="h-9 w-auto"
                                />
                            </Link>

                            {/* Nav links desktop */}
                            <div className="hidden sm:flex items-center gap-1">
                                <Link
                                    href={route("home")}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        route().current("home")
                                            ? "bg-white/20 text-white"
                                            : "text-white/70 hover:text-white hover:bg-white/10"
                                    }`}
                                >
                                    Beranda
                                </Link>
                            </div>
                        </div>

                        {/* User dropdown desktop */}
                        <div className="hidden sm:flex items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                                        <div className="w-7 h-7 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#1E3A5F] font-bold text-xs">
                                            {user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() ?? "U"}
                                        </div>
                                        <span>{user?.name ?? "User"}</span>
                                        <svg
                                            className="w-4 h-4 opacity-60"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Hamburger mobile */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (prev) => !prev,
                                    )
                                }
                                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                            >
                                {showingNavigationDropdown ? (
                                    <X size={22} />
                                ) : (
                                    <Menu size={22} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden border-t border-white/10 bg-[#162d4a]">
                        <div className="px-4 pt-3 pb-2 space-y-1">
                            <Link
                                href={route("home")}
                                className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition"
                            >
                                Beranda
                            </Link>
                        </div>
                        <div className="border-t border-white/10 px-4 py-3">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#1E3A5F] font-bold text-sm">
                                    {user?.name?.charAt(0)?.toUpperCase() ??
                                        "U"}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">
                                        {user?.name}
                                    </div>
                                    <div className="text-xs text-white/50">
                                        {user?.email}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Link
                                    href={route("profile.edit")}
                                    className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="block w-full text-left px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
