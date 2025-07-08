import { UseCurrency } from "@/context/CurrencyContext";
import { useState } from "react";
import { FaFlag } from "react-icons/fa";

const Flag = ({ currencyCode }: { currencyCode: string }) => {
	const [hasError, setHasError] = useState(false);
	const { getFlagUrl } = UseCurrency();

	const flagUrl = getFlagUrl(currencyCode);

	if (!flagUrl || hasError) {
		return <FaFlag />;
	}

	return (
		<img
			src={flagUrl}
			alt={currencyCode}
			className='w-6 h-[18px] object-cover rounded-sm'
			onError={() => setHasError(true)}
		/>
	);
};

export default Flag;
