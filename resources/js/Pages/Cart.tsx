import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CheckoutSteps } from "../components/CheckoutSteps";
import { useApp } from "../context/AppContext";
import { formatRupiah } from "../data/mockData";

function DeleteConfirmModal({
  itemTitle,
  onConfirm,
  onCancel,
}: {
  itemTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-[#F59E0B]" />
        </div>
        <h3 className="text-base font-semibold text-[#1F2937] text-center mb-1">Hapus dari keranjang?</h3>
        <p className="text-sm text-[#6B7280] text-center mb-5">
          <span className="font-medium text-[#1F2937]">"{itemTitle}"</span> akan dihapus dari keranjang belanja.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-[#1F2937] hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useApp();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const shipping = cartItems.length > 0 ? 15000 : 0;
  const tax = Math.round(cartTotal * 0.11);
  const grandTotal = cartTotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <div className="w-28 h-28 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={48} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-2">Keranjang belanja kamu masih kosong</h2>
            <p className="text-sm text-[#6B7280] mb-6">Temukan buku favoritmu dan mulai berbelanja!</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F59E0B] text-white rounded-xl text-sm font-semibold hover:bg-[#D97706] transition-colors"
            >
              <ShoppingBag size={16} />
              Mulai Belanja
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <Navbar />
      {deleteTarget && (
        <DeleteConfirmModal
          itemTitle={deleteTarget.title}
          onConfirm={() => {
            removeFromCart(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 py-6">
          <CheckoutSteps currentStep={1} />

          <h1 className="text-2xl font-semibold text-[#1F2937] mb-6">
            Keranjang Belanja{" "}
            <span className="text-[#6B7280] font-normal text-lg">({cartItems.length} item)</span>
          </h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="lg:w-[65%] space-y-3">
              {cartItems.map((item) => (
                <div key={item.book.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                  <Link to={`/product/${item.book.id}`}>
                    <img
                      src={item.book.cover}
                      alt={item.book.title}
                      className="w-[60px] h-[80px] object-cover rounded-lg flex-shrink-0"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <Link to={`/product/${item.book.id}`}>
                          <h3 className="text-sm font-semibold text-[#1F2937] line-clamp-2 hover:text-[#1E3A5F]">
                            {item.book.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-[#6B7280] mt-0.5">{item.book.author}</p>
                      </div>
                      <button
                        onClick={() => setDeleteTarget({ id: item.book.id, title: item.book.title })}
                        className="text-[#6B7280] hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                          className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#6B7280]">{formatRupiah(item.book.price)} × {item.quantity}</p>
                        <p className="text-sm font-semibold text-[#1E3A5F]">
                          {formatRupiah(item.book.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-[35%]">
              <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24">
                <h2 className="font-semibold text-[#1F2937] mb-4">Ringkasan Pesanan</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Subtotal ({cartItems.length} item)</span>
                    <span className="text-[#1F2937] font-medium">{formatRupiah(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Biaya Pengiriman</span>
                    <span className="text-[#1F2937] font-medium">{formatRupiah(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Pajak 11%</span>
                    <span className="text-[#1F2937] font-medium">{formatRupiah(tax)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 mt-4 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#1F2937]">Total Pembayaran</span>
                    <span className="font-semibold text-[#1E3A5F] text-lg">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/payment")}
                  className="mt-4 w-full py-3 bg-[#1E3A5F] text-white rounded-xl text-sm font-semibold hover:bg-[#16304f] transition-colors flex items-center justify-center gap-2"
                >
                  Lanjut ke Pembayaran
                  <ArrowRight size={16} />
                </button>
                <p className="text-xs text-[#6B7280] text-center mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck size={13} className="text-[#10B981]" />
                  Harga sudah termasuk semua biaya
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
