var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handler as sendOrderHandler } from "./netlify/functions/send-order.js";
import { handler as ordersHandler } from "./netlify/functions/orders.js";
import { handler as authOtpHandler } from "./netlify/functions/auth-otp.js";
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
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
                configureServer: function (server) {
                    var _this = this;
                    server.middlewares.use(function (req, res, next) {
                        var _a, _b;
                        if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith("/api/orders")) {
                            if (req.method === "OPTIONS") {
                                res.writeHead(204, {
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers": "Content-Type",
                                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                                });
                                res.end();
                                return;
                            }
                            var body_1 = "";
                            req.on("data", function (chunk) { body_1 += chunk; });
                            req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                                var urlObj, result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            urlObj = new URL(req.url, "http://localhost");
                                            return [4 /*yield*/, ordersHandler({
                                                    httpMethod: req.method,
                                                    body: body_1,
                                                    queryStringParameters: Object.fromEntries(urlObj.searchParams),
                                                    headers: req.headers,
                                                })];
                                        case 1:
                                            result = _a.sent();
                                            res.writeHead(result.statusCode, __assign({ "Content-Type": "application/json" }, (result.headers || {})));
                                            res.end(result.body);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            return;
                        }
                        if ((_b = req.url) === null || _b === void 0 ? void 0 : _b.startsWith("/api/auth-otp")) {
                            if (req.method === "OPTIONS") {
                                res.writeHead(204, {
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers": "Content-Type",
                                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                                });
                                res.end();
                                return;
                            }
                            var body_2 = "";
                            req.on("data", function (chunk) { body_2 += chunk; });
                            req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, authOtpHandler({
                                                httpMethod: req.method,
                                                body: body_2,
                                                headers: req.headers,
                                            })];
                                        case 1:
                                            result = _a.sent();
                                            res.writeHead(result.statusCode, __assign({ "Content-Type": "application/json" }, (result.headers || {})));
                                            res.end(result.body);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            return;
                        }
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
                                var body_3 = "";
                                req.on("data", function (chunk) {
                                    body_3 += chunk;
                                });
                                req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                                    var result, err_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, sendOrderHandler({
                                                        httpMethod: "POST",
                                                        body: body_3,
                                                        headers: req.headers,
                                                    })];
                                            case 1:
                                                result = _a.sent();
                                                res.writeHead(result.statusCode, __assign({ "Content-Type": "application/json" }, (result.headers || {})));
                                                res.end(result.body);
                                                return [3 /*break*/, 3];
                                            case 2:
                                                err_1 = _a.sent();
                                                res.writeHead(500, { "Content-Type": "application/json" });
                                                res.end(JSON.stringify({
                                                    message: err_1.message || "Internal server error",
                                                }));
                                                return [3 /*break*/, 3];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
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
