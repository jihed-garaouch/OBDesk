/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";

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
			return cache.addAll(["/offline.html", "/offline-bg.jpg"]);
		})
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	console.log("Service Worker activated");
	event.waitUntil(self.clients.claim());
});

// Cache images
registerRoute(
	({ request, sameOrigin }) => {
		return sameOrigin && request.destination === "image";
	},
	new CacheFirst({
		cacheName: "images",
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
					return offlinePage || new Response("Offline", {
						status: 503,
						statusText: "Service Unavailable"
					});
				},
			},
		],
	})
);