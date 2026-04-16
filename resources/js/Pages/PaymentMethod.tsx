import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, ShieldCheck, CreditCard, Smartphone, Building2 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CheckoutSteps } from "../components/CheckoutSteps";
import { useApp } from "../context/AppContext";
import { formatRupiah } from "../data/mockData";

const bankTransferOptions = [
  { id: "BCA", name: "Bank BCA", accountName: "Toko Buku Indonesia", logo: "🏦" },
  { id: "Mandiri", name: "Bank Mandiri", accountName: "Toko Buku Indonesia", logo: "🏛️" },
  { id: "BNI", name: "Bank BNI", accountName: "Toko Buku Indonesia", logo: "🏢" },
  { id: "BRI", name: "Bank BRI", accountName: "Toko Buku Indonesia", logo: "🏗️" },
];

const eWalletOptions = [
  { id: "GoPay", name: "GoPay", logo: "💚" },
  { id: "OVO", name: "OVO", logo: "💜" },
  { id: "DANA", name: "DANA", logo: "💙" },
  { id: "ShopeePay", name: "ShopeePay", logo: "🧡" },
];

export default function PaymentMethod() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, selectedPaymentMethod, setSelectedPaymentMethod } = useApp();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentType, setPaymentType] = useState<"bank" | "ewallet" | "card">("bank");

  const shipping = 15000;
  const tax = Math.round(cartTotal * 0.11);
  const grandTotal = cartTotal + shipping + tax;

  const handleSelect = (id: string, type: "bank" | "ewallet" | "card") => {
    setSelectedPaymentMethod(id);
    setPaymentType(type);
  };

  const handleConfirm = () => {
    navigate("/payment/code");
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 py-6">
          <CheckoutSteps currentStep={3} />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Payment Methods */}
            <div className="lg:w-[60%] space-y-5">
              {/* Bank Transfer */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                  <Building2 size={16} className="text-[#1E3A5F]" />
                  <h3 className="text-sm font-semibold text-[#1F2937]">Transfer Bank</h3>
                </div>
                <div className="p-4 space-y-2">
                  {bankTransferOptions.map((bank) => (
                    <label
                      key={bank.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        selectedPaymentMethod === bank.id && paymentType === "bank"
                          ? "border-[#F59E0B] bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="sr-only"
                        checked={selectedPaymentMethod === bank.id && paymentType === "bank"}
                        onChange={() => handleSelect(bank.id, "bank")}
                      />
                      <span className="text-2xl">{bank.logo}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1F2937]">{bank.name}</p>
                        <p className="text-xs text-[#6B7280]">{bank.accountName}</p>
                      </div>
                      {selectedPaymentMethod === bank.id && paymentType === "bank" && (
                        <CheckCircle2 size={20} className="text-[#F59E0B]" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* E-Wallet */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                  <Smartphone size={16} className="text-[#1E3A5F]" />
                  <h3 className="text-sm font-semibold text-[#1F2937]">E-Wallet</h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-2">
                  {eWalletOptions.map((wallet) => (
                    <label
                      key={wallet.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        selectedPaymentMethod === wallet.id && paymentType === "ewallet"
                          ? "border-[#F59E0B] bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="sr-only"
                        checked={selectedPaymentMethod === wallet.id && paymentType === "ewallet"}
                        onChange={() => handleSelect(wallet.id, "ewallet")}
                      />
                      <span className="text-xl">{wallet.logo}</span>
                      <span className="text-sm font-semibold text-[#1F2937]">{wallet.name}</span>
                      {selectedPaymentMethod === wallet.id && paymentType === "ewallet" && (
                        <CheckCircle2 size={16} className="text-[#F59E0B] ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Credit Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div
                  className={`flex items-center gap-2 px-5 py-3.5 border-b cursor-pointer transition-colors ${
                    paymentType === "card" ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100"
                  }`}
                  onClick={() => handleSelect("Kartu Kredit", "card")}
                >
                  <CreditCard size={16} className="text-[#1E3A5F]" />
                  <h3 className="text-sm font-semibold text-[#1F2937]">Kartu Kredit</h3>
                  {paymentType === "card" && (
                    <CheckCircle2 size={16} className="text-[#F59E0B] ml-auto" />
                  )}
                </div>
                {paymentType === "card" && (
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#6B7280] mb-1">Nomor Kartu</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-[#6B7280] mb-1">Masa Berlaku</label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-[#6B7280] mb-1">CVV</label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                          placeholder="123"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Payment Summary */}
            <div className="lg:w-[40%]">
              <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24">
                <h2 className="font-semibold text-[#1F2937] mb-4">Ringkasan Pembayaran</h2>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.book.id} className="flex gap-3">
                      <img
                        src={item.book.cover}
                        alt={item.book.title}
                        className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#1F2937] line-clamp-2">{item.book.title}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">x{item.quantity}</p>
                        <p className="text-xs font-semibold text-[#1E3A5F] mt-0.5">
                          {formatRupiah(item.book.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="font-medium">{formatRupiah(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Biaya Pengiriman</span>
                    <span className="font-medium">{formatRupiah(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Pajak 11%</span>
                    <span className="font-medium">{formatRupiah(tax)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#1F2937]">Total Pembayaran</span>
                    <span className="font-semibold text-[#1E3A5F] text-lg">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  className="mt-4 w-full py-3 bg-[#1E3A5F] text-white rounded-xl text-sm font-semibold hover:bg-[#16304f] transition-colors"
                >
                  Konfirmasi Pembayaran
                </button>
                <p className="text-xs text-[#6B7280] text-center mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck size={13} className="text-[#10B981]" />
                  Pembayaran aman dan terenkripsi
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
