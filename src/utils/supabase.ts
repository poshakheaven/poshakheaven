import type { Order, OrderStatus, Product, SiteContent } from "../types";

const SUPABASE_URL = (
  import.meta.env.VITE_SUPABASE_URL ||
  (typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : "") ||
  ""
).replace(/\/+$/, "");

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== "undefined" ? process.env.VITE_SUPABASE_ANON_KEY : "") ||
  "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function getHeaders(extraHeaders: Record<string, string> = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...extraHeaders
  };
}

// ---------------- PRODUCTS ----------------

export async function fetchProductsFromCloud(): Promise<Product[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.warn("Error fetching products from Supabase:", err);
    return null;
  }
}

export async function upsertProductToCloud(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: "POST",
      headers: getHeaders({
        Prefer: "resolution=merge-duplicates,return=representation"
      }),
      body: JSON.stringify(product)
    });
    return res.ok;
  } catch (err) {
    console.warn("Error saving product to Supabase:", err);
    return false;
  }
}

export async function deleteProductFromCloud(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return res.ok;
  } catch (err) {
    console.warn("Error deleting product from Supabase:", err);
    return false;
  }
}

// ---------------- SITE CONTENT ----------------

export async function fetchSiteContentFromCloud(): Promise<SiteContent | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?key=eq.main_content&select=content`,
      { headers: getHeaders() }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].content) {
      return data[0].content as SiteContent;
    }
    return null;
  } catch (err) {
    console.warn("Error fetching site settings from Supabase:", err);
    return null;
  }
}

export async function saveSiteContentToCloud(content: SiteContent): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
      method: "POST",
      headers: getHeaders({
        Prefer: "resolution=merge-duplicates,return=representation"
      }),
      body: JSON.stringify({
        key: "main_content",
        content,
        updated_at: new Date().toISOString()
      })
    });
    return res.ok;
  } catch (err) {
    console.warn("Error saving site content to Supabase:", err);
    return false;
  }
}

// ---------------- ORDERS ----------------

export async function fetchOrdersFromCloud(): Promise<Order[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.warn("Error fetching orders from Supabase:", err);
    return null;
  }
}

export async function saveOrderToCloud(order: Order): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",
      headers: getHeaders({
        Prefer: "resolution=merge-duplicates,return=representation"
      }),
      body: JSON.stringify(order)
    });
    return res.ok;
  } catch (err) {
    console.warn("Error saving order to Supabase:", err);
    return false;
  }
}

export async function updateOrderStatusInCloud(
  orderId: string,
  updates: { status?: OrderStatus; archived?: boolean }
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      headers: getHeaders({
        Prefer: "return=representation"
      }),
      body: JSON.stringify(updates)
    });
    return res.ok;
  } catch (err) {
    console.warn("Error updating order in Supabase:", err);
    return false;
  }
}

export async function deleteOrderFromCloud(orderId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return res.ok;
  } catch (err) {
    console.warn("Error deleting order in Supabase:", err);
    return false;
  }
}
