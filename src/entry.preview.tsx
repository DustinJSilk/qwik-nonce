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
import { randomBytes } from "crypto";

const { router, notFound, staticFile } = createQwikCity({
  render,
  qwikCityPlan,
});

type MiddlewareFn = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  next: (err: any) => void,
  nonce?: string
) => void;

// Each middleware function to run sequentially
const middleware: MiddlewareFn[] = [staticFile, router, notFound];

const handler = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  let i = 0;
  const len = middleware.length;

  // Create a nonce
  const nonce = randomBytes(16).toString("base64");

  // Add it to the CSP policy
  const csp = `default-src 'self' 'unsafe-inline'; script-src 'self' 'nonce-${nonce}';`;

  // Set the CSP policy header
  res.setHeader("Content-Security-Policy", csp);

  // Loop through each middleware function
  const next = (err: any) => (err ? undefined : loop());
  const loop = () =>
    res.writableEnded || (i < len && middleware[i++](req, res, next, nonce));

  loop();
};

export default handler;
