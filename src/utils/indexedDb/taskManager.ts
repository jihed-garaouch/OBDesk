import type { Task } from "@/context/TaskManagerContext";
import { openDB } from "idb";

type TaskSyncAction = "create" | "update" | "delete";

type TaskSyncOperation = {
	id: string;
	type: TaskSyncAction;
	table: "tasks";
	payload: Task | { id: string };
	timestamp: number;
};

// Database name and stores
const DB_NAME = "taskManagerDB";
const DB_VERSION = 1;
const TASKS_STORE = "tasks";
const TASK_SYNC_STORE = "taskSyncQueue";

// Initialize IndexedDB
const initDB = async () => {
	return openDB(DB_NAME, DB_VERSION, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(TASKS_STORE)) {
				db.createObjectStore(TASKS_STORE, { keyPath: "id" });
			}
			if (!db.objectStoreNames.contains(TASK_SYNC_STORE)) {
				db.createObjectStore(TASK_SYNC_STORE, { keyPath: "id" });
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

export const getTasksFromIndexedDB = async (): Promise<Task[]> => {
	await ensureDBReady();
	const db = await initDB();
	return (await db.getAll(TASKS_STORE)) || [];
};

export const saveTaskToIndexedDB = async (task: Task) => {
	await ensureDBReady();
	const db = await initDB();
	await db.put(TASKS_STORE, task);
};

export const saveTasksToIndexedDB = async (tasks: Task[]) => {
	if (!tasks.length) return;

	await ensureDBReady();
	const db = await initDB();
	const tx = db.transaction(TASKS_STORE, "readwrite");
	const store = tx.objectStore(TASKS_STORE);

	await store.clear();

	for (const task of tasks) {
		store.put(task);
	}

	await tx.done;
};

export const updateTaskInIndexedDB = async (task: Task) => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	const tx = db.transaction(TASKS_STORE, "readwrite");
	const store = tx.objectStore(TASKS_STORE);
	const allTasks = await store.getAll();

	const updatedTasks = allTasks.map((t: Task) => (t.id === task.id ? task : t));

	await store.clear();
	for (const task of updatedTasks) {
		await store.put(task);
	}

	await tx.done;
};

export const deleteTaskFromIndexedDB = async (
	task: Task
) => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	const tx = db.transaction(TASKS_STORE, "readwrite");
	const store = tx.objectStore(TASKS_STORE);
	const allTasks = await store.getAll();

	const filteredTasks = allTasks.filter(
		(t: Task) => t.id !== task.id
	);

	await store.clear();
	for (const task of filteredTasks) {
		await store.put(task);
	}

	await tx.done;
};

export const addToTaskSyncQueue = async (
	operation: TaskSyncOperation
): Promise<void> => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	await db.put(TASK_SYNC_STORE, operation);
};

export const getTaskSyncQueue = async (): Promise<
	TaskSyncOperation[]
> => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	return db.getAll(TASK_SYNC_STORE);
};

export const removeFromTaskSyncQueue = async (id: string): Promise<void> => {
	await ensureDBReady();
	const db = await openDB(DB_NAME, DB_VERSION);
	await db.delete(TASK_SYNC_STORE, id);
};
