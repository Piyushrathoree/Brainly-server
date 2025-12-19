import crypto from "node:crypto";

export type JwtPayload = Record<string, unknown> & {
    exp?: number;
    iat?: number;
};

function base64UrlEncode(input: Buffer | string): string {
    const buffer =
        typeof input === "string" ? Buffer.from(input, "utf8") : input;
    return buffer
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function base64UrlDecodeToBuffer(input: string): Buffer {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const padding =
        normalized.length % 4 === 0
            ? ""
            : "=".repeat(4 - (normalized.length % 4));
    return Buffer.from(normalized + padding, "base64");
}

function signHmacSha256(data: string, secret: string): string {
    const sig = crypto.createHmac("sha256", secret).update(data).digest();
    return base64UrlEncode(sig);
}

export function signJwt(
    payload: Record<string, unknown>,
    secret: string,
    expiresInSeconds: number
): string {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload: JwtPayload = {
        ...payload,
        iat: now,
        exp: now + expiresInSeconds,
    };

    const headerB64 = base64UrlEncode(Buffer.from(JSON.stringify(header)));
    const payloadB64 = base64UrlEncode(
        Buffer.from(JSON.stringify(fullPayload))
    );
    const signingInput = `${headerB64}.${payloadB64}`;
    const signatureB64 = signHmacSha256(signingInput, secret);
    return `${signingInput}.${signatureB64}`;
}

export function verifyJwt(token: string, secret: string): JwtPayload {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token format");

    const [headerB64, payloadB64, sigB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;
    const expectedSig = signHmacSha256(signingInput, secret);

    const sigBuf = base64UrlDecodeToBuffer(sigB64);
    const expectedBuf = base64UrlDecodeToBuffer(expectedSig);
    if (
        sigBuf.length !== expectedBuf.length ||
        !crypto.timingSafeEqual(sigBuf, expectedBuf)
    ) {
        throw new Error("Invalid token signature");
    }

    const payloadJson = base64UrlDecodeToBuffer(payloadB64).toString("utf8");
    const payload = JSON.parse(payloadJson) as JwtPayload;

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && now >= payload.exp) {
        throw new Error("Token expired");
    }

    return payload;
}
