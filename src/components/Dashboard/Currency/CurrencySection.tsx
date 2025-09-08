import CurrencyDropdown from "@/components/ui/CurrencyDropdown";
import { UseCurrency } from "@/context/CurrencyContext";
import { UseTheme } from "@/context/ThemeContext";
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
interface HistoricalDataPoint {
	date: string;
	rate: number;
}

const CurrencySection = () => {
	const { theme } = UseTheme();
	const isDark = theme === "dark";

	const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
		[]
	);
	const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

	const {
		currencies,
		fromCurrency,
		toCurrency,
		displayAmount,
		toAmount,
		exchangeRate,
		loading,
		error,
		handleSwap,
		handleFromAmountChange,
		setFromCurrency,
		setToCurrency,
	} = UseCurrency();

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

	return (
		<div
			className={`flex-1 border border-foreground/20 border-foreground-20 rounded-lg p-4 h-full ${
				isDark
					? "shadow-[inset_0_2px_10px_rgba(255,255,255,0.10),0_2px_8px_rgba(0,0,0,0.16)]"
					: "shadow-lg"
			}`}>
			{/* Header */}
			<div className='flex flex-col items-center gap-2 mb-4'>
				<h1 className='text-base md:text-xl font-bold text-center'>
					Currency Exchange
				</h1>
				{exchangeRate && !loading && !error && (
					<h1 className='text-2xl md:text-3xl font-bold text-center'>
						1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
					</h1>
				)}
				{loading && (
					<p className='text-sm text-foreground/60 text-foreground-60 text-center'>
						Loading rates...
					</p>
				)}
				{error && <p className='text-sm text-red-500 text-center'>{error}</p>}
			</div>

			{/* Converter */}
			<div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
				{/* From Input */}
				<div className='flex items-center gap-2 justify-between border border-foreground/30 border-foreground-30 shadow p-3 rounded-lg flex-1 w-full'>
					<CurrencyDropdown
						value={fromCurrency}
						onChange={setFromCurrency}
						currencies={currencies}
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
					className='rounded-full p-2 md:p-3 bg-foreground text-background flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer'>
					<ImLoop2 className='text-xs md:text-base' />
				</button>

				{/* To Input */}
				<div className='flex items-center gap-2 justify-between border border-foreground/30 border-foreground-30 shadow p-3 rounded-lg flex-1 w-full'>
					<CurrencyDropdown
						value={toCurrency}
						onChange={setToCurrency}
						currencies={currencies}
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
				<div className='flex flex-col md:flex-row gap-3 items-center justify-between mb-4'>
					<h2 className='text-lg font-semibold'>Historical Trend</h2>
					<div className='flex gap-2'>
						<button
							onClick={() => setTimeRange("7d")}
							className={`px-3 py-1 rounded text-sm ${
								timeRange === "7d"
									? "bg-foreground text-background"
									: "border border-foreground/30 border-foreground-30 hover:bg-foreground/10 hover:bg-foreground-10"
							}`}>
							7D
						</button>
						<button
							onClick={() => setTimeRange("30d")}
							className={`px-3 py-1 rounded text-sm ${
								timeRange === "30d"
									? "bg-foreground text-background"
									: "border border-foreground/30 border-foreground-30 hover:bg-foreground/10 hover:bg-foreground-10"
							}`}>
							30D
						</button>
						<button
							onClick={() => setTimeRange("90d")}
							className={`px-3 py-1 rounded text-sm ${
								timeRange === "90d"
									? "bg-foreground text-background"
									: "border border-foreground/30 border-foreground-30 hover:bg-foreground/10 hover:bg-foreground-10"
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
					<div className='h-[250px] flex items-center justify-center border border-foreground/20 border-foreground-20 rounded'>
						<p className='text-foreground/60 text-foreground-60'>Loading chart data...</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CurrencySection;
