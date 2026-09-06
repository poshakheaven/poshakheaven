import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { categories as defaultCategories, seedProducts } from "../data/catalog";
import { defaultSiteContent } from "../data/defaultContent";
import type { Category, Order, OrderStatus, Product, ProductDraft, SiteContent } from "../types";
import { slugify } from "../utils/format";
import { readStorage, writeStorage } from "../utils/storage";
import {
  deleteOrderFromCloud,
  deleteProductFromCloud,
  fetchCategoriesFromCloud,
  fetchOrdersFromCloud,
  fetchProductsFromCloud,
  fetchSiteContentFromCloud,
  isSupabaseConfigured,
  saveCategoriesToCloud,
  saveOrderToCloud,
  saveSiteContentToCloud,
  updateOrderStatusInCloud,
  upsertProductToCloud
} from "../utils/supabase";

type StoreContextValue = {
  products: Product[];
  categories: Category[];
  orders: Order[];
  siteContent: SiteContent;
  isSyncingOrders: boolean;
  lastSyncedAt: Date | null;
  isCloudConnected: boolean;
  syncOrders: () => Promise<void>;
  syncAll: () => Promise<void>;
  addProduct: (product: ProductDraft) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  addCategory: (category: Category) => void;
  updateCategory: (oldSlug: string, category: Category) => void;
  deleteCategory: (slug: string) => void;
  resetCategories: () => void;
  saveOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  archiveOrder: (orderId: string, archived?: boolean) => void;
  deleteCancelledOrders: () => void;
  resetProducts: () => Promise<void>;
  updateSiteContent: (content: SiteContent) => void;
  resetSiteContent: () => void;
};

const PRODUCTS_KEY = "ph_products";
const CATEGORIES_KEY = "ph_categories";
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
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = readStorage<Product[] | null>(PRODUCTS_KEY, null);
    if (saved !== null) return saved;
    return isSupabaseConfigured ? [] : seedProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() =>
    readStorage(CATEGORIES_KEY, defaultCategories)
  );

  const [orders, setOrders] = useState<Order[]>(() =>
    readStorage<Order[]>(ORDERS_KEY, [])
  );
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

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
  useEffect(() => writeStorage(CATEGORIES_KEY, categories), [categories]);
  useEffect(() => writeStorage(ORDERS_KEY, orders), [orders]);
  useEffect(() => writeStorage(CONTENT_KEY, siteContent), [siteContent]);

  // Sync Products from Supabase (Never auto re-seed deleted products!)
  const syncProducts = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const cloudProducts = await fetchProductsFromCloud();
      if (cloudProducts !== null) {
        setProducts(cloudProducts);
      }
    } catch (err) {
      console.warn("Supabase products sync failed:", err);
    }
  }, []);

  // Sync Categories from Supabase
  const syncCategories = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const cloudCategories = await fetchCategoriesFromCloud();
      if (cloudCategories && cloudCategories.length > 0) {
        setCategories(cloudCategories);
      }
    } catch (err) {
      console.warn("Supabase categories sync failed:", err);
    }
  }, []);

  // Sync Site Content from Supabase
  const syncSiteContent = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const cloudContent = await fetchSiteContentFromCloud();
      if (cloudContent) {
        setSiteContent({
          hero: { ...defaultSiteContent.hero, ...(cloudContent.hero || {}) },
          campaign: { ...defaultSiteContent.campaign, ...(cloudContent.campaign || {}) },
          storeInfo: { ...defaultSiteContent.storeInfo, ...(cloudContent.storeInfo || {}) },
          delivery: { ...defaultSiteContent.delivery, ...(cloudContent.delivery || {}) },
          bulkDiscount: { ...defaultSiteContent.bulkDiscount, ...(cloudContent.bulkDiscount || {}) }
        });
      }
    } catch (err) {
      console.warn("Supabase content sync failed:", err);
    }
  }, []);

  // Sync orders with cloud
  const syncOrders = useCallback(async () => {
    setIsSyncingOrders(true);
    try {
      if (isSupabaseConfigured) {
        const cloudOrders = await fetchOrdersFromCloud();
        if (Array.isArray(cloudOrders)) {
          setOrders(cloudOrders);
          setLastSyncedAt(new Date());
          setIsSyncingOrders(false);
          return;
        }
      }

      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.orders)) {
          setOrders((current) => {
            const map = new Map<string, Order>();
            data.orders.forEach((o: Order) => {
              if (o && o.id) map.set(o.id, o);
            });
            current.forEach((o) => {
              if (o && o.id && !map.has(o.id)) {
                map.set(o.id, o);
              }
            });
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
            );
          });
          setLastSyncedAt(new Date());
        }
      }
    } catch (err) {
      console.warn("Orders sync unavailable (running in local mode):", err);
    } finally {
      setIsSyncingOrders(false);
    }
  }, []);

  const syncAll = useCallback(async () => {
    await Promise.allSettled([
      syncProducts(),
      syncCategories(),
      syncSiteContent(),
      syncOrders()
    ]);
  }, [syncProducts, syncCategories, syncSiteContent, syncOrders]);

  // Initial and periodic sync
  useEffect(() => {
    syncAll();
    const interval = setInterval(syncAll, 15 * 1000);
    return () => clearInterval(interval);
  }, [syncAll]);

  // Product mutations
  const addProduct = useCallback((product: ProductDraft) => {
    const normalized = normalizeProduct(product);
    setProducts((current) => [normalized, ...current]);
    upsertProductToCloud(normalized).catch(() => {});
  }, []);

  const updateProduct = useCallback((product: Product) => {
    const normalized = normalizeProduct(product);
    setProducts((current) =>
      current.map((item) => (item.id === product.id ? normalized : item))
    );
    upsertProductToCloud(normalized).catch(() => {});
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
    await deleteProductFromCloud(id);
  }, []);

  const clearAllProducts = useCallback(async () => {
    const ids = products.map((p) => p.id);
    setProducts([]);
    for (const id of ids) {
      await deleteProductFromCloud(id);
    }
  }, [products]);

  // Category mutations
  const addCategory = useCallback((category: Category) => {
    setCategories((current) => {
      const exists = current.some((c) => c.slug === category.slug);
      const updated = exists
        ? current.map((c) => (c.slug === category.slug ? category : c))
        : [...current, category];
      saveCategoriesToCloud(updated).catch(() => {});
      return updated;
    });
  }, []);

  const updateCategory = useCallback((oldSlug: string, category: Category) => {
    setCategories((current) => {
      const updated = current.map((c) => (c.slug === oldSlug ? category : c));
      saveCategoriesToCloud(updated).catch(() => {});
      return updated;
    });
  }, []);

  const deleteCategory = useCallback((slug: string) => {
    setCategories((current) => {
      const updated = current.filter((c) => c.slug !== slug);
      saveCategoriesToCloud(updated).catch(() => {});
      return updated;
    });
  }, []);

  const resetCategories = useCallback(() => {
    setCategories(defaultCategories);
    saveCategoriesToCloud(defaultCategories).catch(() => {});
  }, []);

  // Order mutations
  const saveOrder = useCallback((order: Order) => {
    setOrders((current) => {
      const exists = current.some((o) => o.id === order.id);
      return exists ? current : [order, ...current];
    });

    saveOrderToCloud(order).catch(() => {});
  }, []);

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      updateOrderStatusInCloud(orderId, { status }).catch(() => {});

      fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status })
      }).catch(() => {});
    },
    []
  );

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((current) => current.filter((order) => order.id !== orderId));

    deleteOrderFromCloud(orderId).catch(() => {});

    fetch("/api/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId })
    }).catch(() => {});
  }, []);

  const archiveOrder = useCallback((orderId: string, archived = true) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, archived } : order
      )
    );

    updateOrderStatusInCloud(orderId, { archived }).catch(() => {});

    fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, archived })
    }).catch(() => {});
  }, []);

  const deleteCancelledOrders = useCallback(() => {
    setOrders((current) => current.filter((order) => order.status !== "Cancelled"));
  }, []);

  // Explicit manual reset button
  const resetProducts = useCallback(async () => {
    setProducts(seedProducts);
    for (const sp of seedProducts) {
      await upsertProductToCloud(sp);
    }
  }, []);

  const updateSiteContent = useCallback((content: SiteContent) => {
    setSiteContent(content);
    saveSiteContentToCloud(content).catch(() => {});
  }, []);

  const resetSiteContent = useCallback(() => {
    setSiteContent(defaultSiteContent);
    saveSiteContentToCloud(defaultSiteContent).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      products,
      categories,
      orders,
      siteContent,
      isSyncingOrders,
      lastSyncedAt,
      isCloudConnected: isSupabaseConfigured,
      syncOrders,
      syncAll,
      addProduct,
      updateProduct,
      deleteProduct,
      clearAllProducts,
      addCategory,
      updateCategory,
      deleteCategory,
      resetCategories,
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
      clearAllProducts,
      addCategory,
      updateCategory,
      deleteCategory,
      resetCategories,
      categories,
      orders,
      products,
      isSyncingOrders,
      lastSyncedAt,
      syncOrders,
      syncAll,
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
