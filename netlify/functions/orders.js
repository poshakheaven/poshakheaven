const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

// Global in-memory order cache for warm serverless instances
let cloudOrders = [];

export function recordCloudOrder(order) {
  if (!order || !order.id) return;
  const exists = cloudOrders.some((o) => o.id === order.id);
  if (!exists) {
    cloudOrders.unshift(order);
  }
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  }

  // GET: Fetch all cloud orders
  if (event.httpMethod === "GET") {
    return json(200, {
      ok: true,
      orders: cloudOrders
    });
  }

  // POST: Add new order
  if (event.httpMethod === "POST") {
    let order;
    try {
      order = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { message: "Invalid JSON payload." });
    }

    if (!order.id) {
      return json(400, { message: "Order ID is required." });
    }

    recordCloudOrder(order);
    return json(200, { ok: true, order });
  }

  // PUT: Update order status
  if (event.httpMethod === "PUT") {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { message: "Invalid JSON payload." });
    }

    const { orderId, status, archived } = body;
    cloudOrders = cloudOrders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          ...(status ? { status } : {}),
          ...(archived !== undefined ? { archived } : {})
        };
      }
      return order;
    });

    return json(200, { ok: true });
  }

  // DELETE: Delete order
  if (event.httpMethod === "DELETE") {
    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {}

    const orderId = body.orderId || event.queryStringParameters?.id;
    if (orderId) {
      cloudOrders = cloudOrders.filter((order) => order.id !== orderId);
    }
    return json(200, { ok: true });
  }

  return json(405, { message: "Method not allowed." });
};

function json(statusCode, data) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
}
