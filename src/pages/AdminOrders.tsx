import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  MessageCircle,
  Package,
  Phone,
  ReceiptText,
  Search,
  Send,
  Trash2,
  Truck,
  User,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { CustomSelect } from "../components/CustomSelect";
import { Meta } from "../components/Meta";
import { useStore } from "../context/StoreContext";
import type { Order, OrderStatus } from "../types";
import { formatCurrency, formatDateTime } from "../utils/format";

const statusOptions: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];

function getCleanWhatsAppUrl(phone?: string, text?: string) {
  if (!phone) return "#";
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880")) {
    digits = digits;
  } else if (digits.startsWith("0")) {
    digits = `88${digits}`;
  } else if (!digits.startsWith("88")) {
    digits = `880${digits}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(text || "")}`;
}

export function AdminOrders() {
  const {
    orders = [],
    updateOrderStatus,
    deleteOrder,
    archiveOrder,
    deleteCancelledOrders
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [feedback, setFeedback] = useState("");

  const safeOrders = useMemo(() => (Array.isArray(orders) ? orders : []), [orders]);

  const filteredOrders = useMemo(() => {
    const q = query.toLowerCase().trim();

    return safeOrders.filter((order) => {
      if (!order) return false;

      // Tab filter
      if (activeTab === "Archived") {
        if (!order.archived) return false;
      } else {
        if (order.archived) return false;
        if (activeTab !== "All" && order.status !== activeTab) return false;
      }

      // Search query filter
      if (!q) return true;

      const idMatch = (order.id || "").toLowerCase().includes(q);
      const nameMatch = (order.customer?.fullName || "").toLowerCase().includes(q);
      const phoneDigits = (order.customer?.phone || "").replace(/\D/g, "");
      const qDigits = q.replace(/\D/g, "");
      const phoneMatch = qDigits ? phoneDigits.includes(qDigits) : false;
      const trxMatch = (order.payment?.transactionId || "").toLowerCase().includes(q);
      const addrMatch = (order.customer?.address || "").toLowerCase().includes(q);

      return idMatch || nameMatch || phoneMatch || trxMatch || addrMatch;
    });
  }, [activeTab, query, safeOrders]);

  const cancelledCount = safeOrders.filter((o) => o?.status === "Cancelled").length;

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
    setFeedback(`Order #${orderId} marked as ${status}.`);
    setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <>
      <Meta
        title="Admin Order Management"
        description="Fulfill, track, and update client orders in PoshakHeaven."
      />
      <AdminShell title="Order Management" eyebrow="Fulfillment & Logistics">
        {feedback && (
          <div className="mb-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400 animate-fade-in">
            ✓ {feedback}
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {["All", ...statusOptions, "Archived"].map((tab) => {
              const count =
                tab === "All"
                  ? safeOrders.filter((o) => !o.archived).length
                  : tab === "Archived"
                    ? safeOrders.filter((o) => o.archived).length
                    : safeOrders.filter((o) => o.status === tab && !o.archived).length;

              const isSelected = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-xs font-semibold tracking-wide transition ${
                    isSelected
                      ? "bg-accent text-background font-bold shadow-soft"
                      : "border border-white/10 bg-[#1A110E] text-muted hover:border-white/20 hover:text-ink"
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                      isSelected
                        ? "bg-background/20 text-background"
                        : "bg-white/10 text-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Purge Cancelled Button */}
          {cancelledCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Permanently remove all ${cancelledCount} cancelled orders?`)) {
                  deleteCancelledOrders();
                  setFeedback("Purged cancelled orders.");
                  setTimeout(() => setFeedback(""), 3000);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Purge Cancelled ({cancelledCount})</span>
            </button>
          )}
        </div>

        {/* Search Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Order ID, Client Name, Phone, or bKash TrxID..."
              className="h-10 w-full rounded-sm border border-white/15 bg-[#1A110E] pl-10 pr-4 text-xs text-ink outline-none focus:border-accent"
            />
          </div>

          <p className="text-xs text-muted">
            Found <strong className="text-ink">{filteredOrders.length}</strong> matching orders
          </p>
        </div>

        {/* Orders List Grid */}
        <div className="mt-6 space-y-4">
          {filteredOrders.map((order) => {
            const isSelected = selectedOrder?.id === order.id;
            const customerName = order.customer?.fullName || "Guest Customer";
            const customerPhone = order.customer?.phone || "";
            const customerAddress = order.customer?.address || "Address not provided";
            const customerNote = order.customer?.note || "";
            const paymentMethod = order.payment?.method || "COD";
            const items = Array.isArray(order.items) ? order.items : [];

            const waUrl = getCleanWhatsAppUrl(
              customerPhone,
              `Hello ${customerName}! We are contacting you from PoshakHeaven regarding your order #${order.id}.`
            );

            return (
              <article
                key={order.id}
                className={`rounded-lg border bg-[#1A110E] p-5 sm:p-6 shadow-soft transition ${
                  isSelected ? "border-accent ring-1 ring-accent" : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-accent">
                        {order.id}
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="text-xs text-muted">
                        {formatDateTime(order.orderTime)}
                      </span>
                      {order.archived && (
                        <span className="rounded bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted font-bold">
                          Archived
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1 font-heading text-base font-bold text-ink">
                      {customerName}
                    </h3>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Direct WhatsApp Message */}
                    {customerPhone && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-[#25D366]/20 px-3 text-xs font-semibold text-[#25D366] hover:bg-[#25D366] hover:text-black transition"
                        title="Open WhatsApp chat with client"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {/* Status Dropdown */}
                    <CustomSelect
                      value={order.status || "Pending"}
                      onChange={(val) => handleStatusChange(order.id, val as OrderStatus)}
                      options={statusOptions.map((s) => ({
                        value: s,
                        label: s,
                        dotColor:
                          s === "Delivered"
                            ? "#4CAF50"
                            : s === "Cancelled"
                              ? "#EF4444"
                              : s === "Shipped"
                                ? "#3B82F6"
                                : s === "Processing"
                                  ? "#F59E0B"
                                  : "#D6B49A"
                      }))}
                      className="w-36"
                      buttonClassName="h-9 bg-[#120B09] text-xs font-bold"
                    />

                    {/* View Details Drawer Toggle */}
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(isSelected ? null : order)}
                      className={`grid h-9 w-9 place-items-center rounded-sm border transition ${
                        isSelected
                          ? "border-accent bg-accent text-background"
                          : "border-white/10 text-muted hover:text-ink hover:border-accent"
                      }`}
                      title={isSelected ? "Close details" : "View full details"}
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {/* Archive / Unarchive */}
                    <button
                      type="button"
                      onClick={() => archiveOrder(order.id, !order.archived)}
                      className="grid h-9 w-9 place-items-center rounded-sm border border-white/10 text-muted hover:text-ink transition"
                      title={order.archived ? "Unarchive order" : "Archive order"}
                    >
                      {order.archived ? (
                        <ArchiveRestore className="h-4 w-4" />
                      ) : (
                        <Archive className="h-4 w-4" />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete Order #${order.id} permanently?`)) {
                          deleteOrder(order.id);
                          if (selectedOrder?.id === order.id) setSelectedOrder(null);
                        }
                      }}
                      className="grid h-9 w-9 place-items-center rounded-sm border border-white/10 text-muted hover:border-rose-500 hover:text-rose-400 transition"
                      title="Delete order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Summary Info Row */}
                <div className="mt-4 grid gap-4 sm:grid-cols-3 text-xs">
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">
                      Client & Destination
                    </span>
                    <p className="mt-1 font-mono text-ink font-semibold">{customerPhone || "No phone"}</p>
                    <p className="mt-0.5 text-muted leading-relaxed">{customerAddress}</p>
                    {customerNote && (
                      <p className="mt-1 text-accent italic">Note: "{customerNote}"</p>
                    )}
                  </div>

                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">
                      Payment Info
                    </span>
                    <p className="mt-1 text-ink font-semibold">
                      Method: <span className="text-accent">{paymentMethod}</span>
                    </p>
                    {order.payment?.senderNumber && (
                      <p className="text-muted font-mono">
                        Sender: {order.payment.senderNumber}
                      </p>
                    )}
                    {order.payment?.transactionId && (
                      <p className="text-muted font-mono">
                        TrxID: <strong className="text-accent">{order.payment.transactionId}</strong>
                      </p>
                    )}
                  </div>

                  <div className="sm:text-right">
                    <span className="text-muted block text-[10px] uppercase tracking-wider font-semibold">
                      Grand Total
                    </span>
                    <p className="mt-1 font-heading text-lg font-bold text-accent">
                      {formatCurrency(order.total || 0)}
                    </p>
                    <p className="text-[10px] text-muted">
                      Subtotal: {formatCurrency(order.subtotal || 0)} • Delivery: {formatCurrency(order.deliveryCharge || 0)}
                      {order.discount ? ` • Disc: -${formatCurrency(order.discount)}` : ""}
                    </p>
                  </div>
                </div>

                {/* Items Breakdown */}
                {items.length > 0 && (
                  <div className="mt-4 rounded-md border border-white/5 bg-[#120B09] p-3.5 text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 font-semibold text-muted text-[10px] uppercase tracking-wider">
                      <span>Items ({items.length})</span>
                      <span>Line Total</span>
                    </div>
                    <div className="space-y-2 divide-y divide-white/5">
                      {items.map((it, i) => (
                        <div key={i} className="flex justify-between items-center pt-2">
                          <div>
                            <p className="font-semibold text-ink">{it.name}</p>
                            <p className="text-[10px] text-muted font-mono">
                              {it.size} • {it.color} • Qty: {it.quantity} @ {formatCurrency(it.price || 0)}
                            </p>
                          </div>
                          <span className="font-mono font-bold text-accent">
                            {formatCurrency(it.lineTotal || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="rounded-lg border border-white/10 bg-[#1A110E] p-12 text-center text-xs text-muted">
              No orders found for the active filter.
            </div>
          )}
        </div>

        {/* Modal / Detailed Order Inspector View */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    Order Details
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-ink">
                    Order #{selectedOrder.id}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-muted hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status Update Strip */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/10 bg-[#120B09] p-3">
                <span className="text-xs font-semibold text-muted">Order Status:</span>
                <div className="flex flex-wrap gap-1.5">
                  {statusOptions.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                        selectedOrder.status === st
                          ? "bg-accent text-background font-bold"
                          : "border border-white/10 text-muted hover:text-ink"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-md border border-white/10 bg-[#120B09] p-4 space-y-1.5">
                  <p className="font-bold text-accent uppercase tracking-wider text-[10px]">
                    Recipient Details
                  </p>
                  <p className="font-semibold text-ink text-sm">{selectedOrder.customer?.fullName || "Guest Customer"}</p>
                  <p className="font-mono text-muted">{selectedOrder.customer?.phone || ""}</p>
                  <p className="text-muted leading-relaxed">{selectedOrder.customer?.address || ""}</p>
                  {selectedOrder.customer?.note && (
                    <p className="mt-2 text-accent italic">Note: "{selectedOrder.customer.note}"</p>
                  )}
                </div>

                <div className="rounded-md border border-white/10 bg-[#120B09] p-4 space-y-1.5">
                  <p className="font-bold text-accent uppercase tracking-wider text-[10px]">
                    Payment Breakdown
                  </p>
                  <p className="text-ink">
                    Method: <strong className="text-accent">{selectedOrder.payment?.method || "COD"}</strong>
                  </p>
                  {selectedOrder.payment?.senderNumber && (
                    <p className="text-muted font-mono">
                      Sender: {selectedOrder.payment.senderNumber}
                    </p>
                  )}
                  {selectedOrder.payment?.transactionId && (
                    <p className="text-muted font-mono">
                      TrxID: <strong className="text-accent">{selectedOrder.payment.transactionId}</strong>
                    </p>
                  )}
                  <p className="text-muted">
                    Delivery Zone: {selectedOrder.deliveryZone === "outside" ? "Outside Dhaka (৳150)" : "Inside Dhaka (৳80)"}
                  </p>
                </div>
              </div>

              {/* Line Items Full List */}
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Purchased Items ({selectedOrder.items?.length || 0})
                </h4>
                {(selectedOrder.items || []).map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded border border-white/5 bg-[#120B09] p-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-ink">{it.name}</p>
                      <p className="text-[10px] text-muted font-mono mt-0.5">
                        Size: {it.size} • Color: {it.color} • Quantity: {it.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-accent">
                      {formatCurrency(it.lineTotal || 0)}
                    </span>
                  </div>
                ))}

                {/* Final Total Box */}
                <div className="mt-4 rounded-md border border-accent/20 bg-accent/5 p-4 text-xs space-y-1 text-right">
                  <p className="text-muted">
                    Subtotal: <span className="text-ink font-semibold">{formatCurrency(selectedOrder.subtotal || 0)}</span>
                  </p>
                  {selectedOrder.discount ? (
                    <p className="text-emerald-400">
                      Bulk Discount: -{formatCurrency(selectedOrder.discount)}
                    </p>
                  ) : null}
                  <p className="text-muted">
                    Delivery: <span className="text-ink font-semibold">{formatCurrency(selectedOrder.deliveryCharge || 0)}</span>
                  </p>
                  <p className="border-t border-white/10 pt-2 font-heading text-base font-bold text-accent">
                    Total: {formatCurrency(selectedOrder.total || 0)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-sm bg-accent px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-background"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    </>
  );
}
