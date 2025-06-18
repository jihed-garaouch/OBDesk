"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import React from "react";

const LoadingScreen = () => {
	const { theme } = useTheme();

	return (
		<div className='flex min-h-svh flex-col items-center justify-center bg-background relative'>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src='/offline-bg.jpg'
				alt='Background'
				className={`absolute top-0 left-0 w-full h-full object-cover z-10 ${
					theme === "dark" ? "" : "invert"
				}`}
			/>
			<Image
				src={"/logo.png"}
				width={56}
				height={56}
				alt='Loader'
				className={`z-20 relative animate-bounce border-2 rounded-full ${
					theme === "dark" ? "border-foreground" : "border-gray-400"
				}`}
			/>
		</div>
	);
};

export default LoadingScreen;
