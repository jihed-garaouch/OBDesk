import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";

type Track = {
	id: number;
	title: string;
	artist: string;
	src: string;
	cover: string;
};

const tracks: Track[] = [
	{ id: 1, title: "Morning Drift Lofi", artist: "Amaksi", src: "/music/audio/music-1.mp3", cover: "/music/img/music-1.webp" },
	{ id: 2, title: "Good Night", artist: "FASSounds", src: "/music/audio/music-2.mp3", cover: "/music/img/music-2.webp" },
	{ id: 3, title: "Lofi Background Music", artist: "LofiDreams", src: "/music/audio/music-3.mp3", cover: "/music/img/music-3.webp" },
	{ id: 4, title: "No Noise", artist: "Ikoliks", src: "/music/audio/music-4.mp3", cover: "/music/img/music-4.webp" },
	{ id: 5, title: "Walk", artist: "Sup3rrr", src: "/music/audio/music-5.mp3", cover: "/music/img/music-5.webp" },
	{ id: 6, title: "Gallows", artist: "Isaiah Matthew", src: "/music/audio/music-6.mp3", cover: "/music/img/music-6.webp" },
	{ id: 7, title: "Chillout", artist: "Music Unlimited", src: "/music/audio/music-7.mp3", cover: "/music/img/music-7.webp" },
	{ id: 8, title: "Outside", artist: "Coma Media", src: "/music/audio/music-8.mp3", cover: "/music/img/music-8.webp" },
	{ id: 9, title: "Autumn Sky", artist: "Lidérc", src: "/music/audio/music-9.mp3", cover: "/music/img/music-9.webp" },
	{ id: 10, title: "Lofi Study", artist: "FASSounds", src: "/music/audio/music-10.mp3", cover: "/music/img/music-10.webp" },
];

interface MusicPlayerContextProps {
	tracks: Track[];
	currentIndex: number;
	currentTrack: Track;
	isPlaying: boolean;
	isLooping: boolean;
	isMuted: boolean;
	currentTime: number;
	duration: number;
	handlePlayPause: () => void;
	handleNext: () => void;
	handlePrev: () => void;
	handleSelect: (index: number) => void;
	setIsLooping: React.Dispatch<React.SetStateAction<boolean>>;
	setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
	handleSeek: (time: number) => void;
	formatTime: (time: number) => string;
	audioRef: React.RefObject<HTMLAudioElement | null>;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | null>(null);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
	const [currentIndex, setCurrentIndex] = useState(() => {
		const saved = localStorage.getItem("lastTrackIndex");
		return saved ? Number(saved) : 0;
	});
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLooping, setIsLooping] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const currentTrack = tracks[currentIndex];

	// Save track index when it changes
	useEffect(() => {
		localStorage.setItem("lastTrackIndex", currentIndex.toString());
		if (audioRef.current) audioRef.current.load();
	}, [currentIndex]);

	// Play/pause effect
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		if (isPlaying) {
			audio.play().catch(() => setIsPlaying(false));
		} else {
			audio.pause();
		}
	}, [isPlaying, currentIndex]);

	// Mute effect
	useEffect(() => {
		if (audioRef.current) audioRef.current.muted = isMuted;
	}, [isMuted]);

	const handlePlayPause = () => setIsPlaying((p) => !p);

	const handleNext = () => setCurrentIndex((p) => (p + 1) % tracks.length);

	const handlePrev = () => setCurrentIndex((p) => (p === 0 ? tracks.length - 1 : p - 1));

	const handleSelect = (index: number) => setCurrentIndex(index);

	const handleSeek = (time: number) => {
		if (!audioRef.current) return;
		audioRef.current.currentTime = time;
		setCurrentTime(time);
	};

	const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
		setDuration(e.currentTarget.duration);
	};

	const handleEnded = () => {
		if (isLooping) {
			audioRef.current!.currentTime = 0;
			audioRef.current!.play();
		} else {
			handleNext();
		}
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};

	return (
		<MusicPlayerContext.Provider
			value={{
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
				audioRef,
			}}>
			<audio
				ref={audioRef}
				src={currentTrack.src}
				preload="metadata"
				loop={isLooping}
				onEnded={handleEnded}
				onLoadedMetadata={handleLoadedMetadata}
				onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
			/>
			{children}
		</MusicPlayerContext.Provider>
	);
};

export const UseMusicPlayer = () => {
	const ctx = useContext(MusicPlayerContext);
	if (!ctx) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
	return ctx;
};
