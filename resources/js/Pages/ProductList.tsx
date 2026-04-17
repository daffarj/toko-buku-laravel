import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { Navbar } from "@/Components/Navbar";
import { Footer } from "@/Components/Footer";
import { StarRating } from "@/Components/StarRating";

// ─── Types ────────────────────────────────────────────────────
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
}

interface PaginatedBooks {
  data: Book[];
  current_page: number;
  last_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface Props {
  books: PaginatedBooks;
  categories: string[];
  filters: {
    category?: string;
    search?: string;
  };
}

// ─── Helper ───────────────────────────────────────────────────
function formatRupiah(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}

// ─── ProductCard ──────────────────────────────────────────────
function ProductCard({ book }: { book: Book }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setLoading(true);
    router.post(
      "/cart/add",
      { book_id: book.id, quantity: 1 },
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

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <Link href={`/product/${book.id}`} className="block relative">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {!book.in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Stok Habis
            </span>
          </div>
        )}
        {book.original_price && (
          <div className="absolute top-2 left-2">
            <span className="bg-[#F59E0B] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              DISKON
            </span>
          </div>
        )}
      </Link>
      <div className="p-3">
        <Link href={`/product/${book.id}`}>
          <h3 className="text-sm font-semibold text-[#1F2937] line-clamp-2 min-h-[2.5rem] hover:text-[#1E3A5F] transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-[#6B7280] mt-0.5">{book.author}</p>
        <div className="mt-1.5">
          <StarRating rating={book.rating} reviewCount={book.review_count} size={12} />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-[#1E3A5F]">{formatRupiah(book.price)}</span>
          {book.original_price && (
            <span className="text-xs text-[#6B7280] line-through">{formatRupiah(book.original_price)}</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={!book.in_stock || loading}
          className={`mt-2.5 w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            book.in_stock
              ? added
                ? "bg-[#10B981] text-white"
                : "bg-[#F59E0B] hover:bg-[#D97706] text-white"
              : "bg-gray-200 text-[#6B7280] cursor-not-allowed"
          }`}
        >
          <ShoppingCart size={14} />
          {!book.in_stock ? "Stok Habis" : added ? "Ditambahkan!" : "Tambah ke Keranjang"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function ProductList({ books, categories, filters }: Props) {
  const [activeCategory, setActiveCategory] = useState(filters.category || "Semua");
  const [searchQuery, setSearchQuery] = useState(filters.search || "");

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    router.get(
      "/",
      { category: cat === "Semua" ? "" : cat, search: searchQuery },
      { preserveState: true, replace: true }
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    router.get(
      "/",
      { category: activeCategory === "Semua" ? "" : activeCategory, search: query },
      { preserveState: true, replace: true }
    );
  };

  const handleLoadMore = () => {
    if (books.next_page_url) {
      router.get(
        books.next_page_url,
        {},
        { preserveState: true, preserveScroll: true }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <Navbar onSearch={handleSearch} searchValue={searchQuery} />
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 py-6">
          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-[#1E3A5F] text-white"
                    : "bg-white text-[#1F2937] border border-gray-200 hover:border-[#1E3A5F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              {books.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">📚</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[#1F2937] mb-2">Produk tidak ditemukan</h2>
                  <p className="text-sm text-[#6B7280] text-center max-w-xs mb-5">
                    Coba kata kunci lain atau hapus filter yang aktif
                  </p>
                  <button
                    onClick={() => handleCategoryChange("Semua")}
                    className="px-5 py-2.5 bg-[#1E3A5F] text-white rounded-lg text-sm font-semibold hover:bg-[#16304f] transition-colors"
                  >
                    Lihat Semua Produk
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-[#6B7280]">
                      Menampilkan <span className="font-semibold text-[#1F2937]">{books.total}</span> produk
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {books.data.map((book) => (
                      <ProductCard key={book.id} book={book} />
                    ))}
                  </div>
                  {books.next_page_url && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={handleLoadMore}
                        className="px-8 py-2.5 border-2 border-[#1E3A5F] text-[#1E3A5F] rounded-lg text-sm font-semibold hover:bg-[#1E3A5F] hover:text-white transition-colors flex items-center gap-2"
                      >
                        <ChevronDown size={16} />
                        Muat Lebih Banyak
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
