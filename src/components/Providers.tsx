import { AuthContextProvider, UserAuth } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WorldClockProvider } from "@/context/WorldClockContext";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import OfflineScreen from "@/screens/Offline/Offline";
import React from "react";

const ProvidersInner = ({ children }: { children: React.ReactNode }) => {
	const { isOnline } = useNetworkStatus();
	const { session } = UserAuth();

	if (!isOnline && !session) {
		return <OfflineScreen />;
	}

	return <main className='flex-grow'>{children}</main>;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuthContextProvider>
			<ThemeProvider>
				<MusicPlayerProvider>
					<WorldClockProvider>
						<CurrencyProvider>
							<ProvidersInner>{children}</ProvidersInner>
						</CurrencyProvider>
					</WorldClockProvider>
				</MusicPlayerProvider>
			</ThemeProvider>
		</AuthContextProvider>
	);
};

export default Providers;
