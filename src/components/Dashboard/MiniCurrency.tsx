import { UseCurrency } from "@/context/CurrencyContext";
import CurrencyDropdown from "@/components/ui/CurrencyDropdown";
import { ImLoop2 } from "react-icons/im";

const MiniCurrency = () => {
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

	return (
		<div className='flex-1 border border-foreground/20 shadow-lg rounded-lg p-4 h-full'>
			{/* Header */}
			<div className='flex flex-col items-center gap-0 mb-4'>
				<h1 className='text-sm font-bold text-center'>Currency Exchange</h1>
				{exchangeRate && !loading && !error && (
					<h1 className='text-xl font-bold text-center'>
						1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
					</h1>
				)}
				{loading && (
					<p className='text-sm text-foreground/60 text-center'>Loading rates...</p>
				)}
				{error && <p className='text-sm text-red-500 text-center'>{error}</p>}
			</div>

			{/* Converter */}
			<div className='flex flex-col items-center justify-between gap-3'>
				{/* From Input */}
				<div className='flex items-center gap-2 justify-between border border-foreground/30 shadow p-3 rounded-lg flex-1 w-full'>
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
					className='rounded-full p-2 bg-foreground text-background flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer'>
					<ImLoop2 className='text-xs' />
				</button>

				{/* To Input */}
				<div className='flex items-center gap-2 justify-between border border-foreground/30 shadow p-3 rounded-lg flex-1 w-full'>
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
		</div>
	);
};

export default MiniCurrency;
