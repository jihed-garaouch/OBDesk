import type { TimeZone } from "@/screens/Dashboard/WorldClock";
import { openDB } from "idb";

type DeleteSyncPayload = {
	timezone: string;
	user_id: string;
};

type DeleteSyncOperation = {
	type: "delete";
	table: "cities";
	payload: DeleteSyncPayload;
	timestamp: number;
};

// Database name and stores
const DB_NAME = "worldClockDB";
const DB_VERSION = 1;
const CITIES_STORE = "cities";
const USER_LOCATION_STORE = "userLocation";
const DELETE_SYNC_STORE = "deleteSyncQueue";

// Initialize IndexedDB
const initDB = async () => {
	return openDB(DB_NAME, DB_VERSION, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(CITIES_STORE)) {
				db.createObjectStore(CITIES_STORE, { keyPath: "timezone" });
			}
			if (!db.objectStoreNames.contains(USER_LOCATION_STORE)) {
				db.createObjectStore(USER_LOCATION_STORE, { keyPath: "timezone" });
			}
			if (!db.objectStoreNames.contains(DELETE_SYNC_STORE)) {
				db.createObjectStore(DELETE_SYNC_STORE, { keyPath: "timestamp" });
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
			console.log("[IndexedDB] Initializing...");
			await initDB(); // This creates/updates stores if needed
			console.log("[IndexedDB] Ready ✅");
		})();
	}

	return dbReadyPromise;
};

// Save a city
export const saveCityToIndexedDB = async (city: TimeZone) => {
	await ensureDBReady();
	const db = await initDB();
	await db.put(CITIES_STORE, city);
};

// Save multiple cities at once
export const saveCitiesToIndexedDB = async (cities: TimeZone[]) => {
  if (!cities.length) return;

  await ensureDBReady();
  const db = await initDB();
  const tx = db.transaction(CITIES_STORE, "readwrite");
  const store = tx.objectStore(CITIES_STORE);

  for (const city of cities) {
    store.put(city);
  }

  await tx.done;
};

// Get all saved cities
export const getCitiesFromIndexedDB = async (): Promise<TimeZone[]> => {
	await ensureDBReady();
	const db = await initDB();
	return (await db.getAll(CITIES_STORE)) || [];
};

// Save user location (first element)
export const saveUserLocationToIndexedDB = async (location: TimeZone) => {
	await ensureDBReady();
	const db = await initDB();
	const tx = db.transaction(USER_LOCATION_STORE, "readwrite");
	const store = tx.objectStore(USER_LOCATION_STORE);
	await store.clear(); // clear previous record
	await store.put(location); // save new record
	await tx.done;
};

// Get last saved user location
export const getUserLocationFromIndexedDB = async (): Promise<
	TimeZone | undefined
> => {
	await ensureDBReady();
	const db = await initDB();
	const all = await db.getAll(USER_LOCATION_STORE);
	return all[0]; // should be only one stored
};

export const deleteCityFromIndexedDB = async (timezone: string) => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	const tx = db.transaction(CITIES_STORE, "readwrite");
	const store = tx.objectStore(CITIES_STORE);
	const allCities = await store.getAll();

	const filtered = allCities.filter((c: TimeZone) => c.timezone !== timezone);

	await store.clear();
	for (const city of filtered) {
		await store.put(city);
	}

	await tx.done;
};

export const addToDeleteSyncQueue = async (
	operation: DeleteSyncOperation
): Promise<void> => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	const tx = db.transaction(DELETE_SYNC_STORE, "readwrite");
	const store = tx.objectStore(DELETE_SYNC_STORE);
	await store.add(operation);
	await tx.done;
};

export const getDeleteSyncQueue = async (): Promise<DeleteSyncOperation[]> => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	return db.getAll(DELETE_SYNC_STORE);
};

export const removeFromDeleteSyncQueue = async (
	timestamp: number
): Promise<void> => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	const tx = db.transaction(DELETE_SYNC_STORE, "readwrite");
	const store = tx.objectStore(DELETE_SYNC_STORE);
	await store.delete(timestamp);
	await tx.done;
};
