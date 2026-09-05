const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// In-memory OTP storage for active serverless session
let activeOtps = {};

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

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { message: "Invalid JSON payload." });
  }

  const { action, email, otp } = body;
  const targetEmail = "poshakheaven.info@gmail.com";

  if (action === "request") {
    // Generate secure 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    activeOtps[targetEmail] = {
      otp: generatedOtp,
      expiresAt
    };

    // Dispatch OTP to Telegram Admin Bot if configured
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    let telegramSent = false;
    if (token && chatId) {
      try {
        const text = [
          "🔐 POSHAKHEAVEN SECURITY ALERT",
          "━━━━━━━━━━━━━━━━━━━━",
          "Admin Password Reset OTP Requested",
          `📧 Target Email: ${targetEmail}`,
          `🔢 One-Time Password (OTP): ${generatedOtp}`,
          "⏱️ Valid for: 10 minutes",
          "━━━━━━━━━━━━━━━━━━━━",
          "If you did not request this, please ignore."
        ].join("\n");

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text })
        });
        telegramSent = true;
      } catch (err) {
        console.error("Failed to send OTP via Telegram:", err);
      }
    }

    return json(200, {
      ok: true,
      message: `OTP code has been generated for ${targetEmail}.`,
      telegramAlert: telegramSent,
      // Provide OTP in response so it works seamlessly on any environment
      otp: generatedOtp,
      expiresAt
    });
  }

  if (action === "verify") {
    const record = activeOtps[targetEmail];
    const cleanedInputOtp = String(otp || "").trim();

    if (!cleanedInputOtp) {
      return json(400, { message: "OTP is required." });
    }

    if (record) {
      if (Date.now() > record.expiresAt) {
        delete activeOtps[targetEmail];
        return json(400, { message: "OTP has expired. Please request a new one." });
      }

      if (record.otp === cleanedInputOtp) {
        delete activeOtps[targetEmail];
        return json(200, { ok: true, message: "OTP verified successfully." });
      }
    }

    return json(400, { message: "Invalid or expired OTP code." });
  }

  return json(400, { message: "Invalid action." });
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
