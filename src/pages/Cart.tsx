import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { CartSummary } from "../components/CartSummary";
import { EmptyState } from "../components/EmptyState";
import { Meta } from "../components/Meta";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";

export function Cart() {
  const { lines, getLineKey, updateQuantity, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <>
        <Meta
          title="Shopping Bag"
          description="Your PoshakHeaven shopping bag is empty."
        />
        <div className="bg-[#120B09] py-16 md:py-24">
          <EmptyState
            title="Your Bag Is Empty"
            action={
              <Link
                to="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-sm bg-accent px-8 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          >
            Add signature pieces to your bag before proceeding to checkout.
          </EmptyState>
        </div>
      </>
    );
  }

  return (
    <>
      <Meta
        title="Shopping Bag"
        description="Review items in your PoshakHeaven shopping bag, adjust quantities, and calculate delivery."
      />
      <section className="bg-[#120B09] py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-accent" />
                <p className="text-xs font-semibold uppercase tracking-luxury text-accent">
                  Your Selection
                </p>
              </div>
              <h1 className="mt-1 font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
                Shopping Bag
              </h1>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
            {/* Left Items Column */}
            <div className="space-y-4">
              {lines.map((line) => {
                const key = getLineKey(line);
                const unitPrice = line.product.discountPrice ?? line.product.price;
                const hasDiscount = Boolean(line.product.discountPrice && line.product.discountPrice < line.product.price);

                return (
                  <article
                    key={key}
                    className="flex flex-col sm:flex-row items-start gap-4 rounded-lg border border-white/10 bg-[#1A110E] p-4 sm:p-5 shadow-soft transition hover:border-white/20"
                  >
                    {/* Thumbnail */}
                    <Link
                      to={`/product/${line.product.slug}`}
                      className="aspect-square w-24 sm:w-28 flex-none overflow-hidden rounded-md border border-white/10 bg-[#2B1B17]"
                    >
                      <img
                        src={line.product.images[0]}
                        alt={line.product.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-luxury text-accent">
                            {line.product.category}
                          </p>
                          <h3 className="font-heading text-base font-bold text-ink">
                            <Link
                              to={`/product/${line.product.slug}`}
                              className="hover:text-accent transition-colors"
                            >
                              {line.product.name}
                            </Link>
                          </h3>
                        </div>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeItem(key)}
                          className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Variant Tags */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span className="rounded bg-[#120B09] border border-white/10 px-2 py-0.5 font-medium">
                          Size: <strong className="text-ink">{line.size}</strong>
                        </span>
                        <span className="rounded bg-[#120B09] border border-white/10 px-2 py-0.5 font-medium">
                          Color: <strong className="text-ink">{line.color}</strong>
                        </span>
                      </div>

                      {/* Price & Quantity Controls Row */}
                      <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/5 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-ink">
                            {formatCurrency(unitPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-muted line-through">
                              {formatCurrency(line.product.price)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Stepper */}
                          <div className="flex h-9 items-center rounded-sm border border-white/15 bg-[#120B09]">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(key, line.quantity - 1)}
                              className="grid h-9 w-8 place-items-center text-muted hover:text-ink transition"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="grid h-9 w-7 place-items-center text-xs font-bold text-ink">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(key, line.quantity + 1)}
                              className="grid h-9 w-8 place-items-center text-muted hover:text-ink transition"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Line Subtotal */}
                          <span className="font-heading text-sm font-bold text-accent min-w-[70px] text-right">
                            {formatCurrency(line.lineTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Right Summary Sidebar */}
            <div>
              <CartSummary checkoutLink={true} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
