import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { seedProducts } from "../data/catalog";
import { defaultSiteContent } from "../data/defaultContent";
import type { Order, OrderStatus, Product, ProductDraft, SiteContent } from "../types";
import { slugify } from "../utils/format";
import { readStorage, writeStorage } from "../utils/storage";

type StoreContextValue = {
  products: Product[];
  orders: Order[];
  siteContent: SiteContent;
  addProduct: (product: ProductDraft) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  saveOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  archiveOrder: (orderId: string, archived?: boolean) => void;
  deleteCancelledOrders: () => void;
  resetProducts: () => void;
  updateSiteContent: (content: SiteContent) => void;
  resetSiteContent: () => void;
};

const PRODUCTS_KEY = "ph_products";
const ORDERS_KEY = "ph_orders";
const CONTENT_KEY = "ph_site_content";

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function normalizeProduct(product: ProductDraft): Product {
  const id = product.id ?? `ph-${Date.now()}`;
  const slug = product.slug || slugify(product.name);

  return {
    ...product,
    id,
    slug,
    price: Number(product.price),
    discountPrice: product.discountPrice
      ? Number(product.discountPrice)
      : undefined,
    stock: Number(product.stock)
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage(PRODUCTS_KEY, seedProducts)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    readStorage<Order[]>(ORDERS_KEY, [])
  );
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = readStorage<Partial<SiteContent>>(CONTENT_KEY, defaultSiteContent);
    return {
      hero: { ...defaultSiteContent.hero, ...(saved?.hero || {}) },
      campaign: { ...defaultSiteContent.campaign, ...(saved?.campaign || {}) },
      storeInfo: { ...defaultSiteContent.storeInfo, ...(saved?.storeInfo || {}) },
      delivery: { ...defaultSiteContent.delivery, ...(saved?.delivery || {}) },
      bulkDiscount: { ...defaultSiteContent.bulkDiscount, ...(saved?.bulkDiscount || {}) }
    };
  });

  useEffect(() => writeStorage(PRODUCTS_KEY, products), [products]);
  useEffect(() => writeStorage(ORDERS_KEY, orders), [orders]);
  useEffect(() => writeStorage(CONTENT_KEY, siteContent), [siteContent]);

  const addProduct = useCallback((product: ProductDraft) => {
    setProducts((current) => [normalizeProduct(product), ...current]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id ? normalizeProduct(product) : item
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  }, []);

  const saveOrder = useCallback((order: Order) => {
    setOrders((current) => [order, ...current]);
  }, []);

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    },
    []
  );

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((current) => current.filter((order) => order.id !== orderId));
  }, []);

  const archiveOrder = useCallback((orderId: string, archived = true) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, archived } : order
      )
    );
  }, []);

  const deleteCancelledOrders = useCallback(() => {
    setOrders((current) => current.filter((order) => order.status !== "Cancelled"));
  }, []);

  const resetProducts = useCallback(() => setProducts(seedProducts), []);

  const updateSiteContent = useCallback((content: SiteContent) => {
    setSiteContent(content);
  }, []);

  const resetSiteContent = useCallback(() => {
    setSiteContent(defaultSiteContent);
  }, []);

  const value = useMemo(
    () => ({
      products,
      orders,
      siteContent,
      addProduct,
      updateProduct,
      deleteProduct,
      saveOrder,
      updateOrderStatus,
      deleteOrder,
      archiveOrder,
      deleteCancelledOrders,
      resetProducts,
      updateSiteContent,
      resetSiteContent
    }),
    [
      addProduct,
      deleteProduct,
      orders,
      products,
      resetProducts,
      resetSiteContent,
      saveOrder,
      siteContent,
      updateOrderStatus,
      deleteOrder,
      archiveOrder,
      deleteCancelledOrders,
      updateSiteContent
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
}
