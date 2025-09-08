import { useEffect, useState } from "react";
import { IoClose, IoNotifications } from "react-icons/io5";
import { toast } from "sonner";

const NotificationPermissionModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	const getPermissionStatus = () => {
		if (typeof window !== "undefined" && "Notification" in window) {
			return Notification.permission;
		}
		return "default"; // Default to "default" if API is missing (e.g., iOS Safari)
	};

	const isPWA =
		typeof window !== "undefined" &&
		window.matchMedia("(display-mode: standalone)").matches;
	const isDenied = getPermissionStatus() === "denied";

	useEffect(() => {
		const permission = getPermissionStatus();
		if ("Notification" in window && permission !== "granted") {
			setIsOpen(true);
			setTimeout(() => setIsVisible(true), 10);
		}
	}, []);

	const closeSheet = () => {
		setIsVisible(false);
		setTimeout(() => setIsOpen(false), 300);
	};

	const getInstructionText = () => {
		if (!isDenied)
			return "Enable notifications to get reminders for your tasks, even when the app is closed.";

		if (isPWA) {
			return "Notifications are blocked. Please go to your device Settings > Notifications > OrbitDesk to allow them.";
		}

		return "Notifications are blocked. To enable, open your site settings and toggle notifications back on.";
	};

	const handleAllow = () => {
		if (isDenied) {
			closeSheet();
			return;
		}

		if ("Notification" in window) {
			Notification.requestPermission().then((permission) => {
				console.log("Notification permission:", permission);
				closeSheet();
			});
		} else {
			// Fallback for iOS users who haven't added to Home Screen yet
			toast.info(
				"To enable notifications on iPhone, please 'Add to Home Screen' first."
			);
			closeSheet();
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-[999] flex items-end justify-center'>
			{/* Backdrop */}
			<div
				className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
					isVisible ? "opacity-100" : "opacity-0"
				}`}
				onClick={closeSheet}
			/>

			{/* Bottom Sheet Modal */}
			<div
				className={`relative w-full max-w-lg xl:max-w-xl bg-background border border-foreground/60 rounded-t-[16px] md:rounded-t-[32px] p-4 py-8 md:p-8 shadow-2xl transition-transform duration-300 ease-out transform ${
					isVisible ? "translate-y-0" : "translate-y-full"
				}`}>
				<button
					onClick={closeSheet}
					className='absolute top-6 right-6 text-foreground/60 hover:text-foreground text-3xl cursor-pointer transition-all duration-300 ease-in-out'>
					<IoClose />
				</button>

				<div className='flex flex-col items-center text-center'>
					<div className='w-15 md:w-24 h-15 md:h-24 mb-6 bg-foreground rounded-full flex items-center justify-center'>
						<IoNotifications className='text-3xl md:text-5xl text-background' />
					</div>

					<h2 className='text-lg md:text-xl font-bold text-foreground mb-2'>
						{isDenied ? "Notifications are Blocked" : "Enable Notifications"}
					</h2>
					<p className='text-xs md:text-sm text-foreground mb-8 leading-relaxed'>
						{getInstructionText()}
					</p>

					<button
						onClick={handleAllow}
						className='w-full py-3 bg-foreground text-sm md:text-base text-background font-semibold rounded-md md:rounded-lg transition-colors shadow-lg cursor-pointer'>
						{isDenied ? "Got it" : "Enable"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default NotificationPermissionModal;
