import type { CartLine, CustomerInfo, DeliveryZone, Order, PaymentInfo } from "../types";
import { calculateDeliveryCharge, createOrderId, formatCurrency, sanitizeText } from "./format";

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

export function formatTelegramOrderText(order: Order): string {
  const items = order.items
    .map(
      (item) =>
        `• ${item.name} (${item.size}, ${item.color}) x ${item.quantity} = BDT ${item.lineTotal}`
    )
    .join("\n");

  const transaction =
    order.payment?.method === "bKash"
      ? `\n📱 Sender: ${order.payment.senderNumber || "N/A"}\n🔢 TrxID: ${order.payment.transactionId || "N/A"}`
      : "";

  const lines = [
    `📦 NEW ORDER !!`,
    `🆔 Order ID: ${order.id}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 Customer: ${order.customer.fullName}`,
    `📞 Phone: ${order.customer.phone}`,
    `📍 Address: ${order.customer.address}`,
    order.customer.note ? `📝 Note: ${order.customer.note}` : null,
    `━━━━━━━━━━━━━━━━━━━━`,
    `💵 Payment: ${order.payment.method}${transaction}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🛍️ Items:`,
    items,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🏷️ Subtotal: BDT ${order.subtotal}`,
    order.discount && order.discount > 0 ? `🎁 Discount: -BDT ${order.discount}` : null,
    `🚚 Delivery (${order.deliveryZone === "outside" ? "Outside Dhaka" : "Inside Dhaka"}): BDT ${order.deliveryCharge}`,
    `🧾 Total: BDT ${order.total}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🕒 Order Time: ${order.orderTime}`
  ];

  return lines.filter(Boolean).join("\n");
}

export async function sendOrder(order: Order): Promise<{ ok: boolean }> {
  // 1. First attempt: Serverless API endpoint
  try {
    const response = await fetch("/api/send-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });

    if (response.ok) {
      return { ok: true };
    }
  } catch (err) {
    console.warn("Serverless Telegram function failed, attempting direct fallback:", err);
  }

  // 2. Direct client fallback (if tokens are configured in Vite)
  const token =
    import.meta.env.VITE_TELEGRAM_BOT_TOKEN ||
    (typeof process !== "undefined" ? process.env.TELEGRAM_BOT_TOKEN : "");
  const chatId =
    import.meta.env.VITE_TELEGRAM_CHAT_ID ||
    (typeof process !== "undefined" ? process.env.TELEGRAM_CHAT_ID : "");

  if (token && chatId) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: formatTelegramOrderText(order)
          })
        }
      );
      if (response.ok) {
        return { ok: true };
      }
    } catch (directErr) {
      console.error("Direct Telegram send failed:", directErr);
    }
  }

  return { ok: false };
}

export function validateBangladeshPhone(phone: string) {
  return /^(\+?88)?01[3-9]\d{8}$/.test(phone.replace(/\s|-/g, ""));
}
