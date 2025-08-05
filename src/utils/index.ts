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

export const formatReadableBalance = (num: number) => {
	const sign = num < 0 ? "-" : "";
	const absNum = Math.abs(num);

	if (absNum >= 1_000_000_000_000) {
		return (
			sign +
			(absNum / 1_000_000_000_000)
				.toFixed(1)
				.replace(/\.0$/, "") +
			"T"
		);
	}
	if (absNum >= 1_000_000_000) {
		return (
			sign +
			(absNum / 1_000_000_000)
				.toFixed(1)
				.replace(/\.0$/, "") +
			"B"
		);
	}
	if (absNum >= 1_000_000) {
		return (
			sign +
			(absNum / 1_000_000)
				.toFixed(1)
				.replace(/\.0$/, "") +
			"M"
		);
	}
	
	// if (absNum >= 1_000) {
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
