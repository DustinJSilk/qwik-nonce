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
import type { IncomingMessage, ServerResponse } from "http";

const { router, notFound, staticFile } = (createQwikCity as any)({
  render,
  qwikCityPlan,
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
