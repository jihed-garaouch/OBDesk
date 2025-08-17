import { createContext, useContext, useState } from "react";

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

	const [tasks, setTasks] = useState<Task[]>([
		{
			id: "1",
			title: "Go and eat food",
			date: "9th December 2025",
			time: "10:00 AM",
			priority: "High",
			category: "Personal",
			isCompleted: false,
			hasReminder: true,
		},
		{
			id: "2",
			title: "Work on Lohli project",
			description: "Push the fix for the image modal",
			date: "10th December 2025",
			time: "10:00 AM",
			priority: "Medium",
			category: "Work",
			client: "Lohli",
			projectName: "Lohli-PWA",
			isCompleted: false,
			hasReminder: false,
		},
		{
			id: "3",
			title: "Work on FilmHouse Project",
			description:
				"Push the changes for the upsell and voucher redemption features to production.Push the changes for the upsell and voucher redemption features to production.Push the changes for the upsell and voucher redemption features to production.Push the changes for the upsell and voucher redemption features to production.",
			date: "10th December 2025",
			time: "10:00 AM",
			priority: "Low",
			category: "Work",
			client: "FilmHouse",
			projectName: "FilmHouse-Frontend",
			isCompleted: false,
			hasReminder: true,
		},
		{
			id: "4",
			title: "Task 3",
			description: "Description of Task 1",
			date: "11th December 2025",
			time: "10:00 AM",
			priority: "Low",
			category: "Personal",
			isCompleted: false,
			hasReminder: false,
		},
	]);

	const handleAddTask = async (task: Task) => {
		setTasks((prev) => [...prev, task]);
	};

	const handleEditTask = async (task: Task) => {
		setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
	};

	const handleDeleteTask = async (task: Task) => {
		setTasks((prev) => prev.filter((t) => t.id !== task.id));
	};

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
