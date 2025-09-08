import { UseTaskManager, type Task } from "@/context/TaskManagerContext";
import { parseReadableDateToInput, stripTime } from "@/utils";

const TaskFilter = () => {
	const { selectedTaskFilter, setSelectedTaskFilter, tasks } = UseTaskManager();

	const isTaskInFilter = (task: Task, filterName: string) => {
		const today = stripTime(new Date());
		const taskDate = stripTime(new Date(parseReadableDateToInput(task.date)));

		switch (filterName) {
			case "Today":
				return taskDate.getTime() === today.getTime() && !task.isCompleted;
			case "Upcoming":
				return taskDate.getTime() > today.getTime() && !task.isCompleted;
			case "Overdue":
				return taskDate.getTime() < today.getTime() && !task.isCompleted;
			case "Completed":
				return task.isCompleted;
			case "All":
				return true;
			default:
				return true;
		}
	};

	const filterNames = ["Today", "Upcoming", "Overdue", "Completed"];

	const taskFilters = filterNames.map((name) => ({
		name,
		count: tasks.filter((task) => isTaskInFilter(task, name)).length,
	}));

	return (
		<div className='flex items-center md:justify-center gap-2 md:gap-6 overflow-x-auto py-3 mt-4'>
			{taskFilters.map((filter) => (
				<button
					key={filter.name}
					onClick={() =>
						setSelectedTaskFilter({
							...selectedTaskFilter,
							activeFilter: filter.name,
						})
					}
					className={`text-xs lg:text-sm shadow-sm px-4 py-2 rounded-full border flex items-center gap-2 cursor-pointer group transition-all duration-300 ease-in-out active:scale-[0.99] 
  ${
		selectedTaskFilter.activeFilter === filter.name
			? "bg-foreground text-background border-foreground/50 border-foreground-50 font-medium"
			: "bg-transparent text-foreground border-foreground/30 border-foreground-30 hover:text-background hover:bg-foreground"
	}
`}>
					<span>{filter.name}</span>
					<span
						className={`text-[10px] lg:text-xs font-bold flex items-center justify-center p-1 min-w-6 min-h-6 rounded-full group-hover:bg-background group-hover:text-foreground transition-all duration-300 ease-in-out ${
							selectedTaskFilter.activeFilter === filter.name
								? "bg-background text-foreground"
								: "bg-foreground text-background"
						}`}>
						{filter.count}
					</span>
				</button>
			))}
		</div>
	);
};

export default TaskFilter;
