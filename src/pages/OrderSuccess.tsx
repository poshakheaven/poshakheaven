import {
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Package,
  Phone,
  Printer,
  ShoppingBag,
  Sparkles,
  Truck
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Meta } from "../components/Meta";
import { useStore } from "../context/StoreContext";
import { formatCurrency } from "../utils/format";

export function OrderSuccess() {
  const { orderId } = useParams();
  const { orders, siteContent } = useStore();
  const [copied, setCopied] = useState(false);

  const order = orders.find((entry) => entry.id === orderId);
  const storeInfo = siteContent?.storeInfo;

  const whatsappNumber = storeInfo?.whatsappNumber || "01970430152";
  const whatsappClean = whatsappNumber.replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Hello PoshakHeaven! I have placed order #${orderId}. Please confirm my order.`
  );
  const whatsappUrl = `https://wa.me/88${whatsappClean}?text=${whatsappMessage}`;

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Meta
        title={`Order Confirmed #${orderId || ""}`}
        description="Your PoshakHeaven order has been placed successfully."
      />

      <section className="bg-[#120B09] py-12 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Main Success Card */}
          <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-10 shadow-soft text-center">
            {/* Animated Crest */}
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full border border-accent/40 bg-[#120B09] text-accent shadow-glow">
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-luxury text-accent">
              Thank You For Your Patronage
            </p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
              Order Confirmed
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-muted max-w-md mx-auto">
              Your order has been recorded. Our team will contact you shortly to confirm packaging and dispatch.
            </p>

            {/* Order Reference Badge */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-[#120B09] px-4 py-2">
              <span className="text-xs text-muted">Order Reference:</span>
              <strong className="font-mono text-sm font-bold text-accent">
                {orderId}
              </strong>
              <button
                type="button"
                onClick={copyOrderId}
                className="text-muted hover:text-ink transition"
                title="Copy Order Reference"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            {copied && (
              <p className="mt-1 text-[11px] text-emerald-400">Reference copied to clipboard.</p>
            )}

            {/* WhatsApp Direct Confirmation Button */}
            <div className="mt-8 rounded-lg border border-accent/20 bg-accent/5 p-4 sm:p-5">
              <p className="text-xs font-bold text-ink">
                Want Instant Order Status on WhatsApp?
              </p>
              <p className="mt-1 text-[11px] text-muted">
                Connect directly with our dedicated client concierge with one tap.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-2.5 text-xs font-bold text-black transition hover:bg-[#1EBE5D] shadow-md"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp ({whatsappNumber})</span>
              </a>
            </div>

            {/* Order Summary Details if Order Found */}
            {order && (
              <div className="mt-8 border-t border-white/10 pt-6 text-left">
                <h2 className="font-heading text-lg font-bold text-ink mb-4">
                  Order Breakdown
                </h2>

                <div className="divide-y divide-white/5 rounded-md border border-white/10 bg-[#120B09] p-4 text-xs space-y-3">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex justify-between items-center pt-2">
                      <div>
                        <p className="font-semibold text-ink">{it.name}</p>
                        <p className="text-[10px] text-muted">
                          {it.size} • {it.color} • Qty: {it.quantity}
                        </p>
                      </div>
                      <span className="font-heading font-bold text-accent">
                        {formatCurrency(it.lineTotal)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-4 space-y-1.5 text-xs">
                    <div className="flex justify-between text-muted">
                      <span>Delivery ({order.deliveryZone === "outside" ? "Outside Dhaka" : "Inside Dhaka"}):</span>
                      <span className="text-ink">
                        {order.deliveryCharge === 0 ? "FREE" : formatCurrency(order.deliveryCharge)}
                      </span>
                    </div>
                    {order.discount && order.discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Bulk Discount Applied:</span>
                        <span>-{formatCurrency(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted">
                      <span>Payment Method:</span>
                      <span className="font-semibold text-ink">{order.payment.method}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 font-heading text-sm font-bold text-ink">
                      <span>Grand Total:</span>
                      <span className="text-accent">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-md border border-white/10 bg-[#120B09] p-4 text-xs text-muted">
                  <p className="font-bold text-ink mb-1">Delivery Destination:</p>
                  <p className="text-ink">{order.customer.fullName} • {order.customer.phone}</p>
                  <p className="mt-0.5">{order.customer.address}</p>
                </div>
              </div>
            )}

            {/* Actions Row */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/orders"
                className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-sm bg-accent px-6 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent"
              >
                <Truck className="h-4 w-4" />
                <span>Track This Order</span>
              </Link>

              <Link
                to="/shop"
                className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-sm border border-white/20 px-6 text-xs font-bold uppercase tracking-wider text-ink transition hover:border-accent hover:text-accent"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
