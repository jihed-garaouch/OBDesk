import { ThemeProvider } from "@/context/ThemeProvider";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import React from "react";
import OfflineScreen from "@/screens/Offline/Offline";

const Providers = ({ children }: { children: React.ReactNode }) => {
	const { isOnline } = useNetworkStatus();
	const isLoggedIn = false;

	if (!isOnline && !isLoggedIn) {
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
