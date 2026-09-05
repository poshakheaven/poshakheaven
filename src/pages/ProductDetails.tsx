import {
  ArrowRight,
  Check,
  CheckCircle2,
  Heart,
  HelpCircle,
  Info,
  Minus,
  Plus,
  RefreshCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  ZoomIn
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { Meta } from "../components/Meta";
import { ProductCard } from "../components/ProductCard";
import { SectionTitle } from "../components/SectionTitle";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { useWishlist } from "../context/WishlistContext";
import { formatCurrency } from "../utils/format";

export function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, siteContent } = useStore();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const product = products.find((item) => item.slug === slug);

  const [selectedImage, setSelectedImage] = useState(product?.images[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0]?.name ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "shipping">("details");

  useEffect(() => {
    if (!product) return;
    setSelectedImage(product.images[0]);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]?.name ?? "");
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);

  const relatedProducts = useMemo(
    () =>
      product
        ? products
            .filter(
              (item) => item.category === product.category && item.id !== product.id
            )
            .slice(0, 4)
        : [],
    [product, products]
  );

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        action={
          <Link
            to="/shop"
            className="inline-flex h-11 items-center rounded-sm bg-accent px-6 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent"
          >
            Explore Catalog
          </Link>
        }
      >
        The silhouette you are looking for may have been retired or moved.
      </EmptyState>
    );
  }

  const activePrice = product.discountPrice ?? product.price;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPct = hasDiscount
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
    : 0;

  const handleAdd = () => {
    addToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const buyNow = () => {
    addToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    navigate("/checkout");
  };

  return (
    <>
      <Meta
        title={product.name}
        description={product.description}
      />

      {/* Main Product Showcase Section */}
      <section className="bg-[#120B09] py-8 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-accent transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-accent">{product.category}</span>
            <span>/</span>
            <span className="text-ink truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            {/* Left Column: Multi-image Editorial Gallery */}
            <div className="space-y-4">
              {/* Primary Main Image Container */}
              <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-md border border-white/10 bg-[#1A110E] shadow-soft">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Floating Image Zoom Trigger */}
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  aria-label="Zoom high-resolution view"
                  title="Expand view"
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-background/80 text-ink backdrop-blur-md transition hover:border-accent hover:text-accent hover:scale-110 shadow-lg"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>

                {/* Discount Badge */}
                {hasDiscount && (
                  <span className="absolute left-4 top-4 rounded-sm bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-background shadow-md">
                    -{discountPct}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails Rail */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-square overflow-hidden rounded-md border transition-all ${
                        selectedImage === img
                          ? "border-accent ring-2 ring-accent/50 shadow-glow"
                          : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Sticky Product Details & Actions */}
            <div className="flex flex-col justify-start">
              {/* Category & Tags */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-luxury text-accent">
                  {product.category}
                </span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-[10px] text-muted">SKU: {product.sku}</span>
              </div>

              {/* Product Title */}
              <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
                {product.name}
              </h1>

              {/* Pricing Stage */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-accent">
                  {formatCurrency(activePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-base text-muted/80 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">
                    Save {formatCurrency(product.price - (product.discountPrice || 0))}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span
                  className={`h-2 w-2 rounded-full ${
                    product.stock > 0 ? "bg-emerald-400" : "bg-rose-500"
                  }`}
                />
                <span className="text-muted">
                  {product.stock > 0 ? (
                    <span>
                      In Stock — <strong className="text-ink">{product.stock} pieces</strong> ready to dispatch
                    </span>
                  ) : (
                    <span className="text-rose-400 font-semibold">Currently Out of Stock</span>
                  )}
                </span>
              </div>

              {/* Short Description */}
              <p className="mt-5 text-xs sm:text-sm leading-relaxed text-muted border-t border-white/10 pt-5">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold uppercase tracking-wider text-ink">
                      Color: <strong className="text-accent font-bold">{selectedColor}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs font-medium transition ${
                          selectedColor === c.name
                            ? "border border-accent bg-accent/15 text-ink ring-1 ring-accent"
                            : "border border-white/15 bg-[#1A110E] text-muted hover:border-white/30 hover:text-ink"
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full ring-1 ring-white/30"
                          style={{ backgroundColor: c.value }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold uppercase tracking-wider text-ink">
                    Select Size
                  </span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-ink transition-colors"
                  >
                    <Ruler className="h-3.5 w-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[48px] h-11 px-4 rounded-sm text-xs font-bold transition-all ${
                        selectedSize === sz
                          ? "bg-accent text-background shadow-md ring-1 ring-accent font-bold"
                          : "border border-white/15 bg-[#1A110E] text-ink hover:border-accent hover:text-accent"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Main CTAs */}
              <div className="mt-8 border-t border-white/10 pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex h-12 items-center rounded-sm border border-white/15 bg-[#1A110E] px-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                      className="grid h-10 w-9 place-items-center text-muted hover:text-ink transition"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="grid h-10 w-9 place-items-center text-xs font-bold text-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((v) => Math.min(product.stock, v + 1))}
                      className="grid h-10 w-9 place-items-center text-muted hover:text-ink transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={product.stock === 0}
                    className="flex-1 flex h-12 items-center justify-center gap-2 rounded-sm bg-accent px-6 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition-all duration-300 hover:bg-ink hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4 text-background" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    aria-label="Save to Wishlist"
                    onClick={() => toggleWishlist(product.id)}
                    className="grid h-12 w-12 place-items-center rounded-sm border border-white/15 bg-[#1A110E] text-ink transition hover:border-accent hover:text-accent flex-none"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isWishlisted(product.id)
                          ? "text-accent fill-accent"
                          : "text-ink"
                      }`}
                    />
                  </button>
                </div>

                {/* Direct Buy Now Button */}
                <button
                  type="button"
                  onClick={buyNow}
                  disabled={product.stock === 0}
                  className="w-full flex h-12 items-center justify-center gap-2 rounded-sm border border-accent/40 bg-[#1A110E] text-xs font-bold uppercase tracking-wider text-accent transition-all duration-300 hover:bg-accent hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>Instant Checkout (Buy Now)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Delivery Guarantees */}
              <div className="mt-8 rounded-lg border border-white/10 bg-[#1A110E] p-4 text-xs text-muted space-y-2.5">
                <div className="flex items-center gap-2.5 text-ink font-semibold">
                  <Truck className="h-4 w-4 text-accent" />
                  <span>Express Courier Across Bangladesh (COD Available)</span>
                </div>
                <div className="flex items-center gap-2.5 text-ink font-semibold">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span>Inspect package on delivery before payment</span>
                </div>
                <div className="flex items-center gap-2.5 text-ink font-semibold">
                  <RefreshCcw className="h-4 w-4 text-accent" />
                  <span>Easy 7-day size exchange guarantee</span>
                </div>
              </div>

              {/* Editorial Accordion Specification Tabs */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex border-b border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className={`pb-3 pr-6 font-semibold uppercase tracking-wider transition ${
                      activeTab === "details"
                        ? "border-b-2 border-accent text-accent font-bold"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    Material & Specs
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("care")}
                    className={`pb-3 px-6 font-semibold uppercase tracking-wider transition ${
                      activeTab === "care"
                        ? "border-b-2 border-accent text-accent font-bold"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    Wash & Care
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("shipping")}
                    className={`pb-3 px-6 font-semibold uppercase tracking-wider transition ${
                      activeTab === "shipping"
                        ? "border-b-2 border-accent text-accent font-bold"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    Shipping & Exchange
                  </button>
                </div>

                <div className="py-4 text-xs leading-relaxed text-muted">
                  {activeTab === "details" && (
                    <div className="space-y-2">
                      <p>
                        <strong className="text-ink">Fabric Composition:</strong> {product.material || "100% Premium Heavyweight Combed Cotton"}
                      </p>
                      <p>
                        <strong className="text-ink">Craftsmanship:</strong> Reinforced twin-needle stitching with custom ribbed collar that retains shape after washing.
                      </p>
                    </div>
                  )}

                  {activeTab === "care" && (
                    <div className="space-y-2">
                      <p>
                        <strong className="text-ink">Care Guide:</strong> {product.care || "Machine wash gentle in cold water. Do not bleach. Dry in shade. Iron inside-out."}
                      </p>
                    </div>
                  )}

                  {activeTab === "shipping" && (
                    <div className="space-y-2">
                      <p>
                        <strong className="text-ink">Delivery Time:</strong> 24–48 hours inside Dhaka; 3–4 working days outside Dhaka.
                      </p>
                      <p>
                        <strong className="text-ink">Exchange:</strong> If the size doesn't fit, simply message us on WhatsApp for a swift replacement.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products / Complete The Look Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-white/10 bg-[#170E0B] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              eyebrow="Complete The Look"
              title="Complimentary Silhouettes"
              subtitle="Consider pairing with other pieces from this curated collection."
            />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Image Zoom Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-surface text-ink hover:text-accent hover:border-accent transition"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={selectedImage}
            alt={`${product.name} zoomed detail`}
            className="max-h-[90vh] max-w-full rounded-md object-contain shadow-2xl"
          />
        </div>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-lg border border-white/10 bg-[#1A110E] p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-accent" />
                <h3 className="font-heading text-xl font-bold text-ink">
                  Size & Fit Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-xs text-muted">
              Measurements are in inches. For an oversized aesthetic, take your normal size. For a regular fit, consider sizing down one size.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-accent font-semibold">
                    <th className="py-2.5">Size</th>
                    <th className="py-2.5">Chest (in)</th>
                    <th className="py-2.5">Length (in)</th>
                    <th className="py-2.5">Sleeve (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-muted">
                  <tr>
                    <td className="py-2 font-bold text-ink">S</td>
                    <td className="py-2">38 - 40</td>
                    <td className="py-2">27.5</td>
                    <td className="py-2">8.5</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-ink">M</td>
                    <td className="py-2">40 - 42</td>
                    <td className="py-2">28.5</td>
                    <td className="py-2">9.0</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-ink">L</td>
                    <td className="py-2">42 - 44</td>
                    <td className="py-2">29.5</td>
                    <td className="py-2">9.5</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-ink">XL</td>
                    <td className="py-2">44 - 46</td>
                    <td className="py-2">30.5</td>
                    <td className="py-2">10.0</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-ink">XXL</td>
                    <td className="py-2">46 - 48</td>
                    <td className="py-2">31.5</td>
                    <td className="py-2">10.5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              className="mt-6 w-full rounded-sm bg-accent py-2.5 text-xs font-bold uppercase tracking-wider text-background"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
