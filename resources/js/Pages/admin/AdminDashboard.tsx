import AdminLayout from "../../Components/AdminLayout";
import React from "react";
import { Link } from "@inertiajs/react";
import {
    BookOpen,
    ShoppingBag,
    DollarSign,
    Users,
    Plus,
    ArrowRight,
    TrendingUp,
} from "lucide-react";

interface Metrics {
    totalBooks: number;
    totalOrders: number;
    totalRevenue: number;
    todayRevenue: number;
    totalUsers: number;
}

interface RecentOrder {
    id: string;
    customer: string;
    total: number;
    status: string;
    date: string;
}

interface Props {
    metrics: Metrics;
    recentOrders: RecentOrder[];
}

const statusColor: Record<string, string> = {
    Dikirim: "bg-blue-100 text-blue-700",
    Diproses: "bg-amber-100 text-amber-700",
    Selesai: "bg-green-100 text-green-700",
    Menunggu: "bg-gray-100 text-gray-700",
    Dibatalkan: "bg-red-100 text-red-700",
};

function formatRupiah(n: number) {
    return "Rp " + n.toLocaleString("id-ID");
}

export default function AdminDashboard({ metrics, recentOrders }: Props) {
    const cards = [
        {
            label: "Total Produk",
            value: metrics.totalBooks.toString(),
            icon: BookOpen,
            color: "bg-blue-500",
            change: "di database",
        },
        {
            label: "Total Pesanan",
            value: metrics.totalOrders.toLocaleString(),
            icon: ShoppingBag,
            color: "bg-amber-500",
            change: "semua waktu",
        },
        {
            label: "Pendapatan Hari Ini",
            value: formatRupiah(metrics.todayRevenue),
            icon: DollarSign,
            color: "bg-green-500",
            change: "hari ini",
        },
        {
            label: "Pengguna Aktif",
            value: metrics.totalUsers.toLocaleString(),
            icon: Users,
            color: "bg-purple-500",
            change: "customer terdaftar",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#1F2937]">
                        Dashboard
                    </h1>
                    <p className="text-sm text-[#6B7280] mt-0.5">
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/products/add"
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#F59E0B] text-white rounded-lg text-sm font-semibold hover:bg-[#D97706] transition-colors"
                    >
                        <Plus size={16} /> Tambah Produk
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-1.5 px-4 py-2 border border-[#1E3A5F] text-[#1E3A5F] rounded-lg text-sm font-semibold hover:bg-[#1E3A5F] hover:text-white transition-colors"
                    >
                        Kelola Produk
                    </Link>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white rounded-xl p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-[#6B7280]">
                                {card.label}
                            </p>
                            <div
                                className={`w-9 h-9 ${card.color} rounded-lg flex items-center justify-center`}
                            >
                                <card.icon size={18} className="text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-semibold text-[#1F2937]">
                            {card.value}
                        </p>
                        <p className="text-xs text-[#10B981] mt-1 flex items-center gap-0.5">
                            <TrendingUp size={11} /> {card.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[#1F2937]">
                        Pesanan Terbaru
                    </h2>
                    <Link
                        href="/admin/orders"
                        className="text-sm text-[#1E3A5F] hover:underline flex items-center gap-1"
                    >
                        Lihat Semua <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                                    Order ID
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                                    Pelanggan
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                                    Total
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                                    Status
                                </th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                                    Tanggal
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-8 text-center text-sm text-[#6B7280]"
                                    >
                                        Belum ada pesanan
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-5 py-3.5 text-sm font-mono font-semibold text-[#1E3A5F]">
                                            {order.id}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-[#1F2937]">
                                            {order.customer}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-[#1F2937]">
                                            {formatRupiah(order.total)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[order.status] || "bg-gray-100 text-gray-700"}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-[#6B7280]">
                                            {order.date}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-[#6B7280] mb-2">
                        Total Pendapatan
                    </p>
                    <p className="font-semibold text-[#1F2937]">
                        {formatRupiah(metrics.totalRevenue)}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                        Dari semua pesanan selesai
                    </p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-[#6B7280] mb-2">Total Produk</p>
                    <p className="font-semibold text-[#1F2937]">
                        {metrics.totalBooks} Buku
                    </p>
                    <p className="text-xs text-[#6B7280]">
                        Tersedia di database
                    </p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-[#6B7280] mb-2">
                        Total Pelanggan
                    </p>
                    <p className="font-semibold text-[#1F2937]">
                        {metrics.totalUsers} User
                    </p>
                    <p className="text-xs text-[#6B7280]">
                        Terdaftar di sistem
                    </p>
                </div>
            </div>
        </div>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
