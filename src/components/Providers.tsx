import PullToRefreshWrapper from "@/components/PullToRefreshWrapper";
import { AuthContextProvider, UserAuth } from "@/context/AuthContext";
import { CryptoProvider } from "@/context/CryptoContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WorldClockProvider } from "@/context/WorldClockContext";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import OfflineScreen from "@/screens/Offline/Offline";
import React from "react";
import { BrowserRouter } from "react-router-dom";

const ProvidersInner = ({ children }: { children: React.ReactNode }) => {
	const { isOnline } = useNetworkStatus();
	const { session } = UserAuth();

	const handleRefresh = async () => {
		if (!isOnline) return;

		try {
			window.location.reload();
		} catch (err) {
			console.error(err);
		}
	};

	if (!isOnline && !session) {
		return <OfflineScreen />;
	}

	return (
		<PullToRefreshWrapper
			onRefresh={handleRefresh}
			// disabled={!isOnline} // Disable when offline
		>
			<main className='flex-grow'>{children}</main>
		</PullToRefreshWrapper>
	);
};

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<BrowserRouter>
			<AuthContextProvider>
				<ThemeProvider>
					<MusicPlayerProvider>
						<WorldClockProvider>
							<CurrencyProvider>
								<CryptoProvider>
									<ProvidersInner>{children}</ProvidersInner>
								</CryptoProvider>
							</CurrencyProvider>
						</WorldClockProvider>
					</MusicPlayerProvider>
				</ThemeProvider>
			</AuthContextProvider>
		</BrowserRouter>
	);
};

export default Providers;
