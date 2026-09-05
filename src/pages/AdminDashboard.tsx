import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Package,
  Plus,
  ReceiptText,
  Settings,
  Sparkles,
  TrendingUp,
  Truck,
  Wallet
} from "lucide-react";
import { Link } from "react-router-dom";
import { AdminShell } from "../components/AdminShell";
import { Meta } from "../components/Meta";
import { useStore } from "../context/StoreContext";
import { formatCurrency, formatDate } from "../utils/format";

export function AdminDashboard() {
  const { products = [], orders = [] } = useStore();
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const pendingOrders = safeOrders.filter((order) => order?.status === "Pending");
  const deliveredOrders = safeOrders.filter((order) => order?.status === "Delivered");
  const revenue = safeOrders
    .filter((order) => order?.status !== "Cancelled")
    .reduce((sum, order) => sum + (Number(order?.total) || 0), 0);

  const stats = [
    {
      label: "Total Catalogue Products",
      value: safeProducts.length,
      sub: "Active silhouettes",
      icon: Package,
      color: "text-accent"
    },
    {
      label: "Total Orders Received",
      value: safeOrders.length,
      sub: `${deliveredOrders.length} delivered`,
      icon: ReceiptText,
      color: "text-accent"
    },
    {
      label: "Pending Verification",
      value: pendingOrders.length,
      sub: "Action required",
      icon: Clock,
      color: "text-amber-400"
    },
    {
      label: "Gross Realized Revenue",
      value: formatCurrency(revenue),
      sub: "Excluding cancelled orders",
      icon: Wallet,
      color: "text-emerald-400"
    }
  ];

  return (
    <>
      <Meta
        title="Admin Dashboard"
        description="PoshakHeaven luxury admin metrics, products, and order activity."
      />
      <AdminShell title="Command Center" eyebrow="Overview">
        {/* Metric Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.label}
                className="relative overflow-hidden rounded-lg border border-white/10 bg-[#1A110E] p-5 shadow-soft transition hover:border-accent/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {stat.label}
                  </span>
                  <div className={`grid h-9 w-9 place-items-center rounded-full bg-[#120B09] border border-white/10 ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <p className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-ink">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] text-muted">{stat.sub}</p>
              </article>
            );
          })}
        </div>

        {/* Live Website Content Customizer Banner */}
        <div className="mt-6 rounded-lg border border-accent/30 bg-gradient-to-r from-accent/15 via-[#1A110E] to-[#1A110E] p-6 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent text-background flex-none shadow-glow">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-ink">
                Live Storefront & Lookbook Customizer
              </h2>
              <p className="mt-1 text-xs text-muted max-w-2xl leading-relaxed">
                Dynamically modify hero headlines, promotional campaigns, lookbook editorial imagery, merchant bKash numbers, WhatsApp contact info, delivery rates, and bulk spend discount tiers.
              </p>
            </div>
          </div>
          <Link
            to="/admin/banners"
            className="inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent flex-none"
          >
            <span>Customize Store</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Recent Orders & Quick Controls */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Recent Orders */}
          <section className="rounded-lg border border-white/10 bg-[#1A110E] p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ReceiptText className="h-4 w-4 text-accent" />
                <h2 className="font-heading text-xl font-bold text-ink">
                  Recent Orders
                </h2>
              </div>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-ink transition"
              >
                <span>View All ({safeOrders.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {safeOrders.slice(0, 6).map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md border border-white/10 bg-[#120B09] p-4 transition hover:border-white/20"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-accent">
                        {order.id}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          order.status === "Delivered"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : order.status === "Cancelled"
                              ? "bg-rose-500/20 text-rose-400"
                              : "bg-accent/20 text-accent"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink font-semibold">
                      {order.customer?.fullName || "Guest Customer"} • <span className="font-mono text-muted">{order.customer?.phone || ""}</span>
                    </p>
                    <p className="text-[10px] text-muted">
                      {(order.items || []).length} items • {order.payment?.method || "COD"}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-heading text-sm font-bold text-ink">
                      {formatCurrency(order.total || 0)}
                    </p>
                    <p className="text-[10px] text-muted">
                      {formatDate(order.orderTime)}
                    </p>
                  </div>
                </div>
              ))}

              {safeOrders.length === 0 && (
                <p className="p-8 text-center text-xs text-muted">
                  No orders have been recorded yet.
                </p>
              )}
            </div>
          </section>

          {/* Quick Management Shortcuts */}
          <section className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-[#1A110E] p-6 shadow-soft space-y-3">
              <h3 className="font-heading text-base font-bold text-ink border-b border-white/10 pb-3">
                Quick Actions
              </h3>

              <Link
                to="/admin/products"
                className="flex items-center justify-between rounded-sm border border-white/10 bg-[#120B09] p-3 text-xs text-ink hover:border-accent transition"
              >
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-accent" />
                  Manage / Add Products
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted" />
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center justify-between rounded-sm border border-white/10 bg-[#120B09] p-3 text-xs text-ink hover:border-accent transition"
              >
                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-accent" />
                  Dispatch & Track Orders
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted" />
              </Link>

              <Link
                to="/admin/banners"
                className="flex items-center justify-between rounded-sm border border-white/10 bg-[#120B09] p-3 text-xs text-ink hover:border-accent transition"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Hero & Campaign Content
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted" />
              </Link>

              <Link
                to="/admin/settings"
                className="flex items-center justify-between rounded-sm border border-white/10 bg-[#120B09] p-3 text-xs text-ink hover:border-accent transition"
              >
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-accent" />
                  Admin Credentials & Security
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted" />
              </Link>
            </div>
          </section>
        </div>
      </AdminShell>
    </>
  );
}
