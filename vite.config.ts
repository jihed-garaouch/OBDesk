import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			devOptions: {
				enabled: true,
			},
			strategies: "injectManifest",
			srcDir: "src",
			filename: "service-worker.ts",
			registerType: "autoUpdate",
			includeAssets: [
				"favicon.ico",
				"apple-touch-icon.png",
				"offline-bg.jpg",
				"offline.html",
				"fonts/*",
			],
			manifest: {
				name: "Orbit Desk",
				short_name: "OrbitDesk",
				description:
					"Your global workspace — sync, simplify, and stay productive anywhere with OrbitDesk.",
				start_url: "/",
				display: "standalone",
				background_color: "#000000",
				theme_color: "#121212",
				orientation: "portrait",
				icons: [
					{
						src: "/icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/maskable_icon_x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/maskable_icon_x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
