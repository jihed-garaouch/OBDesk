import { useEffect, useState } from "react";
import { FaBitcoin } from "react-icons/fa";

interface CryptoIconProps {
	symbol: string;
	cryptos: { id: string; symbol: string; iconUrl: string }[];
}

const CryptoIcon = ({ symbol, cryptos }: CryptoIconProps) => {
	const [iconSrc, setIconSrc] = useState<string | null>(null);
	const [hasError, setHasError] = useState(false);

	const crypto = cryptos.find(
		(c) => c.symbol.toLowerCase() === symbol.toLowerCase()
	);
	const iconUrl = crypto?.iconUrl;
	const cryptoId = symbol.toLowerCase();

	const fallbackIcon = <FaBitcoin className='w-5 h-5 text-foreground/70' />;

	useEffect(() => {
		let isMounted = true;

		const fetchIcon = async () => {
			try {
				if (iconUrl) {
					setIconSrc(iconUrl);
					return;
				}
			} catch (error) {
				console.error("Failed to load crypto icon:", error);
				if (isMounted) setHasError(true);
			}
		};

		fetchIcon();

		return () => {
			isMounted = false;
		};
	}, [cryptoId, iconUrl]);

	if (hasError || !iconSrc) {
		return fallbackIcon;
	}

	return (
		<img
			src={iconSrc}
			alt={symbol}
			className='w-6 h-6 object-contain rounded-full'
			onError={() => setHasError(true)}
		/>
	);
};

export default CryptoIcon;
