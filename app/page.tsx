"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

const Home = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<section className='h-screen w-full flex justify-center items-center bg-background text-foreground'>
			<div className='flex flex-col gap-2 items-center'>
				<div className='flex items-center gap-2'>
					<Image
						src='/logo.webp'
						alt='logo'
						className={`border-2 rounded-full ${
							theme === "dark" ? " border-foreground" : " border-gray-400"
						}`}
						width={50}
						height={50}
					/>
					<h1 className='text-3xl font-bold'>OrbitDesk</h1>
				</div>
				<p className='text-accent font-dm-sans'>Your global workspace</p>
				<button
					onClick={toggleTheme}
					className='bg-foreground text-background px-4 py-2 rounded cursor-pointer'>
					{theme === "light" ? "🌙 Dark" : "☀️ Light"}
				</button>
			</div>
		</section>
	);
};

export default Home;
