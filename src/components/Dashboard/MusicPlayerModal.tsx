import { useState } from "react";
import {
	TbPlayerPause,
	TbPlayerPlay,
	TbPlayerSkipBack,
	TbPlayerSkipForward,
} from "react-icons/tb";
import { LuVolume2 } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

const tracks = [
	{
		id: 1,
		title: "Morning Drift Lofi",
		artist: "Amaksi",
		src: "/music/audio/music-1.mp3",
		cover: "/music/img/music-1.webp",
	},
	{
		id: 2,
		title: "Good Night",
		artist: "FASSounds",
		src: "/music/audio/music-2.mp3",
		cover: "/music/img/music-2.webp",
	},
	{
		id: 3,
		title: "Lofi Background Music",
		artist: "LofiDreams",
		src: "/music/audio/music-3.mp3",
		cover: "/music/img/music-3.webp",
	},
	{
		id: 4,
		title: "No Noise",
		artist: "Ikoliks",
		src: "/music/audio/music-4.mp3",
		cover: "/music/img/music-4.webp",
	},
	{
		id: 5,
		title: "Walk",
		artist: "Sup3rrr",
		src: "/music/audio/music-5.mp3",
		cover: "/music/img/music-5.webp",
	},
	{
		id: 6,
		title: "Gallows",
		artist: "Isaiah Matthew",
		src: "/music/audio/music-6.mp3",
		cover: "/music/img/music-6.webp",
	},
	{
		id: 7,
		title: "Chillout",
		artist: "Music Unlimited",
		src: "/music/audio/music-7.mp3",
		cover: "/music/img/music-7.webp",
	},
	{
		id: 8,
		title: "Outside",
		artist: "Coma Media",
		src: "/music/audio/music-8.mp3",
		cover: "/music/img/music-8.webp",
	},
	{
		id: 9,
		title: "Autumn Sky",
		artist: "Lidérc",
		src: "/music/audio/music-9.mp3",
		cover: "/music/img/music-9.webp",
	},
	{
		id: 10,
		title: "Lofi Study",
		artist: "FASSounds",
		src: "/music/audio/music-10.mp3",
		cover: "/music/img/music-10.webp",
	},
];

type Track = {
    id: number;
    title: string;
    artist: string;
    src: string;
    cover: string;
}

const MusicPlayerModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
	const [isPlaying, setIsPlaying] = useState(false);

	if (!isOpen) return null;

	const handlePlayPause = () => setIsPlaying(!isPlaying);
	const handleSelect = (track: Track) => {
		setCurrentTrack(track);
		setIsPlaying(true);
	};

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
						className={`h-32 w-32 rounded-full overflow-hidden shadow-md border border-foreground/20 ${
							isPlaying ? "custom-animate-spin" : ""
						}`}>
						<img
							src={currentTrack.cover}
							alt={currentTrack.title}
							className='object-cover h-full w-full'
						/>
					</div>
					<div className='text-center'>
						<h2 className='text-sm font-medium'>{currentTrack.title}</h2>
						<p className='text-xs text-foreground/60'>{currentTrack.artist}</p>
					</div>

					{/* Controls */}
					<div className='flex items-center gap-3 mt-2'>
						<button className='p-2 rounded-full hover:bg-white/30 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer'>
							<TbPlayerSkipBack size={20} />
						</button>
						<button
							onClick={handlePlayPause}
							className='bg-white/20 p-3 rounded-full hover:bg-white/30 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer'>
							{isPlaying ? (
								<TbPlayerPause size={22} />
							) : (
								<TbPlayerPlay size={22} />
							)}
						</button>
						<button className='p-2 rounded-full hover:bg-white/30 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer'>
							<TbPlayerSkipForward size={20} />
						</button>
						<button className='p-2 rounded-full hover:bg-white/30 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer'>
							<LuVolume2 size={18} />
						</button>
					</div>
				</div>

				{/* Song List */}
				<div className='mt-5 border-t border-foreground/10 pt-2 max-h-60 flex flex-col gap-1 overflow-y-auto'>
					{tracks.map((track) => (
						<div
							key={track.id}
							onClick={() => handleSelect(track)}
							className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
								currentTrack.id === track.id
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
