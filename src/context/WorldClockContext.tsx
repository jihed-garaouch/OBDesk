import { createContext, useContext, useEffect, useState } from "react";
import {
	addToDeleteSyncQueue,
	deleteCityFromIndexedDB,
	getCitiesFromIndexedDB,
	getDeleteSyncQueue,
	getUserLocationFromIndexedDB,
	removeFromDeleteSyncQueue,
	saveCitiesToIndexedDB,
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
import { formatIntlHourInZone, formatIntlDate, formatIntlTime } from "@/utils";

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

const WorldClockContext = createContext<WorldClockContextType | null>(null);

export const WorldClockProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { isOnline } = useNetworkStatus();
	const { session } = UserAuth();
	const user = session?.user;
	const [timeZones, setTimeZones] = useState<TimeZone[]>([]);

	const detectUserTimeZone = (timezone?: string, active = true): TimeZone => {
		const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
		const city = tz.split("/").pop()?.replace("_", " ") ?? tz;

		const now = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));

		const formattedTime = formatIntlTime(tz, now);

		const [time, ampm] = formattedTime.split(" ");

		const date = formatIntlDate(tz, now);

		const hourInZone = formatIntlHourInZone(tz, now);

		const timeOfDay = hourInZone >= 6 && hourInZone < 18 ? "day" : "night";

		return { city, timezone: tz, time, ampm, date, timeOfDay, active };
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
		if (isOnline && user) {
			savedCities = await fetchUserCities(user); // from Supabase
			// Update IndexedDB with Batch Write
			await saveCitiesToIndexedDB(savedCities);
		} else {
			savedCities = await getCitiesFromIndexedDB(); // fallback offline
		}

		// Step 3: Detect user location
		let firstLocation = await getUserLocationFromIndexedDB();

		if (isOnline) {
			const detected = detectUserTimeZone();

			// If user location missing or timezone changed, update it
			if (!firstLocation || firstLocation.timezone !== detected.timezone) {
				firstLocation = {
					city: detected.city,
					timezone: detected.timezone,
					active: true,
					// store empty strings for time-related values
					time: "",
					ampm: "",
					date: "",
					timeOfDay: "",
				};
				await saveUserLocationToIndexedDB(firstLocation);
			} else {
				// If same timezone, refresh time-related fields dynamically (don’t use stale IndexedDB values)
				firstLocation = { ...firstLocation, ...detected };
			}
		}

		// Offline fallback handling
		if (!firstLocation) {
			const detected = detectUserTimeZone();
			firstLocation = {
				city: detected.city,
				timezone: detected.timezone,
				active: true,
				time: "",
				ampm: "",
				date: "",
				timeOfDay: "",
			};
			if (isOnline) await saveUserLocationToIndexedDB(firstLocation);
		}

		const hydratedCities = [firstLocation, ...savedCities].map((city, index) =>
			index === 0
				? { ...city, ...detectUserTimeZone(city.timezone, true) }
				: { ...city, ...detectUserTimeZone(city.timezone, false) }
		);

		setTimeZones(hydratedCities);
	};

	useEffect(() => {
		if (user) loadTimeZones();
	}, [isOnline, user]);

	// Update clock every second
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeZones((prev) =>
				prev.map((zone) => {
					const now = new Date(
						new Date().toLocaleString("en-US", { timeZone: zone.timezone })
					);
					const formattedTime = formatIntlTime(zone.timezone, now);

					const [time, ampm] = formattedTime.split(" ");

					const date = formatIntlDate(zone.timezone, now);

					const hourInZone = formatIntlHourInZone(zone.timezone, now);

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

		const formattedTime = formatIntlTime(timezone, now);

		const [time, ampm] = formattedTime.split(" ");

		const date = formatIntlDate(timezone, now);

		const hourInZone = formatIntlHourInZone(timezone, now);

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
