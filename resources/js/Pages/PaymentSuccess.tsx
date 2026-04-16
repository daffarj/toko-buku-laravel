import { Link } from "react-router";
import { CheckCircle2, Package, Home } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CheckoutSteps } from "../components/CheckoutSteps";
import { formatRupiah } from "../data/mockData";

export default function PaymentSuccess() {
  const transactionId = "TXN-20260414-8392";
  const timestamp = "14 April 2026, 14:32:05";

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 py-6">
          <CheckoutSteps currentStep={4} />

          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={44} className="text-[#10B981]" />
              </div>

              <h1 className="text-2xl font-semibold text-[#1F2937] mb-2">Pembayaran Berhasil!</h1>
              <p className="text-sm text-[#6B7280] mb-6">
                Terima kasih atas pesananmu. Pesananmu sedang diproses.
              </p>

              {/* Transaction Info */}
              <div className="bg-[#F8F7F4] rounded-xl p-4 text-left mb-5 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">ID Transaksi</span>
                  <span className="font-mono font-semibold text-[#1F2937]">{transactionId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Waktu Pembayaran</span>
                  <span className="font-medium text-[#1F2937]">{timestamp}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Nomor Pesanan</span>
                  <span className="font-semibold text-[#1E3A5F]">#TK-20260001</span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Ringkasan Pesanan</p>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#1F2937]">Laskar Pelangi × 2</span>
                    <span className="font-medium">{formatRupiah(170000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1F2937]">Atomic Habits × 1</span>
                    <span className="font-medium">{formatRupiah(120000)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
                    <span className="text-[#1F2937]">Total</span>
                    <span className="text-[#1E3A5F]">{formatRupiah(336350)}</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  to="/order-confirmation"
                  className="w-full py-3 bg-[#1E3A5F] text-white rounded-xl text-sm font-semibold hover:bg-[#16304f] transition-colors flex items-center justify-center gap-2"
                >
                  <Package size={16} />
                  Lacak Pesanan
                </Link>
                <Link
                  to="/"
                  className="w-full py-3 border-2 border-[#1E3A5F] text-[#1E3A5F] rounded-xl text-sm font-semibold hover:bg-[#1E3A5F] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Home size={16} />
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
