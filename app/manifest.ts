import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Orbit Desk",
		short_name: "OrbitDesk",
		description:
			"Your global workspace — sync, simplify, and stay productive anywhere with OrbitDesk.",
		start_url: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#121212",
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
	};
}
