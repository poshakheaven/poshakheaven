import {
  ChevronDown,
  ChevronRight,
  Heart,
  Home,
  Info,
  Layers,
  Mail,
  Menu,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  X
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { useWishlist } from "../context/WishlistContext";
import { formatCurrency } from "../utils/format";

export function Header() {
  const { count, subtotal } = useCart();
  const { wishlistIds } = useWishlist();
  const { siteContent, categories } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { storeInfo, delivery } = siteContent;

  const whatsappHref = storeInfo?.whatsappNumber
    ? `https://wa.me/88${storeInfo.whatsappNumber.replace(/\D/g, "")}`
    : "https://wa.me/8801970430152";

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  // Lock body scroll when slidebar is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const freeDeliveryThreshold = delivery?.freeDeliveryMinAmount || 5000;

  return (
    <>
      {/* Top Announcement Bar - Liquid Frosted Glass */}
      <div className="liquid-glass-bar text-[11px] text-muted-light">
        <div className="w-full flex h-8 items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center gap-2 truncate text-ink-dim">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-accent font-medium">
              <Sparkles className="h-3 w-3 flex-none" />
              <span>Complimentary Delivery</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="truncate text-xs">
              Orders over <strong className="text-accent">{formatCurrency(freeDeliveryThreshold)}</strong> across Bangladesh
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs flex-none">
            <Link
              to="/orders"
              className="flex items-center gap-1.5 text-muted hover:text-accent transition-colors"
            >
              <Truck className="h-3 w-3 text-accent flex-none" />
              <span className="hidden md:inline">Track Order</span>
            </Link>
            <span className="text-white/10 hidden md:inline">|</span>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted hover:text-accent transition-colors"
              title="Direct WhatsApp Order Assistance"
            >
              <Phone className="h-3 w-3 text-accent flex-none" />
              <span className="hidden md:inline">WhatsApp: {storeInfo?.whatsappNumber || "01970430152"}</span>
              <span className="md:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header - Liquid Frosted Glass Effect */}
      <header className="sticky top-0 z-40 liquid-glass-header transition-all duration-300">
        <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Left Side: Brand Logo, Title & Slidebar Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            <Link to="/" className="flex items-center gap-2.5 group flex-none" aria-label="PoshakHeaven Home">
              <img
                src="/images/poshakheaven-logo.png"
                alt="PoshakHeaven"
                onError={(e) => {
                  e.currentTarget.src = "/poshakheaven-logo.png";
                }}
                className="h-9 w-9 rounded-full border border-accent/30 object-cover flex-none shrink-0 aspect-square shadow-glow transition-transform duration-300 group-hover:scale-105"
              />
              <span className="hidden sm:inline font-heading text-lg sm:text-xl font-bold tracking-tight text-ink whitespace-nowrap">
                PoshakHeaven
              </span>
            </Link>

            {/* Menu Slidebar Trigger Pill Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="liquid-glass-pill inline-flex h-9 items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3.5 text-xs font-semibold uppercase tracking-wider text-ink flex-none shrink-0"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="h-4 w-4 text-accent flex-none shrink-0" />
              <span>Menu</span>
            </button>
          </div>

          {/* Center Quick Navigation Shortcuts */}
          <div className="hidden lg:flex items-center gap-6">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `text-xs uppercase tracking-wider font-medium transition ${
                  isActive ? "text-accent font-bold" : "text-muted hover:text-ink"
                }`
              }
            >
              Shop All
            </NavLink>
            <NavLink
              to="/shop?tag=new"
              className={({ isActive }) =>
                `text-xs uppercase tracking-wider font-medium transition ${
                  isActive ? "text-accent font-bold" : "text-muted hover:text-ink"
                }`
              }
            >
              New Arrivals
            </NavLink>
            <NavLink
              to="/shop?tag=best"
              className={({ isActive }) =>
                `text-xs uppercase tracking-wider font-medium transition ${
                  isActive ? "text-accent font-bold" : "text-muted hover:text-ink"
                }`
              }
            >
              Best Sellers
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `text-xs uppercase tracking-wider font-medium transition ${
                  isActive ? "text-accent font-bold" : "text-muted hover:text-ink"
                }`
              }
            >
              Track Order
            </NavLink>
          </div>

          {/* Right Side: Search, Wishlist, Bag with Liquid Glass Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-none">
            {/* Desktop Search Bar */}
            <form
              onSubmit={submitSearch}
              className="liquid-glass-pill hidden md:flex relative h-9 w-40 lg:w-48 xl:w-56 items-center gap-2 rounded-full px-3 focus-within:border-accent/60"
            >
              <Search className="h-3.5 w-3.5 text-muted flex-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-muted/60"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-muted hover:text-ink text-xs"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </form>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="liquid-glass-pill grid h-9 w-9 place-items-center rounded-full text-ink md:hidden"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              title="Saved Items"
              className="liquid-glass-pill relative grid h-9 w-9 place-items-center rounded-full text-ink flex-none"
            >
              <Heart className="h-4 w-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-[1rem] place-items-center rounded-full bg-accent px-1 text-[9px] font-bold text-background shadow-md">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <Link
              to="/cart"
              aria-label="Shopping Bag"
              title="Shopping Bag"
              className="liquid-glass-pill relative flex h-9 items-center gap-2 rounded-full px-3.5 text-ink flex-none"
            >
              <ShoppingBag className="h-4 w-4 text-accent flex-none" />
              <span className="text-xs font-semibold text-ink whitespace-nowrap">
                Bag ({count})
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {searchOpen && (
          <div className="liquid-glass-bar px-4 py-3 md:hidden animate-fade-in">
            <form onSubmit={submitSearch} className="flex gap-2">
              <input
                ref={searchInputRef}
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search collection..."
                className="h-10 flex-1 rounded-full border border-white/15 bg-white/5 px-4 text-xs text-ink outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="h-10 rounded-full bg-accent px-5 text-xs font-bold uppercase tracking-wider text-background shadow-soft"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Universal Navigation Sidebar Drawer (Slidebar) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative z-10 flex h-full w-[85%] sm:w-[380px] max-w-md flex-col bg-[#120B09]/95 backdrop-blur-2xl border-r border-white/10 p-5 sm:p-7 shadow-2xl overflow-y-auto no-scrollbar animate-slide-in">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 min-w-0"
                aria-label="PoshakHeaven Home"
              >
                <img
                  src="/images/poshakheaven-logo.png"
                  alt="PoshakHeaven"
                  onError={(e) => {
                    e.currentTarget.src = "/poshakheaven-logo.png";
                  }}
                  className="h-10 w-10 rounded-full border border-accent/40 object-cover shadow-glow flex-none shrink-0 aspect-square"
                />
                <div className="min-w-0">
                  <span className="font-heading text-base sm:text-lg font-bold text-ink truncate block">
                    PoshakHeaven
                  </span>
                  <p className="text-[9px] uppercase tracking-widest text-accent font-semibold truncate">
                    Haute Couture & Essentials
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation sidebar"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-muted hover:text-ink transition flex-none shrink-0 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input Inside Drawer */}
            <form onSubmit={submitSearch} className="mt-5">
              <div className="liquid-glass-pill flex h-11 items-center gap-2 rounded-full px-4 focus-within:border-accent">
                <Search className="h-4 w-4 text-muted flex-none" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search catalogue, hoodies, shirts..."
                  className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-muted/60"
                />
              </div>
            </form>

            {/* Navigation Links in Slidebar */}
            <div className="mt-6 flex flex-col gap-1 text-sm font-medium">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-md px-3.5 py-3 text-ink hover:bg-white/5 hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <Home className="h-4 w-4 text-accent" />
                  Home
                </span>
                <ChevronRight className="h-4 w-4 text-muted/50" />
              </NavLink>

              <NavLink
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-md px-3.5 py-3 text-ink hover:bg-white/5 hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <Store className="h-4 w-4 text-accent" />
                  Shop All Collections
                </span>
                <ChevronRight className="h-4 w-4 text-muted/50" />
              </NavLink>

              {/* Curated Categories Dropdown Accordion */}
              <div className="rounded-md bg-white/[0.03] border border-white/5">
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex w-full items-center justify-between px-3.5 py-3 text-ink hover:text-accent transition-colors font-semibold"
                >
                  <span className="flex items-center gap-3">
                    <Layers className="h-4 w-4 text-accent" />
                    Categories ({categories.length})
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted/50 transition-transform duration-300 ${
                      categoriesOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>

                {categoriesOpen && (
                  <div className="px-3 pb-3 space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded px-3 py-2 text-xs text-muted hover:bg-white/5 hover:text-accent transition"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-muted/60">{cat.summary.slice(0, 24)}...</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <NavLink
                to="/shop?tag=new"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-md px-3.5 py-3 text-ink hover:bg-white/5 hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <Sparkles className="h-4 w-4 text-accent" />
                  New Arrivals
                </span>
                <span className="rounded bg-accent/20 px-2 py-0.5 text-[9px] font-bold text-accent">
                  NEW
                </span>
              </NavLink>

              <NavLink
                to="/shop?tag=best"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-md px-3.5 py-3 text-ink hover:bg-white/5 hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <Package className="h-4 w-4 text-accent" />
                  Best Sellers
                </span>
                <ChevronRight className="h-4 w-4 text-muted/50" />
              </NavLink>

              <div className="my-2 border-t border-white/10" />

              <NavLink
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-md px-3.5 py-3 text-ink hover:bg-white/5 hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <Truck className="h-4 w-4 text-accent" />
                  Track Order / My Orders
                </span>
                <ChevronRight className="h-4 w-4 text-muted/50" />
              </NavLink>

              <NavLink
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-md px-3.5 py-3 text-ink hover:bg-white/5 hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <Heart className="h-4 w-4 text-accent" />
                  Wishlist ({wishlistIds.length})
                </span>
                <ChevronRight className="h-4 w-4 text-muted/50" />
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-md px-3.5 py-3 text-ink hover:bg-white/5 hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <Info className="h-4 w-4 text-accent" />
                  Our Story & Craft
                </span>
                <ChevronRight className="h-4 w-4 text-muted/50" />
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-md px-3.5 py-3 text-ink hover:bg-white/5 hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <Mail className="h-4 w-4 text-accent" />
                  Contact & Concierge
                </span>
                <ChevronRight className="h-4 w-4 text-muted/50" />
              </NavLink>
            </div>

            {/* Drawer Bottom WhatsApp Assistance Card */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="rounded-md border border-white/10 bg-white/[0.02] p-3 text-xs text-muted">
                <p className="font-semibold text-ink">Direct Sizing & Fit Advice</p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent/20 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-background transition-colors shadow-sm"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>WhatsApp: {storeInfo?.whatsappNumber || "01970430152"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
