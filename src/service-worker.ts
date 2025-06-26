/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

// Clean old caches
cleanupOutdatedCaches();

// Precache all Vite-built assets
precacheAndRoute(self.__WB_MANIFEST);

// Handle install event to cache offline assets
self.addEventListener("install", (event) => {
	console.log("Service Worker installing...");
	event.waitUntil(
		caches.open("offline-assets").then((cache) => {
			return cache.addAll([
				"/offline.html",
				"/offline-bg.jpg",
				"/fonts/Satoshi/Satoshi-Regular.otf",
				"/fonts/Satoshi/Satoshi-Medium.otf",
				"/fonts/Satoshi/Satoshi-Bold.otf",
				"/fonts/Satoshi/Satoshi-Black.otf",
			]);
		})
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	console.log("Service Worker activated");
	event.waitUntil(self.clients.claim());
});

// Cache fonts
registerRoute(
	({ url }) => url.pathname.startsWith("/fonts/Satoshi/"),
	new CacheFirst({
		cacheName: "satoshi-fonts",
		plugins: [
			new ExpirationPlugin({
				maxEntries: 10,
				maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
			}),
			{
				// Ensure cached response has a usable Content-Type header
				async cacheWillUpdate({ response }) {
					if (!response || response.status !== 200) return null;
					const cloned = response.clone();
					const body = await cloned.blob();
					const headers = new Headers(cloned.headers);

					// If server didn't set Content-Type or it's wrong, set a sensible one
					if (
						!headers.get("Content-Type") ||
						headers.get("Content-Type") === "application/octet-stream"
					) {
						// .otf => font/otf, change to 'font/woff2' if you switch to woff2
						headers.set("Content-Type", "font/otf");
					}

					return new Response(body, {
						status: cloned.status,
						statusText: cloned.statusText,
						headers,
					});
				},
			},
		],
	})
);

// Cache internal app images
registerRoute(
	({ request, sameOrigin }) => {
		return sameOrigin && request.destination === "image";
	},
	new CacheFirst({
		cacheName: "images",
	})
);

// Cache only external images
registerRoute(
	({ request }) => request.destination === "image",
	new CacheFirst({
		cacheName: "external-images",
		plugins: [
			new ExpirationPlugin({
				maxEntries: 50,
				maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
			}),
		],
	})
);

// Cache offline assets with CacheFirst
registerRoute(
	({ url }) =>
		url.pathname === "/offline.html" || url.pathname === "/offline-bg.jpg",
	new CacheFirst({
		cacheName: "offline-assets",
	})
);

// Network-first navigation route with offline fallback
registerRoute(
	({ request }) => request.mode === "navigate",
	new NetworkFirst({
		cacheName: "navigation",
		networkTimeoutSeconds: 3,
		plugins: [
			{
				handlerDidError: async () => {
					console.log("Network failed, serving offline page");
					const offlinePage = await caches.match("/offline.html");
					return (
						offlinePage ||
						new Response("Offline", {
							status: 503,
							statusText: "Service Unavailable",
						})
					);
				},
			},
		],
	})
);
