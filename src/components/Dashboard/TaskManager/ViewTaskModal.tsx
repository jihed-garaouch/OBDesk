import { UseTaskManager } from "@/context/TaskManagerContext";
import { UseTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";

const ViewTaskModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const { selectedTask, setShowAddTaskModal, setShowDeleteTaskModal } =
		UseTaskManager();
	const { theme } = UseTheme();
	const isDark = theme === "dark";

	const [visible, setVisible] = useState(false);
	const [animateIn, setAnimateIn] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setVisible(true);

			setTimeout(() => setAnimateIn(true), 20);
		} else {
			setAnimateIn(false);
			setTimeout(() => setVisible(false), 300);
		}
	}, [isOpen]);

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

	if (!visible) return null;

	return (
		<div
			onClick={onClose}
			className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end items-center z-[999] md:p-2 overflow-hidden'>
			<div
				onClick={(e) => e.stopPropagation()}
				className={`
                    h-full w-full max-w-[600px] bg-background border border-foreground/20 border-foreground-20 rounded-lg relative shadow-xl
                    transition-all duration-300 ease-in-out

                    ${
											animateIn
												? "translate-x-0 opacity-100"
												: "translate-x-[120%] opacity-0"
										}
                `}>
				{/* Modal content */}
				<div className='py-5 px-4 flex flex-col h-full min-h-0'>
					<div className='flex items-center justify-between text-2xl'>
						<span onClick={onClose} className='cursor-pointer'>
							<IoClose />
						</span>
						<div className='flex items-center gap-3'>
							<span
								onClick={() => {
									onClose();
									setShowAddTaskModal(true);
								}}
								className='cursor-pointer'>
								<MdOutlineEdit />
							</span>
							<span
								onClick={() => {
									onClose();
									setShowDeleteTaskModal(true);
								}}
								className='cursor-pointer'>
								<MdDeleteOutline />
							</span>
						</div>
					</div>

					<div className='mt-7 flex flex-col flex-1 min-h-0'>
						<h2 className='text-3xl font-bold mb-5'>Task Details</h2>
						{/* Task details */}
						<div className='flex flex-col gap-3 text-sm overflow-y-auto flex-1 min-h-0'>
							<div className='flex items-start border-b border-foreground/30 border-foreground-30 pb-3 gap-4'>
								<p className='flex-[1]'>Task name:</p>
								<p className='flex-[3]'>{selectedTask?.title}</p>
							</div>
							{selectedTask?.description && (
								<div className='flex items-start border-b border-foreground/30 border-foreground-30 pb-3 gap-4'>
									<p className='flex-[1]'>Task description:</p>
									<p className='flex-[3]'>{selectedTask?.description}</p>
								</div>
							)}
							<div className='flex items-center border-b border-foreground/30 border-foreground-30 pb-3 gap-4'>
								<p className='flex-[1]'>Priority:</p>
								<p className='flex-[3]'>
									{selectedTask?.priority && (
										<span
											className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-normal rounded-md ${
												priorityColor[selectedTask.priority].pillBg
											} ${priorityColor[selectedTask.priority].textColor}`}>
											{selectedTask.priority}
										</span>
									)}
								</p>
							</div>
							<div className='flex items-center border-b border-foreground/30 border-foreground-30 pb-3 gap-4'>
								<p className='flex-[1]'>Category:</p>
								<p className='flex-[3]'>
									{selectedTask?.category && (
										<span
											className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-normal rounded-md ${
												categoryColor[selectedTask.category].pillBg
											} ${categoryColor[selectedTask.category].textColor}`}>
											{selectedTask.category}
										</span>
									)}
								</p>
							</div>
							{selectedTask?.category === "Work" && (
								<>
									<div className='flex items-center border-b border-foreground/30 border-foreground-30 pb-3 gap-4'>
										<p className='flex-[1]'>Client:</p>
										<p className='flex-[3]'>
											{selectedTask?.category && (
												<span
													className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-normal rounded-md ${
														categoryColor[selectedTask.category].pillBg
													} ${categoryColor[selectedTask.category].textColor}`}>
													{selectedTask.client}
												</span>
											)}
										</p>
									</div>
									<div className='flex items-center border-b border-foreground/30 border-foreground-30 pb-3 gap-4'>
										<p className='flex-[1]'>Project Name:</p>
										<p className='flex-[3]'>
											{selectedTask?.category && (
												<span
													className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-normal rounded-md ${
														categoryColor[selectedTask.category].pillBg
													} ${categoryColor[selectedTask.category].textColor}`}>
													{selectedTask.projectName}
												</span>
											)}
										</p>
									</div>
								</>
							)}
							<div className='flex items-center border-b border-foreground/30 border-foreground-30 pb-3 gap-4'>
								<p className='flex-[1]'>Due Date:</p>
								<p className='flex-[3]'>{selectedTask?.date}</p>
							</div>
							<div className='flex items-center border-b border-foreground/30 border-foreground-30 pb-3 gap-4'>
								<p className='flex-[1]'>Due Time:</p>
								<p className='flex-[3]'>{selectedTask?.time}</p>
							</div>
							<div className='flex items-center border-b border-foreground/30 border-foreground-30 pb-3 gap-4'>
								<p className='flex-[1]'>Reminder:</p>
								<p className='flex-[3]'>
									<span
										className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-normal rounded-md ${
											selectedTask?.hasReminder
												? "bg-emerald-500"
												: "bg-red-500"
										} text-white`}>
										{selectedTask?.hasReminder ? "On" : "Off"}
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewTaskModal;
