import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { books, formatRupiah } from "../../data/mockData";

function DeleteModal({
  bookTitle,
  onConfirm,
  onCancel,
}: {
  bookTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-[#F59E0B]" />
        </div>
        <h3 className="text-base font-semibold text-[#1F2937] text-center mb-1">Hapus produk ini?</h3>
        <p className="text-sm text-[#6B7280] text-center mb-5">
          Produk{" "}
          <span className="font-semibold text-[#1F2937]">'{bookTitle}'</span>{" "}
          akan dihapus secara permanen dari sistem dan tidak akan ditampilkan kepada pelanggan.
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
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const perPage = 5;

  const filtered = books
    .filter((b) => !deletedIds.includes(b.id))
    .filter((b) => {
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Semua" || b.category === category;
      return matchSearch && matchCat;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeletedIds((prev) => [...prev, deleteTarget.id]);
    setDeleteTarget(null);
    setToast("Produk berhasil dihapus");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#10B981] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {toast}
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
          <p className="text-sm text-[#6B7280] mt-0.5">{filtered.length} produk ditemukan</p>
        </div>
        <Link
          to="/admin/products/add"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#F59E0B] text-white rounded-lg text-sm font-semibold hover:bg-[#D97706] transition-colors"
        >
          <Plus size={16} />
          Tambah Produk
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari produk..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
        >
          {["Semua", "Fiksi", "Non-Fiksi", "Edukasi", "Komik", "Biografi"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
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
              {paginated.map((book, idx) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{(page - 1) * perPage + idx + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded-md"
                    />
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
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${book.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {book.inStock ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/edit/${book.id}`}
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-[#1E3A5F] text-[#1E3A5F] rounded-lg text-xs font-medium hover:bg-[#1E3A5F] hover:text-white transition-colors"
                      >
                        <Edit2 size={12} />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ id: book.id, title: book.title })}
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-red-400 text-red-500 rounded-lg text-xs font-medium hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 size={12} />
                        Hapus
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
          <p className="text-sm text-[#6B7280]">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-lg text-[#1F2937] hover:border-[#1E3A5F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === p
                    ? "bg-[#1E3A5F] text-white"
                    : "border border-gray-200 text-[#1F2937] hover:border-[#1E3A5F]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-gray-200 rounded-lg text-[#1F2937] hover:border-[#1E3A5F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
