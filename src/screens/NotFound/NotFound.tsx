import { UseTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const { theme } = UseTheme();
	const navigate = useNavigate();

	const isDarkTheme = theme === "dark";

	return (
		<section
			className={`relative h-svh overflow-hidden w-full flex justify-center items-center`}>
			<img
				src='/offline-bg.jpg'
				alt='Offline-Background'
				className={`fixed top-0 left-0 w-screen h-screen object-cover z-0 ${
					isDarkTheme ? "" : "invert"
				}`}
				style={{ pointerEvents: "none" }}
			/>
			<div className='flex flex-col items-center gap-2 px-4 relative z-3 text-foreground'>
				<h1 className='text-[5rem] md:text-[7rem] font-extrabold -mt-[15px] md:-mt-[30px] flex items-center'>
					404
				</h1>
				<div className='h-[3px] w-[80px] bg-foreground -mt-[15px] md:-mt-[25px]' />
				<p className='font-bold text-center text-[1.5rem] md:text-[2rem]'>
					{`Page Not Found`}
				</p>
				<div className='text-xs flex items-center gap-1 font-bold'>
					<span>Sorry the page you're looking for does not exist.</span>
				</div>
				<button
					className='cursor-pointer mt-[10px] py-2 px-8 rounded-[20px] bg-foreground text-background font-bold text-[13px]'
					onClick={() => navigate("/")}
					type='button'>
					Back To Home
				</button>
			</div>
		</section>
	);
};

export default NotFound;
