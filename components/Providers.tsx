"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import OfflineScreen from "@/screens/Offline/Offline";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
	const { isOnline } = useNetworkStatus();

	if (!isOnline) {
		return (
			<ThemeProvider>
				<OfflineScreen />
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider>
			<main className='flex-grow'>{children}</main>
		</ThemeProvider>
	);
};

export default Providers;
