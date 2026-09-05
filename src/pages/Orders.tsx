import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { Meta } from "../components/Meta";
import { useStore } from "../context/StoreContext";
import type { Order, OrderStatus } from "../types";
import { formatCurrency, formatDate } from "../utils/format";

const cancellationReasons = [
  "Ordered wrong size or color",
  "Need to change delivery address or phone",
  "Found another product / Changed my mind",
  "Delivery timeframe is too long",
  "Other reason"
];

const statusSteps: { status: OrderStatus; label: string; description: string }[] = [
  { status: "Pending", label: "Received", description: "Order placed in system" },
  { status: "Confirmed", label: "Confirmed", description: "Verified by merchant" },
  { status: "Processing", label: "Processing", description: "Packed in boutique" },
  { status: "Shipped", label: "In Transit", description: "Handed to courier" },
  { status: "Delivered", label: "Delivered", description: "Completed delivery" }
];

function getStatusStepIndex(status: OrderStatus): number {
  if (status === "Cancelled") return -1;
  const idx = statusSteps.findIndex((s) => s.status === status);
  return idx >= 0 ? idx : 0;
}

function getSafeWhatsAppUrl(phone?: string, text?: string) {
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

export function Orders() {
  const [searchParams] = useSearchParams();
  const { orders = [], updateOrderStatus, siteContent } = useStore();
  const safeOrders = Array.isArray(orders) ? orders : [];

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("id") || searchParams.get("phone") || ""
  );
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState(cancellationReasons[0]);
  const [customReason, setCustomReason] = useState("");

  const storeInfo = siteContent?.storeInfo;
  const whatsappNumber = storeInfo?.whatsappNumber || "01970430152";

  // Preload last order or search query match on load
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const match = safeOrders.find((o) => {
        if (!o) return false;
        const idMatch = (o.id || "").toLowerCase() === query;
        const phoneDigits = (o.customer?.phone || "").replace(/\D/g, "");
        const qDigits = query.replace(/\D/g, "");
        const phoneMatch = qDigits ? phoneDigits.includes(qDigits) : false;
        return idMatch || phoneMatch;
      });
      if (match) setActiveOrder(match);
    } else if (safeOrders.length > 0) {
      setActiveOrder(safeOrders[0]);
    }
  }, [safeOrders, searchQuery]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const match = safeOrders.find((o) => {
      if (!o) return false;
      const idMatch = (o.id || "").toLowerCase().includes(query);
      const phoneDigits = (o.customer?.phone || "").replace(/\D/g, "");
      const qDigits = query.replace(/\D/g, "");
      const phoneMatch = qDigits ? phoneDigits.includes(qDigits) : false;
      return idMatch || phoneMatch;
    });

    if (match) {
      setActiveOrder(match);
    } else {
      setActiveOrder(null);
    }
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrder) return;
    updateOrderStatus(cancelModalOrder.id, "Cancelled");
    setActiveOrder((current) =>
      current && current.id === cancelModalOrder.id
        ? { ...current, status: "Cancelled" }
        : current
    );
    setCancelModalOrder(null);
  };

  return (
    <>
      <Meta
        title="Track Order / My Orders"
        description="Check live status, delivery timeline, and manage your PoshakHeaven orders."
      />

      <section className="bg-[#120B09] py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="mb-8 border-b border-white/10 pb-5">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-accent" />
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-luxury text-accent">
                Customer Services
              </p>
            </div>
            <h1 className="mt-1 font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
              Track Your Order
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted max-w-xl">
              Enter your Order Reference (e.g., PH-2026-XXXX) or your 11-digit phone number to track live fulfillment.
            </p>
          </div>

          {/* Search Bar Stage */}
          <div className="rounded-lg border border-white/10 bg-[#1A110E] p-5 sm:p-6 shadow-soft">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Order ID (PH-2026-...) or 11-digit Phone Number"
                  className="h-12 w-full rounded-sm border border-white/15 bg-[#120B09] pl-10 pr-4 text-xs sm:text-sm text-ink outline-none placeholder:text-muted/60 focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-accent px-7 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent flex-none"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Track Status</span>
              </button>
            </form>

            {/* Quick Recent Orders Chips */}
            {safeOrders.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4 text-xs text-muted">
                <span>Recent Orders:</span>
                {safeOrders.slice(0, 4).map((ord) => (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => {
                      setSearchQuery(ord.id);
                      setActiveOrder(ord);
                    }}
                    className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium transition ${
                      activeOrder?.id === ord.id
                        ? "bg-accent text-background font-bold"
                        : "border border-white/10 bg-[#120B09] text-muted hover:border-accent hover:text-ink"
                    }`}
                  >
                    {ord.id}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Order Display */}
          {activeOrder ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
              {/* Left Column: Timeline & Items */}
              <div className="space-y-6">
                {/* Timeline Status Card */}
                <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-accent">
                        Live Tracking
                      </span>
                      <h2 className="font-heading text-2xl font-bold text-ink">
                        Order #{activeOrder.id}
                      </h2>
                      <p className="mt-0.5 text-xs text-muted font-mono">
                        Placed on {formatDate(activeOrder.orderTime)}
                      </p>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                          activeOrder.status === "Delivered"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : activeOrder.status === "Cancelled"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-accent/20 text-accent border border-accent/40"
                        }`}
                      >
                        {activeOrder.status || "Pending"}
                      </span>

                      {activeOrder.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => setCancelModalOrder(activeOrder)}
                          className="text-xs text-rose-400 underline hover:text-rose-300"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Visual Stepper Timeline (if not cancelled) */}
                  {activeOrder.status !== "Cancelled" ? (
                    <div className="mt-8">
                      <div className="grid grid-cols-5 gap-2 relative">
                        {statusSteps.map((step, index) => {
                          const currentIdx = getStatusStepIndex(activeOrder.status || "Pending");
                          const isCompleted = index <= currentIdx;
                          const isCurrent = index === currentIdx;

                          return (
                            <div key={step.status} className="flex flex-col items-center text-center">
                              {/* Step Dot */}
                              <div
                                className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-bold transition-all ${
                                  isCurrent
                                    ? "border-accent bg-accent text-background shadow-glow scale-110"
                                    : isCompleted
                                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                                      : "border-white/20 bg-[#120B09] text-muted/50"
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <span>{index + 1}</span>
                                )}
                              </div>

                              <span
                                className={`mt-2.5 text-[11px] font-semibold ${
                                  isCompleted ? "text-ink" : "text-muted/60"
                                }`}
                              >
                                {step.label}
                              </span>
                              <span className="hidden sm:block text-[9px] text-muted mt-0.5 max-w-[80px]">
                                {step.description}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-md border border-rose-500/25 bg-rose-500/10 p-4 text-xs text-rose-300">
                      <p className="font-bold">This order has been cancelled.</p>
                      <p className="mt-1">
                        If you need to reactivate this order or have questions, please reach out to our WhatsApp concierge.
                      </p>
                    </div>
                  )}
                </div>

                {/* Items in Order */}
                <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft">
                  <h3 className="font-heading text-lg font-bold text-ink border-b border-white/10 pb-4">
                    Items Purchased ({(activeOrder.items || []).length})
                  </h3>

                  <div className="divide-y divide-white/5 space-y-3 pt-3">
                    {(activeOrder.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between pt-3">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-ink">{item.name}</p>
                          <p className="text-[11px] text-muted font-mono mt-0.5">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-heading text-xs sm:text-sm font-bold text-accent">
                          {formatCurrency(item.lineTotal || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Customer & Payment Details */}
              <div className="space-y-6">
                <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 shadow-soft space-y-5">
                  <h3 className="font-heading text-base font-bold text-ink border-b border-white/10 pb-3">
                    Delivery & Billing Information
                  </h3>

                  {/* Customer Info */}
                  <div className="text-xs space-y-1.5">
                    <p className="font-bold text-ink">{activeOrder.customer?.fullName || "Customer"}</p>
                    <p className="text-accent font-mono">{activeOrder.customer?.phone || ""}</p>
                    <p className="text-muted leading-relaxed">{activeOrder.customer?.address || ""}</p>
                    {activeOrder.customer?.note && (
                      <p className="mt-2 rounded bg-[#120B09] p-2 text-[11px] text-muted italic">
                        Note: "{activeOrder.customer.note}"
                      </p>
                    )}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-muted">
                      <span>Subtotal:</span>
                      <span className="text-ink font-medium">{formatCurrency(activeOrder.subtotal || 0)}</span>
                    </div>

                    {activeOrder.discount ? (
                      <div className="flex justify-between text-emerald-400">
                        <span>Bulk Discount:</span>
                        <span>-{formatCurrency(activeOrder.discount)}</span>
                      </div>
                    ) : null}

                    <div className="flex justify-between text-muted">
                      <span>Delivery ({activeOrder.deliveryZone === "outside" ? "Outside Dhaka" : "Inside Dhaka"}):</span>
                      <span className="text-ink font-medium">
                        {activeOrder.deliveryCharge === 0 ? "FREE" : formatCurrency(activeOrder.deliveryCharge || 0)}
                      </span>
                    </div>

                    <div className="flex justify-between text-muted">
                      <span>Payment Method:</span>
                      <span className="text-ink font-semibold">{activeOrder.payment?.method || "COD"}</span>
                    </div>

                    {activeOrder.payment?.transactionId && (
                      <div className="flex justify-between text-muted font-mono text-[11px]">
                        <span>bKash TrxID:</span>
                        <span className="text-accent">{activeOrder.payment.transactionId}</span>
                      </div>
                    )}

                    <div className="border-t border-white/10 pt-3 flex justify-between font-heading text-sm font-bold text-ink">
                      <span>Total:</span>
                      <span className="text-accent">{formatCurrency(activeOrder.total || 0)}</span>
                    </div>
                  </div>

                  {/* WhatsApp Help CTA */}
                  <div className="border-t border-white/10 pt-4">
                    <a
                      href={getSafeWhatsAppUrl(
                        whatsappNumber,
                        `Hi PoshakHeaven! I am inquiring about Order #${activeOrder.id}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] text-xs font-bold text-black transition hover:bg-[#1EBE5D]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp Support</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-white/10 bg-[#1A110E] p-12 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-accent/30 bg-surface text-accent">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-ink">
                No Order Selected
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted max-w-sm mx-auto">
                Search using your Order ID (PH-2026-XXXX) or phone number above to inspect tracking details.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Cancellation Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#1A110E] p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-400" />
                <h3 className="font-heading text-lg font-bold text-ink">
                  Cancel Order #{cancelModalOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-xs text-muted">
              Please select a cancellation reason so we can improve our service:
            </p>

            <div className="mt-4 space-y-2">
              {cancellationReasons.map((r) => (
                <label
                  key={r}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-xs transition ${
                    selectedReason === r
                      ? "border-accent bg-accent/15 text-ink ring-1 ring-accent"
                      : "border-white/10 bg-[#120B09] text-muted hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="accent-[#D6B49A]"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="flex-1 rounded-sm border border-white/20 py-2.5 text-xs font-semibold text-muted hover:text-ink"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 rounded-sm bg-rose-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
