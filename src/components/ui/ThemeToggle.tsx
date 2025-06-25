import { UseTheme } from "@/context/ThemeContext";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
	const circleRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const { theme, toggleTheme } = UseTheme();

	const isDark = theme === "dark";

	// Animate the toggle when the theme changes
	useEffect(() => {
		if (!circleRef.current || !containerRef.current) return;

		const circle = circleRef.current;

		// Slide animation
		gsap.to(circle, {
			x: isDark ? 32 : 0, // adjust distance to fit toggle width
			duration: 0.4,
			ease: "power2.out",
		});
	}, [isDark]);

	return (
		<div
			ref={containerRef}
			onClick={toggleTheme}
			className={`relative w-16 h-8 rounded-full flex items-center cursor-pointer bg-foreground transition-all duration-300 ease-in-out border-background border-2`}>
			{/* Static icons */}
			<div
				className={`absolute left-2 ${isDark ? "text-black" : "text-white"}`}>
				<FaSun size={16} />
			</div>
			<div
				className={`absolute right-2  ${isDark ? "text-black" : "text-white"}`}>
				<FaMoon size={16} />
			</div>

			{/* Sliding Circle */}
			<div
				ref={circleRef}
				className={`absolute w-7 h-7 ${
					isDark ? "bg-black" : "bg-white"
				} rounded-full flex items-center justify-center`}>
				{isDark ? (
					<FaMoon
						size={14}
						className={`${isDark ? "text-white" : "text-black"}`}
					/>
				) : (
					<FaSun
						size={14}
						className={`${isDark ? "text-white" : "text-black"}`}
					/>
				)}
			</div>
		</div>
	);
};

export default ThemeToggle;
