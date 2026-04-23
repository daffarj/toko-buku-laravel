import { FormEventHandler, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    BookOpen,
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import InputError from "@/Components/InputError";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    // Password strength indicator
    const getPasswordStrength = (pw: string) => {
        if (!pw) return { level: 0, label: "", color: "" };
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (score <= 1)
            return { level: 1, label: "Lemah", color: "bg-red-400" };
        if (score === 2)
            return { level: 2, label: "Cukup", color: "bg-yellow-400" };
        if (score === 3)
            return { level: 3, label: "Kuat", color: "bg-blue-400" };
        return { level: 4, label: "Sangat kuat", color: "bg-green-400" };
    };

    const strength = getPasswordStrength(data.password);

    return (
        <div className="min-h-screen flex">
            <Head title="Daftar" />

            {/* ── Kiri: Dekorasi ── */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1E3A5F] flex-col items-center justify-center relative overflow-hidden px-12">
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
                <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full border border-white/10" />
                <div className="absolute top-[-40px] right-[-40px] w-72 h-72 rounded-full border border-white/10" />
                <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full border border-[#F59E0B]/20" />

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
                        Bergabung dan nikmati kemudahan belanja buku
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                        Daftar gratis dan dapatkan akses ke ribuan koleksi buku
                        pilihan.
                    </p>

                    {/* Keuntungan daftar */}
                    <div className="mt-10 space-y-3 text-left">
                        {[
                            "Akses ke 10.000+ judul buku",
                            "Harga terbaik dengan diskon eksklusif",
                            "Pengiriman cepat ke seluruh Indonesia",
                            "Riwayat pesanan tersimpan otomatis",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2
                                        size={13}
                                        className="text-[#F59E0B]"
                                    />
                                </div>
                                <span className="text-white/70 text-sm">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Kanan: Form ── */}
            <div className="flex-1 flex items-center justify-center bg-[#F8F9FA] px-6 py-12 overflow-y-auto">
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
                        Buat akun baru
                    </h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Isi data di bawah untuk mendaftar
                    </p>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Nama */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <User
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    autoComplete="name"
                                    autoFocus
                                    placeholder="Nama lengkap kamu"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition"
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.name}
                                className="mt-1.5"
                            />
                        </div>

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
                                    placeholder="nama@email.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition"
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.email}
                                className="mt-1.5"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Password
                            </label>
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
                                    autoComplete="new-password"
                                    placeholder="Minimal 8 karakter"
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition"
                                    required
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

                            {/* Password strength */}
                            {data.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all ${
                                                    i <= strength.level
                                                        ? strength.color
                                                        : "bg-gray-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Kekuatan:{" "}
                                        <span className="font-medium">
                                            {strength.label}
                                        </span>
                                    </span>
                                </div>
                            )}
                            <InputError
                                message={errors.password}
                                className="mt-1.5"
                            />
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    id="password_confirmation"
                                    type={showConfirm ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    autoComplete="new-password"
                                    placeholder="Ulangi password"
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showConfirm ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {/* Match indicator */}
                            {data.password_confirmation && (
                                <p
                                    className={`mt-1.5 text-xs ${
                                        data.password ===
                                        data.password_confirmation
                                            ? "text-green-600"
                                            : "text-red-500"
                                    }`}
                                >
                                    {data.password ===
                                    data.password_confirmation
                                        ? "✓ Password cocok"
                                        : "✗ Password tidak cocok"}
                                </p>
                            )}
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-1.5"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 bg-[#1E3A5F] hover:bg-[#162d4a] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {processing ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Buat Akun
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
                        Sudah punya akun?{" "}
                        <Link
                            href={route("login")}
                            className="font-semibold text-[#1E3A5F] hover:text-[#F59E0B] transition-colors"
                        >
                            Masuk di sini
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
