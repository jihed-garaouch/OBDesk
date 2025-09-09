import { UseTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";

const LandingScreen = () => {
	const { theme } = UseTheme();
	const navigate = useNavigate();
	const isDarkTheme = theme === "dark";

	return (
		<div className='min-h-svh w-full flex flex-col lg:flex-row text-foreground bg-background relative'>
			<img
				src='/offline-bg.jpg'
				alt='Offline-Background'
				className={`lg:hidden fixed top-0 left-0 w-screen h-screen object-cover z-0 ${
					isDarkTheme ? "" : "invert"
				}`}
				style={{ pointerEvents: "none" }}
			/>
			<div className='fixed inset-0 bg-background/50 bg-background-50 md:bg-background/10! md:bg-background-10! backdrop-blur-xs z-2 lg:hidden'></div>
			{/* LEFT SIDE: Brand & CTA */}
			<div className='flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 z-20 py-4'>
				<div className="flex justify-start md:justify-center lg:justify-start">
					<div className='flex items-center gap-2 mb-6'>
						<img
							src='/logo.webp'
							alt='logo'
							className={`w-[35px] h-[35px] md:w-[40px] md:h-[40px] border-2 rounded-full ${
								isDarkTheme ? "border-foreground" : "border-gray-400"
							}`}
						/>
						<p className='font-bold text-lg md:text-xl tracking-tight'>OrbitDesk</p>
					</div>
				</div>

				{/* HEADLINE */}
				<div className='mb-8 text-left md:text-center lg:text-left'>
					<h1 className='text-3xl lg:text-4xl xl:text-5xl font-bold leading-[1.1] mb-3'>
						Your command center for global work. <br />
					</h1>
					<p className='font-semibold tracking-wide text-foreground text-sm md:text-base'>
						Work Synchronized. Work Simplified.
					</p>
				</div>

				{/* FEATURES LIST - Scaled down and cleaned up */}
				<div className='space-y-3 mb-6 md:mb-8 max-w-md'>
					{[
						{
							title: "Unified Global Sync",
							desc: "Real-time world clocks and task deadlines in one view.",
						},
						{
							title: "Financial Command",
							desc: "Seamless Fiat & Crypto conversion with expense tracking.",
						},
						{
							title: "Adaptive Workflow",
							desc: "A modular dashboard that evolves with your global needs.",
						},
					].map((item, i) => (
						<div key={i} className='flex items-start gap-4 group'>
							<div className='mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground shrink-0 group-hover:scale-150 transition-transform duration-700 ease-in-out' />
							<div>
								<p className='text-sm md:text-base leading-tight drop-shadow-lg'>
									<span className='font-bold block mb-0.5'>{item.title}</span>
									<span className='text-foreground/70 text-foreground-70 text-xs md:text-sm'>
										{item.desc}
									</span>
								</p>
							</div>
						</div>
					))}
				</div>

				<div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4 text-sm'>
					<button
						onClick={() => navigate("/sign-up")}
						className='active:scale-95 bg-foreground border border-background/30 border-background-30 backdrop-blur-md text-background px-8 py-4 rounded-[4px] font-bold hover:scale-105 transition-all duration-700 ease-in-out cursor-pointer'>
						Get Started Free
					</button>
					<button
						onClick={() => navigate("/login")}
						className='active:scale-95 border border-foreground/30 border-foreground-30 backdrop-blur-md px-8 py-4 rounded-[4px] font-bold hover:scale-105 transition-all duration-700 ease-in-out cursor-pointer'>
						Sign In
					</button>
				</div>
			</div>

			{/* RIGHT SIDE: Visual Hero */}
			<div
				className='hidden lg:flex flex-1 bg-cover bg-center relative'
				style={{ backgroundImage: `url('/login/login-bg.webp')` }}>
				{/* Overlay to match your login screen depth */}
				<div className='absolute inset-0 bg-black/40 backdrop-blur-[2px]'></div>

				<div className='relative z-10 m-auto w-[80%] aspect-video bg-background/10 bg-background-10 backdrop-blur-xl border border-white/30 p-1 rounded-lg shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-700 ease-in-out'>
					<img
						src='/landing.jpg'
						alt='Landing Preview'
						className='w-full h-full object-cover'
					/>
				</div>
			</div>
		</div>
	);
};

export default LandingScreen;
