import CurrencySection from "@/components/Dashboard/CurrencySection";

const CurrencyScreen = () => {
	return (
		<div className='px-4'>
			<h1 className='text-2xl font-bold'>Global Currencies</h1>
			<p className='text-xs mb-6'>Track live fiat and crypto exchange rates</p>
			<div className='flex flex-col md:flex-row flex-wrap gap-5 w-full overflow-hidden'>
				<CurrencySection />
				<div className='flex-1'>{/* Crypto Section here... */}</div>
			</div>
		</div>
	);
};

export default CurrencyScreen;
