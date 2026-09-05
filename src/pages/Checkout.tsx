import {
  AlertCircle,
  Banknote,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  HandCoins,
  Loader2,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Truck
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { Meta } from "../components/Meta";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { defaultSiteContent } from "../data/defaultContent";
import type { PaymentMethod } from "../types";
import { formatCurrency } from "../utils/format";
import { buildOrder, sendOrder, validateBangladeshPhone } from "../utils/orders";

type CheckoutForm = {
  fullName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
  senderNumber: string;
  transactionId: string;
};

const initialForm: CheckoutForm = {
  fullName: "",
  phone: "",
  address: "",
  note: "",
  paymentMethod: "COD",
  senderNumber: "",
  transactionId: ""
};

export function Checkout() {
  const navigate = useNavigate();
  const {
    lines,
    clearCart,
    deliveryZone,
    setDeliveryZone,
    deliveryCharge,
    discountAmount,
    isFreeDelivery,
    subtotal,
    total
  } = useCart();
  const { saveOrder, siteContent } = useStore();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const merchantBkash =
    siteContent.storeInfo?.merchantBkashNumber || "01970430152";
  const deliverySettings = siteContent.delivery || defaultSiteContent.delivery;

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const copyMerchantNumber = () => {
    navigator.clipboard.writeText(merchantBkash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validate = () => {
    if (form.fullName.trim().length < 2) return "Please enter your full recipient name.";
    if (!validateBangladeshPhone(form.phone)) {
      return "Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX).";
    }
    if (form.address.trim().length < 8) {
      return "Please enter a complete delivery address (House, Road, Area, District).";
    }
    if (form.paymentMethod === "bKash") {
      if (!validateBangladeshPhone(form.senderNumber)) {
        return "Please enter your 11-digit bKash account number in 'YOUR BKASH NUMBER'.";
      }
      if (form.transactionId.trim().length < 4) {
        return "Please enter the valid bKash Transaction ID (TrxID).";
      }
    }
    return "";
  };

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    const order = buildOrder(
      lines,
      {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        note: form.note
      },
      {
        method: form.paymentMethod,
        senderNumber:
          form.paymentMethod === "bKash" ? form.senderNumber.trim() : undefined,
        transactionId:
          form.paymentMethod === "bKash" ? form.transactionId.trim() : undefined
      },
      {
        deliveryZone,
        deliveryCharge,
        discount: discountAmount
      }
    );

    setIsSubmitting(true);

    try {
      await sendOrder(order);
      const savedOrder = { ...order, telegramStatus: "sent" as const };
      saveOrder(savedOrder);
      clearCart();
      window.sessionStorage.setItem("ph_last_order_id", savedOrder.id);
      navigate(`/success/${savedOrder.id}`);
    } catch {
      // If Telegram is unconfigured or in dev mode, save locally so orders are never dropped
      const savedOrder = { ...order, telegramStatus: "pending" as const };
      saveOrder(savedOrder);
      clearCart();
      window.sessionStorage.setItem("ph_last_order_id", savedOrder.id);
      navigate(`/success/${savedOrder.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <>
        <Meta
          title="Checkout"
          description="Complete your PoshakHeaven order."
        />
        <div className="bg-[#120B09] py-16 md:py-24">
          <EmptyState
            title="Your Bag Is Empty"
            action={
              <Link
                to="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-sm bg-accent px-8 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent"
              >
                Shop Collection
              </Link>
            }
          >
            Add a signature silhouette to your cart before proceeding to checkout.
          </EmptyState>
        </div>
      </>
    );
  }

  return (
    <>
      <Meta
        title="Checkout"
        description="Secure checkout with Cash On Delivery and bKash payment across Bangladesh."
      />

      <section className="bg-[#120B09] py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 border-b border-white/10 pb-5">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-accent" />
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-luxury text-accent">
                Order Finalization
              </p>
            </div>
            <h1 className="mt-1 font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
              Secure Checkout
            </h1>
          </div>

          <form onSubmit={submitOrder} className="grid gap-10 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
            {/* Left Column: Form Fields */}
            <div className="space-y-8">
              {/* Validation Alert */}
              {error && (
                <div className="flex items-center gap-3 rounded-md border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 animate-fade-in">
                  <AlertCircle className="h-5 w-5 flex-none text-rose-400" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {/* Step 1: Customer Contact & Address */}
              <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-[11px] font-bold text-background">
                    1
                  </span>
                  <h2 className="font-heading text-xl font-bold text-ink">
                    Delivery Details
                  </h2>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Enter your recipient name"
                      className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs sm:text-sm text-ink outline-none placeholder:text-muted/60 focus:border-accent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                      Phone Number (Active for Delivery Call) *
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="017XXXXXXXX or 019XXXXXXXX"
                      className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs sm:text-sm text-ink font-mono outline-none placeholder:text-muted/60 focus:border-accent"
                    />
                  </div>

                  {/* Destination Zone Picker */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                      Delivery Zone *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryZone("inside")}
                        className={`flex flex-col rounded-sm border p-3 text-left transition ${
                          deliveryZone === "inside"
                            ? "border-accent bg-accent/15 text-ink ring-1 ring-accent"
                            : "border-white/10 bg-[#120B09] text-muted hover:border-white/20"
                        }`}
                      >
                        <span className="text-xs font-bold text-ink">Inside Dhaka</span>
                        <span className="text-[11px] text-accent mt-0.5">
                          {isFreeDelivery
                            ? "FREE (৳0)"
                            : formatCurrency(deliverySettings.insideDhakaRate || 80)}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryZone("outside")}
                        className={`flex flex-col rounded-sm border p-3 text-left transition ${
                          deliveryZone === "outside"
                            ? "border-accent bg-accent/15 text-ink ring-1 ring-accent"
                            : "border-white/10 bg-[#120B09] text-muted hover:border-white/20"
                        }`}
                      >
                        <span className="text-xs font-bold text-ink">Outside Dhaka</span>
                        <span className="text-[11px] text-accent mt-0.5">
                          {isFreeDelivery
                            ? "FREE (৳0)"
                            : formatCurrency(deliverySettings.outsideDhakaRate || 150)}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                      Full Street Address (House, Road, Area, District) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="E.g. House 14, Road 5, Block C, Banani, Dhaka"
                      className="w-full rounded-sm border border-white/15 bg-[#120B09] p-3 text-xs sm:text-sm text-ink outline-none placeholder:text-muted/60 focus:border-accent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                      Order Notes (Optional instructions)
                    </label>
                    <input
                      type="text"
                      value={form.note}
                      onChange={(e) => updateField("note", e.target.value)}
                      placeholder="Special delivery time or packaging notes..."
                      className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none placeholder:text-muted/60 focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-[11px] font-bold text-background">
                    2
                  </span>
                  <h2 className="font-heading text-xl font-bold text-ink">
                    Payment Method
                  </h2>
                </div>

                <div className="mt-6 space-y-4">
                  {/* COD Option Selector Card */}
                  <div
                    onClick={() => updateField("paymentMethod", "COD")}
                    className={`flex cursor-pointer items-start gap-4 rounded-md border p-4 transition ${
                      form.paymentMethod === "COD"
                        ? "border-accent bg-accent/10 ring-1 ring-accent"
                        : "border-white/10 bg-[#120B09] hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethodRadio"
                      value="COD"
                      checked={form.paymentMethod === "COD"}
                      onChange={() => updateField("paymentMethod", "COD")}
                      className="mt-1 accent-[#D6B49A] cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-accent" />
                        <span className="font-bold text-sm text-ink">Cash On Delivery (COD)</span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        Pay cash directly to the delivery representative upon receiving and verifying your parcel.
                      </p>
                    </div>
                  </div>

                  {/* bKash Option Selector Card */}
                  <div
                    onClick={() => updateField("paymentMethod", "bKash")}
                    className={`flex cursor-pointer items-start gap-4 rounded-md border p-4 transition ${
                      form.paymentMethod === "bKash"
                        ? "border-accent bg-accent/10 ring-1 ring-accent"
                        : "border-white/10 bg-[#120B09] hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethodRadio"
                      value="bKash"
                      checked={form.paymentMethod === "bKash"}
                      onChange={() => updateField("paymentMethod", "bKash")}
                      className="mt-1 accent-[#D6B49A] cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-accent" />
                          <span className="font-bold text-sm text-ink">bKash Payment</span>
                        </div>
                        <span className="rounded bg-[#E2136E]/20 text-[#E2136E] px-2 py-0.5 text-[10px] font-bold">
                          bKash Send Money / Personal
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        Send the total amount via bKash to our number and provide your bKash details below.
                      </p>
                    </div>
                  </div>

                  {/* bKash Details Inputs Container (Independent from Radio Label) */}
                  {form.paymentMethod === "bKash" && (
                    <div className="mt-4 rounded-md border border-accent/30 bg-[#120B09] p-5 space-y-5 animate-fade-in">
                      {/* Merchant Number Box */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded border border-white/10 bg-[#1A110E] p-3.5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                            Our bKash Number (Send Money)
                          </p>
                          <p className="font-mono text-base font-bold text-accent">
                            {merchantBkash}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={copyMerchantNumber}
                          className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-accent/20 px-3.5 text-xs font-semibold text-accent hover:bg-accent hover:text-background transition"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Number</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 2 Clean Input Boxes */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* YOUR BKASH NUMBER */}
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-accent block mb-1.5">
                            YOUR BKASH NUMBER *
                          </label>
                          <input
                            required={form.paymentMethod === "bKash"}
                            type="tel"
                            value={form.senderNumber}
                            onChange={(e) => updateField("senderNumber", e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="h-11 w-full rounded-sm border border-white/20 bg-[#1A110E] px-3.5 text-xs sm:text-sm text-ink font-mono outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                          />
                          <p className="mt-1 text-[10px] text-muted">
                            The 11-digit mobile number you sent the bKash payment from.
                          </p>
                        </div>

                        {/* TRANSACTION ID */}
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-accent block mb-1.5">
                            TRANSACTION ID (TRXID) *
                          </label>
                          <input
                            required={form.paymentMethod === "bKash"}
                            type="text"
                            value={form.transactionId}
                            onChange={(e) => updateField("transactionId", e.target.value.toUpperCase())}
                            placeholder="E.g. BL92KJ78A"
                            className="h-11 w-full rounded-sm border border-white/20 bg-[#1A110E] px-3.5 text-xs sm:text-sm text-ink font-mono uppercase outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                          />
                          <p className="mt-1 text-[10px] text-muted">
                            The transaction ID from your bKash confirmation SMS or app.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Order Summary & Submission */}
            <div className="space-y-6">
              <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 shadow-soft sticky top-24">
                <h3 className="font-heading text-lg font-bold text-ink border-b border-white/10 pb-3">
                  Items in Order ({lines.length})
                </h3>

                {/* Mini Item List */}
                <div className="mt-4 max-h-60 overflow-y-auto divide-y divide-white/5 pr-1 no-scrollbar space-y-3">
                  {lines.map((line) => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex items-center gap-3 pt-2">
                      <img
                        src={line.product.images[0]}
                        alt={line.product.name}
                        className="h-12 w-12 rounded object-cover border border-white/10 flex-none"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-semibold text-ink truncate">{line.product.name}</p>
                        <p className="text-[10px] text-muted">
                          {line.size} • {line.color} • Qty: {line.quantity}
                        </p>
                      </div>
                      <span className="font-heading text-xs font-bold text-accent">
                        {formatCurrency(line.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Line Breakdown */}
                <div className="mt-6 space-y-2.5 border-t border-white/10 pt-4 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-semibold text-ink">{formatCurrency(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Bulk Discount</span>
                      <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted">
                    <span>Delivery Charge ({deliveryZone === "outside" ? "Outside Dhaka" : "Inside Dhaka"})</span>
                    <span className="font-medium text-ink">
                      {isFreeDelivery ? (
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      ) : (
                        formatCurrency(deliveryCharge)
                      )}
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-heading text-base font-bold text-ink">Grand Total</span>
                      <span className="font-heading text-2xl font-bold text-accent">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-sm bg-accent py-3.5 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition-all duration-300 hover:bg-ink hover:text-accent hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-background" />
                      <span>Transmitting Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Place Order Now</span>
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-[10px] text-muted">
                  By confirming, you agree to our terms and customer exchange policies.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
