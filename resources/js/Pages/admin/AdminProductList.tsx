import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  stock: number;
  in_stock: boolean;
  cover: string;
  deleted_at: string | null;
}

interface PaginatedBooks {
  data: Book[];
  current_page: number;
  last_page: number;
  total: number;
  prev_page_url: string | null;
  next_page_url: string | null;
}

interface Props {
  books: PaginatedBooks;
  categories: string[];
  filters: { search?: string; category?: string };
}

function formatRupiah(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

function DeleteModal({ bookTitle, onConfirm, onCancel }: { bookTitle: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-[#F59E0B]" />
        </div>
        <h3 className="text-base font-semibold text-[#1F2937] text-center mb-1">Hapus produk ini?</h3>
        <p className="text-sm text-[#6B7280] text-center mb-5">
          Produk <span className="font-semibold text-[#1F2937]">'{bookTitle}'</span> akan dihapus dari sistem.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-[#1F2937] hover:bg-gray-50 transition-colors">Batal</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">Ya, Hapus</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductList({ books, categories, filters }: Props) {
  const { flash } = usePage().props as any;
  const [search, setSearch] = useState(filters.search || "");
  const [category, setCategory] = useState(filters.category || "Semua");
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  const handleSearch = () => {
    router.get("/admin/products", { search, category: category === "Semua" ? "" : category }, { preserveState: true, replace: true });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/products/${deleteTarget.id}`, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="space-y-5">
      {/* Flash message */}
      {flash?.success && (
        <div className="fixed top-6 right-6 z-50 bg-[#10B981] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {flash.success}
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          bookTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Daftar Produk</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">{books.total} produk ditemukan</p>
        </div>
        <Link href="/admin/products/add" className="flex items-center gap-1.5 px-4 py-2 bg-[#F59E0B] text-white rounded-lg text-sm font-semibold hover:bg-[#D97706] transition-colors">
          <Plus size={16} /> Tambah Produk
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Cari produk..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); router.get("/admin/products", { search, category: e.target.value === "Semua" ? "" : e.target.value }, { preserveState: true, replace: true }); }}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
        >
          <option value="Semua">Semua</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button onClick={handleSearch} className="px-4 py-2.5 bg-[#1E3A5F] text-white rounded-lg text-sm font-semibold hover:bg-[#16304f] transition-colors">
          Cari
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase w-10">No</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase">Cover</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase">Judul</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase hidden md:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase hidden sm:table-cell">Harga</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase hidden lg:table-cell">Stok</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {books.data.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-[#6B7280]">Tidak ada produk ditemukan</td></tr>
              ) : books.data.map((book, idx) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{(books.current_page - 1) * 10 + idx + 1}</td>
                  <td className="px-4 py-3">
                    <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-md" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-[#1F2937] max-w-[180px] line-clamp-2">{book.title}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{book.author}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{book.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1F2937] hidden sm:table-cell">{formatRupiah(book.price)}</td>
                  <td className="px-4 py-3 text-sm text-[#1F2937] hidden lg:table-cell">{book.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${book.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {book.in_stock ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/edit/${book.id}`} className="flex items-center gap-1 px-2.5 py-1.5 border border-[#1E3A5F] text-[#1E3A5F] rounded-lg text-xs font-medium hover:bg-[#1E3A5F] hover:text-white transition-colors">
                        <Edit2 size={12} /> Edit
                      </Link>
                      <button onClick={() => setDeleteTarget({ id: book.id, title: book.title })} className="flex items-center gap-1 px-2.5 py-1.5 border border-red-400 text-red-500 rounded-lg text-xs font-medium hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-sm text-[#6B7280]">Halaman {books.current_page} dari {books.last_page}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => books.prev_page_url && router.visit(books.prev_page_url)} disabled={!books.prev_page_url} className="p-2 border border-gray-200 rounded-lg text-[#1F2937] hover:border-[#1E3A5F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: books.last_page }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => router.get("/admin/products", { ...filters, page: p })} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${books.current_page === p ? "bg-[#1E3A5F] text-white" : "border border-gray-200 text-[#1F2937] hover:border-[#1E3A5F]"}`}>{p}</button>
            ))}
            <button onClick={() => books.next_page_url && router.visit(books.next_page_url)} disabled={!books.next_page_url} className="p-2 border border-gray-200 rounded-lg text-[#1F2937] hover:border-[#1E3A5F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
