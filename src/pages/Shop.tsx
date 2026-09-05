import {
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Truck,
  X
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CustomSelect } from "../components/CustomSelect";
import { EmptyState } from "../components/EmptyState";
import { Meta } from "../components/Meta";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../context/StoreContext";
import { categories } from "../data/catalog";
import { formatCurrency } from "../utils/format";

type SortMode = "featured" | "low-high" | "high-low" | "newest";
type PriceMode = "all" | "under-1500" | "1500-2500" | "2500-plus";

const categoryNames = ["All", ...categories.map((category) => category.name)];

export function Shop() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, siteContent } = useStore();

  const routedCategory =
    categories.find((category) => category.slug === categorySlug)?.name ?? "All";
  const urlQuery = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag");

  const [query, setQuery] = useState(urlQuery);
  const [category, setCategory] = useState(routedCategory);
  const [priceMode, setPriceMode] = useState<PriceMode>("all");
  const [size, setSize] = useState("All");
  const [color, setColor] = useState("All");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => setQuery(urlQuery), [urlQuery]);
  useEffect(() => setCategory(routedCategory), [routedCategory]);

  const sizes = useMemo(
    () => ["All", ...Array.from(new Set(products.flatMap((p) => p.sizes)))],
    [products]
  );
  const colors = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(products.flatMap((p) => p.colors.map((item) => item.name)))
      )
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const loweredQuery = query.toLowerCase().trim();

    const result = products.filter((product) => {
      const price = product.discountPrice ?? product.price;
      const matchesTag =
        tag === "new" || tag === "best" || tag === "featured"
          ? product.tags.includes(tag)
          : true;
      const matchesQuery =
        !loweredQuery ||
        product.name.toLowerCase().includes(loweredQuery) ||
        product.category.toLowerCase().includes(loweredQuery) ||
        product.sku.toLowerCase().includes(loweredQuery);
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesSize = size === "All" || product.sizes.includes(size);
      const matchesColor =
        color === "All" ||
        product.colors.some((productColor) => productColor.name === color);
      const matchesPrice =
        priceMode === "all" ||
        (priceMode === "under-1500" && price < 1500) ||
        (priceMode === "1500-2500" && price >= 1500 && price <= 2500) ||
        (priceMode === "2500-plus" && price > 2500);

      return (
        matchesTag &&
        matchesQuery &&
        matchesCategory &&
        matchesSize &&
        matchesColor &&
        matchesPrice
      );
    });

    return result.sort((a, b) => {
      if (sortMode === "low-high") {
        return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
      }
      if (sortMode === "high-low") {
        return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
      }
      if (sortMode === "newest") {
        return Number(b.tags.includes("new")) - Number(a.tags.includes("new"));
      }
      return (
        Number(b.tags.includes("featured")) -
        Number(a.tags.includes("featured"))
      );
    });
  }, [category, color, priceMode, products, query, size, sortMode, tag]);

  const activeFiltersCount =
    (category !== "All" ? 1 : 0) +
    (priceMode !== "all" ? 1 : 0) +
    (size !== "All" ? 1 : 0) +
    (color !== "All" ? 1 : 0) +
    (query ? 1 : 0) +
    (tag ? 1 : 0);

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setPriceMode("all");
    setSize("All");
    setColor("All");
    setSortMode("featured");
    setSearchParams({});
  };

  const pageTitle =
    tag === "new"
      ? "New Arrivals"
      : tag === "best"
        ? "Best Sellers"
        : tag === "featured"
          ? "Featured Collection"
          : category !== "All"
            ? category
            : "Shop All";

  return (
    <>
      <Meta
        title={pageTitle}
        description="Filter and shop premium t-shirts, shirts, hoodies, pants, joggers, and accessories from PoshakHeaven."
      />

      {/* Editorial Collection Banner */}
      <section className="relative border-b border-white/10 bg-[#170E0B] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-accent" />
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-luxury text-accent">
              The Wardrobe
            </p>
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-ink sm:text-5xl md:text-6xl">
            {pageTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted">
            Engineered silhouettes, pure cotton interlock, and timeless luxury cuts designed for effortless everyday wearing.
          </p>

          {/* Quick Category Filter Bar */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categoryNames.map((cat) => {
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-accent text-background font-bold shadow-md"
                      : "border border-white/10 bg-[#1A110E] text-muted hover:border-accent/40 hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <section className="bg-[#120B09] py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Controls Bar */}
          <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-sm border border-white/15 bg-surface px-4 text-xs font-semibold text-ink lg:hidden hover:border-accent"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
                <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
              </button>

              <p className="text-xs text-muted">
                Showing <strong className="text-ink">{filteredProducts.length}</strong> of{" "}
                {products.length} pieces
              </p>
            </div>

            {/* Sort & Search in Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted hidden sm:inline">Sort:</span>
              <CustomSelect
                value={sortMode}
                onChange={(val) => setSortMode(val as SortMode)}
                options={[
                  { value: "featured", label: "Featured" },
                  { value: "newest", label: "Newest Arrivals" },
                  { value: "low-high", label: "Price: Low to High" },
                  { value: "high-low", label: "Price: High to Low" }
                ]}
                className="w-48"
                buttonClassName="h-10 bg-[#1A110E] text-xs"
              />
            </div>
          </div>

          {/* Catalog Layout Grid */}
          <div className="grid gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden h-fit space-y-6 rounded-lg border border-white/10 bg-[#1A110E] p-5 shadow-soft lg:block sticky top-24">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-accent" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                    Filter Catalogue
                  </h2>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-ink transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Search within Category */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-2">
                  Keyword Search
                </label>
                <div className="flex h-10 items-center gap-2 rounded-sm border border-white/10 bg-[#120B09] px-3">
                  <Search className="h-3.5 w-3.5 text-muted" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="E.g. Oversized, Ivory..."
                    className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-muted/60"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="text-muted hover:text-ink"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-2">
                  Price Tier
                </label>
                <CustomSelect
                  value={priceMode}
                  onChange={(val) => setPriceMode(val as PriceMode)}
                  options={[
                    { value: "all", label: "All Price Points" },
                    { value: "under-1500", label: "Under ৳1,500" },
                    { value: "1500-2500", label: "৳1,500 – ৳2,500" },
                    { value: "2500-plus", label: "Above ৳2,500" }
                  ]}
                  buttonClassName="bg-[#120B09] text-xs h-10"
                />
              </div>

              {/* Size Filter */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-2">
                  Size
                </label>
                <CustomSelect
                  value={size}
                  onChange={setSize}
                  options={sizes}
                  placeholder="Filter by size"
                  buttonClassName="bg-[#120B09] text-xs h-10"
                />
              </div>

              {/* Color Filter */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-2">
                  Colorway
                </label>
                <CustomSelect
                  value={color}
                  onChange={setColor}
                  options={colors}
                  placeholder="Filter by color"
                  buttonClassName="bg-[#120B09] text-xs h-10"
                />
              </div>

              {/* Delivery Assurance Widget */}
              <div className="rounded-md border border-white/10 bg-[#120B09] p-3.5 text-xs text-muted space-y-2">
                <div className="flex items-center gap-2 text-accent font-semibold">
                  <Truck className="h-4 w-4" />
                  <span>Complimentary Shipping</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Orders over {formatCurrency(siteContent.delivery?.freeDeliveryMinAmount || 5000)} qualify for free express delivery.
                </p>
              </div>
            </aside>

            {/* Products Grid Stage */}
            <div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-[#1A110E] p-12 text-center">
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-accent/30 bg-surface text-accent">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-ink">
                    No Matching Silhouettes
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted max-w-sm mx-auto">
                    We couldn't find any items matching your selected criteria. Try resetting filters or exploring all products.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-xs font-bold uppercase tracking-wider text-background transition hover:bg-ink hover:text-accent"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 flex h-full w-[85%] max-w-sm flex-col bg-[#120B09] border-r border-white/10 p-6 shadow-2xl overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-accent" />
                <h3 className="font-heading text-lg font-bold text-ink">Filters</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {/* Category */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                  Category
                </label>
                <CustomSelect
                  value={category}
                  onChange={setCategory}
                  options={categoryNames}
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                  Price Range
                </label>
                <CustomSelect
                  value={priceMode}
                  onChange={(val) => setPriceMode(val as PriceMode)}
                  options={[
                    { value: "all", label: "All Price Points" },
                    { value: "under-1500", label: "Under ৳1,500" },
                    { value: "1500-2500", label: "৳1,500 – ৳2,500" },
                    { value: "2500-plus", label: "Above ৳2,500" }
                  ]}
                />
              </div>

              {/* Size */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                  Size
                </label>
                <CustomSelect
                  value={size}
                  onChange={setSize}
                  options={sizes}
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                  Color
                </label>
                <CustomSelect
                  value={color}
                  onChange={setColor}
                  options={colors}
                />
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  setMobileFiltersOpen(false);
                }}
                className="flex-1 rounded-sm border border-white/20 py-2.5 text-xs font-semibold text-muted hover:text-ink"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 rounded-sm bg-accent py-2.5 text-xs font-bold uppercase tracking-wider text-background"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
