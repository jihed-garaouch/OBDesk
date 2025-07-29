import type { TimeZone } from "@/screens/Dashboard/WorldClock";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export const syncCityToSupabase = async (city: TimeZone, user: User) => {
	if (!user) return;

	try {
		const { data, error } = await supabase.from("cities").upsert(
			[
				{
					user_id: user.id,
					city: city.city,
					timezone: city.timezone,
				},
			],
			{
				onConflict: "user_id,timezone",
			}
		);

		if (error) throw error;
		return data;
	} catch (err) {
		console.error("Error syncing city to Supabase:", err);
	}
};

export const fetchUserCities = async (user: User): Promise<TimeZone[]> => {
	if (!user) return [];

	try {
		const { data, error } = await supabase
			.from("cities")
			// .select("*") // for selecting all.
			.select("city, timezone")
			.eq("user_id", user.id);

		if (error) throw error;

		return (data || []).map((d) => ({
			city: d.city,
			timezone: d.timezone,
			time: "", // fill dynamically in component
			ampm: "",
			date: "",
			timeOfDay: "day",
			active: false,
		}));
	} catch (err) {
		console.error("Error fetching user cities:", err);
		return [];
	}
};

export const deleteCityFromSupabase = async ({timezone, user}:{timezone: string, user: User}) => {
	if (!user) return;

	try {
		const { error } = await supabase
			.from("cities")
			.delete()
			.eq("user_id", user.id)
			.eq("timezone", timezone);

		if (error) throw error;
	} catch (err) {
		console.error("Error deleting city from Supabase:", err);
	}
};
