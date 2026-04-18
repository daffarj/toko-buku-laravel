import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    CreditCard,
    CheckCircle2,
} from "lucide-react";
import AdminLayout from "../../Components/AdminLayout";

interface OrderItem {
    id: number;
    book_title: string;
    book_author: string;
    book_cover: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    customer_name: string;
    customer_email: string;
    recipient_name: string;
    recipient_phone: string;
    shipping_address: string;
    payment_type: string;
    payment_method: string;
    payment_code: string | null;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    grand_total: number;
    notes: string | null;
    paid_at: string | null;
    shipped_at: string | null;
    completed_at: string | null;
    created_at: string;
    items: OrderItem[];
}

interface Props {
    order: Order;
    statuses: string[];
}

const statusColor: Record<string, string> = {
    Menunggu: "bg-gray-100 text-gray-700",
    Diproses: "bg-amber-100 text-amber-700",
    Dikirim: "bg-blue-100 text-blue-700",
    Selesai: "bg-green-100 text-green-700",
    Dibatalkan: "bg-red-100 text-red-700",
};

// Alur status yang valid
const statusFlow: Record<string, string[]> = {
    Menunggu: ["Diproses", "Dibatalkan"],
    Diproses: ["Dikirim", "Dibatalkan"],
    Dikirim: ["Selesai"],
    Selesai: [],
    Dibatalkan: [],
};

function formatRupiah(n: number) {
    return "Rp " + n.toLocaleString("id-ID");
}

function Section({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: any;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <Icon size={16} className="text-[#1E3A5F]" />
                <h2 className="text-sm font-semibold text-[#1F2937]">
                    {title}
                </h2>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex justify-between py-1.5 text-sm border-b border-gray-50 last:border-0">
            <span className="text-[#6B7280]">{label}</span>
            <span className="font-medium text-[#1F2937] text-right max-w-[60%]">
                {value}
            </span>
        </div>
    );
}

export default function AdminOrderDetail({ order, statuses }: Props) {
    const { flash } = usePage().props as any;
    const [updating, setUpdating] = useState(false);
    const nextStatuses = statusFlow[order.status] || [];

    const handleUpdateStatus = (newStatus: string) => {
        if (!confirm(`Ubah status ke "${newStatus}"?`)) return;
        setUpdating(true);
        router.patch(
            `/admin/orders/${order.id}/status`,
            { status: newStatus },
            {
                onFinish: () => setUpdating(false),
            },
        );
    };

    return (
        <div className="space-y-5">
            {flash?.success && (
                <div className="fixed top-6 right-6 z-50 bg-[#10B981] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
                    ✓ {flash.success}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/orders"
                    className="p-2 border border-gray-200 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:border-gray-300 transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-semibold text-[#1F2937]">
                            {order.order_number}
                        </h1>
                        <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[order.status]}`}
                        >
                            {order.status}
                        </span>
                    </div>
                    <p className="text-sm text-[#6B7280] mt-0.5">
                        Dibuat: {order.created_at}
                    </p>
                </div>
            </div>

            {/* Update Status */}
            {nextStatuses.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <p className="text-sm font-semibold text-[#1F2937] mb-3">
                        Update Status Pesanan
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {nextStatuses.map((s) => (
                            <button
                                key={s}
                                onClick={() => handleUpdateStatus(s)}
                                disabled={updating}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 ${
                                    s === "Dibatalkan"
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-[#1E3A5F] text-white hover:bg-[#16304f]"
                                }`}
                            >
                                {updating ? "Memproses..." : `→ ${s}`}
                            </button>
                        ))}
                    </div>

                    {/* Timeline */}
                    <div className="mt-4 flex items-center gap-1 flex-wrap">
                        {["Menunggu", "Diproses", "Dikirim", "Selesai"].map(
                            (s, i) => {
                                const statOrder = [
                                    "Menunggu",
                                    "Diproses",
                                    "Dikirim",
                                    "Selesai",
                                ];
                                const currentIdx = statOrder.indexOf(
                                    order.status,
                                );
                                const thisIdx = statOrder.indexOf(s);
                                const isDone =
                                    thisIdx <= currentIdx &&
                                    order.status !== "Dibatalkan";
                                return (
                                    <React.Fragment key={s}>
                                        <div
                                            className={`flex items-center gap-1 text-xs font-medium ${isDone ? "text-[#10B981]" : "text-gray-300"}`}
                                        >
                                            <CheckCircle2 size={14} />
                                            {s}
                                        </div>
                                        {i < 3 && (
                                            <div
                                                className={`h-px w-6 ${isDone && thisIdx < currentIdx ? "bg-[#10B981]" : "bg-gray-200"}`}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            },
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Info Pelanggan */}
                <Section title="Informasi Pelanggan" icon={User}>
                    <InfoRow
                        label="Nama Akun"
                        value={order.customer_name || "-"}
                    />
                    <InfoRow
                        label="Email"
                        value={order.customer_email || "-"}
                    />
                    <InfoRow
                        label="Nama Penerima"
                        value={order.recipient_name}
                    />
                    <InfoRow label="Telepon" value={order.recipient_phone} />
                </Section>

                {/* Alamat Pengiriman */}
                <Section title="Alamat Pengiriman" icon={MapPin}>
                    <p className="text-sm text-[#1F2937]">
                        {order.shipping_address}
                    </p>
                    {order.shipped_at && (
                        <p className="text-xs text-[#6B7280] mt-2">
                            Dikirim: {order.shipped_at}
                        </p>
                    )}
                    {order.completed_at && (
                        <p className="text-xs text-[#10B981] mt-1">
                            Diterima: {order.completed_at}
                        </p>
                    )}
                </Section>

                {/* Info Pembayaran */}
                <Section title="Informasi Pembayaran" icon={CreditCard}>
                    <InfoRow label="Metode" value={order.payment_method} />
                    <InfoRow
                        label="Tipe"
                        value={
                            order.payment_type === "bank"
                                ? "Transfer Bank"
                                : order.payment_type === "ewallet"
                                  ? "E-Wallet"
                                  : "QRIS"
                        }
                    />
                    {order.payment_code && (
                        <InfoRow
                            label="Kode Bayar"
                            value={
                                <span className="font-mono text-xs">
                                    {order.payment_code}
                                </span>
                            }
                        />
                    )}
                    <InfoRow
                        label="Status Bayar"
                        value={
                            order.paid_at ? (
                                <span className="text-[#10B981]">
                                    ✓ Dibayar {order.paid_at}
                                </span>
                            ) : (
                                <span className="text-amber-600">
                                    Menunggu pembayaran
                                </span>
                            )
                        }
                    />
                </Section>

                {/* Rincian Harga */}
                <Section title="Rincian Harga" icon={Package}>
                    <InfoRow
                        label="Subtotal"
                        value={formatRupiah(order.subtotal)}
                    />
                    <InfoRow
                        label="Ongkos Kirim"
                        value={formatRupiah(order.shipping_cost)}
                    />
                    <InfoRow
                        label="Pajak (11%)"
                        value={formatRupiah(order.tax)}
                    />
                    <div className="flex justify-between pt-2 mt-1 border-t border-gray-200">
                        <span className="font-semibold text-[#1F2937]">
                            Total
                        </span>
                        <span className="font-semibold text-[#1E3A5F] text-base">
                            {formatRupiah(order.grand_total)}
                        </span>
                    </div>
                </Section>
            </div>

            {/* Daftar Item */}
            <Section title="Item Pesanan" icon={Package}>
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                        >
                            <img
                                src={
                                    item.book_cover ||
                                    "https://via.placeholder.com/60x80"
                                }
                                alt={item.book_title}
                                className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#1F2937] line-clamp-1">
                                    {item.book_title}
                                </p>
                                <p className="text-xs text-[#6B7280]">
                                    {item.book_author}
                                </p>
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className="text-xs text-[#6B7280]">
                                        ×{item.quantity} ×{" "}
                                        {formatRupiah(item.price)}
                                    </span>
                                    <span className="text-sm font-semibold text-[#1E3A5F]">
                                        {formatRupiah(item.subtotal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {order.notes && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-xl">
                        <p className="text-xs text-[#6B7280] mb-1">
                            Catatan dari pembeli:
                        </p>
                        <p className="text-sm text-[#1F2937]">{order.notes}</p>
                    </div>
                )}
            </Section>
        </div>
    );
}

AdminOrderDetail.layout = (page: React.ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
