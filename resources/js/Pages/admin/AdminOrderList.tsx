import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import AdminLayout from "../../Components/AdminLayout";

interface Order {
    id: number;
    order_number: string;
    customer: string;
    grand_total: number;
    status: string;
    payment_method: string;
    paid_at: string | null;
    created_at: string;
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    orders: PaginatedOrders;
    filters: { search?: string; status?: string };
    statuses: string[];
}

const statusColor: Record<string, string> = {
    Menunggu: "bg-gray-100 text-gray-700",
    Diproses: "bg-amber-100 text-amber-700",
    Dikirim: "bg-blue-100 text-blue-700",
    Selesai: "bg-green-100 text-green-700",
    Dibatalkan: "bg-red-100 text-red-700",
};

function formatRupiah(n: number) {
    return "Rp " + n.toLocaleString("id-ID");
}

export default function AdminOrderList({ orders, filters, statuses }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "Semua");

    const handleSearch = () => {
        router.get(
            "/admin/orders",
            {
                search,
                status: status === "Semua" ? "" : status,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleStatusFilter = (s: string) => {
        setStatus(s);
        router.get(
            "/admin/orders",
            {
                search,
                status: s === "Semua" ? "" : s,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="space-y-5">
            {flash?.success && (
                <div className="fixed top-6 right-6 z-50 bg-[#10B981] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
                    ✓ {flash.success}
                </div>
            )}

            <div>
                <h1 className="text-2xl font-semibold text-[#1F2937]">
                    Kelola Pesanan
                </h1>
                <p className="text-sm text-[#6B7280] mt-0.5">
                    {orders.total} pesanan ditemukan
                </p>
            </div>

            {/* Filter status */}
            <div className="flex gap-2 flex-wrap">
                {statuses.map((s) => (
                    <button
                        key={s}
                        onClick={() => handleStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            status === s
                                ? "bg-[#1E3A5F] text-white"
                                : "bg-white border border-gray-200 text-[#6B7280] hover:border-[#1E3A5F]"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="flex gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Cari nomor order atau nama pelanggan..."
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="px-4 py-2.5 bg-[#1E3A5F] text-white rounded-lg text-sm font-semibold hover:bg-[#16304f] transition-colors"
                >
                    Cari
                </button>
            </div>

            {/* Tabel */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase">
                                    Order ID
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase">
                                    Pelanggan
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase hidden sm:table-cell">
                                    Pembayaran
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase">
                                    Total
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase">
                                    Status
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase hidden md:table-cell">
                                    Tanggal
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-12 text-center text-sm text-[#6B7280]"
                                    >
                                        Tidak ada pesanan ditemukan
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm font-mono font-semibold text-[#1E3A5F]">
                                            {order.order_number}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#1F2937]">
                                            {order.customer}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#6B7280] hidden sm:table-cell">
                                            {order.payment_method}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-[#1F2937]">
                                            {formatRupiah(order.grand_total)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[order.status] || "bg-gray-100 text-gray-700"}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[#6B7280] hidden md:table-cell">
                                            {order.created_at}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="flex items-center gap-1 px-2.5 py-1.5 border border-[#1E3A5F] text-[#1E3A5F] rounded-lg text-xs font-medium hover:bg-[#1E3A5F] hover:text-white transition-colors"
                                            >
                                                <Eye size={12} /> Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
                    <p className="text-sm text-[#6B7280]">
                        Halaman {orders.current_page} dari {orders.last_page}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                orders.prev_page_url &&
                                router.visit(orders.prev_page_url)
                            }
                            disabled={!orders.prev_page_url}
                            className="p-2 border border-gray-200 rounded-lg text-[#1F2937] hover:border-[#1E3A5F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() =>
                                orders.next_page_url &&
                                router.visit(orders.next_page_url)
                            }
                            disabled={!orders.next_page_url}
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

AdminOrderList.layout = (page: React.ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
