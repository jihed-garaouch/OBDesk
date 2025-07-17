import { UserAuth } from "@/context/AuthContext";
import { UseTheme } from "@/context/ThemeContext";
import { navItems } from "@/data/Navbar";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import {
	IoArrowUndoOutline,
	IoCloudDoneOutline,
	IoCloudOfflineOutline,
} from "react-icons/io5";
import { Link, Outlet, useLocation } from "react-router-dom";
import Avatar from "../ui/Avatar";
import MusicPlayer from "./MusicPlayer";
import MusicPlayerModal from "./MusicPlayerModal";

const DashboardLayout = () => {
	const { theme } = UseTheme();
	const { signOut, user } = UserAuth();
	const { isOnline } = useNetworkStatus();
	const location = useLocation();

	const isDarkTheme = theme === "dark";
	const [mobileOpen, setMobileOpen] = useState(false);
	const [showMusicPlayerModal, setShowMusicPlayerModal] = useState(false);
	const [showBackOnline, setShowBackOnline] = useState(false);
	const wasOffline = useRef(false);

	const fullName = user?.full_name;

	const isActive = (path: string) =>
		path === "/dashboard"
			? location.pathname === path
			: location.pathname.startsWith(path);

	useEffect(() => {
		if (!isOnline) {
			wasOffline.current = true;
			setShowBackOnline(false);
		} else if (wasOffline.current && isOnline) {
			setShowBackOnline(true);
			wasOffline.current = false;

			const timer = setTimeout(() => setShowBackOnline(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [isOnline]);

	return (
		<div className='h-svh flex'>
			{/* Sidebar */}
			<aside className='group hidden md:w-22 hover:md:w-54 border-r border-[var(--border)] p-4 h-svh lg:flex flex-col transition-all duration-500 ease-in-out'>
				<Link
					to='/dashboard'
					className='flex group-hover:flex-row flex-col items-center gap-1 mb-8 text-xs group-hover:text-sm'>
					<img
						src='/logo.webp'
						alt='logo'
						className={`w-8 h-8 border-2 rounded-full ${
							isDarkTheme ? "border-foreground" : "border-gray-400"
						}`}
					/>
					<span className='font-bold'>OrbitDesk</span>
				</Link>

				<nav className='gap-2 flex flex-col items-center'>
					{navItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`flex items-center gap-2 px-4 py-2 rounded-md w-fit group-hover:w-full ${
								isActive(item.path)
									? "bg-foreground text-background"
									: "hover:bg-foreground/10 transition-all duration-500 ease-in-out"
							}`}>
							<span>{item.icon}</span>
							<span className='text-sm hidden group-hover:block truncate max-w[170px]'>
								{item.label}
							</span>
						</Link>
					))}
				</nav>

				<div className='mt-auto w-full flex flex-col items-center gap-4'>
					<div className='flex items-center gap-2 w-full justify-center group-hover:justify-start cursor-default'>
						<Avatar />
						<span className='hidden group-hover:block text-sm font-medium truncate max-w[170px]'>
							{fullName}
						</span>
					</div>
					<button
						onClick={() => signOut()}
						className='w-fit group-hover:w-full active:scale-95 flex justify-center items-center gap-2 px-4 py-2 text-sm text-white bg-destructive rounded-md cursor-pointer transition-all duration-500 ease-in-out'>
						<span>
							<IoArrowUndoOutline />
						</span>
						<span className='hidden group-hover:block text-sm truncate max-w[170px]'>
							Sign Out
						</span>
					</button>
				</div>
			</aside>

			{/* Mobile top bar */}
			<header className='lg:hidden fixed top-3 left-0 right-0 h-12 flex items-center px-3 z-40'>
				<button
					aria-label='Open menu'
					onClick={() => setMobileOpen(true)}
					className='p-2 rounded-md hover:bg-foreground/6 cursor-pointer'>
					<FiMenu size={18} />
				</button>
			</header>

			{/* Mobile backdrop */}
			{mobileOpen && (
				<div
					className='fixed inset-0 bg-black/40 z-40 lg:hidden'
					onClick={() => setMobileOpen(false)}
				/>
			)}

			{/* Mobile drawer */}
			<aside
				className={`fixed top-0 left-0 bottom-0 w-64 z-50 h-svh flex flex-col transform transition-transform duration-250 ease-in-out lg:hidden bg-background border-r border-[var(--border)] p-4 ${
					mobileOpen ? "translate-x-0" : "-translate-x-full"
				}`}>
				<div className='flex items-center justify-between mb-6'>
					<Link
						to='/dashboard'
						onClick={() => setMobileOpen(false)}
						className='flex items-center gap-1'>
						<img
							src='/logo.webp'
							alt='logo'
							className={`w-8 h-8 border-2 rounded-full ${
								isDarkTheme ? "border-foreground" : "border-gray-400"
							}`}
						/>
						<span className='font-bold'>OrbitDesk</span>
					</Link>
					<button
						aria-label='Close menu'
						onClick={() => setMobileOpen(false)}
						className='p-2 rounded-md hover:bg-foreground/6 cursor-pointer'>
						<FiX size={18} />
					</button>
				</div>

				<nav className='gap-2 flex flex-col'>
					{navItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							onClick={() => setMobileOpen(false)}
							className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
								isActive(item.path)
									? "bg-foreground text-background"
									: "hover:bg-foreground/10 transition-all duration-500 ease-in-out"
							}`}>
							{item.icon}
							<span>{item.label}</span>
						</Link>
					))}
				</nav>

				<div className='mt-auto w-full flex flex-col items-center gap-4'>
					<div className='flex items-center gap-2 cursor-default hover:bg-foreground/10 px-4 py-2 rounded-md w-full transition-all duration-500 ease-in-out'>
						<Avatar />
						<span className='text-sm font-medium'>{fullName}</span>
					</div>
					<button
						onClick={() => {
							setMobileOpen(false);
							signOut();
						}}
						className='w-full px-4 py-2 text-sm text-white bg-destructive rounded-md transition-colors cursor-pointer flex justify-center items-center gap-2'>
						<IoArrowUndoOutline />
						<span>Sign Out</span>
					</button>
				</div>
			</aside>

			{/* Mobile Offline Indicator */}
			<div
				className={`lg:hidden fixed top-5 right-5 flex items-center gap-1 text-xs px-3 py-2 rounded-full border shadow-xs backdrop-blur-md transition-all duration-300 ease-out
          ${
						!isOnline
							? "opacity-100 translate-y-0 bg-red-500/5 border-red-500/20 text-red-500"
							: showBackOnline
							? "opacity-100 translate-y-0 bg-green-500/10 border-green-500/20 text-green-500"
							: "opacity-0 -translate-y-2 pointer-events-none bg-green-500/10 border-green-500/20 text-green-500"
					}`}>
				{!isOnline ? (
					<>
						<IoCloudOfflineOutline className='text-sm' />
						<span>Offline</span>
					</>
				) : (
					<>
						<IoCloudDoneOutline className='text-sm' />
						<span>Back Online</span>
					</>
				)}
			</div>

			{/* Main Content */}
			<main className='flex-1 p-4 lg:p-6 pt-16 lg:pt-3 overflow-hidden flex flex-col'>
				<div className='flex items-center gap-2 justify-between'>
					<div
						className={`hidden lg:flex items-center gap-1 text-xs px-3 py-2 rounded-full border shadow-xs backdrop-blur-md transition-all duration-300 ease-out
          ${
						!isOnline
							? "opacity-100 translate-y-0 bg-red-500/5 border-red-500/20 text-red-500"
							: showBackOnline
							? "opacity-100 translate-y-0 bg-green-500/10 border-green-500/20 text-green-500"
							: "opacity-0 -translate-y-2 pointer-events-none bg-green-500/10 border-green-500/20 text-green-500"
					}`}>
						{!isOnline ? (
							<>
								<IoCloudOfflineOutline className='text-sm' />
								<span>Offline</span>
							</>
						) : (
							<>
								<IoCloudDoneOutline className='text-sm' />
								<span>Back Online</span>
							</>
						)}
					</div>
					<div className='bg-foreground/5 border-foreground/10 border shadow-md backdrop-blur-md mb-3 rounded-full p-2 flex justify-between items-center text-xs ml-auto w-fit'>
						<div className='flex items-center gap-2 md:gap-3'>
							<MusicPlayer setShowMusicPlayerModal={setShowMusicPlayerModal} />
							<div className='bg-foreground rounded-full h-8 w-8 shadow-sm flex items-center justify-center font-bold text-sm text-background overflow-hidden cursor-default'>
								<Avatar />
							</div>
						</div>
					</div>
				</div>
				<div className='h-full flex-1 overflow-auto'>
					<Outlet />
				</div>
			</main>
			<MusicPlayerModal
				isOpen={showMusicPlayerModal}
				onClose={() => setShowMusicPlayerModal(false)}
			/>
		</div>
	);
};

export default DashboardLayout;
