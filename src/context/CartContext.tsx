import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { CartItem, CartLine, DeliveryZone, Product } from "../types";
import { defaultSiteContent } from "../data/defaultContent";
import { readStorage, writeStorage } from "../utils/storage";
import { useStore } from "./StoreContext";

type AddToCartInput = {
  product: Product;
  size: string;
  color: string;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  subtotal: number;
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  deliveryCharge: number;
  discountAmount: number;
  isFreeDelivery: boolean;
  isBulkDiscountEligible: boolean;
  total: number;
  count: number;
  addToCart: (input: AddToCartInput) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  removeItem: (lineKey: string) => void;
  clearCart: () => void;
  getLineKey: (item: CartItem) => string;
};

const CART_KEY = "ph_cart";
const DELIVERY_ZONE_KEY = "ph_delivery_zone";

const CartContext = createContext<CartContextValue | undefined>(undefined);

function lineKey(item: CartItem) {
  return `${item.productId}__${item.size}__${item.color}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, siteContent } = useStore();
  const [items, setItems] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>(CART_KEY, [])
  );
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>(() =>
    readStorage<DeliveryZone>(DELIVERY_ZONE_KEY, "inside")
  );

  useEffect(() => writeStorage(CART_KEY, items), [items]);
  useEffect(() => writeStorage(DELIVERY_ZONE_KEY, deliveryZone), [deliveryZone]);

  const addToCart = useCallback(
    ({ product, size, color, quantity = 1 }: AddToCartInput) => {
      setItems((current) => {
        const nextItem = { productId: product.id, size, color, quantity };
        const nextKey = lineKey(nextItem);
        const existing = current.find((item) => lineKey(item) === nextKey);

        if (!existing) return [...current, nextItem];

        return current.map((item) =>
          lineKey(item) === nextKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      });
    },
    []
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          lineKey(item) === key
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => lineKey(item) !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const lines = useMemo<CartLine[]>(
    () =>
      items
        .map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          if (!product) return null;
          const price = product.discountPrice ?? product.price;
          return {
            ...item,
            product,
            lineTotal: price * item.quantity
          };
        })
        .filter(Boolean) as CartLine[],
    [items, products]
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.lineTotal, 0),
    [lines]
  );

  const deliverySettings = siteContent.delivery || defaultSiteContent.delivery;
  const bulkDiscountSettings = siteContent.bulkDiscount || defaultSiteContent.bulkDiscount;

  const isFreeDelivery =
    deliverySettings.freeDeliveryMinAmount > 0 &&
    subtotal >= deliverySettings.freeDeliveryMinAmount;

  const deliveryCharge = useMemo(() => {
    if (lines.length === 0) return 0;
    if (isFreeDelivery) return 0;
    return deliveryZone === "outside"
      ? Number(deliverySettings.outsideDhakaRate || 150)
      : Number(deliverySettings.insideDhakaRate || 80);
  }, [deliverySettings.insideDhakaRate, deliverySettings.outsideDhakaRate, deliveryZone, isFreeDelivery, lines.length]);

  const isBulkDiscountEligible = useMemo(() => {
    return (
      Boolean(bulkDiscountSettings.enabled) &&
      Number(bulkDiscountSettings.discountPercentage || 0) > 0 &&
      subtotal >= Number(bulkDiscountSettings.minSpend || 5000)
    );
  }, [bulkDiscountSettings.discountPercentage, bulkDiscountSettings.enabled, bulkDiscountSettings.minSpend, subtotal]);

  const discountAmount = useMemo(() => {
    if (!isBulkDiscountEligible) return 0;
    const pct = Number(bulkDiscountSettings.discountPercentage || 0);
    return Math.round(subtotal * (pct / 100));
  }, [bulkDiscountSettings.discountPercentage, isBulkDiscountEligible, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + deliveryCharge);
  }, [deliveryCharge, discountAmount, subtotal]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      lines,
      subtotal,
      deliveryZone,
      setDeliveryZone,
      deliveryCharge,
      discountAmount,
      isFreeDelivery,
      isBulkDiscountEligible,
      total,
      count,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      getLineKey: lineKey
    }),
    [
      addToCart,
      clearCart,
      count,
      deliveryCharge,
      deliveryZone,
      discountAmount,
      isBulkDiscountEligible,
      isFreeDelivery,
      items,
      lines,
      removeItem,
      subtotal,
      total,
      updateQuantity
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
