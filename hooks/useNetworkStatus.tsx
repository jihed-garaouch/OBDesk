"use client";

import { useEffect, useState } from "react";

const useNetworkStatus = () => {
	const [isOnline, setIsOnline] = useState<boolean>(
		typeof navigator !== "undefined" ? navigator.onLine : true
	);

	const updateNetworkStatus = () => {
		setIsOnline(navigator.onLine);
	};

	useEffect(() => {
		updateNetworkStatus();
	}, []);

	useEffect(() => {
		window.addEventListener("load", updateNetworkStatus);
		window.addEventListener("online", updateNetworkStatus);
		window.addEventListener("offline", updateNetworkStatus);

		return () => {
			window.removeEventListener("load", updateNetworkStatus);
			window.removeEventListener("online", updateNetworkStatus);
			window.removeEventListener("offline", updateNetworkStatus);
		};
	}, []);

	return { isOnline };
};

export default useNetworkStatus;
