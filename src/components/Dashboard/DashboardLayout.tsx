import { UserAuth } from "@/context/AuthContext";
import { UseTheme } from "@/context/ThemeContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
	FiHome,
	FiDollarSign,
	FiCheckSquare,
	FiMenu,
	FiX,
} from "react-icons/fi";
import { useState } from "react";

const DashboardLayout = () => {
	const { theme } = UseTheme();
	const { signOut } = UserAuth();
	const location = useLocation();
	const isDarkTheme = theme === "dark";
	const [mobileOpen, setMobileOpen] = useState(false);

	const navItems = [
		{ path: "/dashboard", icon: <FiHome />, label: "Home" },
		{ path: "/dashboard/finance", icon: <FiDollarSign />, label: "Finance" },
		{ path: "/dashboard/todo", icon: <FiCheckSquare />, label: "Todo" },
	];

	const isActive = (path: string) =>
		path === "/dashboard"
			? location.pathname === path
			: location.pathname.startsWith(path);

	return (
		<div className='h-svh flex'>
			{/* Sidebar */}
			<aside className='hidden md:w-48 border-r border-[var(--border)] p-4 h-svh md:flex flex-col'>
				<Link to='/dashboard' className='flex items-center gap-2 mb-8'>
					<img
						src='/logo.webp'
						alt='logo'
						className={`w-8 h-8 border-2 rounded-full ${
							isDarkTheme ? "border-foreground" : "border-gray-400"
						}`}
					/>
					<span className='font-bold'>OrbitDesk</span>
				</Link>

				<nav className='space-y-2 flex flex-col'>
					{navItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
								isActive(item.path)
									? "bg-foreground text-background"
									: "hover:bg-foreground/10"
							}`}>
							{item.icon}
							<span>{item.label}</span>
						</Link>
					))}
				</nav>

				<button
					onClick={() => signOut()}
					className='mt-auto w-full px-4 py-2 text-sm text-white bg-destructive rounded-md transition-colors cursor-pointer'>
					Sign Out
				</button>
			</aside>

			{/* Mobile top bar */}
			<header className='md:hidden fixed top-3 left-0 right-0 h-12 flex items-center px-3 z-40'>
				<button
					aria-label='Open menu'
					onClick={() => setMobileOpen(true)}
					className='p-2 rounded-md hover:bg-foreground/6 cursor-pointer'>
					<FiMenu size={18} />
				</button>

				{/* <div onClick={() => setMobileOpen(true)} className='cursor-pointer'>
					<img
						src='/logo.webp'
						alt='logo'
						className={`w-8 h-8 border-2 rounded-full ${
							isDarkTheme ? "border-foreground" : "border-gray-400"
						}`}
					/>
				</div> */}
			</header>

			{/* Mobile backdrop */}
			{mobileOpen && (
				<div
					className='fixed inset-0 bg-black/40 z-40 md:hidden'
					onClick={() => setMobileOpen(false)}
				/>
			)}

			{/* Mobile drawer */}
			<aside
				className={`fixed top-0 left-0 bottom-0 w-64 z-50 h-svh flex flex-col transform transition-transform duration-250 ease-in-out md:hidden bg-background border-r border-[var(--border)] p-4 ${
					mobileOpen ? "translate-x-0" : "-translate-x-full"
				}`}>
				<div className='flex items-center justify-between mb-6'>
					<Link
						to='/dashboard'
						onClick={() => setMobileOpen(false)}
						className='flex items-center gap-2'>
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

				<nav className='space-y-2 flex flex-col'>
					{navItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							onClick={() => setMobileOpen(false)}
							className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
								isActive(item.path)
									? "bg-foreground text-background"
									: "hover:bg-foreground/10"
							}`}>
							{item.icon}
							<span>{item.label}</span>
						</Link>
					))}
				</nav>

				<button
					onClick={() => {
						setMobileOpen(false);
						signOut();
					}}
					className='mt-auto w-full px-4 py-2 text-sm text-white bg-destructive rounded-md transition-colors cursor-pointer'>
					Sign Out
				</button>
			</aside>

			{/* Main Content */}
			<main className='flex-1 p-6 pt-16 md:pt-6 overflow-auto'>
				<Outlet />
			</main>
		</div>
	);
};

export default DashboardLayout;
