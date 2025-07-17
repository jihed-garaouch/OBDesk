import type { CryptoCurrency } from "@/context/CryptoContext";
import { openDB } from "idb";

const DB_NAME = "cryptoDB";
const DB_VERSION = 1;
const CRYPTO_STORE = "cryptos";

// Initialize DB
const initDB = async () => {
	return openDB(DB_NAME, DB_VERSION, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(CRYPTO_STORE)) {
				db.createObjectStore(CRYPTO_STORE, { keyPath: "id" });
			}
		},
	});
};

let dbReadyPromise: Promise<void> | null = null;

// Ensure DB is initialized
export const ensureCryptoDBReady = async () => {
	if (!dbReadyPromise) {
		dbReadyPromise = (async () => {
			await initDB();
		})();
	}
	return dbReadyPromise;
};

// Save all cryptos
export const saveCryptosToIndexedDB = async (cryptos: CryptoCurrency[]) => {
	await ensureCryptoDBReady();
	const db = await initDB();

	const tx = db.transaction(CRYPTO_STORE, "readwrite");
	const store = tx.objectStore(CRYPTO_STORE);

	// Clear old list first
	await store.clear();

	// Insert all cryptos
	for (const crypto of cryptos) {
		await store.put(crypto);
	}

	await tx.done;
};

// Get all cryptos
export const getCryptosFromIndexedDB = async () => {
	await ensureCryptoDBReady();
	const db = await initDB();

	const all = await db.getAll(CRYPTO_STORE);
	return all || [];
};
