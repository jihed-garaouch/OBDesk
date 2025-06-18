import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";
import Image from "next/image";

const satoshi = localFont({
	src: [
		{
			path: "../public/fonts/Satoshi/Satoshi-Light.otf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../public/fonts/Satoshi/Satoshi-Regular.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/Satoshi/Satoshi-Medium.otf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../public/fonts/Satoshi/Satoshi-Bold.otf",
			weight: "700",
			style: "normal",
		},
		{
			path: "../public/fonts/Satoshi/Satoshi-Black.otf",
			weight: "900",
			style: "normal",
		},
	],
	variable: "--font-satoshi",
	display: "swap",
	preload: true,
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
	display: "swap",
	preload: true,
});

export const metadata: Metadata = {
	title: "Orbit Desk",
	description:
		"Your global workspace — sync, simplify, and stay productive anywhere with OrbitDesk.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' data-theme='dark'>
			<head>
				<link rel='preload' as='image' href='/offline-bg.jpg' />
			</head>
			<body className={`${satoshi.variable} ${dmSans.variable} antialiased`}>
				{/* Hidden image to force caching */}
				<Image
					src='/offline-bg.jpg'
					alt=''
					width={1}
					height={1}
					style={{ display: "none" }}
					priority
				/>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
