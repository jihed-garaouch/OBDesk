import { LuVolume2 } from "react-icons/lu";
import {
	TbPlayerPlay,
	TbPlayerSkipBack,
	TbPlayerSkipForward,
} from "react-icons/tb";

const MusicPlayer = () => {
	return (
		<div className='bg-foreground/12 p-2 rounded-full flex items-center text-[1.2rem] cursor-pointer shadow-sm'>
			<div className='group relative flex items-center gap-2 bg-foreground/8 hover:bg-foreground/15 active:scale-95 px-3 py-1 rounded-full transition-all duration-300 ease-in-out'>
				<button className='bg-white/50 border-[0.1px] border-white/5 rounded-full h-8 w-8 shadow-sm overflow-hidden cursor-pointer'>
					<img
						src='https://img.freepik.com/free-photo/3d-music-related-scene_23-2151125082.jpg?t=st=1761334364~exp=1761337964~hmac=416464f0fff74284be50f521f871e2d6d61003f41ea534e38d2c4b20ec13d618&w=1480'
						alt='Music'
						className='object-cover w-full h-full'
					/>
				</button>

				{/* Label with tooltip */}
				<div className='relative'>
					<span className='text-xs font-light truncate max-w-[80px] block'>
						Coffee Shop Work House
					</span>

					{/* Tooltip */}
					<div className='absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 rounded-md text-[10px] font-medium text-background bg-foreground opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-all duration-700 ease-in-out shadow-md'>
						Coffee Shop Work House
						<div className='absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-foreground rotate-45'></div>
					</div>
				</div>
			</div>
			<button className='cursor-pointer hover:bg-foreground/15 active:scale-90 p-2 rounded-full transition-all duration-300 ease-in-out text-sm md:text-base'>
				<TbPlayerSkipBack />
			</button>
			<button className='cursor-pointer hover:bg-foreground/15 active:scale-90 p-2 rounded-full transition-all duration-300 ease-in-out text-sm md:text-base'>
				<TbPlayerPlay />
				{/* <TbPlayerPause /> */}
			</button>
			<button className='cursor-pointer hover:bg-foreground/15 active:scale-90 p-2 rounded-full transition-all duration-300 ease-in-out text-sm md:text-base'>
				<TbPlayerSkipForward />
			</button>
			<button className='cursor-pointer hover:bg-foreground/15 active:scale-90 p-2 rounded-full transition-all duration-300 ease-in-out text-sm md:text-base'>
				<LuVolume2 />
				{/* <LuVolumeX /> */}
			</button>
		</div>
	);
};

export default MusicPlayer;
