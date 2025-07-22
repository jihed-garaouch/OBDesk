import cryptoClient from "../axios/crypto";

export const fetchCryptoList = async () => {
	const res = await cryptoClient.get(
		"/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1"
	);
	return res.data;
};

export const fetchCryptoPrice = async (
	cryptoId: string,
	vsCurrency: string
) => {
	const res = await cryptoClient.get(
		`/simple/price?ids=${cryptoId}&vs_currencies=${vsCurrency}`
	);
	return res.data;
};

export const fetchCryptoHistory = async (
	cryptoId: string,
	vsCurrency: string,
	days: number
) => {
	const res = await cryptoClient.get(
		`/coins/${cryptoId}/market_chart?vs_currency=${vsCurrency}&days=${days}`
	);
	return res.data;
};
