"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const node_crypto_1 = __importDefault(require("node:crypto"));
function base64UrlEncode(input) {
    const buffer = typeof input === "string" ? Buffer.from(input, "utf8") : input;
    return buffer
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}
function base64UrlDecodeToBuffer(input) {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4 === 0
        ? ""
        : "=".repeat(4 - (normalized.length % 4));
    return Buffer.from(normalized + padding, "base64");
}
function signHmacSha256(data, secret) {
    const sig = node_crypto_1.default.createHmac("sha256", secret).update(data).digest();
    return base64UrlEncode(sig);
}
function signJwt(payload, secret, expiresInSeconds) {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
        ...payload,
        iat: now,
        exp: now + expiresInSeconds,
    };
    const headerB64 = base64UrlEncode(Buffer.from(JSON.stringify(header)));
    const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(fullPayload)));
    const signingInput = `${headerB64}.${payloadB64}`;
    const signatureB64 = signHmacSha256(signingInput, secret);
    return `${signingInput}.${signatureB64}`;
}
function verifyJwt(token, secret) {
    const parts = token.split(".");
    if (parts.length !== 3)
        throw new Error("Invalid token format");
    const [headerB64, payloadB64, sigB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;
    const expectedSig = signHmacSha256(signingInput, secret);
    const sigBuf = base64UrlDecodeToBuffer(sigB64);
    const expectedBuf = base64UrlDecodeToBuffer(expectedSig);
    if (sigBuf.length !== expectedBuf.length ||
        !node_crypto_1.default.timingSafeEqual(sigBuf, expectedBuf)) {
        throw new Error("Invalid token signature");
    }
    const payloadJson = base64UrlDecodeToBuffer(payloadB64).toString("utf8");
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && now >= payload.exp) {
        throw new Error("Token expired");
    }
    return payload;
}
