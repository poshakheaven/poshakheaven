import { Check, Eye, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import type { Product } from "../types";
import { formatCurrency } from "../utils/format";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const price = product.discountPrice ?? product.price;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPct = hasDiscount
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
    : 0;

  const handleQuickAdd = () => {
    addToCart({
      product,
      size: selectedSize,
      color: selectedColor || product.colors[0]?.name || "Standard",
      quantity: 1
    });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setShowQuickAdd(false);
    }, 1200);
  };

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-md border border-white/10 bg-[#1A110E] transition-all duration-500 hover:-translate-y-1 hover:border-[#D6B49A]/40 hover:shadow-luxury"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#2B1B17]">
        <Link
          to={`/product/${product.slug}`}
          className="block h-full w-full overflow-hidden"
          aria-label={`View ${product.name}`}
        >
          {/* Main & Secondary Image Transition */}
          <img
            src={primaryImage}
            alt={product.name}
            className={`h-full w-full object-cover transition-all duration-700 ease-out ${
              product.images[1] && isHovered
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100 group-hover:scale-105"
            }`}
            loading="lazy"
          />

          {product.images[1] && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
              loading="lazy"
            />
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          {hasDiscount && (
            <span className="rounded-sm bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background shadow-md">
              -{discountPct}%
            </span>
          )}
          {product.tags.includes("new") && (
            <span className="rounded-sm bg-[#120B09]/90 border border-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-ink backdrop-blur-sm">
              New Drop
            </span>
          )}
          {product.tags.includes("best") && (
            <span className="rounded-sm bg-[#4A2F27]/90 border border-accent/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-accent backdrop-blur-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={
            isWishlisted(product.id)
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-background/80 text-ink backdrop-blur-md transition-all duration-300 hover:border-accent hover:text-accent hover:scale-110 shadow-md"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted(product.id)
                ? "text-accent fill-accent"
                : "text-ink"
            }`}
          />
        </button>

        {/* Quick View Button for Mobile / Hover */}
        <Link
          to={`/product/${product.slug}`}
          className="absolute bottom-3 left-3 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-background/80 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:grid hidden backdrop-blur-sm hover:border-accent hover:text-accent"
          title="View Details"
        >
          <Eye className="h-3.5 w-3.5" />
        </Link>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-[2px]">
            <span className="rounded-sm border border-white/20 bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Add Overlay on Hover / Click */}
        {showQuickAdd && product.stock > 0 && (
          <div className="absolute inset-x-0 bottom-0 bg-[#120B09]/95 p-3.5 border-t border-white/15 backdrop-blur-md animate-fade-in z-10">
            <div className="flex items-center justify-between text-xs text-muted mb-2">
              <span className="font-semibold text-ink">Select Size:</span>
              <span className="text-[10px] uppercase text-accent font-bold">
                {product.stock} in stock
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`h-7 px-2.5 rounded-sm text-xs font-semibold transition ${
                    selectedSize === s
                      ? "bg-accent text-background font-bold ring-1 ring-accent"
                      : "border border-white/20 bg-surface text-ink hover:border-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={justAdded}
              className="w-full flex h-9 items-center justify-center gap-2 rounded-sm bg-accent text-xs font-bold uppercase tracking-wider text-background transition hover:bg-ink hover:text-accent"
            >
              {justAdded ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Confirm Add</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Color Dots */}
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-luxury text-accent">
            {product.category}
          </span>
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((col) => (
                <span
                  key={col.name}
                  title={col.name}
                  className="h-2.5 w-2.5 rounded-full border border-white/30"
                  style={{ backgroundColor: col.value }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] text-muted font-mono">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Product Title */}
        <h3 className="line-clamp-1 font-heading text-base font-semibold text-ink transition-colors group-hover:text-accent">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Pricing & Add To Cart Button */}
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-white/5 pt-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-ink sm:text-base">
                {formatCurrency(price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted/80 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[10px] text-muted">
              {product.stock > 0 ? (
                <span className="text-emerald-400 font-medium">In Stock</span>
              ) : (
                <span className="text-rose-400 font-medium">Sold Out</span>
              )}
            </p>
          </div>

          {/* Quick Add / Select CTA */}
          <button
            type="button"
            disabled={product.stock === 0}
            onClick={() => {
              if (product.sizes.length > 1) {
                setShowQuickAdd(!showQuickAdd);
              } else {
                handleQuickAdd();
              }
            }}
            aria-label={`Quick add ${product.name}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-white/15 bg-surface/80 px-3 text-xs font-semibold text-ink transition-all duration-300 hover:border-accent hover:bg-accent hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">
              {product.sizes.length > 1 ? "Add" : "Add"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
