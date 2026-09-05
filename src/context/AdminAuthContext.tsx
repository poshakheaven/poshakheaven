import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { readStorage, writeStorage } from "../utils/storage";

type AdminAuthContextValue = {
  isAuthenticated: boolean;
  hasAdmin: boolean;
  username: string | null;
  setupAdmin: (username: string, pin: string) => Promise<void>;
  login: (username: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changeUsername: (currentPin: string, newUsername: string) => Promise<{ success: boolean; error?: string }>;
  changePin: (currentPin: string, newPin: string) => Promise<{ success: boolean; error?: string }>;
  checkLockout: () => { locked: boolean; remainingSeconds: number };
};

const ADMIN_USER_KEY = "ph_admin_user";
const ADMIN_HASH_KEY = "ph_admin_hash";
const ADMIN_SESSION_KEY = "ph_admin_session";
const ADMIN_FAILED_KEY = "ph_admin_failed";
const ADMIN_LOCKED_UNTIL_KEY = "ph_admin_locked_until";
const ADMIN_LAST_ACTIVITY_KEY = "ph_admin_last_activity";
const SALT = "poshakheaven-local-admin-v1";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);

async function hashPin(pin: string) {
  const value = `${SALT}:${pin}`;

  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  return btoa(value);
}

function getFailedAttempts(): { count: number; lastAttempt: number } {
  const stored = readStorage<{ count: number; lastAttempt: number } | null>(ADMIN_FAILED_KEY, null);
  if (!stored) return { count: 0, lastAttempt: 0 };
  return stored;
}

function saveFailedAttempts(count: number, lastAttempt: number) {
  writeStorage(ADMIN_FAILED_KEY, { count, lastAttempt });
}

function getLockedUntil(): number {
  return readStorage<number>(ADMIN_LOCKED_UNTIL_KEY, 0);
}

function setLockedUntil(until: number) {
  writeStorage(ADMIN_LOCKED_UNTIL_KEY, until);
}

function getLastActivity(): number {
  return readStorage<number>(ADMIN_LAST_ACTIVITY_KEY, 0);
}

function setLastActivity(timestamp: number) {
  writeStorage(ADMIN_LAST_ACTIVITY_KEY, timestamp);
}

export function AdminAuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    readStorage(ADMIN_SESSION_KEY, false)
  );
  const [hasAdmin, setHasAdmin] = useState(() =>
    Boolean(readStorage<string | null>(ADMIN_HASH_KEY, null))
  );
  const [username, setUsername] = useState(() =>
    readStorage<string | null>(ADMIN_USER_KEY, null)
  );
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Check session expiry and lockout on mount
  useEffect(() => {
    const checkSession = () => {
      const session = readStorage(ADMIN_SESSION_KEY, false);
      const lastActivity = getLastActivity();
      const now = Date.now();

      if (session && lastActivity > 0 && now - lastActivity > SESSION_TIMEOUT_MS) {
        // Session expired due to inactivity
        writeStorage(ADMIN_SESSION_KEY, false);
        setIsAuthenticated(false);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Update lockout countdown
  useEffect(() => {
    const updateLockout = () => {
      const lockedUntil = getLockedUntil();
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setLockoutRemaining(remaining);
      if (remaining === 0) {
        // Clear failed attempts when lockout expires
        saveFailedAttempts(0, 0);
        setLockedUntil(0);
      }
    };

    updateLockout();
    const interval = setInterval(updateLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkLockout = useCallback(() => {
    const lockedUntil = getLockedUntil();
    const now = Date.now();
    if (lockedUntil > now) {
      return { locked: true, remainingSeconds: Math.ceil((lockedUntil - now) / 1000) };
    }
    return { locked: false, remainingSeconds: 0 };
  }, []);

  const recordActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Record activity on user interaction
  useEffect(() => {
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    const handler = recordActivity;
    events.forEach((event) => window.addEventListener(event, handler));
    return () => events.forEach((event) => window.removeEventListener(event, handler));
  }, [recordActivity]);

  const setupAdmin = useCallback(async (usernameValue: string, pin: string) => {
    const hashed = await hashPin(pin);
    writeStorage(ADMIN_HASH_KEY, hashed);
    writeStorage(ADMIN_USER_KEY, usernameValue);
    writeStorage(ADMIN_SESSION_KEY, true);
    setLastActivity(Date.now());
    setHasAdmin(true);
    setUsername(usernameValue);
    setIsAuthenticated(true);
    saveFailedAttempts(0, 0);
    setLockedUntil(0);
  }, []);

  const login = useCallback(async (usernameValue: string, pin: string) => {
    const lockout = checkLockout();
    if (lockout.locked) {
      return { success: false, error: `Account locked. Try again in ${lockout.remainingSeconds} seconds.` };
    }

    const storedUsername = readStorage<string | null>(ADMIN_USER_KEY, null);
    const storedHash = readStorage<string | null>(ADMIN_HASH_KEY, null);

    if (!storedUsername || !storedHash) {
      return { success: false, error: "Admin not configured." };
    }

    if (usernameValue !== storedUsername) {
      const failed = getFailedAttempts();
      const newCount = failed.count + 1;
      saveFailedAttempts(newCount, Date.now());
      
      if (newCount >= MAX_FAILED_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION_MS;
        setLockedUntil(until);
        return { success: false, error: "Too many failed attempts. Account locked for 15 minutes." };
      }
      
      return { success: false, error: `Invalid username or PIN. ${MAX_FAILED_ATTEMPTS - newCount} attempts remaining.` };
    }

    const hashed = await hashPin(pin);
    const matches = storedHash === hashed;

    if (matches) {
      writeStorage(ADMIN_SESSION_KEY, true);
      setLastActivity(Date.now());
      setIsAuthenticated(true);
      saveFailedAttempts(0, 0);
      setLockedUntil(0);
      return { success: true };
    } else {
      const failed = getFailedAttempts();
      const newCount = failed.count + 1;
      saveFailedAttempts(newCount, Date.now());
      
      if (newCount >= MAX_FAILED_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION_MS;
        setLockedUntil(until);
        return { success: false, error: "Too many failed attempts. Account locked for 15 minutes." };
      }
      
      return { success: false, error: `Invalid username or PIN. ${MAX_FAILED_ATTEMPTS - newCount} attempts remaining.` };
    }
  }, [checkLockout]);

  const logout = useCallback(() => {
    writeStorage(ADMIN_SESSION_KEY, false);
    setIsAuthenticated(false);
  }, []);

  const changeUsername = useCallback(async (currentPin: string, newUsername: string) => {
    if (!newUsername.trim()) {
      return { success: false, error: "Username cannot be empty." };
    }

    const storedHash = readStorage<string | null>(ADMIN_HASH_KEY, null);
    if (!storedHash) {
      return { success: false, error: "Admin not configured." };
    }

    const hashed = await hashPin(currentPin);
    if (hashed !== storedHash) {
      return { success: false, error: "Current PIN is incorrect." };
    }

    writeStorage(ADMIN_USER_KEY, newUsername);
    setUsername(newUsername);
    return { success: true };
  }, []);

  const changePin = useCallback(async (currentPin: string, newPin: string) => {
    if (newPin.length < 6) {
      return { success: false, error: "PIN must be at least 6 characters." };
    }

    const storedHash = readStorage<string | null>(ADMIN_HASH_KEY, null);
    if (!storedHash) {
      return { success: false, error: "Admin not configured." };
    }

    const hashed = await hashPin(currentPin);
    if (hashed !== storedHash) {
      return { success: false, error: "Current PIN is incorrect." };
    }

    const newHashed = await hashPin(newPin);
    writeStorage(ADMIN_HASH_KEY, newHashed);
    return { success: true };
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      hasAdmin,
      username,
      setupAdmin,
      login,
      logout,
      changeUsername,
      changePin,
      checkLockout
    }),
    [
      hasAdmin,
      isAuthenticated,
      username,
      login,
      logout,
      setupAdmin,
      changeUsername,
      changePin,
      checkLockout
    ]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return context;
}
