import { UseTheme } from "@/context/ThemeContext"; // your custom theme hook
import { Toaster as Sonner } from "sonner";

export const Toaster = () => {
	const { theme } = UseTheme();

	return (
		<Sonner
			theme={theme}
			className='toaster group'
			toastOptions={{
				classNames: {
					toast:
						"group toast !font-satoshi group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg font-sans",
					success:
						"!bg-success !text-white !border-success !text-center [&>div:first-child]:!hidden flex items-center justify-center",
					error:
						"!bg-destructive !text-white !border-destructive !text-center !gap-2 flex-row flex !items-center justify-center",
					info: "!bg-warning !text-white !border-warning !text-center [&>div:first-child]:!hidden flex items-center justify-center",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			richColors
			position='top-center'
			mobileOffset='50px'
		/>
	);
};
