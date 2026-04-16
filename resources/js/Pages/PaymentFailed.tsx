import { Link, useNavigate } from "react-router";
import { XCircle, RefreshCw, Home } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            {/* Failed Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle size={44} className="text-[#EF4444]" />
            </div>

            <h1 className="text-2xl font-semibold text-[#1F2937] mb-2">
              Pembayaran Gagal atau Kedaluwarsa
            </h1>
            <p className="text-sm text-[#6B7280] mb-8">
              Silakan coba lagi dengan metode pembayaran lain atau periksa koneksi internet Anda.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/payment")}
                className="w-full py-3 bg-[#1E3A5F] text-white rounded-xl text-sm font-semibold hover:bg-[#16304f] transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Coba Lagi
              </button>
              <Link
                to="/"
                className="w-full py-3 border-2 border-gray-200 text-[#1F2937] rounded-xl text-sm font-semibold hover:border-[#1E3A5F] transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
