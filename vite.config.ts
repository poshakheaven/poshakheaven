import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handler as sendOrderHandler } from "./netlify/functions/send-order.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (env.TELEGRAM_BOT_TOKEN) {
    process.env.TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
  }
  if (env.TELEGRAM_CHAT_ID) {
    process.env.TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;
  }

  return {
    plugins: [
      react(),
      {
        name: "dev-serverless-functions",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/api/send-order") {
              if (req.method === "OPTIONS") {
                res.writeHead(204, {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Headers": "Content-Type",
                  "Access-Control-Allow-Methods": "POST, OPTIONS",
                });
                res.end();
                return;
              }

              if (req.method === "POST") {
                let body = "";
                req.on("data", (chunk) => {
                  body += chunk;
                });

                req.on("end", async () => {
                  try {
                    const result = await sendOrderHandler({
                      httpMethod: "POST",
                      body,
                      headers: req.headers,
                    });

                    res.writeHead(result.statusCode, {
                      "Content-Type": "application/json",
                      ...(result.headers || {}),
                    });
                    res.end(result.body);
                  } catch (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message: err.message || "Internal server error",
                      })
                    );
                  }
                });
                return;
              }
            }
            next();
          });
        },
      },
    ],
  };
});
