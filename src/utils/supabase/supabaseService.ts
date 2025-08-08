import type { TimeZone } from "@/screens/Dashboard/WorldClock";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import type { TransactionType } from "@/context/FinanceContext";

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

export const deleteCityFromSupabase = async ({
	timezone,
	user,
}: {
	timezone: string;
	user: User;
}) => {
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

export const addTransactionToSupabase = async (
	transaction: TransactionType,
	user: User
) => {
	if (!user) return;

	const payload = {
		id: transaction.id,
		transaction_type: transaction.transactionType,
		category: transaction.category,
		description: transaction.description,
		amount: transaction.amount,
		date: transaction.date,
		time: transaction.time,
		user_id: user.id,
	};

	try {
		const { error } = await supabase.from("transactions").insert([payload]);
		if (error) throw error;
	} catch (err) {
		console.error("Error adding transaction:", err);
	}
};

export const updateTransactionInSupabase = async (
	transaction: TransactionType,
	user: User
) => {
	if (!user) return;

	const payload = {
		transaction_type: transaction.transactionType,
		category: transaction.category,
		description: transaction.description,
		amount: transaction.amount,
		date: transaction.date,
		time: transaction.time,
		updated_at: new Date().toISOString(),
	};

	try {
		const { error } = await supabase
			.from("transactions")
			.update(payload)
			.eq("id", transaction.id)
			.eq("user_id", user.id);
		if (error) throw error;
	} catch (err) {
		console.error("Error editing transaction:", err);
	}
};

export const deleteTransactionFromSupabase = async (
	transactionId: string,
	user: User
) => {
	if (!user) return;
	try {
		const { error } = await supabase
			.from("transactions")
			.delete()
			.eq("id", transactionId)
			.eq("user_id", user.id);
		if (error) throw error;
	} catch (err) {
		console.error("Error deleting transaction:", err);
	}
};

export const fetchUserTransactionsFromSupabase = async (user: User) => {
	if (!user) return [];

	const { data, error } = await supabase
		.from("transactions")
		.select("*")
		.eq("user_id", user.id)
		.order("date", { ascending: false });

	if (error) {
		console.error("Error fetching:", error);
		return [];
	}

	return data.map((item) => ({
		id: item.id,
		transactionType: item.transaction_type,
		category: item.category.split(" ").join("_"),
		description: item.description,
		amount: item.amount,
		date: item.date,
		time: item.time,
	})) as TransactionType[];
};
