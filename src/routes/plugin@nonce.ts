import { randomBytes } from "crypto";

export const onRequest = ({ sharedMap, headers }: any) => {
  if (!import.meta.env.DEV) {
    const nonce = randomBytes(16).toString("base64");

    sharedMap.set("@nonce", nonce);

    headers.set(
      "Content-Security-Policy",
      [
        `default-src 'self'`,
        `style-src 'self' 'unsafe-inline'`,
        `img-src 'self' data:`,
        `script-src 'self' 'unsafe-inline' 'strict-dynamic' 'nonce-${nonce}'`,
      ].join(";")
    );
  }
};
