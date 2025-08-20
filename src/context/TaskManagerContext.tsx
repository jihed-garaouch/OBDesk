import useNetworkStatus from "@/hooks/useNetworkStatus";
import {
	addToTaskSyncQueue,
	deleteTaskFromIndexedDB,
	getTasksFromIndexedDB,
	getTaskSyncQueue,
	removeFromTaskSyncQueue,
	saveTasksToIndexedDB,
	saveTaskToIndexedDB,
	updateTaskInIndexedDB,
} from "@/utils/indexedDb/taskManager";
import { createContext, useContext, useEffect, useState } from "react";
import { UserAuth } from "./AuthContext";
import { supabase } from "@/utils/supabase/supabaseClient";
import {
	addTaskToSupabase,
	deleteTaskFromSupabase,
	fetchUserTasksFromSupabase,
	updateTaskInSupabase,
} from "@/utils/supabase/supabaseService";
import { parseReadableDateToInput, parseReadableTimeToInput } from "@/utils";

export type Task = {
	id: string;
	title: string;
	description?: string;
	date: string;
	time: string;
	priority: "High" | "Medium" | "Low";
	category: "Personal" | "Work";
	client?: string;
	projectName?: string;
	isCompleted: boolean;
	hasReminder: boolean;
};

type SelectedTaskFilter = {
	category: "All" | "Personal" | "Work";
	priority: "High" | "Medium" | "Low" | "All";
	activeFilter: string;
};

interface TaskManagerContextType {
	selectedTaskFilter: SelectedTaskFilter;
	setSelectedTaskFilter: React.Dispatch<
		React.SetStateAction<SelectedTaskFilter>
	>;
	searchInput: string;
	setSearchInput: React.Dispatch<React.SetStateAction<string>>;
	tasks: Task[];
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
	showViewTaskModal: boolean;
	setShowViewTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
	showAddTaskModal: boolean;
	setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
	showDeleteTaskModal: boolean;
	setShowDeleteTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
	selectedTask: Task | null;
	setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
	isAddTask: boolean;
	setIsAddTask: React.Dispatch<React.SetStateAction<boolean>>;
	handleAddTask: (task: Task) => void;
	handleEditTask: (task: Task) => void;
	handleDeleteTask: (task: Task) => void;
}

const TaskManagerContext = createContext<TaskManagerContextType | null>(null);

export const TaskManagerProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { isOnline } = useNetworkStatus();
	const { session } = UserAuth();
	const user = session?.user;

	const [selectedTaskFilter, setSelectedTaskFilter] =
		useState<SelectedTaskFilter>({
			category: "All",
			priority: "All",
			activeFilter: "Today",
		});

	const [searchInput, setSearchInput] = useState<string>("");
	const [showViewTaskModal, setShowViewTaskModal] = useState<boolean>(false);
	const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
	const [showDeleteTaskModal, setShowDeleteTaskModal] =
		useState<boolean>(false);

	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isAddTask, setIsAddTask] = useState(false);

	const [tasks, setTasks] = useState<Task[]>([]);

	const handleAddTask = async (task: Task) => {
		setTasks((prev) => [...prev, task]);
		await saveTaskToIndexedDB(task);

		if (!isOnline) {
			await addToTaskSyncQueue({
				id: task.id,
				type: "create",
				table: "tasks",
				payload: {
					...task,
					date: parseReadableDateToInput(task.date),
					time: parseReadableTimeToInput(task.time),
				},
				timestamp: Date.now(),
			});
			return;
		}

		if (user) await addTaskToSupabase(task, user);
	};

	const handleEditTask = async (task: Task) => {
		setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
		await updateTaskInIndexedDB(task);

		if (!isOnline) {
			await addToTaskSyncQueue({
				id: task.id,
				type: "update",
				table: "tasks",
				payload: {
					...task,
					date: parseReadableDateToInput(task.date),
					time: parseReadableTimeToInput(task.time),
				},
				timestamp: Date.now(),
			});
			return;
		}

		if (user) await updateTaskInSupabase(task, user);
	};

	const handleDeleteTask = async (task: Task) => {
		setTasks((prev) => prev.filter((t) => t.id !== task.id));
		await deleteTaskFromIndexedDB(task);

		if (!isOnline) {
			await addToTaskSyncQueue({
				id: task.id,
				type: "delete",
				table: "tasks",
				payload: {
					...task,
					date: parseReadableDateToInput(task.date),
					time: parseReadableTimeToInput(task.time),
				},
				timestamp: Date.now(),
			});
			return;
		}

		if (user) await deleteTaskFromSupabase(task.id, user);
	};

	const processTaskSyncQueue = async () => {
		const queue = await getTaskSyncQueue();

		for (const op of queue) {
			if (!isOnline) break;

			let success = false;

			try {
				if (op.type === "create") {
					const tx = op.payload as Task;
					const payload = {
						id: tx.id,
						title: tx.title,
						description: tx.description,
						date: tx.date,
						time: tx.time,
						priority: tx.priority,
						category: tx.category,
						client: tx.client,
						project_name: tx.projectName,
						is_completed: tx.isCompleted,
						has_reminder: tx.hasReminder,
						user_id: user?.id,
					};
					const { error } = await supabase.from(op.table).insert([payload]);
					if (!error) success = true;
					else console.error("Sync create error:", error);
				}

				if (op.type === "update") {
					const tx = op.payload as Task;
					const payload = {
						title: tx.title,
						description: tx.description,
						date: tx.date,
						time: tx.time,
						priority: tx.priority,
						category: tx.category,
						client: tx.client,
						project_name: tx.projectName,
						is_completed: tx.isCompleted,
						has_reminder: tx.hasReminder,
						updated_at: new Date().toISOString(),
					};
					const { error } = await supabase
						.from(op.table)
						.update(payload)
						.eq("id", tx.id)
						.eq("user_id", user?.id);
					if (!error) success = true;
					else console.error("Sync update error:", error);
				}

				if (op.type === "delete") {
					const tx = op.payload as { id: string };
					const { error } = await supabase
						.from(op.table)
						.delete()
						.eq("id", tx.id)
						.eq("user_id", user?.id);
					if (!error) success = true;
					else console.error("Sync delete error:", error);
				}
			} catch (err) {
				console.error("Offline task sync error:", err);
			}

			if (success) {
				await removeFromTaskSyncQueue(op.id);
			} else {
				console.warn("Sync failed for task operation:", op);
			}
		}
	};

	const loadTasks = async () => {
		if (isOnline) {
			await processTaskSyncQueue();
		}

		let savedTasks: Task[] = [];
		if (isOnline && user) {
			savedTasks = await fetchUserTasksFromSupabase(user);

			// Update IndexedDB with Batch Write
			await saveTasksToIndexedDB(savedTasks);
		} else {
			savedTasks = await getTasksFromIndexedDB();
		}

		setTasks(savedTasks);
	};

	useEffect(() => {
		if (user) loadTasks();
	}, [isOnline, user]);

	const values = {
		selectedTaskFilter,
		setSelectedTaskFilter,
		searchInput,
		setSearchInput,
		tasks,
		setTasks,
		showViewTaskModal,
		setShowViewTaskModal,
		showAddTaskModal,
		setShowAddTaskModal,
		selectedTask,
		setSelectedTask,
		isAddTask,
		setIsAddTask,
		showDeleteTaskModal,
		setShowDeleteTaskModal,
		handleAddTask,
		handleDeleteTask,
		handleEditTask,
	};

	return (
		<TaskManagerContext.Provider value={values}>
			{children}
		</TaskManagerContext.Provider>
	);
};

export const UseTaskManager = () => {
	const ctx = useContext(TaskManagerContext);
	if (!ctx)
		throw new Error(
			"UseTaskManager must be used within TaskManagerContextProvider"
		);
	return ctx;
};
