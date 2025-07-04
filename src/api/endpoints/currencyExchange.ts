import currencyExchangeClient from "../axios/currencyExchange";

export const fetchCurrencies = async () => {
	const res = await currencyExchangeClient.get("/USD");
	return res.data;
};
export const fetchExchangeRate = async (fromCurrency: string) => {
	const res = await currencyExchangeClient.get(`/${fromCurrency}`);
	return res.data;
};
