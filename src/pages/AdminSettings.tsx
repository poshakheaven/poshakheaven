import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Lock,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User
} from "lucide-react";
import { FormEvent, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { Meta } from "../components/Meta";
import { useAdminAuth } from "../context/AdminAuthContext";

export function AdminSettings() {
  const { username, changeUsername, changePin } = useAdminAuth();

  const [currentPinUser, setCurrentPinUser] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [userMsg, setUserMsg] = useState({ type: "", text: "" });

  const [currentPinPin, setCurrentPinPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMsg, setPinMsg] = useState({ type: "", text: "" });

  const handleUpdateUsername = async (e: FormEvent) => {
    e.preventDefault();
    setUserMsg({ type: "", text: "" });
    if (!newUsername.trim()) {
      setUserMsg({ type: "error", text: "New username cannot be blank." });
      return;
    }
    const res = await changeUsername(currentPinUser, newUsername.trim());
    if (res.success) {
      setUserMsg({ type: "success", text: "Username updated successfully." });
      setCurrentPinUser("");
      setNewUsername("");
    } else {
      setUserMsg({ type: "error", text: res.error || "Failed to update." });
    }
  };

  const handleUpdatePin = async (e: FormEvent) => {
    e.preventDefault();
    setPinMsg({ type: "", text: "" });
    if (newPin.length < 6) {
      setPinMsg({ type: "error", text: "New PIN must be at least 6 characters." });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMsg({ type: "error", text: "PIN confirmation does not match." });
      return;
    }
    const res = await changePin(currentPinPin, newPin);
    if (res.success) {
      setPinMsg({ type: "success", text: "Admin PIN changed successfully." });
      setCurrentPinPin("");
      setNewPin("");
      setConfirmPin("");
    } else {
      setPinMsg({ type: "error", text: res.error || "Failed to change PIN." });
    }
  };

  return (
    <>
      <Meta
        title="Admin Settings & Security"
        description="Configure admin credentials, PIN code, and authentication security."
      />
      <AdminShell title="Security & Access" eyebrow="Portal Settings">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Change Username Card */}
          <form
            onSubmit={handleUpdateUsername}
            className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft space-y-5"
          >
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
              <User className="h-5 w-5 text-accent" />
              <div>
                <h2 className="font-heading text-lg font-bold text-ink">
                  Update Admin Username
                </h2>
                <p className="text-[11px] text-muted">
                  Current user: <strong className="text-ink">{username}</strong>
                </p>
              </div>
            </div>

            {userMsg.text && (
              <div
                className={`rounded-md p-3 text-xs font-medium ${
                  userMsg.type === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {userMsg.text}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                New Username *
              </label>
              <input
                required
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Current Security PIN *
              </label>
              <input
                required
                type="password"
                value={currentPinUser}
                onChange={(e) => setCurrentPinUser(e.target.value)}
                placeholder="Enter current PIN to authenticate"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Update Username</span>
            </button>
          </form>

          {/* Change Security PIN Card */}
          <form
            onSubmit={handleUpdatePin}
            className="rounded-lg border border-white/10 bg-[#1A110E] p-6 sm:p-8 shadow-soft space-y-5"
          >
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
              <KeyRound className="h-5 w-5 text-accent" />
              <div>
                <h2 className="font-heading text-lg font-bold text-ink">
                  Change Security PIN
                </h2>
                <p className="text-[11px] text-muted">
                  Minimum 6 characters or alphanumeric digits
                </p>
              </div>
            </div>

            {pinMsg.text && (
              <div
                className={`rounded-md p-3 text-xs font-medium ${
                  pinMsg.type === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {pinMsg.text}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Current PIN *
              </label>
              <input
                required
                type="password"
                value={currentPinPin}
                onChange={(e) => setCurrentPinPin(e.target.value)}
                placeholder="Enter existing PIN"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                New Security PIN *
              </label>
              <input
                required
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter at least 6 characters"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
                Confirm New PIN *
              </label>
              <input
                required
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Re-type new PIN"
                className="h-11 w-full rounded-sm border border-white/15 bg-[#120B09] px-3.5 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-xs font-bold uppercase tracking-wider text-background shadow-soft transition hover:bg-ink hover:text-accent"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Change Security PIN</span>
            </button>
          </form>
        </div>

        {/* Security Overview Box */}
        <div className="mt-8 rounded-lg border border-white/10 bg-[#1A110E] p-6 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Active Admin Security Protocols</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 text-xs text-muted pt-2">
            <div className="rounded-md border border-white/5 bg-[#120B09] p-3">
              <p className="font-bold text-ink">Lockout Protection</p>
              <p className="mt-1 text-[11px]">Locks for 15 mins after 5 consecutive failed PIN attempts.</p>
            </div>
            <div className="rounded-md border border-white/5 bg-[#120B09] p-3">
              <p className="font-bold text-ink">Inactivity Auto-Logout</p>
              <p className="mt-1 text-[11px]">Sessions automatically expire after 30 minutes of idle time.</p>
            </div>
            <div className="rounded-md border border-white/5 bg-[#120B09] p-3">
              <p className="font-bold text-ink">SHA-256 Hashing</p>
              <p className="mt-1 text-[11px]">PIN credentials are salted and hashed using browser SubtleCrypto.</p>
            </div>
          </div>
        </div>
      </AdminShell>
    </>
  );
}
