import AddTaskModal from "@/components/Dashboard/TaskManager/AddTaskModal";
import DeleteTaskModal from "@/components/Dashboard/TaskManager/DeleteTaskModal";
import TaskCard from "@/components/Dashboard/TaskManager/TaskCard";
import ViewTaskModal from "@/components/Dashboard/TaskManager/ViewTaskModal";
import Input from "@/components/ui/Input";
import SelectDropdown from "@/components/ui/SelectDropdown";
import { UseTaskManager, type Task } from "@/context/TaskManagerContext";
import { parseReadableDateToInput, stripTime } from "@/utils";
import { MdOutlineArrowForward, MdOutlineArrowOutward } from "react-icons/md";
import { PiStackPlusFill } from "react-icons/pi";
import { Link } from "react-router-dom";

const MiniTaskManager = () => {
	const {
		searchInput,
		setSearchInput,
		tasks,
		selectedTaskFilter,
		setSelectedTaskFilter,
		showAddTaskModal,
		setShowAddTaskModal,
		showViewTaskModal,
		setShowViewTaskModal,
		showDeleteTaskModal,
		setShowDeleteTaskModal,
		selectedTask,
		setIsAddTask,
		handleDeleteTask,
	} = UseTaskManager();

	const isTaskInActiveFilter = (task: Task, filterName: string) => {
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

		const matchesActiveFilter = isTaskInActiveFilter(task, "Today");

		return (
			matchesSearch && matchesCategory && matchesPriority && matchesActiveFilter
		);
	});

	const todayTasks = () => {
		const today = stripTime(new Date());
		return tasks.filter((task) => {
			const taskDate = stripTime(new Date(parseReadableDateToInput(task.date)));
			return taskDate.getTime() === today.getTime() && !task.isCompleted;
		});
	};

	return (
		<div className='h-full'>
			<div className='max-w-full mx-auto mb-2'>
				<div className='flex flex-col gap-2 items-center'>
					<p className='text-lg lg:text-xl font-medium text-center'>
						You’ve got {todayTasks().length} tasks scheduled for today.
					</p>
					<p className='text-xs lg:text-sm'>
						Stay focused — you’ve got this. 💪
					</p>
				</div>

				<div className='flex-[1] mt-2 md:w-[80%] mx-auto'>
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
				<div className='flex items-center justify-center gap-3 md:gap-4 flex-wrap mt-4 w-full xl:w-[70%] mx-auto'>
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
						onClick={() => {
							setShowAddTaskModal(true);
							setIsAddTask(true);
						}}
						className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border py-2 px-4 md:px-6 min-w-[100px] rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out'>
						<span>Add Task</span>
						<MdOutlineArrowOutward className='text-lg' />
					</button>
					<Link
						to='/dashboard/task-manager'
						className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border py-2 px-4 md:px-6 min-w-[100px] rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out'>
						<span>View all</span>
						<MdOutlineArrowForward className='text-lg' />
					</Link>
				</div>
			</div>

			<div
				className={`flex items-start justify-center gap-5 flex-wrap max-h-[400px] md:max-h-[600px] overflow-y-auto pr-3 py-4`}>
				{filteredTasks.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}
			</div>
			{filteredTasks.length === 0 && (
				<div
					onClick={() => {
						setIsAddTask(true);
						setShowAddTaskModal(true);
					}}
					className='flex flex-col items-center gap-2 w-fit mx-auto mt-4'>
					<div className='h-20 w-20 rounded-[20px] p-2 bg-foreground flex justify-center items-center active:scale-95 cursor-pointer transition-all duration-300 ease-in-out'>
						<PiStackPlusFill className='text-background text-4xl' />
					</div>
					<p className='text-sm'>No tasks found</p>
				</div>
			)}

			<ViewTaskModal
				isOpen={showViewTaskModal}
				onClose={() => {
					setShowViewTaskModal(false);
				}}
			/>
			<AddTaskModal
				isOpen={showAddTaskModal}
				onClose={() => {
					setShowAddTaskModal(false);
				}}
			/>
			<DeleteTaskModal
				isOpen={showDeleteTaskModal}
				onClose={() => {
					setShowDeleteTaskModal(false);
				}}
				onDeleteTask={handleDeleteTask}
				taskToBeDeleted={selectedTask || ({} as Task)}
			/>
		</div>
	);
};

export default MiniTaskManager;
