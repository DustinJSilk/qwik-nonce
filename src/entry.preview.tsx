/*
 * WHAT IS THIS FILE?
 *
 * It's the bundle entry point for `npm run preview`.
 * That is, serving your app built in production mode.
 *
 * Feel free to modify this file, but don't remove it!
 *
 * Learn more about Vite's preview command:
 * - https://vitejs.dev/config/preview-options.html#preview-options
 *
 */
import { createQwikCity } from "@builder.io/qwik-city/middleware/node";
import render from "./entry.ssr";
import qwikCityPlan from "@qwik-city-plan";
import { IncomingMessage, ServerResponse } from "http";

const { router, notFound, staticFile } = createQwikCity({
  render,
  qwikCityPlan,
  headers: {
    "Origin-Agent-Cluster": "?1",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=15552000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-DNS-Prefetch-Control": "off",
    "X-Download-Options": "noopen",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-XSS-Protection": "0",
  },
  nonce: true,
  contentSecurityPolicy: {
    scriptSrc: `'self' 'unsafe-inline' 'strict-dynamic'`,
  },
});

type MiddlewareFn = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  next: (err: any) => void
) => void;

// Each middleware function to run sequentially
const middleware: MiddlewareFn[] = [staticFile, router, notFound];

const handler = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  let i = 0;
  const len = middleware.length;

  // Loop through each middleware function
  const next = (err: any) => (err ? undefined : loop());
  const loop = () =>
    res.writableEnded || (i < len && middleware[i++](req, res, next));

  loop();
};

export default handler;
