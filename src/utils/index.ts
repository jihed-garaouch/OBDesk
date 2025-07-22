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
}
