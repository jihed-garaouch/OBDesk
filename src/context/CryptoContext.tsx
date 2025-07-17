import {
	createContext,
	useContext,
	useEffect,
	useState,
	useRef,
	type ReactNode,
} from "react";
import { toast } from "sonner";
import type { Currency } from "./CurrencyContext";
import { currencyToCountryCode } from "@/utils/constants";
import { fetchCurrencies } from "@/api/endpoints/currencyExchange";
import {
	formatCalculatedAmount,
	formatNumberForDisplay,
	parseFormattedInput,
} from "@/utils";
import {
	getCryptosFromIndexedDB,
	saveCryptosToIndexedDB,
} from "@/utils/indexedDb/crypto";

type Crypto = {
	id: string;
	symbol: string;
	name: string;
	image: string;
};

export interface CryptoCurrency {
	id: string;
	symbol: string;
	name: string;
	iconUrl: string;
}

interface HistoricalPoint {
	date: string;
	price: number;
}

interface CryptoContextType {
	cryptos: CryptoCurrency[];
	fiatCurrencies: Currency[];
	fromCrypto: string;
	toCurrency: string;
	fromAmount: string;
	displayAmount: string;
	toAmount: string;
	price: number | null;
	loading: boolean;
	error: string | null;
	historicalData: HistoricalPoint[];
	timeRange: "24h" | "7d" | "30d";
	trend: "up" | "down" | "neutral";
	percentageChange: number;
	handleSwap: () => void;
	handleFromAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	setFromCrypto: (value: string) => void;
	setToCurrency: (value: string) => void;
	setTimeRange: (value: "24h" | "7d" | "30d") => void;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

// Utility: Exponential backoff retry with delay
async function fetchWithRetry(url: string, maxRetries = 3, baseDelay = 1000) {
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			const response = await fetch(url);

			// Handle rate limiting
			if (response.status === 429) {
				const retryAfter = response.headers.get("Retry-After");
				const delay = retryAfter
					? parseInt(retryAfter) * 1000
					: baseDelay * Math.pow(2, attempt);

				if (attempt < maxRetries) {
					console.warn(
						`Rate limited. Retrying after ${delay}ms (attempt ${
							attempt + 1
						}/${maxRetries})`
					);
					await new Promise((resolve) => setTimeout(resolve, delay));
					continue;
				}
				throw new Error("Rate limit exceeded. Please try again later.");
			}

			// Handle 404 or other errors
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			if (attempt === maxRetries) {
				throw error;
			}
			// Wait before retry
			const delay = baseDelay * Math.pow(2, attempt);
			console.warn(`Request failed. Retrying after ${delay}ms...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
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

export const CryptoProvider = ({ children }: { children: ReactNode }) => {
	const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
	const [fromCrypto, setFromCrypto] = useState("bitcoin");
	const [toCurrency, setToCurrency] = useState("USD");
	const [price, setPrice] = useState<number | null>(null);

	const [fromAmount, setFromAmount] = useState("1");
	const [displayAmount, setDisplayAmount] = useState("1");
	const [toAmount, setToAmount] = useState("");

	const [historicalData, setHistoricalData] = useState<HistoricalPoint[]>([]);
	const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [trend, setTrend] = useState<"up" | "down" | "neutral">("neutral");
	const [percentageChange, setPercentageChange] = useState(0);
	const [fiatCurrencies, setFiatCurrencies] = useState<Currency[]>([]);

	// Cache to avoid redundant requests
	const priceCache = useRef<Map<string, { price: number; timestamp: number }>>(
		new Map()
	);
	const CACHE_DURATION = 30000; // 30 seconds

	// Debounced crypto/currency changes to reduce API calls
	const debouncedFromCrypto = useDebounce(fromCrypto, 500);
	const debouncedToCurrency = useDebounce(toCurrency, 500);

	// === Fetch Fiat Currencies ===
	useEffect(() => {
		const fetchAllCurrencies = async () => {
			try {
				const data = await fetchCurrencies();
				const currencyList: Currency[] = Object.keys(data.rates).map(
					(code) => ({
						name: code,
						countryCode: currencyToCountryCode[code],
					})
				);
				setFiatCurrencies(currencyList);
			} catch (err) {
				console.error("Failed to fetch currencies:", err);
			}
		};
		fetchAllCurrencies();
	}, []);

	// === Fetch top cryptos with error handling ===
	useEffect(() => {
		const loadCryptos = async () => {
			const stored = await getCryptosFromIndexedDB();

			if (stored.length > 0) {
				setCryptos(stored);
				setFromCrypto(stored.find((c: Crypto) => c.symbol === "BTC")!.id);
				return;
			}

			try {
				const data = await fetchWithRetry(
					"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1"
				);

				const formatted = data.map((coin: Crypto) => ({
					id: coin.id,
					symbol: coin.symbol.toUpperCase(),
					name: coin.name,
					iconUrl: coin.image,
				}));

				if (formatted.length > 0) {
					setCryptos(formatted);
					setFromCrypto(formatted.find((c: Crypto) => c.symbol === "BTC")!.id);

					await saveCryptosToIndexedDB(formatted);
				}
			} catch (err) {
				console.error("Crypto fetch error:", err);
				toast.error("Failed to fetch crypto list");

				const fallbackCryptos: CryptoCurrency[] = [
					{
						id: "bitcoin",
						symbol: "BTC",
						name: "Bitcoin",
						iconUrl:
							"https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
					},
					{
						id: "ethereum",
						symbol: "ETH",
						name: "Ethereum",
						iconUrl:
							"https://assets.coingecko.com/coins/images/279/small/ethereum.png",
					},
					{
						id: "tether",
						symbol: "USDT",
						name: "Tether",
						iconUrl:
							"https://assets.coingecko.com/coins/images/325/small/Tether.png",
					},
				];

				setCryptos(fallbackCryptos);
				setFromCrypto(fallbackCryptos[0].id);
			}
		};

		loadCryptos();
	}, []);

	// === Fetch live price with caching and debouncing ===
	useEffect(() => {
		const fetchPrice = async () => {
			if (!debouncedFromCrypto || !debouncedToCurrency) return;

			const cacheKey = `${debouncedFromCrypto}-${debouncedToCurrency}`;
			const cached = priceCache.current.get(cacheKey);

			// Check cache first
			if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
				setPrice(cached.price);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const data = await fetchWithRetry(
					`https://api.coingecko.com/api/v3/simple/price?ids=${debouncedFromCrypto}&vs_currencies=${debouncedToCurrency}`
				);

				const fetchedPrice =
					data[debouncedFromCrypto]?.[debouncedToCurrency.toLowerCase()];

				if (fetchedPrice !== undefined) {
					setPrice(fetchedPrice);
					priceCache.current.set(cacheKey, {
						price: fetchedPrice,
						timestamp: Date.now(),
					});
				} else {
					throw new Error("Price data not available");
				}
			} catch (err) {
				setError("Failed to fetch crypto exchange rate");
				toast.error(
					"Failed to fetch crypto exchange rates. Come back online to get updated rates."
				);
				setPrice(null);
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchPrice();
	}, [debouncedFromCrypto, debouncedToCurrency]);

	// === Calculate conversion dynamically ===
	useEffect(() => {
		if (price && fromAmount && !isNaN(Number(fromAmount))) {
			const converted = parseFloat(fromAmount) * price;
			setToAmount(formatCalculatedAmount(converted));
		} else {
			setToAmount("");
		}
	}, [fromAmount, price]);

	// === Swap Crypto and Fiat ===
	const handleSwap = () => {
		toast.info("Swap functionality is disabled for crypto to fiat conversion");
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

	// === Fetch historical data ===
	useEffect(() => {
		const fetchHistory = async () => {
			if (!debouncedFromCrypto || !debouncedToCurrency) return;

			try {
				const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : 30;
				const data = await fetchWithRetry(
					`https://api.coingecko.com/api/v3/coins/${debouncedFromCrypto}/market_chart?vs_currency=${debouncedToCurrency}&days=${days}`
				);

				if (!data.prices || data.prices.length === 0) {
					throw new Error("No historical data available");
				}

				const formatted = data.prices.map((p: [number, number]) => ({
					date: new Date(p[0]).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					}),
					price: p[1],
				}));

				setHistoricalData(formatted);

				const first = formatted[0]?.price ?? 0;
				const last = formatted[formatted.length - 1]?.price ?? 0;
				const change = first !== 0 ? ((last - first) / first) * 100 : 0;
				setTrend(change > 0 ? "up" : change < 0 ? "down" : "neutral");
				setPercentageChange(Number(change.toFixed(2)));
			} catch (err) {
				console.error("Historical data fetch error:", err);
				setHistoricalData([]);
				setTrend("neutral");
				setPercentageChange(0);
			}
		};

		fetchHistory();
	}, [debouncedFromCrypto, debouncedToCurrency, timeRange]);

	return (
		<CryptoContext.Provider
			value={{
				cryptos,
				fiatCurrencies,
				fromCrypto,
				toCurrency,
				fromAmount,
				displayAmount,
				toAmount,
				price,
				loading,
				error,
				historicalData,
				timeRange,
				trend,
				percentageChange,
				handleSwap,
				handleFromAmountChange,
				setFromCrypto,
				setToCurrency,
				setTimeRange,
			}}>
			{children}
		</CryptoContext.Provider>
	);
};

export const UseCrypto = () => {
	const context = useContext(CryptoContext);
	if (!context) throw new Error("useCrypto must be used within CryptoProvider");
	return context;
};
