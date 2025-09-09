import { UseMusicPlayer } from "@/context/MusicPlayerContext";
import { useEffect, useRef } from "react";
import { LuVolume2, LuVolumeX } from "react-icons/lu";
import {
	TbPlayerPause,
	TbPlayerPlay,
	TbPlayerSkipBack,
	TbPlayerSkipForward,
} from "react-icons/tb";

interface MusicPlayerProps {
	setShowMusicPlayerModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const MusicPlayer = ({ setShowMusicPlayerModal }: MusicPlayerProps) => {
	const {
		currentTrack,
		isPlaying,
		handlePlayPause,
		handleNext,
		handlePrev,
		isMuted,
		setIsMuted,
	} = UseMusicPlayer();

	const coverRef = useRef<HTMLDivElement>(null);
	const rotationRef = useRef(0);
	const lastTimestampRef = useRef<number | null>(null);

	useEffect(() => {
		let frameId: number;

		if (isPlaying) {
			lastTimestampRef.current = null;
		}

		const rotate = (timestamp: number) => {
			if (lastTimestampRef.current === null)
				lastTimestampRef.current = timestamp;

			const delta = timestamp - lastTimestampRef.current;

			if (isPlaying && coverRef.current) {
				rotationRef.current =
					(rotationRef.current + (delta / 8000) * 360) % 360;

				coverRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
			}

			lastTimestampRef.current = timestamp;
			frameId = requestAnimationFrame(rotate);
		};

		frameId = requestAnimationFrame(rotate);
		return () => {
			cancelAnimationFrame(frameId);
			lastTimestampRef.current = null;
		};
	}, [isPlaying]);

	return (
		<div className='bg-foreground/12 bg-foreground-12 p-2 rounded-full flex items-center text-[1.2rem] shadow-sm'>
			{/* Cover + Track Name */}
			<div
				onClick={() => setShowMusicPlayerModal(true)}
				className='group relative flex items-center gap-2 bg-foreground/8 bg-foreground-8 hover:bg-foreground/15 hover:bg-foreground-15 active:scale-95 px-3 py-1 rounded-full transition-all cursor-pointer'>
				<div
					ref={coverRef}
					className='bg-white/50 border-[0.1px] border-white/5 rounded-full h-8 w-8 shadow-sm overflow-hidden'>
					<img
						src={currentTrack.cover}
						alt={currentTrack.title}
						className='object-cover w-full h-full'
						style={{
							transition: "none", // Critical: Disable CSS transitions during JS animation
							willChange: "transform", // Hint to iOS to use GPU acceleration
						}}
					/>
				</div>

				{/* Tooltip + Label */}
				<div className='relative'>
					<span className='text-xs font-light truncate max-w-[80px] block'>
						{currentTrack.title}
					</span>
					<div className='absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 rounded-md text-[10px] font-medium text-background bg-foreground opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-all duration-700 ease-in-out shadow-md'>
						{currentTrack.title}
						<div className='absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-foreground rotate-45'></div>
					</div>
				</div>
			</div>

			{/* Controls */}
			<button
				onClick={handlePrev}
				className='hover:bg-foreground/15 hover:bg-foreground-15 active:scale-90 p-2 rounded-full transition-all text-sm md:text-base cursor-pointer'>
				<TbPlayerSkipBack />
			</button>

			<button
				onClick={handlePlayPause}
				className='hover:bg-foreground/15 hover:bg-foreground-15 active:scale-90 p-2 rounded-full transition-all text-sm md:text-base cursor-pointer'>
				{isPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
			</button>

			<button
				onClick={handleNext}
				className='hover:bg-foreground/15 hover:bg-foreground-15 active:scale-90 p-2 rounded-full transition-all text-sm md:text-base cursor-pointer'>
				<TbPlayerSkipForward />
			</button>

			<button
				onClick={() => setIsMuted((prev) => !prev)}
				className='hover:bg-foreground/15 hover:bg-foreground-15 active:scale-90 p-2 rounded-full transition-all text-sm md:text-base cursor-pointer'
				title={isMuted ? "Unmute" : "Mute"}>
				{isMuted ? <LuVolumeX /> : <LuVolume2 />}
			</button>
		</div>
	);
};

export default MusicPlayer;
