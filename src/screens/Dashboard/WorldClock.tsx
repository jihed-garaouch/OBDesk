import { AddCityModal } from "@/components/Dashboard/AddCityModal";
import DeleteCityModal from "@/components/Dashboard/DeleteCityModal";
import LoadingScreen from "@/components/Loading/Loading";
import { UserAuth } from "@/context/AuthContext";
import useNetworkStatus from "@/hooks/useNetworkStatus";
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
import { supabase } from "@/utils/supabase/supabaseClient";
import {
	deleteCityFromSupabase,
	fetchUserCities,
	syncCityToSupabase,
} from "@/utils/supabase/supabaseService";
import { useEffect, useState } from "react";
import { FiSun } from "react-icons/fi";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { MdDeleteOutline, MdOutlineModeNight } from "react-icons/md";
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

const WorldClockScreen = () => {
	const { isOnline } = useNetworkStatus();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [cityToBeDeleted, setCityToBeDeleted] = useState("");
	const [timeZones, setTimeZones] = useState<TimeZone[]>([]);

	const { session } = UserAuth();
	const user = session?.user;

	// Detect user's current location
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

	// Load initial data from IndexedDB and/or API
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

	
	const currentRegion = timeZones.find((z) => z.active)!;
	
	if (timeZones.length === 0) return <LoadingScreen />;

	return (
		<div className='px-4'>
			{/* Top Section */}
			<div className='mb-4'>
				<h1 className='font-bold text-sm md:text-[1.5rem] xl:text-[2rem]'>
					{currentRegion?.date ?? ""}
				</h1>

				<div className='flex items-center justify-center gap-2'>
					<h1 className='font-black text-[18vw] md:text-[17vw] leading-none'>
						{currentRegion?.time ?? ""}
					</h1>
					<span className='text-xs md:text-[1.5rem] xl:text-[3rem] font-black'>
						{currentRegion?.ampm ?? ""}
					</span>
				</div>

				<div className='flex flex-col md:flex-row justify-between md:items-center gap-3 mt-2'>
					<div className='flex flex-col'>
						<p className='font-bold text-xs md:text-sm'>Current City.</p>
						<h1 className='font-bold text-[1.5rem] xl:text-[2rem]'>
							{currentRegion?.city ?? ""}
						</h1>
					</div>
					<button
						onClick={() => {
							if (!isOnline) {
								toast.info(
									"Cannot add cities while offline. Come back online!"
								);
								return;
							}
							setIsModalOpen(true);
						}}
						className='flex items-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border p-3 rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out md:min-w-[154px]'>
						<span>Add another city</span>
						<HiOutlinePlusCircle className='text-base' />
					</button>
				</div>
			</div>

			{/* Timezone Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
				{timeZones.map((zone, index) => (
					<div
						key={index}
						className={`p-4 pt-6 border border-foreground/50 rounded-lg flex flex-col gap-3 cursor-default relative ${
							zone.active
								? "bg-foreground text-background font-bold"
								: "font-medium"
						}`}>
						{index !== 0 && (
							<div className=' absolute top-3 right-4 flex justify-end text-[1.3rem]'>
								<span
									className='active:scale-90 transition-all duration-500 ease-in-out'
									onClick={() => {
										setIsDeleteModalOpen(true);
										setCityToBeDeleted(zone.timezone);
									}}>
									<MdDeleteOutline className='cursor-pointer text-red-500' />
								</span>
							</div>
						)}
						<div className='flex justify-between items-center gap-5 text-sm min-h-[50px]'>
							<h3 className='break-all'>{zone.city}</h3>
							<p>{zone.timezone}</p>
						</div>

						<div className='flex justify-between items-center gap-3 text-sm'>
							<div className='flex items-end gap-1'>
								<h3 className='text-[3rem] leading-none'>{zone.time}</h3>
								<span className='text-lg font-semibold mb-1'>{zone.ampm}</span>
							</div>
						</div>

						<div className='flex justify-between items-center gap-3 text-sm'>
							<span>{zone.date}</span>
							<span className='flex items-center gap-1'>
								{zone.timeOfDay === "day" ? (
									<>
										<FiSun />
										<span className='capitalize'>{zone.timeOfDay}</span>
									</>
								) : (
									<>
										<MdOutlineModeNight className='rotate-45' />
										<span className='capitalize'>{zone.timeOfDay}</span>
									</>
								)}
							</span>
						</div>
					</div>
				))}
			</div>

			<AddCityModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAddCity={handleAddCity}
			/>
			<DeleteCityModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onDeleteCity={handleDeleteCity}
				cityToBeDeleted={cityToBeDeleted}
			/>
		</div>
	);
};

export default WorldClockScreen;
