import { createContext, useContext, useEffect, useState } from "react";
import {
	addToDeleteSyncQueue,
	deleteCityFromIndexedDB,
	getCitiesFromIndexedDB,
	getDeleteSyncQueue,
	getUserLocationFromIndexedDB,
	removeFromDeleteSyncQueue,
	saveCityToIndexedDB,
	saveUserLocationToIndexedDB,
} from "@/utils/indexedDb/worldClock";
import {
	deleteCityFromSupabase,
	fetchUserCities,
	syncCityToSupabase,
} from "@/utils/supabase/supabaseService";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { UserAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase/supabaseClient";
import { toast } from "sonner";

export type TimeZone = {
	city: string;
	timezone: string;
	time: string;
	ampm: string;
	timeOfDay: string;
	active: boolean;
	date: string;
};

type WorldClockContextType = {
	timeZones: TimeZone[];
	currentRegion: TimeZone | null;
	loadTimeZones: () => Promise<void>;
	handleAddCity: (tz: string) => Promise<void>;
	handleDeleteCity: (timezone: string) => Promise<void>;
};

const WorldClockContext = createContext<WorldClockContextType | undefined>(
	undefined
);

export const WorldClockProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { isOnline } = useNetworkStatus();
	const { session } = UserAuth();
	const user = session?.user;
	const [timeZones, setTimeZones] = useState<TimeZone[]>([]);

	const detectUserTimeZone = (): TimeZone => {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const city = timezone.split("/").pop()?.replace("_", " ") ?? timezone;
		const now = new Date(
			new Date().toLocaleString("en-US", { timeZone: timezone })
		);

		const formattedTime = new Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
			timeZone: timezone,
		}).format(now);

		const [time, ampm] = formattedTime.split(" ");

		const date = new Intl.DateTimeFormat("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
			timeZone: timezone,
		}).format(now);

		const hourInZone = +new Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			hour12: false,
			timeZone: timezone,
		}).format(now);

		const timeOfDay = hourInZone >= 6 && hourInZone < 18 ? "day" : "night";

		return { city, timezone, time, ampm, date, timeOfDay, active: true };
	};

	const loadTimeZones = async () => {
		// Step 1: Process queued deletions if online
		if (isOnline) {
			const queue = await getDeleteSyncQueue();
			for (const op of queue) {
				if (op.type === "delete" && op.table === "cities") {
					await supabase.from("cities").delete().match(op.payload);
					await removeFromDeleteSyncQueue(op.timestamp);
				}
			}
		}

		// Step 2: Load cities
		let savedCities: TimeZone[] = [];
		if (isOnline) {
			savedCities = await fetchUserCities(user!); // from Supabase
			// Update IndexedDB
			for (const city of savedCities) {
				await saveCityToIndexedDB(city);
			}
		} else {
			savedCities = await getCitiesFromIndexedDB(); // fallback offline
		}

		// Step 3: Detect user location
		let firstLocation = await getUserLocationFromIndexedDB();

		if (isOnline) {
			const detected = detectUserTimeZone();
			if (!firstLocation || firstLocation.timezone !== detected.timezone) {
				firstLocation = detected;
				await saveUserLocationToIndexedDB(detected);
			}
		}

		if (!firstLocation && savedCities.length) {
			firstLocation = savedCities.shift()!;
			firstLocation.active = true;
		}

		if (!firstLocation) {
			firstLocation = detectUserTimeZone();
			if (isOnline) await saveUserLocationToIndexedDB(firstLocation);
		}

		setTimeZones([firstLocation, ...savedCities]);
	};

	useEffect(() => {
		loadTimeZones();
	}, [isOnline]);

	// Update clock every second
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeZones((prev) =>
				prev.map((zone) => {
					const now = new Date(
						new Date().toLocaleString("en-US", { timeZone: zone.timezone })
					);
					const formattedTime = new Intl.DateTimeFormat("en-US", {
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
						hour12: true,
						timeZone: zone.timezone,
					}).format(now);
					const [time, ampm] = formattedTime.split(" ");
					const date = new Intl.DateTimeFormat("en-US", {
						weekday: "long",
						month: "long",
						day: "numeric",
						year: "numeric",
						timeZone: zone.timezone,
					}).format(now);
					const hourInZone = +new Intl.DateTimeFormat("en-US", {
						hour: "2-digit",
						hour12: false,
						timeZone: zone.timezone,
					}).format(now);
					const timeOfDay =
						hourInZone >= 6 && hourInZone < 18 ? "day" : "night";
					return { ...zone, time, ampm, date, timeOfDay };
				})
			);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Add new city
	const handleAddCity = async (tz: string) => {
		if (!isOnline) {
			toast.info("Cannot add cities while offline. Come back online!");
			return;
		}

		const city = tz.split("/").pop()?.replace("_", " ") ?? tz;
		const timezone = tz;

		const now = new Date(
			new Date().toLocaleString("en-US", { timeZone: timezone })
		);

		const formattedTime = new Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
			timeZone: timezone,
		}).format(now);

		const [time, ampm] = formattedTime.split(" ");

		const date = new Intl.DateTimeFormat("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
			timeZone: timezone,
		}).format(now);

		const hourInZone = +new Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			hour12: false,
			timeZone: timezone,
		}).format(now);

		const timeOfDay = hourInZone >= 6 && hourInZone < 18 ? "day" : "night";

		const newCity: TimeZone = {
			city,
			timezone,
			time,
			ampm,
			date,
			timeOfDay,
			active: false,
		};

		await saveCityToIndexedDB(newCity);
		await syncCityToSupabase(newCity, user!);

		setTimeZones((prev) => {
			const exists = prev.some((z) => z.timezone === newCity.timezone);
			if (exists) return prev;
			return [...prev, newCity];
		});
	};

	const handleDeleteCity = async (timezone: string) => {
		if (!user) return; // safety check

		// Always delete locally
		await deleteCityFromIndexedDB(timezone);
		setTimeZones((prev) => prev.filter((z) => z.timezone !== timezone));

		if (isOnline) {
			// Sync immediately
			deleteCityFromSupabase({ timezone, user });
		} else {
			// Queue for later
			await addToDeleteSyncQueue({
				type: "delete",
				table: "cities",
				payload: { timezone, user_id: user.id },
				timestamp: Date.now(),
			});
		}
	};

	const currentRegion = timeZones.find((z) => z.active) ?? null;

	return (
		<WorldClockContext.Provider
			value={{
				timeZones,
				currentRegion,
				loadTimeZones,
				handleAddCity,
				handleDeleteCity,
			}}>
			{children}
		</WorldClockContext.Provider>
	);
};

export const UseWorldClock = () => {
	const ctx = useContext(WorldClockContext);
	if (!ctx)
		throw new Error("useWorldClock must be used inside WorldClockProvider");
	return ctx;
};
