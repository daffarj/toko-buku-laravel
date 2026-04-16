import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Upload, X, ArrowLeft } from "lucide-react";
import { books } from "../../data/mockData";

interface Errors {
  [key: string]: string;
}

function Field({ label, required, error, children }: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1F2937] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputClass = (error?: string) =>
  `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
    error
      ? "border-red-400 focus:ring-red-200"
      : "border-gray-200 focus:ring-[#F59E0B]"
  }`;

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const book = books.find((b) => b.id === id) || books[0];

  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    description: book.synopsis,
    category: book.category,
    price: book.price.toString(),
    stock: book.stock.toString(),
    isbn: book.isbn,
    publisher: book.publisher,
    year: book.year.toString(),
    status: book.inStock,
    coverPreview: book.cover as string | null,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: string, value: string | boolean | null) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.title.trim()) e.title = "Judul buku wajib diisi";
    if (!form.author.trim()) e.author = "Penulis wajib diisi";
    if (!form.category) e.category = "Kategori wajib dipilih";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Harga harus berupa angka positif";
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Stok harus berupa angka";
    if (!form.publisher.trim()) e.publisher = "Penerbit wajib diisi";
    if (!form.year || isNaN(Number(form.year)))
      e.year = "Tahun terbit harus berupa angka";
    return e;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("coverPreview", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("coverPreview", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    setToast("Produk berhasil diperbarui");
    setTimeout(() => navigate("/admin/products"), 1500);
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#10B981] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {toast}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/products")}
          className="p-2 border border-gray-200 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:border-gray-300 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Edit Produk: {book.title}</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Perbarui informasi produk di bawah</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Judul Buku" required error={errors.title}>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className={inputClass(errors.title)}
              />
            </Field>
            <Field label="Penulis" required error={errors.author}>
              <input
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                className={inputClass(errors.author)}
              />
            </Field>
          </div>

          <Field label="Deskripsi">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              className={inputClass() + " resize-none"}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Kategori" required error={errors.category}>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputClass(errors.category)}
              >
                {["Fiksi", "Non-Fiksi", "Edukasi", "Komik", "Biografi"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Harga (Rp)" required error={errors.price}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6B7280]">Rp</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className={inputClass(errors.price) + " pl-9"}
                  min={0}
                />
              </div>
            </Field>
            <Field label="Stok" required error={errors.stock}>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                className={inputClass(errors.stock)}
                min={0}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="ISBN">
              <input value={form.isbn} onChange={(e) => set("isbn", e.target.value)} className={inputClass()} />
            </Field>
            <Field label="Penerbit" required error={errors.publisher}>
              <input value={form.publisher} onChange={(e) => set("publisher", e.target.value)} className={inputClass(errors.publisher)} />
            </Field>
            <Field label="Tahun Terbit" required error={errors.year}>
              <input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} className={inputClass(errors.year)} />
            </Field>
          </div>

          {/* Upload */}
          <Field label="Foto Produk">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#F59E0B] hover:bg-amber-50 transition-colors"
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {form.coverPreview ? (
                <div className="flex items-center justify-center gap-4">
                  <img src={form.coverPreview} alt="Preview" className="w-20 h-28 object-cover rounded-lg shadow-sm" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#1F2937]">Foto produk saat ini</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Klik untuk ganti foto</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); set("coverPreview", null); }} className="mt-2 flex items-center gap-1 text-xs text-red-500">
                      <X size={12} /> Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={20} className="text-[#6B7280] mx-auto mb-2" />
                  <p className="text-sm text-[#6B7280]">Drag & drop atau klik untuk pilih foto</p>
                </>
              )}
            </div>
          </Field>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-[#1F2937]">Status Produk</p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {form.status ? "Aktif — ditampilkan ke pelanggan" : "Nonaktif — disembunyikan"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("status", !form.status)}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.status ? "bg-[#10B981]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.status ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-6 py-2.5 bg-[#1E3A5F] text-white rounded-lg text-sm font-semibold hover:bg-[#16304f] transition-colors">
              Simpan Perubahan
            </button>
            <button type="button" onClick={() => navigate("/admin/products")} className="px-6 py-2.5 border border-gray-300 text-[#1F2937] rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
