import { Link } from "@inertiajs/react";
import { BookOpen } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#1E3A5F] text-white mt-auto">
            <div className="max-w-[1280px] mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* logo footer */}
                    <Link href="/" className="flex items-center flex-shrink-0">
                        <img
                            src="/logo.svg"
                            alt="Toko Buku"
                            className="h-9 w-auto"
                        />
                    </Link>

                    <nav className="flex items-center gap-6 text-sm text-white/70">
                        <Link
                            href="#"
                            className="hover:text-[#F59E0B] transition-colors"
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-[#F59E0B] transition-colors"
                        >
                            Kebijakan Privasi
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-[#F59E0B] transition-colors"
                        >
                            Kontak
                        </Link>
                    </nav>
                    <p className="text-sm text-white/50">
                        © 2026 Toko Buku. Semua hak dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    );
}
