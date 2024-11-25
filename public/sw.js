if (!self.define) {
  let e,
    s = {};
  const i = (i, n) => (
    (i = new URL(i + ".js", n).href),
    s[i] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = i), (e.onload = s), document.head.appendChild(e);
        } else (e = i), importScripts(i), s();
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, a) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[t]) return;
    let c = {};
    const r = (e) => i(e, t),
      x = { module: { uri: t }, exports: c, require: r };
    s[t] = Promise.all(n.map((e) => x[e] || r(e))).then((e) => (a(...e), c));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "f51420527cda0efbb5a1549378716908",
        },
        {
          url: "/_next/static/IiS37OHLE8xExxwsQwrJv/_buildManifest.js",
          revision: "c155cce658e53418dec34664328b51ac",
        },
        {
          url: "/_next/static/IiS37OHLE8xExxwsQwrJv/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/117-d8b42f138b0e30d9.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/41ade5dc-e6840933a2201c74.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/585-92a349fac7e35461.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/605-71c42f35cb0a8784.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/736-14ecf81711b6d60c.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/746-efd0c0ef36b02fbe.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/785-514c8839c666d187.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/972-211b74ebdec155c1.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-4d1f1e5ae4dcd19a.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/auth/signin/page-b845b4b4e2aa9147.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/auth/signup/page-17b4dfd799893c8d.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/error-1932879355626249.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/favorites/page-4268e3e05997aa11.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/layout-f1e93b68b1f6cdf4.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/loading-0c84d000ba243508.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/not-found-1ecb6fb457aaa640.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/page-59423ccfc78f0f00.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/profile/page-26be4a8ea5804d4e.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/recipes/%5Bid%5D/page-01abffe261607c30.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/app/shopping-list/page-4d7c696f4ecdb619.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/fd9d1056-52bf880d6adf56a0.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/framework-f66176bb897dc684.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/main-app-827c388fee174082.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/main-ed75631742cb7d73.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/pages/_app-72b849fbd24ac258.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/pages/_error-7ba65e1336b92748.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-68d128f78d0676ff.js",
          revision: "IiS37OHLE8xExxwsQwrJv",
        },
        {
          url: "/_next/static/css/4108455834d7bf84.css",
          revision: "4108455834d7bf84",
        },
        {
          url: "/android-chrome-192x192.png",
          revision: "0b1ea54e1cab7482905ed7f81eb6ef4b",
        },
        {
          url: "/android-chrome-512x512.png",
          revision: "c260dba8539adc195714077544dd3040",
        },
        {
          url: "/apple-touch-icon.png",
          revision: "21f2aa7ba259aff14a02519bf501ec80",
        },
        {
          url: "/favicon-16x16.png",
          revision: "96332a57728eb690913064f95e58df7d",
        },
        {
          url: "/favicon-32x32.png",
          revision: "948cb0d52ca1739250e404d15397ce49",
        },
        { url: "/favicon.ico", revision: "238a414c811c0a47793bfafa8bacedc3" },
        {
          url: "/hero_section1.jpg",
          revision: "5bf05d15424b8b83af977d21c7ec6875",
        },
        { url: "/logo.png", revision: "4a89d4109d583314e0fa020d161eaf3a" },
        {
          url: "/site.webmanifest",
          revision: "57b97026a2675cb34eef23f6d14d4744",
        },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: i,
              state: n,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
