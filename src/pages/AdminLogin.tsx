import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  KeyRound,
  LockKeyhole,
  Mail,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
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
  const {
    isAuthenticated,
    login,
    checkLockout,
    recoveryEmail,
    requestPasswordResetOtp,
    verifyOtpAndResetPassword
  } = useAdminAuth();

  // Login form state
  const [username, setUsername] = useState("admin");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Forgot password recovery state
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [otpStep, setOtpStep] = useState<"request" | "verify">("request");
  const [otpCode, setOtpCode] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [recoveryMsg, setRecoveryMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

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

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (lockoutRemaining > 0) {
      setError(`Account locked. Try again in ${formatTime(lockoutRemaining)}.`);
      return;
    }

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
      setError(result.error || "Login failed. Check credentials.");
    }
  };

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setRecoveryMsg(null);
    setIsRequestingOtp(true);

    try {
      const res = await requestPasswordResetOtp(recoveryEmail);
      if (res.success) {
        setRecoveryMsg({
          type: "success",
          text: `A 6-digit OTP code has been dispatched to ${recoveryEmail}.`
        });
        setOtpStep("verify");
      } else {
        setRecoveryMsg({
          type: "error",
          text: "Failed to generate OTP code. Please try again."
        });
      }
    } catch {
      setRecoveryMsg({
        type: "error",
        text: "Network error requesting OTP."
      });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerifyOtpAndReset = async (e: FormEvent) => {
    e.preventDefault();
    setRecoveryMsg(null);

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setRecoveryMsg({ type: "error", text: "Please enter a valid 6-digit OTP code." });
      return;
    }
    if (newPin.length < 6) {
      setRecoveryMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPin !== confirmNewPin) {
      setRecoveryMsg({ type: "error", text: "New password confirmation does not match." });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await verifyOtpAndResetPassword(otpCode.trim(), newPin);
      if (res.success) {
        setRecoveryMsg({
          type: "success",
          text: "Password successfully reset! You can now log in with your new password."
        });
        setPin(newPin);
        setTimeout(() => {
          setIsForgotMode(false);
          setOtpStep("request");
          setOtpCode("");
          setNewPin("");
          setConfirmNewPin("");
        }, 1800);
      } else {
        setRecoveryMsg({
          type: "error",
          text: res.error || "Invalid or expired OTP code."
        });
      }
    } catch {
      setRecoveryMsg({ type: "error", text: "Verification error occurred." });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <>
      <Meta
        title="Admin Authorization | PoshakHeaven"
        description="Secure access portal for PoshakHeaven management."
      />
      <section className="flex min-h-screen items-center justify-center bg-[#120B09] px-4 py-12">
        <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-2xl">
          {/* Brand Logo */}
          <Link to="/" className="mb-6 flex items-center justify-center gap-3">
            <img
              src="/images/poshakheaven-logo.png"
              alt="PoshakHeaven"
              onError={(e) => {
                e.currentTarget.src = "/poshakheaven-logo.png";
              }}
              className="h-12 w-12 rounded-full border border-accent/30 object-cover shadow-glow"
            />
            <div>
              <span className="font-heading text-2xl font-bold tracking-tight text-ink">
                PoshakHeaven
              </span>
              <p className="text-[9px] uppercase tracking-luxury text-accent font-semibold">
                Haute Couture Admin Portal
              </p>
            </div>
          </Link>

          {!isForgotMode ? (
            /* STANDARD LOGIN VIEW */
            <>
              {/* Heading */}
              <div className="border-t border-white/10 pt-5 text-center">
                <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-accent">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <h1 className="font-heading text-2xl font-bold text-ink">
                  Staff Authorization
                </h1>
                <p className="mt-1 text-xs text-muted">
                  Enter your administrative credentials to manage store orders and catalog.
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
              <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                    Admin Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                    <input
                      required
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      disabled={lockoutRemaining > 0}
                      className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] pl-10 pr-3.5 text-xs text-ink outline-none focus:border-accent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block">
                      Security PIN / Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setOtpStep("request");
                        setRecoveryMsg(null);
                      }}
                      className="text-[11px] text-accent hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                    <input
                      required
                      type="password"
                      autoComplete="current-password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••••••"
                      disabled={lockoutRemaining > 0}
                      className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] pl-10 pr-3.5 text-xs text-ink outline-none focus:border-accent disabled:opacity-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={lockoutRemaining > 0}
                  className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-accent text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Authorize & Enter</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            /* FORGOT PASSWORD OTP RECOVERY VIEW */
            <>
              <div className="border-t border-white/10 pt-5 text-center">
                <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-accent">
                  <Mail className="h-5 w-5" />
                </div>
                <h1 className="font-heading text-2xl font-bold text-ink">
                  Account Recovery
                </h1>
                <p className="mt-1 text-xs text-muted">
                  Reset your admin password securely via OTP verification.
                </p>
              </div>

              {/* Status/Error Messages */}
              {recoveryMsg && (
                <div
                  className={`mt-5 flex items-center gap-2 rounded-md p-3 text-xs ${
                    recoveryMsg.type === "success"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {recoveryMsg.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 flex-none text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-none text-rose-400" />
                  )}
                  <span>{recoveryMsg.text}</span>
                </div>
              )}

              {otpStep === "request" ? (
                /* Step 1: Request OTP */
                <form onSubmit={handleRequestOtp} className="mt-6 space-y-4">
                  <div className="rounded-md border border-white/10 bg-[#120B09] p-4 text-xs text-muted space-y-2">
                    <p className="font-semibold text-ink flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-accent" />
                      Registered Administrative Email
                    </p>
                    <p className="font-mono text-accent text-sm break-all font-bold">
                      {recoveryEmail}
                    </p>
                    <p className="text-[11px] text-muted-light">
                      A single-use 6-digit verification code will be dispatched to this email address to verify authorization.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isRequestingOtp}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-accent text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent disabled:opacity-50"
                  >
                    <span>{isRequestingOtp ? "Sending OTP..." : "Send Verification OTP"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsForgotMode(false)}
                    className="flex h-10 w-full items-center justify-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Login</span>
                  </button>
                </form>
              ) : (
                /* Step 2: Verify OTP & Enter New Password */
                <form onSubmit={handleVerifyOtpAndReset} className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                      6-Digit OTP Code
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 123456"
                      className="h-11 w-full text-center font-mono tracking-widest text-base rounded-sm border border-white/15 bg-[#120B09] text-ink outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                      New Security PIN (Min 6 Chars)
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                      <input
                        required
                        type="password"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] pl-10 pr-3.5 text-xs text-ink outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                      Confirm New PIN
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                      <input
                        required
                        type="password"
                        value={confirmNewPin}
                        onChange={(e) => setConfirmNewPin(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] pl-10 pr-3.5 text-xs text-ink outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-accent text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent disabled:opacity-50"
                  >
                    <span>{isVerifyingOtp ? "Verifying..." : "Verify OTP & Reset Password"}</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpStep("request")}
                      className="text-xs text-muted hover:text-accent transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Resend OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(false)}
                      className="text-xs text-muted hover:text-ink transition-colors"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

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
