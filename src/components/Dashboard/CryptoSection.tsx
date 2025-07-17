import { UseCrypto } from "@/context/CryptoContext";
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
import CurrencyDropdown from "../ui/CurrencyDropdown";
import CryptoDropdown from "../ui/CryptoDropdown";

type TimeRange = "24h" | "7d" | "30d";

const CryptoSection = () => {
	const {
		cryptos,
		fiatCurrencies,
		fromCrypto,
		toCurrency,
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
	} = UseCrypto();

	const lineColor =
		trend === "up" ? "#16a34a" : trend === "down" ? "#dc2626" : "#6b7280";

	// Get current crypto for display
	const currentCrypto = cryptos.find((c) => c.id === fromCrypto);
	const displaySymbol = currentCrypto?.symbol || fromCrypto.toUpperCase();

	return (
		<div className='flex-1 border border-foreground/20 shadow-lg rounded-lg p-4 h-full'>
			{/* Header */}
			<div className='flex flex-col items-center gap-2 mb-4'>
				<h1 className='text-base md:text-xl font-bold text-center'>
					Crypto ↔ Fiat Exchange
				</h1>
				{price && !loading && !error && (
					<h1 className='text-2xl md:text-3xl font-bold text-center'>
						1 {displaySymbol} = {price.toLocaleString()} {toCurrency}
					</h1>
				)}
				{loading && <p className='text-sm text-foreground/60'>Loading...</p>}
				{error && <p className='text-sm text-red-500'>{error}</p>}
				{!loading && !error && historicalData.length > 0 && (
					<div
						className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] md:text-xs ${
							trend === "up"
								? "bg-green-100 text-green-700"
								: trend === "down"
								? "bg-red-100 text-red-700"
								: "bg-gray-100 text-gray-700"
						}`}>
						{trend === "up" && (
							<>
								🔼 Up {percentageChange}% in last {timeRange}
							</>
						)}
						{trend === "down" && (
							<>
								🔻 Down {Math.abs(percentageChange)}% in last {timeRange}
							</>
						)}
						{trend === "neutral" && <>— Stable in last {timeRange}</>}
					</div>
				)}
			</div>

			{/* Converter */}
			<div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
				{/* From Crypto Input */}
				<div className='flex items-center gap-2 justify-between border border-foreground/30 shadow p-3 rounded-lg flex-1 w-full'>
					<CryptoDropdown
						value={fromCrypto}
						onChange={setFromCrypto}
						cryptos={cryptos}
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
					className='rounded-full p-2 md:p-3 bg-foreground/20 text-foreground flex-shrink-0 hover:opacity-80 transition-opacity cursor-not-allowed opacity-50'
					disabled>
					<ImLoop2 className='text-xs md:text-base' />
				</button>

				{/* To Fiat Input */}
				<div className='flex items-center gap-2 justify-between border border-foreground/30 shadow p-3 rounded-lg flex-1 w-full'>
					<CurrencyDropdown
						value={toCurrency}
						onChange={setToCurrency}
						currencies={fiatCurrencies}
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

			{/* Live Price Chart */}
			<div className='mt-6'>
				<div className='flex flex-col md:flex-row gap-3 items-center justify-between mb-4'>
					<h2 className='text-lg font-semibold'>Live Price Chart</h2>
					<div className='flex gap-2'>
						{["24h", "7d", "30d"].map((range) => (
							<button
								key={range}
								onClick={() => setTimeRange(range as TimeRange)}
								className={`px-3 py-1 rounded text-sm ${
									timeRange === range
										? "bg-foreground text-background"
										: "border border-foreground/30 hover:bg-foreground/10"
								}`}>
								{range.toUpperCase()}
							</button>
						))}
					</div>
				</div>

				{historicalData.length > 0 ? (
					<ResponsiveContainer width='100%' height={250}>
						<LineChart data={historicalData}>
							<CartesianGrid strokeDasharray='3 3' opacity={0.3} />
							<XAxis dataKey='date' tick={{ fontSize: 12 }} />
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
								dataKey='price'
								stroke={lineColor}
								strokeWidth={2}
								dot={false}
								isAnimationActive={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				) : (
					<div className='h-[250px] flex items-center justify-center border border-foreground/20 rounded'>
						<p className='text-foreground/60'>
							{loading ? "Loading chart data..." : "No chart data available"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CryptoSection;