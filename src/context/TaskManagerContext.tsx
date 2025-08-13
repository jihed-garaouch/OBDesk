import { createContext, useContext, useState } from "react";

export type Task = {
	id: number;
	title: string;
	description?: string;
	date: string;
	time: string;
	priority: "High" | "Medium" | "Low";
	category: "Personal" | "Work";
	client?: string;
	projectName?: string;
	isCompleted: boolean;
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

	const [tasks, setTasks] = useState<Task[]>([
		{
			id: 1,
			title: "Go and eat food",
			date: "9th December 2025",
			time: "10:00 AM",
			priority: "High",
			category: "Personal",
			client: "Client A",
			projectName: "Project A",
			isCompleted: false,
		},
		{
			id: 2,
			title: "Work on Lohli project",
			description: "Push the fix for the image modal",
			date: "10th December 2025",
			time: "10:00 AM",
			priority: "Medium",
			category: "Work",
			client: "Lohli",
			projectName: "Lohli-PWA",
			isCompleted: false,
		},
		{
			id: 3,
			title: "Work on FilmHouse Project",
			description:
				"Push the changes for the upsell and voucher redemption features to production.",
			date: "10th December 2025",
			time: "10:00 AM",
			priority: "Low",
			category: "Work",
			client: "FilmHouse",
			projectName: "FilmHouse-Frontend",
			isCompleted: false,
		},
		{
			id: 4,
			title: "Task 3",
			description: "Description of Task 1",
			date: "11th December 2025",
			time: "10:00 AM",
			priority: "Low",
			category: "Personal",
			isCompleted: false,
		},
	]);

	const values = {
		selectedTaskFilter,
		setSelectedTaskFilter,
		searchInput,
		setSearchInput,
		tasks,
		setTasks,
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
