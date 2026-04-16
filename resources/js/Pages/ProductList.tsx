import { useState, useMemo } from "react";
import { Link } from "react-router";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { StarRating } from "../components/StarRating";
import { useApp } from "../context/AppContext";
import { books, categories, formatRupiah, Book } from "../data/mockData";

function ProductCard({ book }: { book: Book }) {
  const { addToCart } = useApp();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <Link to={`/product/${book.id}`} className="block relative">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {!book.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Stok Habis
            </span>
          </div>
        )}
        {book.originalPrice && (
          <div className="absolute top-2 left-2">
            <span className="bg-[#F59E0B] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              DISKON
            </span>
          </div>
        )}
      </Link>
      <div className="p-3">
        <Link to={`/product/${book.id}`}>
          <h3 className="text-sm font-semibold text-[#1F2937] line-clamp-2 min-h-[2.5rem] hover:text-[#1E3A5F] transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-[#6B7280] mt-0.5">{book.author}</p>
        <div className="mt-1.5">
          <StarRating rating={book.rating} reviewCount={book.reviewCount} size={12} />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-[#1E3A5F]">{formatRupiah(book.price)}</span>
          {book.originalPrice && (
            <span className="text-xs text-[#6B7280] line-through">{formatRupiah(book.originalPrice)}</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={!book.inStock}
          className={`mt-2.5 w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            book.inStock
              ? added
                ? "bg-[#10B981] text-white"
                : "bg-[#F59E0B] hover:bg-[#D97706] text-white"
              : "bg-gray-200 text-[#6B7280] cursor-not-allowed"
          }`}
        >
          <ShoppingCart size={14} />
          {!book.inStock ? "Stok Habis" : added ? "Ditambahkan!" : "Tambah ke Keranjang"}
        </button>
      </div>
    </div>
  );
}

export default function ProductList() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchCategory =
        activeCategory === "Semua" || book.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <Navbar onSearch={setSearchQuery} searchValue={searchQuery} />
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 py-6">
          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(8); }}
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
            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">📚</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[#1F2937] mb-2">Produk tidak ditemukan</h2>
                  <p className="text-sm text-[#6B7280] text-center max-w-xs mb-5">
                    Coba kata kunci lain atau hapus filter yang aktif
                  </p>
                  <button
                    onClick={() => { setActiveCategory("Semua"); setSearchQuery(""); setVisibleCount(8); }}
                    className="px-5 py-2.5 bg-[#1E3A5F] text-white rounded-lg text-sm font-semibold hover:bg-[#16304f] transition-colors"
                  >
                    Lihat Semua Produk
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-[#6B7280]">
                      Menampilkan <span className="font-semibold text-[#1F2937]">{filtered.length}</span> produk
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {visible.map((book) => (
                      <ProductCard key={book.id} book={book} />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={() => setVisibleCount((c) => c + 8)}
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
