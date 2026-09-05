import {
  ArrowRight,
  CheckCircle2,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export function Footer() {
  const { siteContent } = useStore();
  const { storeInfo } = siteContent;
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const whatsappHref = storeInfo?.whatsappNumber
    ? `https://wa.me/88${storeInfo.whatsappNumber.replace(/\D/g, "")}`
    : "https://wa.me/8801970430152";

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-white/10 bg-[#170E0B] text-ink">
      {/* Brand Value Pillars Bar */}
      <div className="border-b border-white/5 bg-[#120B09]/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-11 w-11 place-items-center rounded-full border border-accent/20 bg-surface/80 text-accent flex-none">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Artisan Quality
                </h3>
                <p className="text-[11px] text-muted">240+ GSM combed cotton</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="grid h-11 w-11 place-items-center rounded-full border border-accent/20 bg-surface/80 text-accent flex-none">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Nationwide Courier
                </h3>
                <p className="text-[11px] text-muted">Direct to your doorstep</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="grid h-11 w-11 place-items-center rounded-full border border-accent/20 bg-surface/80 text-accent flex-none">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Cash On Delivery
                </h3>
                <p className="text-[11px] text-muted">Inspect before payment</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="grid h-11 w-11 place-items-center rounded-full border border-accent/20 bg-surface/80 text-accent flex-none">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  bKash Verified
                </h3>
                <p className="text-[11px] text-muted">Instant official confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand Intro & Contact */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/images/poshakheaven-logo.png"
                alt="PoshakHeaven"
                className="h-12 w-12 rounded-full border border-[#D6B49A]/30 object-cover shadow-glow"
              />
              <div>
                <span className="font-heading text-2xl font-bold tracking-tight text-ink">
                  PoshakHeaven
                </span>
                <p className="text-[9px] uppercase tracking-luxury text-accent font-semibold">
                  Luxury Fashion Bangladesh
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-xs leading-relaxed text-muted">
              {storeInfo?.footerAbout ||
                "Refined wardrobe essentials for Bangladesh, tailored with premium heavyweight fabrics, modern silhouettes, and quiet luxury craftsmanship."}
            </p>

            <div className="pt-2 flex items-center gap-2.5">
              {storeInfo?.whatsappNumber && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Concierge"
                  title={`WhatsApp: ${storeInfo.whatsappNumber}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-surface/60 text-ink transition hover:border-accent hover:text-accent hover:scale-105"
                >
                  <Phone className="h-4 w-4" />
                </a>
              )}
              {storeInfo?.instagramUrl && (
                <a
                  href={storeInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Follow on Instagram"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-surface/60 text-ink transition hover:border-accent hover:text-accent hover:scale-105"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {storeInfo?.email && (
                <a
                  href={`mailto:${storeInfo.email}`}
                  aria-label="Email Support"
                  title={`Email: ${storeInfo.email}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-surface/60 text-ink transition hover:border-accent hover:text-accent hover:scale-105"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-surface/40 px-3 py-1 text-[11px] text-muted">
                <MapPin className="h-3 w-3 text-accent" />
                <span>{storeInfo?.location || "Dhaka, Bangladesh"}</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">
              Collections
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-muted">
              <li>
                <Link className="transition hover:text-accent" to="/shop">
                  All Products
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/shop?tag=new">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/shop?tag=best">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/category/oversized-t-shirts">
                  Oversized T-Shirts
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/category/hoodies">
                  Heavyweight Hoodies
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/wishlist">
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">
              Client Care
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-muted">
              <li>
                <Link className="transition hover:text-accent" to="/orders">
                  Track Order / Status
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/shipping-policy">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/return-policy">
                  Exchange & Return Policy
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/about">
                  Brand Philosophy
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/contact">
                  Customer Concierge
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/privacy-policy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-accent" to="/terms-and-conditions">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* VIP Newsletter Box */}
          <div className="rounded-lg border border-white/10 bg-surface/70 p-5 shadow-soft">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
              VIP Club
            </span>
            <h4 className="mt-1 font-heading text-lg font-semibold text-ink">
              Seasonal Drops & VIP Access
            </h4>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              Subscribe to receive private lookbooks, limited run announcements, and exclusive offers.
            </p>

            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <label htmlFor="footer-newsletter" className="sr-only">
                Email Address
              </label>
              <input
                id="footer-newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email..."
                className="h-10 min-w-0 flex-1 rounded-sm border border-white/10 bg-background px-3 text-xs text-ink outline-none placeholder:text-muted/60 focus:border-accent"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-accent text-background transition hover:bg-ink hover:text-accent flex-none"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {subscribed && (
              <p className="mt-2.5 text-xs text-success font-medium animate-fade-in">
                ✓ Welcome to PoshakHeaven VIP list.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-white/10 bg-[#120B09] py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:px-6 text-center text-[11px] text-muted md:flex-row lg:px-8">
          <p>© 2026 PoshakHeaven. All rights reserved. Crafted with distinction in Dhaka, Bangladesh.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-light font-mono">bKash Merchant Verified</span>
            <span className="text-white/20">•</span>
            <span className="text-muted-light font-mono">COD Nationwide</span>
            <span className="text-white/20">•</span>
            <Link to="/secure-admin-login" className="text-muted/40 hover:text-muted transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
