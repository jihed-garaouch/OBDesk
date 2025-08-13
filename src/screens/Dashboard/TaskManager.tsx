import TaskCard from "@/components/Dashboard/TaskManager/TaskCard";
import TaskFilter from "@/components/Dashboard/TaskManager/TaskFilter";
import Input from "@/components/ui/Input";
import SelectDropdown from "@/components/ui/SelectDropdown";
import { UseTaskManager, type Task } from "@/context/TaskManagerContext";
import { parseReadableDateToInput, stripTime } from "@/utils";
import { MdOutlineArrowOutward } from "react-icons/md";
import { PiStackPlusFill } from "react-icons/pi";

const TaskManagerScreen = () => {
	const {
		searchInput,
		setSearchInput,
		tasks,
		selectedTaskFilter,
		setSelectedTaskFilter,
	} = UseTaskManager();

	const isTaskInActiveFilter = (task: Task) => {
		const today = stripTime(new Date());
		const taskDate = stripTime(new Date(parseReadableDateToInput(task.date)));

		switch (selectedTaskFilter.activeFilter) {
			case "Today":
				return taskDate.getTime() === today.getTime() && !task.isCompleted;
			case "Upcoming":
				return taskDate.getTime() > today.getTime() && !task.isCompleted;
			case "Overdue":
				return taskDate.getTime() < today.getTime() && !task.isCompleted;
			case "Completed":
				return task.isCompleted;
			default:
				return true;
		}
	};

	const filteredTasks = tasks.filter((task) => {
		const matchesSearch =
			task.title.toLowerCase().includes(searchInput.toLowerCase()) ||
			(task.description?.toLowerCase().includes(searchInput.toLowerCase()) ??
				false);

		const matchesCategory =
			selectedTaskFilter.category === "All" ||
			task.category === selectedTaskFilter.category;

		const matchesPriority =
			selectedTaskFilter.priority === "All" ||
			task.priority === selectedTaskFilter.priority;

		const matchesActiveFilter = isTaskInActiveFilter(task);

		return (
			matchesSearch && matchesCategory && matchesPriority && matchesActiveFilter
		);
	});

	return (
		<div className='pr-4 h-full'>
			<h1 className='text-2xl font-bold'>Task Manager</h1>
			<p className='text-xs mb-6'>
				Organize, prioritize, and track your tasks effortlessly.
			</p>
			<div className='max-w-[1200px] mx-auto mb-2'>
				<div className='flex flex-col gap-2 items-center'>
					<p className='text-center text-2xl lg:text-4xl font-bold'>
						Wednesday, May 3, 2025
					</p>
					<p className='text-sm lg:text-lg font-medium'>
						You’ve got 5 tasks scheduled for today.
					</p>
					<p className='text-xs lg:text-sm'>
						Stay focused — you’ve got this. 💪
					</p>
				</div>

				<div className='flex flex-col md:flex-row flex-wrap md:items-center gap-3 mt-4 w-full md:w-[80%] xl:w-[70%] mx-auto'>
					<div className='flex-1'>
						<Input
							type='search'
							id='search'
							placeholder='Search tasks'
							value={searchInput}
							onChange={(e) => {
								setSearchInput(e.target.value);
							}}
						/>
					</div>
					<div className='flex items-center gap-6 md:gap-2 flex-wrap'>
						<div className='flex items-center gap-2'>
							<p className='text-xs md:text-sm'>Category:</p>
							<SelectDropdown
								value={selectedTaskFilter.category}
								onChange={(val) => {
									setSelectedTaskFilter({
										...selectedTaskFilter,
										category: val as "All" | "Personal" | "Work",
									});
								}}
								isRounded={false}
								options={[
									{ id: 1, name: "All" },
									{ id: 2, name: "Personal" },
									{ id: 3, name: "Work" },
								]}
							/>
						</div>
						<div className='flex items-center gap-2'>
							<p className='text-xs md:text-sm'>Priority:</p>
							<SelectDropdown
								value={selectedTaskFilter.priority}
								onChange={(val) => {
									setSelectedTaskFilter({
										...selectedTaskFilter,
										priority: val as "All" | "High" | "Medium" | "Low",
									});
								}}
								isRounded={false}
								options={[
									{ id: 1, name: "All" },
									{ id: 2, name: "High" },
									{ id: 3, name: "Medium" },
									{ id: 4, name: "Low" },
								]}
							/>
						</div>
						<button
							// onClick={() => setShowFinanceModal(true)}
							className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border py-2 px-6 min-w-[100px] rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out'>
							<span>Add Task</span>
							<MdOutlineArrowOutward className='text-lg' />
						</button>
					</div>
				</div>
				<TaskFilter />
			</div>

			<div
				className={`flex items-start ${
					filteredTasks.length > 3 ? "justify-center" : "justify-start"
				} gap-5 flex-wrap max-h-[400px] overflow-y-auto pr-3 py-4`}>
				{filteredTasks.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}
			</div>
			{filteredTasks.length === 0 && (
				<div
					// onClick={() => setShowFinanceModal(true)}
					className='flex flex-col items-center gap-2 mt-4'>
					<div className='h-20 w-20 rounded-[20px] p-2 bg-foreground flex justify-center items-center active:scale-95 cursor-pointer transition-all duration-300 ease-in-out'>
						<PiStackPlusFill className='text-background text-4xl' />
					</div>
					<p className='text-sm'>No tasks found</p>
				</div>
			)}
		</div>
	);
};

export default TaskManagerScreen;
