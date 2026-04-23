import { FormEventHandler, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import InputError from "@/Components/InputError";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Masuk" />

            {/* ── Kiri: Dekorasi ── */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1E3A5F] flex-col items-center justify-center relative overflow-hidden px-12">
                {/* Pattern background */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            45deg,
                            #F59E0B 0px,
                            #F59E0B 1px,
                            transparent 1px,
                            transparent 40px
                        )`,
                    }}
                />
                {/* Lingkaran dekoratif */}
                <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full border border-white/10" />
                <div className="absolute top-[-40px] right-[-40px] w-72 h-72 rounded-full border border-white/10" />
                <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full border border-[#F59E0B]/20" />

                {/* Konten */}
                <div className="relative z-10 text-center max-w-sm">
                    {/* Logo */}
                    <Link href="/" className="flex justify-center mb-10">
                        <img
                            src="/logo.svg"
                            alt="Toko Buku"
                            className="h-12 w-auto"
                        />
                    </Link>

                    <h2 className="text-white text-3xl font-bold leading-snug mb-4">
                        Temukan buku favoritmu di sini
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Ribuan judul buku tersedia dengan harga terbaik. Masuk
                        dan mulai belanja sekarang.
                    </p>

                    {/* Stats */}
                    <div className="mt-10 grid grid-cols-3 gap-4">
                        {[
                            { label: "Judul Buku", value: "10.000+" },
                            { label: "Kategori", value: "50+" },
                            { label: "Pembeli", value: "25.000+" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white/10 rounded-xl p-3 border border-white/10"
                            >
                                <div className="text-[#F59E0B] font-bold text-lg">
                                    {stat.value}
                                </div>
                                <div className="text-white/50 text-xs mt-0.5">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Kanan: Form ── */}
            <div className="flex-1 flex items-center justify-center bg-[#F8F9FA] px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Logo mobile */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 bg-[#1E3A5F] rounded-lg flex items-center justify-center">
                            <BookOpen size={18} className="text-[#F59E0B]" />
                        </div>
                        <span className="text-[#1E3A5F] font-bold text-lg">
                            Toko Buku
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-[#1E3A5F] mb-1">
                        Selamat datang kembali
                    </h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Masuk ke akunmu untuk melanjutkan belanja
                    </p>

                    {status && (
                        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Alamat Email
                            </label>
                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="nama@email.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition"
                                />
                            </div>
                            <InputError
                                message={errors.email}
                                className="mt-1.5"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-xs text-[#1E3A5F] hover:text-[#F59E0B] transition-colors"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    autoComplete="current-password"
                                    placeholder="Masukkan password"
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            <InputError
                                message={errors.password}
                                className="mt-1.5"
                            />
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData(
                                        "remember",
                                        e.target.checked as false,
                                    )
                                }
                                className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F] cursor-pointer"
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm text-gray-600 cursor-pointer"
                            >
                                Ingat saya
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 bg-[#1E3A5F] hover:bg-[#162d4a] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Masuk
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">atau</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Belum punya akun?{" "}
                        <Link
                            href={route("register")}
                            className="font-semibold text-[#1E3A5F] hover:text-[#F59E0B] transition-colors"
                        >
                            Daftar sekarang
                        </Link>
                    </p>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ← Kembali ke beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
