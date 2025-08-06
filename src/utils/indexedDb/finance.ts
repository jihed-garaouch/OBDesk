import type { TransactionType } from "@/context/FinanceContext";
import { openDB } from "idb";

type TransactionSyncAction = "create" | "update" | "delete";

type TransactionSyncOperation = {
	id: string;
	type: TransactionSyncAction;
	table: "transactions";
	payload: TransactionType | { id: string };
	timestamp: number;
};

// Database name and stores
const DB_NAME = "financeDB";
const DB_VERSION = 1;
const TRANSACTIONS_STORE = "transactions";
const TRANSACTION_SYNC_STORE = "transactionSyncQueue";

// Initialize IndexedDB
const initDB = async () => {
	return openDB(DB_NAME, DB_VERSION, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(TRANSACTIONS_STORE)) {
				db.createObjectStore(TRANSACTIONS_STORE, { keyPath: "id" });
			}
			if (!db.objectStoreNames.contains(TRANSACTION_SYNC_STORE)) {
				db.createObjectStore(TRANSACTION_SYNC_STORE, { keyPath: "id" });
			}
		},
	});
};

let dbReadyPromise: Promise<void> | null = null;

/**
 * Ensures IndexedDB is initialized and ready before any operation runs.
 */
export const ensureDBReady = async () => {
	if (!dbReadyPromise) {
		dbReadyPromise = (async () => {
			await initDB();
		})();
	}
	return dbReadyPromise;
};

export const getTransactionsFromIndexedDB = async (): Promise<
	TransactionType[]
> => {
	await ensureDBReady();
	const db = await initDB();
	return (await db.getAll(TRANSACTIONS_STORE)) || [];
};

export const saveTransactionToIndexedDB = async (
	transaction: TransactionType
) => {
	await ensureDBReady();
	const db = await initDB();
	await db.put(TRANSACTIONS_STORE, transaction);
};

export const saveTransactionsToIndexedDB = async (
	transactions: TransactionType[]
) => {
	if (!transactions.length) return;

	await ensureDBReady();
	const db = await initDB();
	const tx = db.transaction(TRANSACTIONS_STORE, "readwrite");
	const store = tx.objectStore(TRANSACTIONS_STORE);

	await store.clear();

	for (const transaction of transactions) {
		store.put(transaction);
	}

	await tx.done;
};

export const updateTransactionInIndexedDB = async (
	transaction: TransactionType
) => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	const tx = db.transaction(TRANSACTIONS_STORE, "readwrite");
	const store = tx.objectStore(TRANSACTIONS_STORE);
	const allTransactions = await store.getAll();

	const updatedTransactions = allTransactions.map((t: TransactionType) =>
		t.id === transaction.id ? transaction : t
	);

	await store.clear();
	for (const transaction of updatedTransactions) {
		await store.put(transaction);
	}

	await tx.done;
};

export const deleteTransactionFromIndexedDB = async (
	transaction: TransactionType
) => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	const tx = db.transaction(TRANSACTIONS_STORE, "readwrite");
	const store = tx.objectStore(TRANSACTIONS_STORE);
	const allTransactions = await store.getAll();

	const filteredTransactions = allTransactions.filter(
		(t: TransactionType) => t.id !== transaction.id
	);

	await store.clear();
	for (const transaction of filteredTransactions) {
		await store.put(transaction);
	}

	await tx.done;
};

export const addToTransactionSyncQueue = async (
	operation: TransactionSyncOperation
): Promise<void> => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	await db.put(TRANSACTION_SYNC_STORE, operation);
};

export const getTransactionSyncQueue = async (): Promise<
	TransactionSyncOperation[]
> => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	return db.getAll(TRANSACTION_SYNC_STORE);
};

export const removeFromSyncQueue = async (id: string): Promise<void> => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	await db.delete(TRANSACTION_SYNC_STORE, id);
};
