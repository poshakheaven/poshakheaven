import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Feather,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  Truck
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Meta } from "../components/Meta";
import { ProductCard } from "../components/ProductCard";
import { SectionTitle } from "../components/SectionTitle";
import { useStore } from "../context/StoreContext";

export function Home() {
  const { products, siteContent, categories } = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { hero, campaign } = siteContent;

  const featuredProducts = products
    .filter((product) => product.tags.includes("featured"))
    .slice(0, 4);
  const newArrivals = products
    .filter((product) => product.tags.includes("new"))
    .slice(0, 4);
  const bestSellers = products
    .filter((product) => product.tags.includes("best"))
    .slice(0, 4);

  const submitNewsletter = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <>
      <Meta
        title="Luxury Fashion Bangladesh"
        description="Discover luxury t-shirts, shirts, hoodies, tailored pants, joggers, and accessories from PoshakHeaven."
      />

      {/* Editorial Hero Banner */}
      <section className="relative min-h-[580px] lg:min-h-[720px] overflow-hidden bg-[#120B09] flex items-center">
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.image}
            alt={hero.title}
            className="h-full w-full object-cover object-center transform scale-105 transition-transform duration-1000"
          />
          {/* Multi-stage Luxury Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#120B09] via-[#120B09]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120B09] via-transparent to-black/30" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-[#1A110E]/80 px-3.5 py-1 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-luxury text-accent">
                {hero.badge || "Autumn Edit 2026"}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl leading-[1.08]">
              {hero.title || "PoshakHeaven"}
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-ivory/90 md:text-lg">
              {hero.subtitle ||
                "Premium wardrobe essentials for Bangladesh, shaped by refined fabric, modern proportion, and quiet luxury details."}
            </p>

            {/* CTA Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <Link
                to={hero.primaryButtonLink || "/shop"}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-sm bg-accent px-7 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition-all duration-300 hover:bg-ink hover:text-accent hover:shadow-glow"
              >
                <span>{hero.primaryButtonText || "Shop Collection"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={hero.secondaryButtonLink || "/shop?tag=new"}
                className="inline-flex h-12 items-center justify-center rounded-sm border border-white/20 bg-surface/40 px-6 text-xs font-bold uppercase tracking-wider text-ink backdrop-blur-sm transition-all duration-300 hover:border-accent hover:text-accent hover:bg-surface/80"
              >
                {hero.secondaryButtonText || "New Arrivals"}
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="mt-10 flex items-center gap-6 border-t border-white/10 pt-6 text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Heavyweight Fabrics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>COD Nationwide</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>bKash Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker / Brand Values Marquee */}
      <div className="overflow-hidden border-y border-white/10 bg-[#1A110E] py-3.5 text-xs text-muted font-medium">
        <div className="flex whitespace-nowrap animate-marquee gap-8">
          {[
            "100% Premium Heavyweight Combed Cotton",
            "Express Doorstep Delivery Across Bangladesh",
            "Cash On Delivery & Verified bKash Checkout",
            "Hassle-Free Size & Style Exchange",
            "Quiet Luxury Aesthetics & Tailored Fits",
            "100% Premium Heavyweight Combed Cotton",
            "Express Doorstep Delivery Across Bangladesh",
            "Cash On Delivery & Verified bKash Checkout",
            "Hassle-Free Size & Style Exchange",
            "Quiet Luxury Aesthetics & Tailored Fits"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-accent">•</span>
              <span className="tracking-wide uppercase text-[11px] text-ink/80">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Categories Section */}
      <section className="bg-[#120B09] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="The Collections"
            title="Curated Categories"
            subtitle="Explore our considered categories crafted for modern Bangladeshi lifestyles."
            action={
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:text-ink transition-colors"
              >
                <span>View Full Catalog</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group relative flex min-h-[220px] sm:min-h-[260px] flex-col justify-between overflow-hidden rounded-md border border-white/10 bg-[#1A110E] p-4 transition-all duration-500 hover:border-accent/40 hover:shadow-luxury"
              >
                {/* Category Image with Overlay */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-75"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120B09] via-[#120B09]/40 to-transparent" />

                {/* Index number */}
                <div className="relative z-10 flex justify-between">
                  <span className="font-mono text-[10px] font-bold text-accent/80">
                    0{index + 1}
                  </span>
                </div>

                {/* Info Container */}
                <div className="relative z-10">
                  <h3 className="font-heading text-base font-bold text-ink transition-colors group-hover:text-accent">
                    {category.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-tight text-muted/90">
                    {category.summary}
                  </p>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Shop Now <ArrowRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="border-t border-white/10 bg-[#170E0B] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Editorial Pick"
            title="Featured Essentials"
            subtitle="Signature pieces defined by proportion, texture, and lasting longevity."
            action={
              <Link
                to="/shop?tag=featured"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:text-ink transition-colors"
              >
                <span>View All Featured</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Campaign Lookbook (Admin Editable) - Animated Hero Gradient Backdrop */}
      <section className="relative overflow-hidden border-y border-accent/20 bg-gradient-to-br from-[#1E120D] via-[#150D0A] to-[#0D0706] py-20 md:py-28">
        {/* Animated Hero Gradient Glow Backdrop & Mesh */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Top subtle golden shimmer border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          {/* Floating Glowing Ambient Orbs */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-accent/20 to-secondary/30 blur-[110px] animate-float-slow" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-[#4A2F27]/40 to-accent/15 blur-[120px] animate-float-reverse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-accent/5 blur-[130px] animate-pulse-subtle" />

          {/* Luxury Ambient Radial Gradient & Subtle Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

          {/* Bottom subtle golden shimmer border */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16 lg:px-8">
          {/* Left Text Block */}
          <div>
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/80 px-3.5 py-1.5 backdrop-blur-md shadow-sm mb-4">
              <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse-subtle" />
              <p className="text-[11px] font-semibold uppercase tracking-luxury text-accent">
                {campaign.eyebrow || "Limited Campaign"}
              </p>
            </div>

            <h2 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl leading-[1.12]">
              {campaign.title || "Mid-season pieces, softer pricing."}
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-muted/90 max-w-lg">
              {campaign.description ||
                "Save on selected t-shirts, hoodies, shirts, and accessories while stock lasts. Cash On Delivery and bKash Payment are available at checkout."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={campaign.buttonLink || "/shop"}
                className="inline-flex h-12 items-center gap-2.5 rounded-sm bg-accent px-7 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition-all duration-300 hover:bg-ink hover:text-accent hover:shadow-glow"
              >
                <span>{campaign.buttonText || "Explore Edit"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/orders"
                className="inline-flex h-12 items-center rounded-sm border border-white/20 bg-surface/50 px-6 text-xs font-bold uppercase tracking-wider text-ink backdrop-blur-sm transition-all duration-300 hover:border-accent hover:text-accent hover:bg-surface/80"
              >
                Track Your Order
              </Link>
            </div>

            {/* Subtle editorial highlight bullets */}
            <div className="mt-10 flex items-center gap-6 border-t border-white/10 pt-6 text-xs text-muted/80">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Curated Capsule</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Limited Quantities</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Priority Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Image Lookbook Grid */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4.5">
            {campaign.images.slice(0, 4).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-md border border-accent/20 bg-[#1A110E] shadow-luxury transition-all duration-500 hover:border-accent/60 hover:shadow-glow"
              >
                <img
                  src={image}
                  alt={`PoshakHeaven lookbook ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Image Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                {/* Index tag */}
                <div className="absolute top-3 left-3 z-10 rounded bg-black/60 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-accent backdrop-blur-md border border-white/10">
                  LOOK 0{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="border-t border-white/10 bg-[#170E0B] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Fresh In"
            title="New Arrivals"
            subtitle="The newest silhouettes, fresh colorways, and seasonal additions."
            action={
              <Link
                to="/shop?tag=new"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:text-ink transition-colors"
              >
                <span>Explore All New</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="border-t border-white/10 bg-[#120B09] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Iconic Silhouettes"
            title="Customer Favorites"
            subtitle="Loved for their structured drape, durability, and understated elegance."
            action={
              <Link
                to="/shop?tag=best"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:text-ink transition-colors"
              >
                <span>View All Best Sellers</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Testimonials & VIP Drop Box */}
      <section className="border-t border-white/10 bg-[#170E0B] py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-8">
          {/* Client Reviews */}
          <div>
            <SectionTitle
              eyebrow="Client Stories"
              title="Worn Across Bangladesh"
              subtitle="Real experiences from customers across Dhaka, Chittagong, and beyond."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: "Nafisa R.",
                  city: "Gulshan, Dhaka",
                  quote:
                    "The fabric feels truly elevated without being loud. The oversized tee has the perfect collar retention after multiple washes."
                },
                {
                  name: "Ariyan H.",
                  city: "Dhanmondi, Dhaka",
                  quote:
                    "Fast confirmation via WhatsApp, clean luxury unboxing, and the hoodie has the exact heavyweight drape I wanted."
                },
                {
                  name: "Zubair K.",
                  city: "Chittagong",
                  quote:
                    "Exceptional stitch quality and color depth. It feels like buying from an international designer label right here in BD."
                },
                {
                  name: "Tanvir S.",
                  city: "Uttara, Dhaka",
                  quote:
                    "Easy COD process. The pants fit like a bespoke tailor made them. 10/10 recommendation for quality lovers."
                }
              ].map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="rounded-lg border border-white/10 bg-[#1A110E] p-5 shadow-sm transition hover:border-accent/30"
                >
                  <div className="flex items-center gap-1 text-accent mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-accent" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <div>
                      <p className="text-xs font-bold text-ink">{testimonial.name}</p>
                      <p className="text-[10px] text-muted">{testimonial.city}</p>
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400">
                      Verified Buyer
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* VIP Drop Membership Card */}
          <div className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-luxury text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                <span>The PoshakHeaven Club</span>
              </div>
              <h3 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-ink">
                Receive private drops and bespoke seasonal edits.
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted">
                Join our circle of refined fashion connoisseurs. Get notified before public releases, limited batch restocking, and private discounts.
              </p>

              <form onSubmit={submitNewsletter} className="mt-6 flex flex-col sm:flex-row gap-2">
                <label className="sr-only" htmlFor="vip-email">
                  Email Address
                </label>
                <input
                  id="vip-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address..."
                  className="h-12 min-w-0 flex-1 rounded-sm border border-white/15 bg-[#120B09] px-4 text-xs sm:text-sm text-ink outline-none placeholder:text-muted/60 focus:border-accent"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-accent px-6 text-xs font-bold uppercase tracking-wider text-background transition-all hover:bg-ink hover:text-accent flex-none"
                >
                  <Mail className="h-4 w-4" />
                  <span>Join List</span>
                </button>
              </form>

              {subscribed && (
                <div className="mt-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 animate-fade-in">
                  ✓ You are subscribed to PoshakHeaven VIP Drops.
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="grid grid-cols-2 gap-4 text-xs text-muted">
                <div>
                  <p className="font-semibold text-ink">Fast Delivery</p>
                  <p className="text-[11px] text-muted">Inside & Outside Dhaka</p>
                </div>
                <div>
                  <p className="font-semibold text-ink">WhatsApp Concierge</p>
                  <p className="text-[11px] text-muted">7 days a week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
