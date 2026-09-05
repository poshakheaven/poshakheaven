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

type WishlistContextValue = {
  wishlistIds: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
};

const WISHLIST_KEY = "ph_wishlist";

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    readStorage<string[]>(WISHLIST_KEY, [])
  );

  useEffect(() => writeStorage(WISHLIST_KEY, wishlistIds), [wishlistIds]);

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }, []);

  const clearWishlist = useCallback(() => setWishlistIds([]), []);

  const value = useMemo(
    () => ({ wishlistIds, isWishlisted, toggleWishlist, clearWishlist }),
    [clearWishlist, isWishlisted, toggleWishlist, wishlistIds]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
}
