import { UseCurrency } from "@/context/CurrencyContext";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { useEffect, useState } from "react";
import { FaFlag } from "react-icons/fa";

const Flag = ({ currencyCode }: { currencyCode: string }) => {
	const [hasError, setHasError] = useState(false);
	const [flagUrl, setFlagUrl] = useState<string | null>("");
	const { getFlagUrl } = UseCurrency();
	const { isOnline } = useNetworkStatus();

	useEffect(() => {
		setFlagUrl(getFlagUrl(currencyCode));
	}, [isOnline, currencyCode]);

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
