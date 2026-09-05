export const DELIVERY_CHARGE = 80;
export const FREE_DELIVERY_THRESHOLD = 3000;

export function formatCurrency(value: number) {
  const num = Number(value) || 0;
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0
  }).format(num)}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return "Recently";
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "Recently";
  }
}

export function calculateDeliveryCharge(subtotal: number) {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sanitizeText(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export function createOrderId() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PH-${year}-${random}`;
}
