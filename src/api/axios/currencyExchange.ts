import { createClient } from "../createClient";

const currencyExchangeClient = createClient({
	baseURL: "https://api.exchangerate-api.com/v4/latest",
	label: "Currency Exchange API",
});

export default currencyExchangeClient;
