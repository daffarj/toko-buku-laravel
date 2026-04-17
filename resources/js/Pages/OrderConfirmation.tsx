import { Link } from "@inertiajs/react";
import { CheckCircle2, MapPin, CreditCard, Package } from "lucide-react";
import { Navbar } from "@/Components/Navbar";
import { Footer } from "@/Components/Footer";
import { CheckoutSteps } from "@/Components/CheckoutSteps";

interface OrderItem {
  book_title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Props {
  orderNumber: string;
  order?: {
    shipping_address: string;
    payment_method: string;
    payment_type: string;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    grand_total: number;
    items: OrderItem[];
  } | null;
}

function formatRupiah(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

export default function OrderConfirmation({ orderNumber, order }: Props) {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 py-6">
          <CheckoutSteps currentStep={4} />
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-[#1E3A5F] px-6 py-8 text-center text-white">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={36} className="text-[#10B981]" />
                </div>
                <h1 className="text-xl font-semibold mb-1">Pesanan Berhasil Dibuat!</h1>
                <p className="text-sm text-white/70">Order ID: <span className="font-mono font-semibold text-[#F59E0B]">{orderNumber}</span></p>
              </div>

              <div className="p-6 space-y-5">
                {/* Items */}
                {order && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#1F2937] mb-3">Pesanan</h3>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-[#1F2937]">{item.book_title} <span className="text-[#6B7280]">×{item.quantity}</span></span>
                          <span className="font-medium">{formatRupiah(item.subtotal)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-100 pt-2 space-y-1.5">
                        <div className="flex justify-between text-sm text-[#6B7280]"><span>Biaya Pengiriman</span><span>{formatRupiah(order.shipping_cost)}</span></div>
                        <div className="flex justify-between text-sm text-[#6B7280]"><span>Pajak 11%</span><span>{formatRupiah(order.tax)}</span></div>
                        <div className="flex justify-between text-sm font-semibold text-[#1E3A5F] border-t border-gray-100 pt-2"><span>Total</span><span>{formatRupiah(order.grand_total)}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping address */}
                {order?.shipping_address && (
                  <div className="bg-[#F8F7F4] rounded-xl p-4">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-[#1E3A5F] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-[#6B7280] mb-1">Alamat Pengiriman</p>
                        <p className="text-sm text-[#1F2937]">{order.shipping_address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment method */}
                {order?.payment_method && (
                  <div className="bg-[#F8F7F4] rounded-xl p-4">
                    <div className="flex items-center gap-2.5">
                      <CreditCard size={16} className="text-[#1E3A5F]" />
                      <div>
                        <p className="text-xs font-semibold text-[#6B7280] mb-0.5">Metode Pembayaran</p>
                        <p className="text-sm font-medium text-[#1F2937]">
                          {order.payment_type === "bank" ? "Transfer Bank" : order.payment_type === "ewallet" ? "E-Wallet" : "Kartu Kredit"} {order.payment_method}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 flex-col">
                  <Link href="/" className="w-full py-3 bg-[#1E3A5F] text-white rounded-xl text-sm font-semibold hover:bg-[#16304f] transition-colors flex items-center justify-center gap-2">
                    <Package size={16} /> Lanjutkan Belanja
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
