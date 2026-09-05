import {
  ArrowUpRight,
  BarChart3,
  Cloud,
  CloudOff,
  LogOut,
  Package,
  ReceiptText,
  RefreshCw,
  Settings,
  Sparkles
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useStore } from "../context/StoreContext";

type AdminShellProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex h-10 items-center gap-2 rounded-sm px-3.5 text-xs font-semibold tracking-wide transition-all ${
    isActive
      ? "bg-accent text-background shadow-soft font-bold"
      : "border border-white/10 bg-[#1A110E] text-muted hover:border-accent/40 hover:text-ink"
  }`;

export function AdminShell({
  title,
  eyebrow = "Management Portal",
  children
}: AdminShellProps) {
  const { logout, username } = useAdminAuth();
  const { isCloudConnected, isSyncingOrders, syncAll, lastSyncedAt } = useStore();
  const [manualSyncing, setManualSyncing] = useState(false);

  const handleManualSync = async () => {
    setManualSyncing(true);
    await syncAll();
    setTimeout(() => setManualSyncing(false), 600);
  };

  return (
    <div className="min-h-screen bg-[#120B09] text-ink antialiased">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#170E0B]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/images/poshakheaven-logo.png"
                alt="PoshakHeaven"
                className="h-8 w-8 rounded-full border border-accent/30 object-cover"
              />
              <span className="font-heading text-lg font-bold tracking-tight text-ink">
                PoshakHeaven
              </span>
            </Link>
            <span className="rounded bg-accent/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-accent">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Cloud Sync Status */}
            <div className="flex items-center gap-2">
              {isCloudConnected ? (
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                  <Cloud className="h-3.5 w-3.5 animate-pulse" />
                  <span className="hidden md:inline">Supabase Cloud Sync</span>
                  <span className="md:hidden">Cloud</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-2.5 py-1 text-[11px] font-medium text-amber-300">
                  <CloudOff className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Local Storage Mode</span>
                  <span className="md:hidden">Local</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleManualSync}
                disabled={manualSyncing || isSyncingOrders}
                title="Sync database now"
                className="inline-flex h-7 items-center gap-1 rounded-sm border border-white/10 bg-surface px-2 text-[11px] text-muted hover:text-ink transition hover:border-accent/40 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3 w-3 ${
                    manualSyncing || isSyncingOrders ? "animate-spin text-accent" : ""
                  }`}
                />
                <span className="hidden sm:inline">Sync</span>
              </button>
            </div>

            {username && (
              <span className="hidden lg:inline text-muted">
                Signed in as <strong className="text-ink">{username}</strong>
              </span>
            )}

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
            >
              <span>View Store</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={logout}
              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-white/10 bg-surface px-3 text-xs font-semibold text-muted transition hover:border-error/40 hover:text-error"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Section */}
      <main className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header & Nav Tabs */}
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-luxury text-accent">
                {eyebrow}
              </p>
              <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-ink md:text-5xl">
                {title}
              </h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
              <NavLink to="/admin" end className={linkClass}>
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/admin/products" className={linkClass}>
                <Package className="h-3.5 w-3.5" />
                <span>Products</span>
              </NavLink>
              <NavLink to="/admin/orders" className={linkClass}>
                <ReceiptText className="h-3.5 w-3.5" />
                <span>Orders</span>
              </NavLink>
              <NavLink to="/admin/banners" className={linkClass}>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Banners & Content</span>
              </NavLink>
              <NavLink to="/admin/settings" className={linkClass}>
                <Settings className="h-3.5 w-3.5" />
                <span>Settings</span>
              </NavLink>
            </div>
          </div>

          {/* Children View */}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
