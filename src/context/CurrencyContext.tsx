import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { fetchCurrencies, fetchExchangeRate } from "@/api/endpoints/currencyExchange";
import { currencyToCountryCode } from "@/utils/constants";

export interface Currency {
	name: string;
	countryCode?: string;
}

interface CurrencyContextType {
	currencies: Currency[];
	fromCurrency: string;
	toCurrency: string;
	fromAmount: string;
	displayAmount: string;
	toAmount: string;
	exchangeRate: number | null;
	loading: boolean;
	error: string | null;
	getFlagUrl: (currencyCode: string) => string | null;
	handleSwap: () => void;
	handleFromAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	setFromCurrency: (value: string) => void;
	setToCurrency: (value: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const [fromCurrency, setFromCurrency] = useState("USD");
	const [toCurrency, setToCurrency] = useState("EUR");
	const [fromAmount, setFromAmount] = useState("1");
	const [displayAmount, setDisplayAmount] = useState("1");
	const [toAmount, setToAmount] = useState("");
	const [exchangeRate, setExchangeRate] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// === Utility functions ===
	const formatNumberForDisplay = (value: string): string => {
		if (!value) return "";
		const cleanedValue = value.replace(/,/g, "");
		const parts = cleanedValue.split(".");
		const integerPart = parts[0];
		const decimalPart = parts[1] ?? "";
		const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.length > 1 ? `${formattedInteger}.${decimalPart}` : formattedInteger;
	};

	const parseFormattedInput = (formattedValue: string): string => {
		return formattedValue?.replace(/,/g, "") ?? "";
	};

	const formatCalculatedAmount = (amount: number): string => {
		if (isNaN(amount) || amount === 0) return "0.00";
		return new Intl.NumberFormat("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount);
	};

	const getFlagUrl = (currencyCode: string): string | null => {
		const countryCode = currencyToCountryCode[currencyCode];
		return countryCode
			? `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
			: null;
	};

	// === Fetch All Currencies ===
	useEffect(() => {
		const fetchAllCurrencies = async () => {
			try {
				const data = await fetchCurrencies();
				const currencyList: Currency[] = Object.keys(data.rates).map((code) => ({
					name: code,
					countryCode: currencyToCountryCode[code],
				}));
				setCurrencies(currencyList);
			} catch (err) {
				console.error("Failed to fetch currencies:", err);
			}
		};
		fetchAllCurrencies();
	}, []);

	// === Fetch Exchange Rate ===
	useEffect(() => {
		const fetchRate = async () => {
			if (!fromCurrency || !toCurrency) return;

			setLoading(true);
			setError(null);
			try {
				const data = await fetchExchangeRate(fromCurrency);
				const rate: number = data.rates[toCurrency];
				setExchangeRate(rate);

				if (fromAmount && !isNaN(Number(fromAmount))) {
					const converted = parseFloat(fromAmount) * rate;
					setToAmount(formatCalculatedAmount(converted));
				}
			} catch (err) {
				setError("Failed to fetch exchange rates");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
        
		fetchRate();
	}, [fromCurrency, toCurrency]);

	// === Update conversion dynamically ===
	useEffect(() => {
		if (exchangeRate && fromAmount && !isNaN(Number(fromAmount))) {
			const converted = parseFloat(fromAmount) * exchangeRate;
			setToAmount(formatCalculatedAmount(converted));
		} else {
			setToAmount("");
		}
	}, [fromAmount, exchangeRate]);

	// === Swap currencies ===
	const handleSwap = () => {
		setFromCurrency(toCurrency);
		setToCurrency(fromCurrency);

		const newFromAmount = parseFormattedInput(toAmount);
		setFromAmount(newFromAmount);
		setDisplayAmount(formatNumberForDisplay(newFromAmount));
	};

	// === Handle amount change ===
	const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;
		const cleanValue = parseFormattedInput(rawValue);
		const isNumeric = /^\d*(\.\d*)?$/.test(cleanValue);

		if (isNumeric || cleanValue === "") {
			setFromAmount(cleanValue);
			setDisplayAmount(formatNumberForDisplay(rawValue));
		}
	};

	return (
		<CurrencyContext.Provider
			value={{
				currencies,
				fromCurrency,
				toCurrency,
				fromAmount,
				displayAmount,
				toAmount,
				exchangeRate,
				loading,
				error,
				getFlagUrl,
				handleSwap,
				handleFromAmountChange,
				setFromCurrency,
				setToCurrency,
			}}>
			{children}
		</CurrencyContext.Provider>
	);
};

export const UseCurrency = () => {
	const context = useContext(CurrencyContext);
	if (!context) {
		throw new Error("useCurrency must be used within a CurrencyProvider");
	}
	return context;
};
