import type { TransactionType } from "@/context/FinanceContext";
import type { Task } from "@/context/TaskManagerContext";
import { useEffect, useState } from "react";

export const formatNumberForDisplay = (value: string): string => {
	if (!value) return "";
	const cleanedValue = value.replace(/,/g, "");
	const parts = cleanedValue.split(".");
	const integerPart = parts[0];
	const decimalPart = parts[1] ?? "";
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.length > 1
		? `${formattedInteger}.${decimalPart}`
		: formattedInteger;
};

export const parseFormattedInput = (formattedValue: string): string => {
	return formattedValue?.replace(/,/g, "") ?? "";
};

export const formatCalculatedAmount = (amount: number): string => {
	if (isNaN(amount) || amount === 0) return "0.00";
	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 6,
	}).format(amount);
};

export const useDebounce = <T>(value: T, delay: number): T => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

export const formatIntlTime = (timezone: string, date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
		timeZone: timezone,
	}).format(date);
};

export const formatIntlDate = (timezone: string, date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: timezone,
	}).format(date);
};

export const formatIntlHourInZone = (timezone: string, date: Date): number => {
	return +new Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		hour12: false,
		timeZone: timezone,
	}).format(date);
};

export const formatReadableBalance = (
	num: number,
	isLarge: boolean = false
) => {
	const sign = num < 0 ? "-" : "";
	const absNum = Math.abs(num);

	if (absNum >= 1_000_000_000_000) {
		if (isLarge) {
			return (
				sign + (absNum / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T"
			);
		} else {
			return (
				sign + (absNum / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T"
			);
		}
	}

	if (absNum >= 1_000_000_000) {
		if (isLarge) {
			return (
				sign + (absNum / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B"
			);
		} else {
			return (
				sign + (absNum / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B"
			);
		}
	}

	if (!isLarge && absNum >= 1_000_000) {
		return sign + (absNum / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
	}

	// if (!isLarge && absNum >= 1_000) {
	// 	return (
	// 		sign +
	// 		(absNum / 1_000)
	// 			.toFixed(1)
	// 			.replace(/\.0$/, "") +
	// 		"K"
	// 	);
	// }

	return (
		sign +
		absNum.toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
	);
};

export const formatReadableDate = (dateString: string) => {
	const date = new Date(dateString);

	const day = date.getDate();
	const month = date.toLocaleString("en-US", { month: "long" });
	const year = date.getFullYear();

	const ordinal =
		day % 10 === 1 && day !== 11
			? "st"
			: day % 10 === 2 && day !== 12
			? "nd"
			: day % 10 === 3 && day !== 13
			? "rd"
			: "th";

	return `${day}${ordinal} ${month} ${year}`;
};

export const parseReadableDateToInput = (dateStr: string): string => {
	const regex = /^(\d{1,2})(?:st|nd|rd|th)? ([A-Za-z]+) (\d{4})$/;
	const match = dateStr.match(regex);
	if (!match) return "";

	const day = match[1].padStart(2, "0");
	const monthName = match[2];
	const year = match[3];

	const monthIndex = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	].findIndex((m) => m.toLowerCase() === monthName.toLowerCase());

	if (monthIndex === -1) return "";

	const month = String(monthIndex + 1).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export const formatReadableTime = (time24: string): string => {
	if (!time24) return "";

	const [hourStr, minute] = time24.split(":");
	let hour = parseInt(hourStr, 10);

	const period = hour >= 12 ? "PM" : "AM";
	hour = hour % 12 || 12;

	return `${hour}:${minute} ${period}`;
};

export const parseReadableTimeToInput = (timeStr: string): string => {
	if (!timeStr) return "";

	const regex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
	const match = timeStr.match(regex);
	if (!match) return "";

	const [, hourStr, minute, period] = match;
	let hour = parseInt(hourStr, 10);

	if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
	if (period.toUpperCase() === "AM" && hour === 12) hour = 0;

	return `${String(hour).padStart(2, "0")}:${minute}`;
};

export const generateSmartYearOptions = (
	transactions: TransactionType[],
	pastYears = 20,
	futureYears = 5
) => {
	const currentYear = new Date().getFullYear();

	let startYear = currentYear - pastYears;
	const endYear = currentYear + futureYears;

	if (transactions.length > 0) {
		const earliestTransactionYear = Math.min(
			...transactions.map((t) => new Date(t.date).getFullYear())
		);

		if (earliestTransactionYear < startYear) {
			startYear = earliestTransactionYear;
		}
	}

	return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
		const year = endYear - i;
		return { id: year, name: String(year) };
	});
};

const parseTransactionDate = (dateStr: string, timeStr: string) => {
	const cleanDate = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
	return new Date(`${cleanDate} ${timeStr}`);
};

export const sortTransactions = (transactions: TransactionType[]) => {
	return [...transactions].sort((a, b) => {
		const dateA = parseTransactionDate(a.date, a.time);
		const dateB = parseTransactionDate(b.date, b.time);
		return dateB.getTime() - dateA.getTime(); // newest → oldest
	});
};

export const stripTime = (date: Date) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const scheduleLocalReminder = (task: Task) => {
	if (!task.hasReminder) return;

	const dueTimestamp = new Date(`${task.date}T${task.time}`).getTime();
	const delay = dueTimestamp - Date.now();

	if (delay <= 0) return; // Past due

	setTimeout(() => {
		if (Notification.permission === "granted") {
			new Notification(`Reminder: ${task.title}`, {
				body: `Task is due at ${formatReadableDate(task.date)} ${formatReadableTime(task.time)}`,
			});
		}
	}, delay);
};
