import { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { LuVolume2, LuVolumeX } from "react-icons/lu";
import { RiLoopRightFill } from "react-icons/ri";
import {
	TbPlayerPause,
	TbPlayerPlay,
	TbPlayerSkipBack,
	TbPlayerSkipForward,
} from "react-icons/tb";
import { UseMusicPlayer } from "@/context/MusicPlayerContext";

const MusicPlayerModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const {
		tracks,
		currentIndex,
		currentTrack,
		isPlaying,
		isLooping,
		isMuted,
		currentTime,
		duration,
		handlePlayPause,
		handleNext,
		handlePrev,
		handleSelect,
		setIsLooping,
		setIsMuted,
		handleSeek,
		formatTime,
	} = UseMusicPlayer();

	// --- Handle Cover Rotation ---
	const [rotation, setRotation] = useState(0);
	const rotationRef = useRef(0);
	const lastTimestampRef = useRef<number | null>(null);

	useEffect(() => {
		let frameId: number;

		const rotate = (timestamp: number) => {
			if (lastTimestampRef.current === null)
				lastTimestampRef.current = timestamp;
			const delta = timestamp - lastTimestampRef.current;

			if (isPlaying) {
				rotationRef.current += (delta / 8000) * 360; // 8s for full rotation
				setRotation(rotationRef.current);
			}

			lastTimestampRef.current = timestamp;
			frameId = requestAnimationFrame(rotate);
		};

		frameId = requestAnimationFrame(rotate);
		return () => cancelAnimationFrame(frameId);
	}, [isPlaying]);

	if (!isOpen) return null;

	return (
		<div
			onClick={onClose}
			className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]'>
			<div
				onClick={(e) => e.stopPropagation()}
				className='bg-background/90 rounded-2xl border border-foreground/20 w-[90%] max-w-md p-4 shadow-lg text-foreground relative z-[1000]'>
				{/* Close Button */}
				<button
					onClick={onClose}
					className='absolute top-3 right-3 text-foreground/60 hover:text-foreground transition-all cursor-pointer'>
					<IoClose size={22} />
				</button>

				{/* Now Playing */}
				<div className='flex flex-col items-center gap-3 mt-4'>
					<div
						className='h-32 w-32 rounded-full overflow-hidden shadow-md border border-foreground/20'
						style={{
							transform: `rotate(${rotation}deg)`,
							transition: "transform 0.1s linear",
						}}>
						<img
							src={currentTrack.cover}
							alt={currentTrack.title}
							className='object-cover h-full w-full'
						/>
					</div>

					{/* Track Info */}
					<div className='text-center'>
						<h2 className='text-sm font-medium'>{currentTrack.title}</h2>
						<p className='text-xs text-foreground/60'>{currentTrack.artist}</p>
					</div>

					{/* Progress Bar */}
					<div className='w-full flex flex-col items-center gap-1'>
						<input
							type='range'
							min={0}
							max={duration || 0}
							value={currentTime}
							onChange={(e) => handleSeek(parseFloat(e.target.value))}
							className='w-full accent-foreground cursor-pointer'
						/>
						<div className='w-full flex justify-between text-[10px] text-foreground/70'>
							<span>{formatTime(currentTime)}</span>
							<span>{formatTime(duration)}</span>
						</div>
					</div>

					{/* Controls */}
					<div className='flex items-center gap-3 mt-2'>
						<button
							onClick={() => setIsLooping((prev) => !prev)}
							className={`p-2 rounded-full hover:bg-white/30 active:scale-95 transition-all cursor-pointer ${
								isLooping ? "text-green-400" : ""
							}`}
							title='Loop'>
							<RiLoopRightFill size={18} />
						</button>
						<button
							onClick={handlePrev}
							className='p-2 rounded-full hover:bg-white/30 active:scale-95 transition-all cursor-pointer'>
							<TbPlayerSkipBack size={20} />
						</button>
						<button
							onClick={handlePlayPause}
							className='bg-white/20 p-3 rounded-full hover:bg-white/30 active:scale-95 transition-all cursor-pointer'>
							{isPlaying ? (
								<TbPlayerPause size={22} />
							) : (
								<TbPlayerPlay size={22} />
							)}
						</button>
						<button
							onClick={handleNext}
							className='p-2 rounded-full hover:bg-white/30 active:scale-95 transition-all cursor-pointer'>
							<TbPlayerSkipForward size={20} />
						</button>
						<button
							onClick={() => setIsMuted((prev) => !prev)}
							className='p-2 rounded-full hover:bg-white/30 active:scale-95 transition-all cursor-pointer'
							title={isMuted ? "Unmute" : "Mute"}>
							{isMuted ? <LuVolumeX size={18} /> : <LuVolume2 size={18} />}
						</button>
					</div>
				</div>

				{/* Song List */}
				<div className='mt-5 border-t border-foreground/10 pt-2 max-h-60 flex flex-col gap-1 overflow-y-auto'>
					{tracks.map((track, index) => (
						<div
							key={track.id}
							onClick={() => handleSelect(index)}
							className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
								currentIndex === index
									? "bg-foreground/10"
									: "hover:bg-foreground/5"
							}`}>
							<img
								src={track.cover}
								alt={track.title}
								className='w-10 h-10 rounded-full border border-foreground/20 object-cover'
							/>
							<div className='flex-1'>
								<p className='text-sm font-medium truncate'>{track.title}</p>
								<p className='text-xs text-foreground/60 truncate'>
									{track.artist}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MusicPlayerModal;
