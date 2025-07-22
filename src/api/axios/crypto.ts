import { createClientWithRetry } from "../createClientWithRetry";

const cryptoClient = createClientWithRetry({
  baseURL: "https://api.coingecko.com/api/v3",
  label: "CoinGecko API",
  maxRetries: 3,
  baseDelay: 1000,
});

export default cryptoClient;