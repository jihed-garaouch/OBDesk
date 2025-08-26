import { Route, Routes } from "react-router-dom";
import RouteGuard from "./components/RouteGuard";
import ThemeToggle from "./components/ui/ThemeToggle";
import routes, { type AppRoute } from "./routes";
import NotificationPermissionModal from "./components/NotificationPermissionModal";
import MissedRemindersModal from "./components/MissedRemindersModal";

const renderRoute = (route: AppRoute) => {
	const element = route.protected ? (
		<RouteGuard>{route.element}</RouteGuard>
	) : (
		route.element
	);

	if (!route.children || route.children.length === 0) {
		return <Route key={route.path} path={route.path} element={element} />;
	}

	// has nested children
	return (
		<Route key={route.path} path={route.path} element={element}>
			{route.children.map((child) => renderRoute(child))}
		</Route>
	);
};

const App = () => {
	return (
		<div className='bg-background text-foreground relative'>
			<div className='fixed right-6 bottom-8 z-50'>
				<ThemeToggle />
			</div>
			{/* Hidden image to force caching */}
			<img
				src='/offline-bg.jpg'
				alt=''
				width={1}
				height={1}
				style={{ display: "none" }}
			/>
			<Routes>{routes.map((r) => renderRoute(r))}</Routes>
			<NotificationPermissionModal />
			<MissedRemindersModal />
		</div>
	);
};

export default App;
