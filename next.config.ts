import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
	dest: "public",
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	workboxOptions: {
		disableDevLogs: true,
		// Precache these files during service worker installation
		additionalManifestEntries: [
			{ url: "/offline", revision: "1" },
			{ url: "/offline-bg.jpg", revision: "1" },
		],
		runtimeCaching: [
			// Cache the offline page
			{
				urlPattern: ({ url }) => url.pathname === "/offline",
				handler: "CacheFirst",
				options: {
					cacheName: "offline-page",
				},
			},
			{
				urlPattern: /^\/offline-bg\.jpg$/,
				handler: "CacheFirst",
				options: {
					cacheName: "images",
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
					},
				},
			},
			// Cache pages for offline access
			{
				urlPattern: ({ request }) => request.mode === "navigate",
				handler: "NetworkFirst",
				options: {
					cacheName: "pages",
					expiration: {
						maxEntries: 32,
						maxAgeSeconds: 60 * 60 * 24, // 24 hours
					},
					networkTimeoutSeconds: 3,
				},
			},
			// Cache API responses
			{
				urlPattern: /^https:\/\/your-api\.com\/.*$/,
				handler: "NetworkFirst",
				options: {
					cacheName: "api-cache",
					expiration: {
						maxEntries: 50,
						maxAgeSeconds: 60 * 60, // 1 hour
					},
					networkTimeoutSeconds: 10,
				},
			},
			// ...add other caching rules if needed
		],
		// Fallback to offline page when network fails
		navigateFallback: "/offline",
		navigateFallbackDenylist: [
			/^\/_next/,
			/^\/api/,
			/\.(?:png|jpg|jpeg|svg|gif)$/,
		],
	},
});

const nextConfig = withPWA({
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
			{
				source: "/sw.js",
				headers: [
					{
						key: "Content-Type",
						value: "application/javascript; charset=utf-8",
					},
					{
						key: "Cache-Control",
						value: "no-cache, no-store, must-revalidate",
					},
					{
						key: "Content-Security-Policy",
						value: "default-src 'self'; script-src 'self'",
					},
				],
			},
		];
	},
});

export default nextConfig;
