import type { CartLine, CustomerInfo, DeliveryZone, Order, PaymentInfo } from "../types";
import { calculateDeliveryCharge, createOrderId, sanitizeText } from "./format";

export function buildOrder(
  lines: CartLine[],
  customer: CustomerInfo,
  payment: PaymentInfo,
  pricing?: {
    deliveryZone?: DeliveryZone;
    deliveryCharge?: number;
    discount?: number;
  }
): Order {
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const deliveryCharge =
    pricing?.deliveryCharge !== undefined
      ? pricing.deliveryCharge
      : calculateDeliveryCharge(subtotal);
  const discount = pricing?.discount || 0;
  const total = Math.max(0, subtotal - discount + deliveryCharge);

  return {
    id: createOrderId(),
    customer: {
      fullName: sanitizeText(customer.fullName),
      phone: sanitizeText(customer.phone),
      address: sanitizeText(customer.address),
      note: customer.note ? sanitizeText(customer.note) : undefined
    },
    payment: {
      method: payment.method,
      senderNumber: payment.senderNumber
        ? sanitizeText(payment.senderNumber)
        : undefined,
      transactionId: payment.transactionId
        ? sanitizeText(payment.transactionId)
        : undefined
    },
    items: lines.map((line) => ({
      productId: line.product.id,
      name: line.product.name,
      sku: line.product.sku,
      size: line.size,
      color: line.color,
      quantity: line.quantity,
      price: line.product.discountPrice ?? line.product.price,
      lineTotal: line.lineTotal
    })),
    subtotal,
    deliveryZone: pricing?.deliveryZone || "inside",
    deliveryCharge,
    discount: discount > 0 ? discount : undefined,
    total,
    status: "Pending",
    telegramStatus: "pending",
    orderTime: new Date().toISOString()
  };
}

export async function sendOrder(order: Order) {
  const response = await fetch("/api/send-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? "Could not send order to Telegram.");
  }

  return response.json() as Promise<{ ok: true }>;
}

export function validateBangladeshPhone(phone: string) {
  return /^(\+?88)?01[3-9]\d{8}$/.test(phone.replace(/\s|-/g, ""));
}
