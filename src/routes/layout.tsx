import { component$, Slot } from "@builder.io/qwik";
import { loader$ } from "@builder.io/qwik-city";
import { randomBytes } from "crypto";

import Header from "../components/header/header";

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

export const useServerTimeLoader = loader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const serverTime = useServerTimeLoader();
  return (
    <>
      <main>
        <Header />
        <section>
          <Slot />
        </section>
      </main>
      <footer>
        <a href="https://www.builder.io/" target="_blank">
          Made with ♡ by Builder.io
          <div>{serverTime.value.date}</div>
        </a>
      </footer>
    </>
  );
});
