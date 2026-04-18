import AdminLayout from "../../Components/AdminLayout";
import React from "react";
import { useRef } from "react";
import { Link, useForm } from "@inertiajs/react";
import { Upload, X, ArrowLeft } from "lucide-react";

interface Book {
    id: number;
    title: string;
    author: string;
    synopsis: string;
    category: string;
    price: number;
    stock: number;
    isbn: string;
    publisher: string;
    year: number;
    pages: number;
    language: string;
    description: string;
    in_stock: boolean;
    cover: string;
}

interface Props {
    book: Book;
    categories: string[];
}

function Field({
    label,
    required,
    error,
    children,
}: {
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
    `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#F59E0B]"}`;

export default function EditProduct({ book, categories }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);

    // Pre-fill form dengan data buku dari server
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT", // Laravel method spoofing
        title: book.title,
        author: book.author,
        synopsis: book.synopsis || "",
        category: book.category,
        price: book.price.toString(),
        stock: book.stock.toString(),
        isbn: book.isbn || "",
        publisher: book.publisher || "",
        year: book.year?.toString() || "",
        pages: book.pages?.toString() || "",
        language: book.language || "Indonesia",
        description: book.description || "",
        in_stock: book.in_stock,
        cover: null as File | null,
        coverPreview: book.cover as string | null,
    });

    const handleFile = (file: File | undefined) => {
        if (!file) return;
        setData("cover", file);
        const reader = new FileReader();
        reader.onload = () => setData("coverPreview", reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Gunakan post dengan _method PUT karena form HTML tidak support PUT
        post(`/admin/products/${book.id}`, {
            forceFormData: true,
        });
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/products"
                    className="p-2 border border-gray-200 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:border-gray-300 transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-[#1F2937]">
                        Edit Produk
                    </h1>
                    <p className="text-sm text-[#6B7280] mt-0.5 line-clamp-1">
                        {book.title}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Judul Buku" required error={errors.title}>
                            <input
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className={inputClass(errors.title)}
                            />
                        </Field>
                        <Field label="Penulis" required error={errors.author}>
                            <input
                                value={data.author}
                                onChange={(e) =>
                                    setData("author", e.target.value)
                                }
                                className={inputClass(errors.author)}
                            />
                        </Field>
                    </div>

                    <Field label="Sinopsis">
                        <textarea
                            value={data.synopsis}
                            onChange={(e) =>
                                setData("synopsis", e.target.value)
                            }
                            rows={4}
                            className={inputClass() + " resize-none"}
                        />
                    </Field>

                    <Field label="Deskripsi Singkat (genre)">
                        <input
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className={inputClass()}
                        />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Field
                            label="Kategori"
                            required
                            error={errors.category}
                        >
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData("category", e.target.value)
                                }
                                className={inputClass(errors.category)}
                            >
                                {categories.map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Harga (Rp)" required error={errors.price}>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6B7280]">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    className={
                                        inputClass(errors.price) + " pl-9"
                                    }
                                    min={0}
                                />
                            </div>
                        </Field>
                        <Field label="Stok" required error={errors.stock}>
                            <input
                                type="number"
                                value={data.stock}
                                onChange={(e) =>
                                    setData("stock", e.target.value)
                                }
                                className={inputClass(errors.stock)}
                                min={0}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Field label="ISBN">
                            <input
                                value={data.isbn}
                                onChange={(e) =>
                                    setData("isbn", e.target.value)
                                }
                                className={inputClass()}
                            />
                        </Field>
                        <Field
                            label="Penerbit"
                            required
                            error={errors.publisher}
                        >
                            <input
                                value={data.publisher}
                                onChange={(e) =>
                                    setData("publisher", e.target.value)
                                }
                                className={inputClass(errors.publisher)}
                            />
                        </Field>
                        <Field
                            label="Tahun Terbit"
                            required
                            error={errors.year}
                        >
                            <input
                                type="number"
                                value={data.year}
                                onChange={(e) =>
                                    setData("year", e.target.value)
                                }
                                className={inputClass(errors.year)}
                                min={1900}
                                max={2030}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Jumlah Halaman">
                            <input
                                type="number"
                                value={data.pages}
                                onChange={(e) =>
                                    setData("pages", e.target.value)
                                }
                                className={inputClass()}
                                min={1}
                            />
                        </Field>
                        <Field label="Bahasa">
                            <input
                                value={data.language}
                                onChange={(e) =>
                                    setData("language", e.target.value)
                                }
                                className={inputClass()}
                            />
                        </Field>
                    </div>

                    {/* Upload Cover */}
                    <Field label="Foto Cover Buku">
                        <div
                            onDrop={(e) => {
                                e.preventDefault();
                                handleFile(e.dataTransfer.files?.[0]);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#F59E0B] hover:bg-amber-50 transition-colors"
                        >
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    handleFile(e.target.files?.[0])
                                }
                            />
                            {data.coverPreview ? (
                                <div className="flex items-center justify-center gap-4">
                                    <img
                                        src={data.coverPreview}
                                        alt="Preview"
                                        className="w-20 h-28 object-cover rounded-lg shadow-sm"
                                    />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-[#1F2937]">
                                            Foto cover saat ini
                                        </p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">
                                            Klik untuk ganti foto
                                        </p>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setData("coverPreview", null);
                                                setData("cover", null);
                                            }}
                                            className="mt-2 flex items-center gap-1 text-xs text-red-500"
                                        >
                                            <X size={12} /> Hapus
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload
                                        size={20}
                                        className="text-[#6B7280] mx-auto mb-2"
                                    />
                                    <p className="text-sm text-[#6B7280]">
                                        Drag & drop atau klik untuk pilih foto
                                        baru
                                    </p>
                                </>
                            )}
                        </div>
                    </Field>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <p className="text-sm font-medium text-[#1F2937]">
                                Status Produk
                            </p>
                            <p className="text-xs text-[#6B7280] mt-0.5">
                                {data.in_stock
                                    ? "Aktif — ditampilkan ke pelanggan"
                                    : "Nonaktif — disembunyikan"}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setData("in_stock", !data.in_stock)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${data.in_stock ? "bg-[#10B981]" : "bg-gray-300"}`}
                        >
                            <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${data.in_stock ? "translate-x-7" : "translate-x-1"}`}
                            />
                        </button>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-[#1E3A5F] text-white rounded-lg text-sm font-semibold hover:bg-[#16304f] transition-colors disabled:opacity-60"
                        >
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                        <Link
                            href="/admin/products"
                            className="px-6 py-2.5 border border-gray-300 text-[#1F2937] rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

EditProduct.layout = (page: React.ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
