import { ArrowRight, Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { Meta } from "../components/Meta";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../context/StoreContext";
import { useWishlist } from "../context/WishlistContext";

export function Wishlist() {
  const { wishlistIds, clearWishlist } = useWishlist();
  const { products } = useStore();

  const wishlistedProducts = products.filter((product) =>
    wishlistIds.includes(product.id)
  );

  if (wishlistedProducts.length === 0) {
    return (
      <>
        <Meta
          title="Wishlist"
          description="Your saved PoshakHeaven wardrobe pieces."
        />
        <div className="bg-[#120B09] py-16 md:py-24">
          <EmptyState
            title="Your Wishlist Is Empty"
            icon={<Heart className="h-7 w-7 text-accent" />}
            action={
              <Link
                to="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-sm bg-accent px-8 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent"
              >
                <span>Browse Collections</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          >
            Save your favorite silhouettes to review, compare, and order at your convenience.
          </EmptyState>
        </div>
      </>
    );
  }

  return (
    <>
      <Meta
        title={`Wishlist (${wishlistedProducts.length})`}
        description="Review and add your saved PoshakHeaven luxury items to bag."
      />

      <section className="bg-[#120B09] py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-accent" />
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-luxury text-accent">
                  Saved Pieces
                </p>
              </div>
              <h1 className="mt-1 font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
                My Wishlist
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "silhouette" : "silhouettes"} curated by you
              </p>
            </div>

            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Entire Wishlist</span>
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
