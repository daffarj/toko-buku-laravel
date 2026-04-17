import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { ShoppingCart, Minus, Plus, ChevronRight, Package } from "lucide-react";
import { Navbar } from "@/Components/Navbar";
import { Footer } from "@/Components/Footer";
import { StarRating } from "@/Components/StarRating";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  cover: string;
  in_stock: boolean;
  stock: number;
  isbn: string;
  publisher: string;
  year: number;
  pages: number;
  language: string;
  description: string;
  synopsis: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

interface Props {
  book: Book;
  related: Book[];
  reviews: Review[];
}

function formatRupiah(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}

export default function ProductDetail({ book, related, reviews }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"deskripsi" | "spesifikasi" | "ulasan">("deskripsi");
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = () => {
    setLoading(true);
    router.post(
      "/cart/add",
      { book_id: book.id, quantity },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        },
        onFinish: () => setLoading(false),
      }
    );
  };

  const handleBuyNow = () => {
    router.post(
      "/cart/add",
      { book_id: book.id, quantity },
      {
        onSuccess: () => router.visit("/cart"),
      }
    );
  };

  const stockStatus = () => {
    if (!book.in_stock) return { label: "Stok Habis", color: "text-red-500 bg-red-50" };
    if (book.stock <= 10) return { label: `Stok Terbatas (${book.stock})`, color: "text-[#F59E0B] bg-amber-50" };
    return { label: "Tersedia", color: "text-[#10B981] bg-green-50" };
  };

  const status = stockStatus();

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-[#6B7280] mb-6">
            <Link href="/" className="hover:text-[#1E3A5F] transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <Link href={`/?category=${book.category}`} className="hover:text-[#1E3A5F] transition-colors">{book.category}</Link>
            <ChevronRight size={14} />
            <span className="text-[#1F2937] font-medium line-clamp-1">{book.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Images */}
            <div className="lg:w-[40%]">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm aspect-[3/4] max-w-sm mx-auto lg:max-w-none">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2 mt-3 justify-center lg:justify-start">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 h-20 rounded-lg overflow-hidden border-2 border-[#1E3A5F] cursor-pointer">
                    <img src={book.cover} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:w-[60%] space-y-4">
              <div>
                <span className="inline-block text-xs font-semibold bg-[#EBF4FF] text-[#1E3A5F] px-2 py-0.5 rounded-full mb-2">
                  {book.category}
                </span>
                <h1 className="text-2xl font-semibold text-[#1F2937]">{book.title}</h1>
                <p className="text-sm text-[#6B7280] mt-1">oleh <span className="text-[#1E3A5F] font-medium">{book.author}</span></p>
              </div>

              <StarRating rating={book.rating} reviewCount={book.review_count} size={16} />

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-[#1E3A5F]">{formatRupiah(book.price)}</span>
                {book.original_price && (
                  <span className="text-base text-[#6B7280] line-through">{formatRupiah(book.original_price)}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Package size={16} className="text-[#6B7280]" />
                <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
              </div>

              {book.in_stock && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#1F2937]">Jumlah:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="px-5 py-2 text-sm font-semibold text-[#1F2937] border-x border-gray-200">{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleAddToCart}
                  disabled={!book.in_stock || loading}
                  className={`flex-1 min-w-[140px] py-3 rounded-xl text-sm font-semibold border-2 flex items-center justify-center gap-2 transition-colors ${
                    book.in_stock
                      ? added ? "border-[#10B981] text-[#10B981]" : "border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={16} />
                  {added ? "Ditambahkan!" : "Tambah ke Keranjang"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!book.in_stock}
                  className={`flex-1 min-w-[140px] py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    book.in_stock ? "bg-[#F59E0B] hover:bg-[#D97706] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Beli Sekarang
                </button>
              </div>

              {/* Tabs */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex gap-0 border-b border-gray-200">
                  {(["deskripsi", "spesifikasi", "ulasan"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                        activeTab === tab ? "border-[#1E3A5F] text-[#1E3A5F]" : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
                      }`}
                    >
                      {tab === "deskripsi" ? "Deskripsi" : tab === "spesifikasi" ? "Spesifikasi" : `Ulasan (${book.review_count})`}
                    </button>
                  ))}
                </div>
                <div className="pt-4">
                  {activeTab === "deskripsi" && <p className="text-sm text-[#1F2937] leading-relaxed">{book.synopsis}</p>}
                  {activeTab === "spesifikasi" && (
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-100">
                        {[["ISBN", book.isbn], ["Penerbit", book.publisher], ["Tahun Terbit", book.year], ["Halaman", `${book.pages} halaman`], ["Bahasa", book.language], ["Kategori", book.category]].map(([label, value]) => (
                          <tr key={String(label)}>
                            <td className="py-2 text-[#6B7280] w-36">{label}</td>
                            <td className="py-2 text-[#1F2937] font-medium">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {activeTab === "ulasan" && (
                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <p className="text-sm text-[#6B7280]">Belum ada ulasan untuk buku ini.</p>
                      ) : reviews.map((r) => (
                        <div key={r.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-[#1F2937]">{r.name}</span>
                            <span className="text-xs text-[#6B7280]">{r.date}</span>
                          </div>
                          <StarRating rating={r.rating} size={12} />
                          <p className="text-sm text-[#1F2937] mt-2">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
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
