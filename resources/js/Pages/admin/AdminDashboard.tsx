import { Link } from "react-router";
import { BookOpen, ShoppingBag, DollarSign, Users, Plus, ArrowRight, TrendingUp } from "lucide-react";
import { adminOrders, books, formatRupiah } from "../../data/mockData";

const statusColor: Record<string, string> = {
  Dikirim: "bg-blue-100 text-blue-700",
  Diproses: "bg-amber-100 text-amber-700",
  Selesai: "bg-green-100 text-green-700",
  Menunggu: "bg-gray-100 text-gray-700",
  Dibatalkan: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const metrics = [
    { label: "Total Produk", value: books.length.toString(), icon: BookOpen, color: "bg-blue-500", change: "+2 bulan ini" },
    { label: "Total Pesanan", value: "1,284", icon: ShoppingBag, color: "bg-amber-500", change: "+18 hari ini" },
    { label: "Pendapatan Hari Ini", value: formatRupiah(3450000), icon: DollarSign, color: "bg-green-500", change: "+12% kemarin" },
    { label: "Pengguna Aktif", value: "892", icon: Users, color: "bg-purple-500", change: "+34 minggu ini" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Senin, 14 April 2026</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/products/add"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#F59E0B] text-white rounded-lg text-sm font-semibold hover:bg-[#D97706] transition-colors"
          >
            <Plus size={16} />
            Tambah Produk
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center gap-1.5 px-4 py-2 border border-[#1E3A5F] text-[#1E3A5F] rounded-lg text-sm font-semibold hover:bg-[#1E3A5F] hover:text-white transition-colors"
          >
            Lihat Semua Pesanan
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#6B7280]">{metric.label}</p>
              <div className={`w-9 h-9 ${metric.color} rounded-lg flex items-center justify-center`}>
                <metric.icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-[#1F2937]">{metric.value}</p>
            <p className="text-xs text-[#10B981] mt-1 flex items-center gap-0.5">
              <TrendingUp size={11} />
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1F2937]">Pesanan Terbaru</h2>
          <Link
            to="/admin/orders"
            className="text-sm text-[#1E3A5F] hover:underline flex items-center gap-1"
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Pelanggan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {adminOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-mono font-semibold text-[#1E3A5F]">{order.id}</td>
                  <td className="px-5 py-3.5 text-sm text-[#1F2937]">{order.customer}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-[#1F2937]">{formatRupiah(order.total)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#6B7280]">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Produk Terlaris</p>
          <p className="font-semibold text-[#1F2937]">One Piece Vol. 100</p>
          <p className="text-xs text-[#6B7280]">Terjual 328 kopi bulan ini</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Kategori Terpopuler</p>
          <p className="font-semibold text-[#1F2937]">Komik</p>
          <p className="text-xs text-[#6B7280]">42% dari total penjualan</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Rating Toko</p>
          <p className="font-semibold text-[#1F2937]">4.8 / 5.0</p>
          <p className="text-xs text-[#6B7280]">Berdasarkan 12.450 ulasan</p>
        </div>
      </div>
    </div>
  );
}
