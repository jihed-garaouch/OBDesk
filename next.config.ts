import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
	dest: "public",
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	workboxOptions: {
		disableDevLogs: true,
		runtimeCaching: [
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
			// ...add other caching rules if needed
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