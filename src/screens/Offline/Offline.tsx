import { useTheme } from "@/context/ThemeContext";
import { FiPower } from "react-icons/fi";
import { RiWifiOffLine } from "react-icons/ri";

const OfflineScreen = () => {
	const { theme } = useTheme();

	const handleReload = () => {
		window.location.reload();
	};

	const isDarkTheme = theme === "dark";

	return (
		<section
			className={`relative h-screen w-full flex justify-center items-center`}>
			<img
				src='/offline-bg.jpg'
				alt='Offline-Background'
				className={`fixed top-0 left-0 w-screen h-screen object-cover -z-10 ${
					isDarkTheme ? "" : "invert"
				}`}
				style={{ pointerEvents: "none" }}
			/>
			<div className='flex flex-col items-center gap-2 px-4 relative z-3 text-foreground'>
				<RiWifiOffLine className='text-[3rem] md:text-[5rem]' />
				<p className='uppercase text-xs md:text-sm font-bold'>Currently</p>
				<h1 className='text-[3rem] md:text-[5rem] font-extrabold -mt-[15px] md:-mt-[30px] flex items-center'>
					<span>
						<FiPower />
					</span>
					ffline
				</h1>
				<div className='h-[3px] w-[80px] bg-foreground -mt-[7px] md:-mt-[15px]' />
				<p className='font-bold text-center w-[80%] text-sm md:text-base'>
					{`Don't worry, your data is safe. We'll sync when you're back online.`}
				</p>
				<div className='text-xs flex items-center gap-1 font-bold mt-2'>
					<RiWifiOffLine className='font-bold' />
					<span>Offline Mode.</span>
				</div>
				<button
					className='cursor-pointer mt-[10px] py-2 px-8 rounded-[20px] bg-foreground text-background font-bold text-[13px]'
					onClick={handleReload}
					type='button'>
					Try Again
				</button>
			</div>
		</section>
	);
};

export default OfflineScreen;
