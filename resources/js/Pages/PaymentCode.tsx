// ─── PaymentCode.tsx ─────────────────────────────────────────
import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { Copy, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Navbar } from "@/Components/Navbar";
import { Footer } from "@/Components/Footer";
import { CheckoutSteps } from "@/Components/CheckoutSteps";

interface Props {
    orderNumber: string;
    order?: {
        payment_method: string;
        payment_code: string;
        grand_total: number;
    } | null;
}

const bankInstructions: Record<string, string[]> = {
    BCA: [
        "Buka aplikasi BCA Mobile atau klik menu m-BCA",
        "Pilih m-Transfer > BCA Virtual Account",
        "Masukkan nomor Virtual Account di atas",
        "Pastikan detail pembayaran sesuai, lalu konfirmasi",
        "Masukkan PIN BCA Mobile Anda",
        "Simpan bukti pembayaran",
    ],
    Mandiri: [
        "Buka aplikasi Livin' by Mandiri",
        "Pilih Pembayaran > Multi Payment",
        "Masukkan kode perusahaan dan nomor Virtual Account",
        "Konfirmasi detail pembayaran",
        "Masukkan MPIN dan konfirmasi",
    ],
    BNI: [
        "Buka aplikasi BNI Mobile Banking",
        "Pilih Transfer > Virtual Account Billing",
        "Masukkan nomor Virtual Account",
        "Ikuti instruksi untuk menyelesaikan pembayaran",
    ],
    BRI: [
        "Buka BRImo atau ATM BRI",
        "Pilih Transaksi Lain > Pembayaran > BRIVA",
        "Masukkan nomor Virtual Account",
        "Konfirmasi dan bayar",
    ],
    GoPay: [
        "Buka aplikasi Gojek",
        "Pilih GoPay > Bayar",
        "Scan QR code atau masukkan kode pembayaran",
        "Konfirmasi pembayaran",
    ],
    OVO: [
        "Buka aplikasi OVO",
        "Pilih Transfer atau Bayar",
        "Masukkan kode pembayaran OVO",
        "Konfirmasi dengan PIN OVO",
    ],
    DANA: [
        "Buka aplikasi DANA",
        "Pilih Scan QR atau Bayar",
        "Masukkan kode pembayaran",
        "Konfirmasi pembayaran",
    ],
    ShopeePay: [
        "Buka aplikasi Shopee",
        "Pilih ShopeePay di bagian atas",
        "Scan QR atau masukkan kode pembayaran",
        "Konfirmasi pembayaran",
    ],
};

const bankLogo: Record<string, string> = {
    BCA: "/banks/bca.svg",
    Mandiri: "/banks/mandiri.svg",
    BNI: "/banks/bni.svg",
    BRI: "/banks/bri.svg",
};
const methodEmoji: Record<string, string> = {
    GoPay: "💚",
    OVO: "💜",
    DANA: "💙",
    ShopeePay: "🧡",
};

function formatRupiah(n: number) {
    return "Rp " + n.toLocaleString("id-ID");
}

export default function PaymentCode({ orderNumber, order }: Props) {
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(23 * 3600 + 59 * 60);
    const [checkingPayment, setCheckingPayment] = useState(false);

    const paymentMethod = order?.payment_method || "BCA";
    const paymentCode = order?.payment_code || "8277 0000 1234 5678";
    const grandTotal = order?.grand_total || 0;
    const instructions =
        bankInstructions[paymentMethod] || bankInstructions.BCA;

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 0) {
                    clearInterval(timer);
                    router.visit("/payment/failed");
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Polling: cek status order setiap 5 detik
    useEffect(() => {
        const poll = setInterval(async () => {
            try {
                const encoded = encodeURIComponent(orderNumber);
                const res = await fetch(`/payment/status?order=${encoded}`);
                const json = await res.json();
                if (json.status === "Diproses" || json.status === "Selesai") {
                    clearInterval(poll);
                    router.visit("/payment/success");
                }
            } catch (_) {
                // Ignore network error, lanjut polling
            }
        }, 5000);
        return () => clearInterval(poll);
    }, [orderNumber]);

    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600),
            m = Math.floor((secs % 3600) / 60),
            s = secs % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentCode.replace(/\s/g, ""));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
            <Navbar />
            <main className="flex-1">
                <div className="max-w-[1280px] mx-auto px-4 py-6">
                    <CheckoutSteps currentStep={3} />
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
                            <div className="text-center mb-6">
                                <div className="w-20 h-14 flex items-center justify-center mx-auto mb-3">
                                    {bankLogo[paymentMethod] ? (
                                        <img
                                            src={bankLogo[paymentMethod]}
                                            alt={paymentMethod}
                                            className="h-12 w-auto object-contain rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl">
                                            {methodEmoji[paymentMethod] || "🏦"}
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-[#1F2937]">
                                    {paymentMethod}
                                </h2>
                                <p className="text-sm text-[#6B7280] mt-0.5">
                                    Virtual Account
                                </p>
                            </div>
                            <div className="bg-[#F8F7F4] rounded-xl p-4 flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-xs text-[#6B7280] mb-1">
                                        Nomor Virtual Account
                                    </p>
                                    <p className="text-xl font-mono font-semibold text-[#1F2937] tracking-widest">
                                        {paymentCode}
                                    </p>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${copied ? "bg-[#10B981] text-white" : "bg-[#1E3A5F] text-white hover:bg-[#16304f]"}`}
                                >
                                    {copied ? (
                                        <CheckCircle2 size={14} />
                                    ) : (
                                        <Copy size={14} />
                                    )}
                                    {copied ? "Disalin!" : "Salin"}
                                </button>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                                <p className="text-xs text-[#6B7280] mb-1">
                                    Total Pembayaran (transfer tepat)
                                </p>
                                <p className="text-2xl font-semibold text-[#1E3A5F]">
                                    {formatRupiah(grandTotal)}
                                </p>
                                <p className="text-xs text-[#6B7280] mt-1">
                                    Order:{" "}
                                    <span className="font-mono font-semibold text-[#F59E0B]">
                                        {orderNumber}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-red-500 mb-5">
                                <Clock size={16} />
                                <span className="text-sm font-medium">
                                    Selesaikan dalam{" "}
                                    <span className="font-mono font-semibold text-base">
                                        {formatTime(timeLeft)}
                                    </span>
                                </span>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                                    Cara Pembayaran:
                                </h3>
                                <ol className="space-y-2">
                                    {instructions.map((step, i) => (
                                        <li
                                            key={i}
                                            className="flex gap-3 text-sm"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                                                {i + 1}
                                            </span>
                                            <span className="text-[#1F2937]">
                                                {step}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-2 text-[#6B7280] bg-gray-50 rounded-xl p-3">
                                <Loader2
                                    size={16}
                                    className="animate-spin text-[#F59E0B]"
                                />
                                <span className="text-sm">
                                    Menunggu Pembayaran...
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
