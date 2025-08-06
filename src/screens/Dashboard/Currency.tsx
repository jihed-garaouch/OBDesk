import CryptoSection from "@/components/Dashboard/Currency/CryptoSection";
import CurrencySection from "@/components/Dashboard/Currency/CurrencySection";

const CurrencyScreen = () => {
	return (
		<div className='pr-4 h-full'>
			<h1 className='text-2xl font-bold'>Global Currencies</h1>
			<p className='text-xs mb-6'>Track live fiat and crypto exchange rates.</p>
			<div className='flex flex-col md:flex-row flex-wrap gap-5 w-full overflow-hidden'>
				<CurrencySection />
				<CryptoSection />
			</div>
		</div>
	);
};

export default CurrencyScreen;
