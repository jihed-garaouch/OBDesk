import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Providers from "./components/Providers.tsx";
import { Toaster } from "./components/ui/Toaster.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Providers>
			<Toaster />
			<App />
		</Providers>
	</StrictMode>
);
