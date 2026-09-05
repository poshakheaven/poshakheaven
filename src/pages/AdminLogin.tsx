import {
  AlertCircle,
  ArrowRight,
  Clock,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  User
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Meta } from "../components/Meta";
import { useAdminAuth } from "../context/AdminAuthContext";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { hasAdmin, isAuthenticated, setupAdmin, login, checkLockout } =
    useAdminAuth();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const destination = state?.from?.pathname ?? "/admin";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate(destination, { replace: true });
  }, [destination, isAuthenticated, navigate]);

  // Update lockout countdown
  useEffect(() => {
    const updateLockout = () => {
      const { locked, remainingSeconds } = checkLockout();
      setLockoutRemaining(locked ? remainingSeconds : 0);
    };
    updateLockout();
    const interval = setInterval(updateLockout, 1000);
    return () => clearInterval(interval);
  }, [checkLockout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (lockoutRemaining > 0) {
      setError(`Account locked. Try again in ${formatTime(lockoutRemaining)}.`);
      return;
    }

    if (!hasAdmin) {
      // First-time setup
      if (!username.trim()) {
        setError("Username is required.");
        return;
      }
      if (pin.length < 6) {
        setError("PIN must be at least 6 characters.");
        return;
      }
      if (pin !== confirmPin) {
        setError("PIN confirmation does not match.");
        return;
      }
      await setupAdmin(username.trim(), pin);
      navigate("/admin", { replace: true });
      return;
    }

    // Regular login
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (pin.length < 6) {
      setError("PIN must be at least 6 characters.");
      return;
    }

    const result = await login(username.trim(), pin);
    if (result.success) {
      navigate("/admin", { replace: true });
    } else {
      setError(result.error || "Login failed.");
    }
  };

  return (
    <>
      <Meta
        title="Admin Authentication"
        description="Secure access portal for PoshakHeaven management."
      />
      <section className="flex min-h-screen items-center justify-center bg-[#120B09] px-4 py-12">
        <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-2xl">
          {/* Logo */}
          <Link to="/" className="mb-6 flex items-center justify-center gap-3">
            <img
              src="/images/poshakheaven-logo.png"
              alt="PoshakHeaven"
              className="h-12 w-12 rounded-full border border-accent/30 object-cover shadow-glow"
            />
            <div>
              <span className="font-heading text-2xl font-bold tracking-tight text-ink">
                PoshakHeaven
              </span>
              <p className="text-[9px] uppercase tracking-luxury text-accent font-semibold">
                Haute Couture Admin
              </p>
            </div>
          </Link>

          {/* Heading */}
          <div className="border-t border-white/10 pt-5 text-center">
            <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-accent">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-ink">
              {hasAdmin ? "Staff Authorization" : "First-Time Admin Setup"}
            </h1>
            <p className="mt-1 text-xs text-muted">
              {hasAdmin
                ? "Enter your credentials to access the store management portal."
                : "Create initial administrative credentials."}
            </p>
          </div>

          {/* Lockout Warning */}
          {lockoutRemaining > 0 && (
            <div className="mt-5 flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <Clock className="h-4 w-4 flex-none text-rose-400" />
              <span>
                Access locked. Retry in <strong>{formatTime(lockoutRemaining)}</strong>.
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 flex-none text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                <input
                  required
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={hasAdmin ? "Enter admin username" : "Create admin username"}
                  disabled={lockoutRemaining > 0}
                  className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] pl-10 pr-3.5 text-xs text-ink outline-none focus:border-accent disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Security PIN (Min 6 Chars)
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                <input
                  required
                  type="password"
                  autoComplete={hasAdmin ? "current-password" : "new-password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••••"
                  disabled={lockoutRemaining > 0}
                  className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] pl-10 pr-3.5 text-xs text-ink outline-none focus:border-accent disabled:opacity-50"
                />
              </div>
            </div>

            {!hasAdmin && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                  Confirm Security PIN
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                  <input
                    required
                    type="password"
                    autoComplete="new-password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] pl-10 pr-3.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={lockoutRemaining > 0}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-accent text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{hasAdmin ? "Authorize & Enter" : "Complete Setup"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <Link
              to="/"
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
