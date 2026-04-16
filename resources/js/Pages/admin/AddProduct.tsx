import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Upload, X, ArrowLeft } from "lucide-react";

interface FormData {
  title: string;
  author: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  isbn: string;
  publisher: string;
  year: string;
  status: boolean;
  coverPreview: string | null;
}

const initialForm: FormData = {
  title: "",
  author: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  isbn: "",
  publisher: "",
  year: "",
  status: true,
  coverPreview: null,
};

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

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData, value: string | boolean | null) =>
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
    setToast("Produk berhasil disimpan");
    setTimeout(() => {
      navigate("/admin/products");
    }, 1500);
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
          <h1 className="text-2xl font-semibold text-[#1F2937]">Tambah Produk</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Isi form di bawah untuk menambah produk baru</p>
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
                placeholder="Masukkan judul buku"
              />
            </Field>
            <Field label="Penulis" required error={errors.author}>
              <input
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                className={inputClass(errors.author)}
                placeholder="Nama penulis"
              />
            </Field>
          </div>

          <Field label="Deskripsi">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              className={inputClass() + " resize-none"}
              placeholder="Sinopsis atau deskripsi buku..."
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Kategori" required error={errors.category}>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputClass(errors.category)}
              >
                <option value="">Pilih kategori</option>
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
                  placeholder="0"
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
                placeholder="0"
                min={0}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="ISBN">
              <input
                value={form.isbn}
                onChange={(e) => set("isbn", e.target.value)}
                className={inputClass()}
                placeholder="978-xxx-xxx-xxx-x"
              />
            </Field>
            <Field label="Penerbit" required error={errors.publisher}>
              <input
                value={form.publisher}
                onChange={(e) => set("publisher", e.target.value)}
                className={inputClass(errors.publisher)}
                placeholder="Nama penerbit"
              />
            </Field>
            <Field label="Tahun Terbit" required error={errors.year}>
              <input
                type="number"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                className={inputClass(errors.year)}
                placeholder="2024"
                min={1900}
                max={2030}
              />
            </Field>
          </div>

          {/* Upload */}
          <Field label="Foto Produk">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#F59E0B] hover:bg-amber-50 transition-colors relative"
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {form.coverPreview ? (
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={form.coverPreview}
                    alt="Preview"
                    className="w-24 h-32 object-cover rounded-lg shadow-sm"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#1F2937]">Gambar dipilih</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Klik untuk ganti gambar</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); set("coverPreview", null); }}
                      className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                    >
                      <X size={12} /> Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Upload size={22} className="text-[#6B7280]" />
                  </div>
                  <p className="text-sm font-medium text-[#1F2937]">Drag & drop foto di sini</p>
                  <p className="text-xs text-[#6B7280] mt-1">atau klik untuk pilih file (PNG, JPG, max 5MB)</p>
                </>
              )}
            </div>
          </Field>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-[#1F2937]">Status Produk</p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {form.status ? "Produk aktif dan ditampilkan ke pelanggan" : "Produk nonaktif dan tersembunyi"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("status", !form.status)}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.status ? "bg-[#10B981]" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.status ? "translate-x-7" : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E3A5F] text-white rounded-lg text-sm font-semibold hover:bg-[#16304f] transition-colors"
            >
              Simpan Produk
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-2.5 border border-gray-300 text-[#1F2937] rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
