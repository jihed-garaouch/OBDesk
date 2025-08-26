import { AuthContextProvider, UserAuth } from "@/context/AuthContext";
import { CryptoProvider } from "@/context/CryptoContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { FinanceProvider } from "@/context/FinanceContext";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import { TaskManagerProvider } from "@/context/TaskManagerContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WorldClockProvider } from "@/context/WorldClockContext";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import OfflineScreen from "@/screens/Offline/Offline";
import { subscribeToPushNotifications } from "@/utils/pushNotifications";
import React, { useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";

const ProvidersInner = ({ children }: { children: React.ReactNode }) => {
	const { isOnline } = useNetworkStatus();
	const { session } = UserAuth();
	const hasSubscribedRef = useRef(false);

	// const refreshAll = async () => {
	// 	// await Promise.all([loadTimeZones(), loadTransactions()]);
	// 	window.location.reload();
	// };

	// const handleRefresh = async () => {
	// 	if (!isOnline) return;
	// 	await refreshAll();
	// };

	useEffect(() => {
		if (!session?.user) return;
		if (hasSubscribedRef.current) return;

		hasSubscribedRef.current = true;
		subscribeToPushNotifications(session.user.id);
	}, [session?.user?.id]);

	if (!isOnline && !session) {
		return <OfflineScreen />;
	}

	return (
		// <PullToRefreshWrapper
		// 	onRefresh={handleRefresh}
		// 	// disabled={!isOnline} // Disable when offline
		// >
		<main className='flex-grow'>{children}</main>
		// </PullToRefreshWrapper>
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
									<FinanceProvider>
										<TaskManagerProvider>
											<ProvidersInner>{children}</ProvidersInner>
										</TaskManagerProvider>
									</FinanceProvider>
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
