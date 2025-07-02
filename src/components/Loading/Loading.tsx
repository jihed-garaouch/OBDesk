import { UseTheme } from "@/context/ThemeContext";

const LoadingScreen = () => {
	const { theme } = UseTheme();

	return (
		<div className='flex h-full flex-col items-center justify-center bg-background relative'>
			{/* <img
				src='/offline-bg.jpg'
				alt='Background'
				className={`absolute top-0 left-0 w-full h-full object-cover z-10 ${
					theme === "dark" ? "" : "invert"
				}`}
			/> */}
			<img
				src={"/logo.png"}
				alt='Loader'
				className={`w-[60px] h-[60px] z-20 relative animate-bounce border-2 rounded-full ${
					theme === "dark" ? "border-foreground" : "border-gray-400"
				}`}
			/>
		</div>
	);
};

export default LoadingScreen;
