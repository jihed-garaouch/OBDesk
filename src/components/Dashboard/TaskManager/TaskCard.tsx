import { UseTaskManager, type Task } from "@/context/TaskManagerContext";
import { UseTheme } from "@/context/ThemeContext";
import { FaCheck, FaEdit } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

interface TaskCardProps {
	task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
	const { theme } = UseTheme();
	const { setTasks } = UseTaskManager();

	const isDark = theme === "dark";

	const priorityColor = {
		High: {
			pillBg: isDark ? "bg-red-500/25" : "bg-red-500/10",
			textColor: "text-red-500",
			labelBg: "bg-red-500",
		},
		Medium: {
			pillBg: isDark ? "bg-yellow-500/25" : "bg-yellow-500/15",
			textColor: "text-yellow-600",
			labelBg: "bg-yellow-500",
		},
		Low: {
			pillBg: isDark ? "bg-green-500/25" : "bg-green-500/10",
			textColor: "text-green-500",
			labelBg: "bg-green-500",
		},
	};

	const categoryColor = {
		Personal: {
			pillBg: isDark ? "bg-blue-500/30" : "bg-blue-500/10",
			textColor: isDark ? "text-blue-300" : "text-blue-500",
			labelBg: "bg-blue-500",
		},
		Work: {
			pillBg: isDark ? "bg-purple-500/30" : "bg-purple-500/10",
			textColor: isDark ? "text-purple-300" : "text-purple-500",
			labelBg: "bg-purple-500",
		},
	};

	return (
		<div
			className={`group relative flex gap-3 bg-background border w-full md:w-fit p-5 rounded-xl border-foreground/30 md:min-w-[300px] md:max-w-[320px] ${
				isDark
					? "shadow-[inset_0_2px_10px_rgba(255,255,255,0.10),0_2px_8px_rgba(0,0,0,0.16)]"
					: "shadow-[0_3px_10px_rgba(0,0,0,0.16)]"
			}`}>
			{/* Custom Checkbox */}
			<div
				onClick={() =>
					setTasks((t) =>
						t.map((t) =>
							t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
						)
					)
				}
				className='flex-shrink-0'>
				<div
					className={`flex items-center justify-center border-2 ${
						task.isCompleted
							? "bg-blue-500 border-blue-500/40 hover:border-blue-500/60"
							: "bg-background border-foreground/40 hover:border-foreground/60"
					} p-[3px] rounded-md h-5 w-5 cursor-pointer transition-colors duration-150 mt-1`}>
					<FaCheck
						className={`${task.isCompleted ? "block text-white" : "hidden"}`}
					/>
				</div>
			</div>

			<div className='flex-1'>
				<h3
					className={`text-lg font-semibold text-foreground leading-tight mb-2 line-clamp-1 ${
						task.isCompleted ? "line-through" : ""
					}`}>
					{task.title}
				</h3>
				{task.description && (
					<p
						className={`text-sm text-foreground/90 mb-2.5 line-clamp-2 ${
							task.isCompleted ? "line-through" : ""
						}`}>
						{task.description}
					</p>
				)}

				<div className='flex items-center gap-2 text-[10px] md:text-xs mt-1 font-light mb-3 text-foreground/80'>
					<p className='flex items-center gap-[2px]'>
						<FiCalendar size={12} /> <span>{task.date}</span>
					</p>
					<p className='bg-foreground h-[4px] w-[4px] rounded-full mt-[2px]'></p>
					<p>{task.time}</p>
				</div>

				<div className='flex flex-wrap gap-2 items-center'>
					{/* Priority Badge */}
					<span
						className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-normal rounded-md ${
							priorityColor[task.priority].pillBg
						} ${priorityColor[task.priority].textColor}`}>
						<span
							className={`w-[4px] h-[4px] rounded-full ${
								priorityColor[task.priority].labelBg
							}`}></span>
						{task.priority} Priority
					</span>

					{/* Category Badge */}
					<span
						className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-normal rounded-md ${
							categoryColor[task.category].pillBg
						} ${categoryColor[task.category].textColor}`}>
						<span
							className={`w-[4px] h-[4px] rounded-full ${
								categoryColor[task.category].labelBg
							}`}></span>
						{task.category}
					</span>

					{/* Client/Project badges when Category = Work */}
					{task.category === "Work" && (
						<>
							<p
								className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-normal rounded-md ${
									categoryColor[task.category].pillBg
								} ${categoryColor[task.category].textColor}`}>
								<span
									className={`w-[4px] h-[4px] rounded-full ${
										categoryColor[task.category].labelBg
									}`}></span>
								<span className='max-w-[100px] truncate'>{task.client}</span>
							</p>
							<p
								className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-normal rounded-md ${
									categoryColor[task.category].pillBg
								} ${categoryColor[task.category].textColor}`}>
								<span
									className={`w-[4px] h-[4px] rounded-full ${
										categoryColor[task.category].labelBg
									}`}></span>
								<span className='max-w-[100px] truncate'>
									{task.projectName}
								</span>
							</p>
						</>
					)}
				</div>
				<div className='mt-4 flex gap-2'>
					<button
						className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-normal rounded-md bg-black border border-white/50 text-white cursor-pointer active:scale-[0.95] transition-all duration-300 ease-in-out`}>
						<FaEdit />
						<span className='max-w-[100px] truncate'>Edit</span>
					</button>
					<button
						className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-normal rounded-md bg-red-500 text-white cursor-pointer active:scale-[0.95] transition-all duration-300 ease-in-out`}>
						<MdDelete />
						<span className='max-w-[100px] truncate'>Delete</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default TaskCard;
