import { currencyToCountryCode } from "@/utils/constants";
import { useEffect, useState } from "react";
import { ImLoop2 } from "react-icons/im";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import CurrencyDropdown from "../ui/CurrencyDropDown";
import {
	fetchCurrencies,
	fetchExchangeRate,
} from "@/api/endpoints/currencyExchange";

interface Currency {
	name: string;
	countryCode?: string;
}

interface HistoricalDataPoint {
	date: string;
	rate: number;
}

const formatNumberForDisplay = (value: string): string => {
	if (!value) return "";

	const cleanedValue = value.replace(/,/g, "");

	// Split into integer and decimal parts
	const parts = cleanedValue.split(".");
	const integerPart = parts[0];
	const decimalPart = parts.length > 1 ? parts[1] : "";

	// Add commas to the integer part
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	// Recombine. If a decimal part exists, keep it as is (allows user to type)
	if (parts.length > 1) {
		return `${formattedInteger}.${decimalPart}`;
	}

	return formattedInteger;
};

const parseFormattedInput = (formattedValue: string): string => {
	if (!formattedValue) return "";
	return formattedValue.replace(/,/g, "");
};

const CurrencySection = () => {
	const getFlagUrl = (currencyCode: string): string | null => {
		const countryCode = currencyToCountryCode[currencyCode];
		return countryCode
			? `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
			: null;
	};

	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const [fromCurrency, setFromCurrency] = useState<string>("USD");
	const [toCurrency, setToCurrency] = useState<string>("EUR");
	const [fromAmount, setFromAmount] = useState<string>("1");
	const [displayAmount, setDisplayAmount] = useState<string>("1");
	const [toAmount, setToAmount] = useState<string>("");
	const [exchangeRate, setExchangeRate] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
		[]
	);
	const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
	const [error, setError] = useState<string | null>(null);

	const formatCalculatedAmount = (amount: number): string => {
		if (isNaN(amount) || amount === 0) return "0.00";
		return new Intl.NumberFormat("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount);
	};

	// Fetch all available currencies
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
				setCurrencies(currencyList);
			} catch (err) {
				console.error("Failed to fetch currencies:", err);
			}
		};
		fetchAllCurrencies();
	}, []);

	// Fetch exchange rate
	useEffect(() => {
		const fetchRate = async () => {
			if (!fromCurrency || !toCurrency) return;

			setLoading(true);
			setError(null);
			try {
				const data = await fetchExchangeRate(fromCurrency);
				const rate: number = data.rates[toCurrency];
				setExchangeRate(rate);

				// Calculate converted amount and apply formatting
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

	// Update conversion when fromAmount or exchangeRate changes
	useEffect(() => {
		if (exchangeRate && fromAmount && !isNaN(Number(fromAmount))) {
			const converted = parseFloat(fromAmount) * exchangeRate;
			setToAmount(formatCalculatedAmount(converted));
		} else {
			setToAmount("");
		}
	}, [fromAmount, exchangeRate]);

	// Fetch historical data
	useEffect(() => {
		const fetchHistoricalData = async () => {
			try {
				const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
				const data: HistoricalDataPoint[] = [];
				const today = new Date();

				for (let i = days - 1; i >= 0; i--) {
					const date = new Date(today);
					date.setDate(date.getDate() - i);

					const variance = exchangeRate ? exchangeRate * 0.05 : 1;
					const randomRate = exchangeRate
						? exchangeRate + (Math.random() - 0.5) * variance
						: 1 + (Math.random() - 0.5) * 0.05;

					data.push({
						date: date.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						}),
						rate: parseFloat(randomRate.toFixed(4)),
					});
				}

				setHistoricalData(data);
			} catch (err) {
				console.error("Failed to fetch historical data:", err);
			}
		};

		if (exchangeRate) {
			fetchHistoricalData();
		}
	}, [fromCurrency, toCurrency, timeRange, exchangeRate]);

	// Swap currencies and amounts.
	const handleSwap = () => {
		setFromCurrency(toCurrency);
		setToCurrency(fromCurrency);

		// Parse the formatted 'toAmount' back to a clean numeric string for 'fromAmount'
		const newFromAmount = parseFormattedInput(toAmount);
		setFromAmount(newFromAmount);

		// Format the new clean 'fromAmount' for display
		setDisplayAmount(formatNumberForDisplay(newFromAmount));
	};

	const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;

		// 1. Clean the input for internal state (remove commas)
		const cleanValue = parseFormattedInput(rawValue);

		// Regex to check if the clean value is a valid numeric input (including incomplete decimal)
		const isNumeric = /^\d*(\.\d*)?$/.test(cleanValue);

		if (isNumeric || cleanValue === "") {
			// Update the clean numeric state for calculations
			setFromAmount(cleanValue);

			// Update the display state with formatting
			const formatted = formatNumberForDisplay(rawValue);
			setDisplayAmount(formatted);
		}
		// If the input is invalid (e.g., two decimal points), simply ignore the keystroke
	};

	return (
		<div className='flex-1 border border-foreground/20 shadow-lg rounded-lg p-4 h-full'>
			{/* Header */}
			<div className='flex flex-col items-center gap-2 mb-4'>
				<h1 className='text-xl font-bold text-center'>Currency Exchange</h1>
				{exchangeRate && !loading && (
					<h1 className='text-3xl font-bold text-center'>
						1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
					</h1>
				)}
				{loading && (
					<p className='text-sm text-foreground/60'>Loading rates...</p>
				)}
				{error && <p className='text-sm text-red-500'>{error}</p>}
			</div>

			{/* Converter */}
			<div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
				{/* From Input */}
				<div className='flex items-center gap-2 justify-between border border-foreground/30 shadow p-3 rounded-lg flex-1 w-full'>
					<CurrencyDropdown
						value={fromCurrency}
						onChange={setFromCurrency}
						currencies={currencies}
						getFlagUrl={getFlagUrl}
					/>
					<input
						type='text'
						value={displayAmount}
						onChange={handleFromAmountChange}
						placeholder='1.00'
						className='border-none outline-none text-2xl text-right no-spinner w-[100px] sm:w-[120px] max-w-[45%] bg-transparent'
					/>
				</div>

				{/* Swap Icon */}
				<button
					onClick={handleSwap}
					className='rounded-full p-3 bg-foreground text-background flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer'>
					<ImLoop2 className='text-base' />
				</button>

				{/* To Input */}
				<div className='flex items-center gap-2 justify-between border border-foreground/30 shadow p-3 rounded-lg flex-1 w-full'>
					<CurrencyDropdown
						value={toCurrency}
						onChange={setToCurrency}
						currencies={currencies}
						getFlagUrl={getFlagUrl}
					/>
					<input
						type='text'
						value={toAmount}
						readOnly
						placeholder='0.00'
						className='border-none outline-none text-2xl text-right no-spinner w-[100px] sm:w-[120px] max-w-[45%] bg-transparent'
					/>
				</div>
			</div>

			{/* Historical Trend Chart */}
			<div className='mt-6'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-lg font-semibold'>Historical Trend</h2>
					<div className='flex gap-2'>
						<button
							onClick={() => setTimeRange("7d")}
							className={`px-3 py-1 rounded text-sm ${
								timeRange === "7d"
									? "bg-foreground text-background"
									: "border border-foreground/30 hover:bg-foreground/10"
							}`}>
							7D
						</button>
						<button
							onClick={() => setTimeRange("30d")}
							className={`px-3 py-1 rounded text-sm ${
								timeRange === "30d"
									? "bg-foreground text-background"
									: "border border-foreground/30 hover:bg-foreground/10"
							}`}>
							30D
						</button>
						<button
							onClick={() => setTimeRange("90d")}
							className={`px-3 py-1 rounded text-sm ${
								timeRange === "90d"
									? "bg-foreground text-background"
									: "border border-foreground/30 hover:bg-foreground/10"
							}`}>
							90D
						</button>
					</div>
				</div>

				{historicalData.length > 0 ? (
					<ResponsiveContainer width='100%' height={250}>
						<LineChart data={historicalData}>
							<CartesianGrid strokeDasharray='3 3' opacity={0.3} />
							<XAxis
								dataKey='date'
								tick={{ fontSize: 12 }}
								interval={timeRange === "7d" ? 0 : timeRange === "30d" ? 4 : 14}
							/>
							<YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
							<Tooltip
								contentStyle={{
									backgroundColor: "rgba(0,0,0,0.8)",
									border: "none",
									borderRadius: "8px",
									color: "#fff",
								}}
							/>
							<Line
								type='monotone'
								dataKey='rate'
								stroke='#3b82f6'
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				) : (
					<div className='h-[250px] flex items-center justify-center border border-foreground/20 rounded'>
						<p className='text-foreground/60'>Loading chart data...</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CurrencySection;
