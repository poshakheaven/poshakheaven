import { recordCloudOrder } from "./orders.js";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { message: "Method not allowed." });
  }

  if (!event.body || event.body.length > 20000) {
    return json(400, { message: "Invalid order payload." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return json(503, {
      message:
        "Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID."
    });
  }

  let order;
  try {
    order = JSON.parse(event.body);
  } catch {
    return json(400, { message: "Order payload must be valid JSON." });
  }

  recordCloudOrder(order);
  const validation = validateOrder(order);
  if (validation) {
    return json(400, { message: validation });
  }

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
          text: formatTelegramOrder(order)
        })
      }
    );

    if (!response.ok) {
      return json(502, { message: "Telegram rejected the order message." });
    }

    return json(200, { ok: true });
  } catch (err) {
    return json(502, { message: "Failed to connect to Telegram: " + (err?.message || "network error") });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

function clean(value, max = 400) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, max);
}

function money(value) {
  return `BDT ${Number(value || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 0
  })}`;
}

function validateOrder(order) {
  if (!clean(order.id, 80)) return "Order ID is required.";
  if (!clean(order.customer?.fullName, 120)) return "Customer name is required.";
  if (!/^(\+?88)?01[3-9]\d{8}$/.test(clean(order.customer?.phone, 30))) {
    return "Valid customer phone number is required.";
  }
  if (!clean(order.customer?.address, 800)) return "Address is required.";
  if (!Array.isArray(order.items) || order.items.length === 0) {
    return "At least one product is required.";
  }
  if (order.payment?.method === "bKash") {
    if (!clean(order.payment?.senderNumber, 30)) {
      return "bKash sender number is required.";
    }
    if (!clean(order.payment?.transactionId, 80)) {
      return "bKash transaction ID is required.";
    }
  }
  return "";
}

function formatTelegramOrder(order) {
  const items = order.items
    .map(
      (item) =>
        `• ${clean(item.name, 160)} (${clean(item.size, 20)}, ${clean(
          item.color,
          40
        )}) x ${Number(item.quantity || 0)} = ${money(item.lineTotal)}`
    )
    .join("\n");

  const transaction =
    order.payment?.method === "bKash"
      ? `\n📱 Sender: ${clean(order.payment.senderNumber, 30)}\n🔢 TrxID: ${clean(order.payment.transactionId, 80)}`
      : "";

  const lines = [
    `📦 NEW ORDER !!`,
    `🆔 Order ID: ${clean(order.id, 80)}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 Customer: ${clean(order.customer.fullName, 120)}`,
    `📞 Phone: ${clean(order.customer.phone, 30)}`,
    `📍 Address: ${clean(order.customer.address, 800)}`,
    clean(order.customer.note, 500)
      ? `📝 Note: ${clean(order.customer.note, 500)}`
      : null,
    `━━━━━━━━━━━━━━━━━━━━`,
    `💵 Payment: ${clean(order.payment.method, 20)}${transaction}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🛍️ Items:`,
    items,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🏷️ Subtotal: ${money(order.subtotal)}`,
    order.discount && Number(order.discount) > 0
      ? `🎁 Discount: -${money(order.discount)}`
      : null,
    `🚚 Delivery (${order.deliveryZone === "outside" ? "Outside Dhaka" : "Inside Dhaka"}): ${money(order.deliveryCharge)}`,
    `🧾 Total: ${money(order.total)}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🕒 Order Time: ${clean(order.orderTime, 80)}`
  ];

  return lines.filter((line) => line !== null && line !== undefined).join("\n");
}
