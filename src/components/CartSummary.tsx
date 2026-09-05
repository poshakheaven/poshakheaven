import {
  CheckCircle2,
  Gift,
  HelpCircle,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { defaultSiteContent } from "../data/defaultContent";
import { formatCurrency } from "../utils/format";

type CartSummaryProps = {
  checkoutLink?: boolean;
};

export function CartSummary({ checkoutLink = true }: CartSummaryProps) {
  const {
    subtotal,
    deliveryZone,
    setDeliveryZone,
    deliveryCharge,
    discountAmount,
    isFreeDelivery,
    isBulkDiscountEligible,
    total,
    lines
  } = useCart();
  const { siteContent } = useStore();

  const deliverySettings = siteContent?.delivery || defaultSiteContent.delivery;
  const bulkDiscountSettings =
    siteContent?.bulkDiscount || defaultSiteContent.bulkDiscount;

  const freeDeliveryThreshold = deliverySettings.freeDeliveryMinAmount || 5000;
  const bulkSpendThreshold = bulkDiscountSettings.minSpend || 5000;

  const amountUntilFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const amountUntilBulkDiscount = Math.max(0, bulkSpendThreshold - subtotal);

  const freeDeliveryPercent = Math.min(
    100,
    Math.round((subtotal / (freeDeliveryThreshold || 1)) * 100)
  );

  return (
    <aside className="h-fit rounded-lg border border-white/10 bg-[#1A110E] p-5 sm:p-6 shadow-soft">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="font-heading text-xl font-bold text-ink">Order Summary</h2>
        <span className="text-xs text-muted font-medium">
          {lines.length} {lines.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {/* Delivery Zone Switcher */}
      <div className="mt-5 rounded-md border border-white/10 bg-[#120B09] p-3">
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
          <MapPin className="h-3.5 w-3.5 text-accent" />
          Delivery Destination
        </label>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDeliveryZone("inside")}
            className={`flex flex-col items-start rounded-sm p-2.5 text-left transition ${
              deliveryZone === "inside"
                ? "border border-accent bg-accent/15 text-ink ring-1 ring-accent"
                : "border border-white/10 bg-surface/50 text-muted hover:border-white/20"
            }`}
          >
            <span className="text-xs font-bold text-ink">Inside Dhaka</span>
            <span className="text-[10px] text-accent mt-0.5">
              {isFreeDelivery
                ? "FREE (৳0)"
                : formatCurrency(deliverySettings.insideDhakaRate || 80)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setDeliveryZone("outside")}
            className={`flex flex-col items-start rounded-sm p-2.5 text-left transition ${
              deliveryZone === "outside"
                ? "border border-accent bg-accent/15 text-ink ring-1 ring-accent"
                : "border border-white/10 bg-surface/50 text-muted hover:border-white/20"
            }`}
          >
            <span className="text-xs font-bold text-ink">Outside Dhaka</span>
            <span className="text-[10px] text-accent mt-0.5">
              {isFreeDelivery
                ? "FREE (৳0)"
                : formatCurrency(deliverySettings.outsideDhakaRate || 150)}
            </span>
          </button>
        </div>
      </div>

      {/* Promotional Progress Rails */}
      <div className="mt-5 space-y-3">
        {/* Free Delivery Bar */}
        {freeDeliveryThreshold > 0 && (
          <div className="rounded-md border border-white/10 bg-[#120B09]/80 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <Truck className="h-3.5 w-3.5 text-accent" />
                {isFreeDelivery ? (
                  <span className="text-emerald-400 font-semibold">
                    Free Delivery Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-accent">{formatCurrency(amountUntilFreeDelivery)}</strong> for Free Delivery
                  </span>
                )}
              </span>
              <span className="text-[10px] text-muted font-mono">
                {freeDeliveryPercent}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeDelivery ? "bg-emerald-400" : "bg-accent"
                }`}
                style={{ width: `${freeDeliveryPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Bulk Spend Discount Notification */}
        {bulkDiscountSettings.enabled && Number(bulkDiscountSettings.discountPercentage || 0) > 0 && (
          <div>
            {isBulkDiscountEligible ? (
              <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-ink">
                <Sparkles className="h-4 w-4 flex-none text-emerald-400" />
                <p>
                  <strong className="text-emerald-400">
                    🎉 {bulkDiscountSettings.discountPercentage}% VIP Bulk Discount Applied!
                  </strong>
                </p>
              </div>
            ) : amountUntilBulkDiscount > 0 ? (
              <div className="flex items-center gap-2 rounded-md border border-accent/25 bg-accent/10 p-3 text-xs text-muted">
                <Gift className="h-4 w-4 flex-none text-accent" />
                <p>
                  Add <strong className="text-ink">{formatCurrency(amountUntilBulkDiscount)}</strong> more to unlock <strong className="text-accent">{bulkDiscountSettings.discountPercentage}% OFF</strong>!
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Financial Line Breakdown */}
      <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-xs">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span className="font-semibold text-ink">{formatCurrency(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span className="flex items-center gap-1">
              <Gift className="h-3 w-3" />
              Bulk Discount ({bulkDiscountSettings.discountPercentage}%)
            </span>
            <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-muted">
          <span>Delivery Charge</span>
          <span className="font-medium text-ink">
            {isFreeDelivery ? (
              <span className="text-emerald-400 font-semibold">FREE (৳0)</span>
            ) : (
              formatCurrency(deliveryCharge)
            )}
          </span>
        </div>

        <div className="border-t border-white/10 pt-3">
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-base font-bold text-ink">Estimated Total</span>
            <span className="font-heading text-xl font-bold text-accent">
              {formatCurrency(total)}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-muted">
            Includes all applicable charges. Pay via COD or bKash.
          </p>
        </div>
      </div>

      {/* Checkout Link Action */}
      {checkoutLink && (
        <Link
          to="/checkout"
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-accent text-xs font-bold uppercase tracking-wider text-background shadow-soft transition-all duration-300 hover:bg-ink hover:text-accent hover:shadow-glow"
        >
          <span>Proceed to Checkout</span>
        </Link>
      )}

      {/* Trust Guarantees */}
      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/5 pt-4 text-[10px] text-muted">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-accent flex-none" />
          <span>Cash on Delivery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-accent flex-none" />
          <span>Manual bKash</span>
        </div>
      </div>
    </aside>
  );
}
