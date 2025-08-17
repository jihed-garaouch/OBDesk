import Input from "@/components/ui/Input";
import SelectDropdown from "@/components/ui/SelectDropdown";
import { UseTaskManager, type Task } from "@/context/TaskManagerContext";
import { UseTheme } from "@/context/ThemeContext";
import {
	formatReadableDate,
	formatReadableTime,
	parseReadableDateToInput,
	parseReadableTimeToInput,
} from "@/utils";
import { LoaderIcon } from "@/vectors/loader";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import z from "zod";

const AddTaskModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const {
		selectedTask,
		isAddTask,
		setIsAddTask,
		handleAddTask,
		handleEditTask,
	} = UseTaskManager();
	const { theme } = UseTheme();
	const isDark = theme === "dark";

	const taskSchema = z
		.object({
			title: z.string().min(1, "Task name is required"),
			description: z.string().optional(),
			date: z.string().min(1, "Due date is required"),
			time: z.string().min(1, "Due time is required"),
			priority: z.enum(["High", "Medium", "Low"], {
				message: "Priority is required",
			}),
			category: z.enum(["Personal", "Work"], {
				message: "Category is required",
			}),
			client: z.string().optional(),
			projectName: z.string().optional(),
			isCompleted: z.boolean(),
			hasReminder: z.boolean(),
		})
		.superRefine((data, ctx) => {
			if (data.category === "Work") {
				if (!data.client || data.client.trim() === "") {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Client is required",
						path: ["client"],
					});
				}
				if (!data.projectName || data.projectName.trim() === "") {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Project Name is required",
						path: ["projectName"],
					});
				}
			}
		});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isLoading, setIsLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [animateIn, setAnimateIn] = useState(false);

	const [taskFormDetails, setTaskFormDetails] = useState({
		id: "",
		title: "",
		description: "",
		date: "",
		time: "",
		priority: "High",
		category: "Personal",
		client: "",
		projectName: "",
		isCompleted: false,
		hasReminder: false,
	});

	useEffect(() => {
		if (isOpen) {
			setVisible(true);

			if (!isAddTask && selectedTask) {
				setTaskFormDetails({
					id: selectedTask.id,
					title: selectedTask.title,
					description: selectedTask.description || "",
					date: parseReadableDateToInput(selectedTask.date),
					time: parseReadableTimeToInput(selectedTask.time),
					priority: selectedTask.priority,
					category: selectedTask.category,
					client: selectedTask.client || "",
					projectName: selectedTask.projectName || "",
					isCompleted: selectedTask.isCompleted,
					hasReminder: selectedTask.hasReminder,
				});
			}

			setTimeout(() => setAnimateIn(true), 20);
		} else {
			setAnimateIn(false);
			setTimeout(() => {
				setVisible(false);
				setIsAddTask(false);
				setErrors({});
			}, 300);

			setTaskFormDetails({
				id: "",
				title: "",
				description: "",
				date: "",
				time: "",
				priority: "High",
				category: "Personal",
				client: "",
				projectName: "",
				isCompleted: false,
				hasReminder: false,
			});
		}
	}, [isOpen]);

	const handleEdit = async () => {
		const result = taskSchema.safeParse(taskFormDetails);
		if (!result.success) {
			const fieldErrors: { [key: string]: string } = {};
			result.error.issues.forEach((err) => {
				const key =
					err.path && err.path.length > 0 ? String(err.path[0]) : undefined;
				if (key) fieldErrors[key] = err.message;
			});
			setErrors(fieldErrors);
			return;
		}

		const formattedTaskDetails: Task = {
			...taskFormDetails,
			date: formatReadableDate(taskFormDetails.date),
			time: formatReadableTime(taskFormDetails.time),
			priority: taskFormDetails.priority as "High" | "Medium" | "Low",
			category: taskFormDetails.category as "Personal" | "Work",
		};

		setIsLoading(true);
		try {
			handleEditTask(formattedTaskDetails);
		} catch (err) {
			console.error("Failed to add task:", err);
		} finally {
			setTaskFormDetails({
				id: "",
				title: "",
				description: "",
				date: "",
				time: "",
				priority: "High",
				category: "Personal",
				client: "",
				projectName: "",
				isCompleted: false,
				hasReminder: false,
			});
			onClose();
			setIsLoading(false);
		}
	};

	const handleSubmit = () => {
		const result = taskSchema.safeParse(taskFormDetails);
		if (!result.success) {
			const fieldErrors: { [key: string]: string } = {};
			result.error.issues.forEach((err) => {
				const key =
					err.path && err.path.length > 0 ? String(err.path[0]) : undefined;
				if (key) fieldErrors[key] = err.message;
			});
			setErrors(fieldErrors);
			return;
		}

		const formattedTaskDetails: Task = {
			...taskFormDetails,
			id: crypto.randomUUID(),
			date: formatReadableDate(taskFormDetails.date),
			time: formatReadableTime(taskFormDetails.time),
			priority: taskFormDetails.priority as "High" | "Medium" | "Low",
			category: taskFormDetails.category as "Personal" | "Work",
		};

		setIsLoading(true);
		try {
			handleAddTask(formattedTaskDetails);
		} catch (err) {
			console.error("Failed to add task:", err);
		} finally {
			setTaskFormDetails({
				id: "",
				title: "",
				description: "",
				date: "",
				time: "",
				priority: "High",
				category: "Personal",
				client: "",
				projectName: "",
				isCompleted: false,
				hasReminder: false,
			});
			onClose();
			setIsLoading(false);
		}
	};

	const validateField = (
		field: string,
		value: unknown,
		allValues: typeof taskFormDetails
	) => {
		const partial = { ...allValues, [field]: value };
		const result = taskSchema.safeParse(partial);
		if (!result.success) {
			const issue = result.error.issues.find((err) => err.path[0] === field);
			return issue ? issue.message : "";
		}
		return "";
	};

	if (!visible) return null;

	return (
		<div
			onClick={onClose}
			className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end items-center z-[999] md:p-2 overflow-hidden'>
			<div
				onClick={(e) => e.stopPropagation()}
				className={`
                    h-full w-full max-w-[600px] bg-background border border-foreground/20 rounded-lg relative shadow-xl
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
					</div>

					<div className='mt-7 flex flex-col flex-1 min-h-0'>
						<h2 className='text-3xl font-bold mb-5'>
							{isAddTask ? "Add Task" : "Edit Task"}
						</h2>
						{/* Task details */}
						<div className='flex flex-col gap-3 text-sm overflow-y-auto flex-1 min-h-0 pr-3'>
							<div className='flex flex-col gap-1'>
								<p className='flex-[1]'>Task name:</p>
								<div className='flex-[3]'>
									<Input
										type='text'
										id='title'
										placeholder='E.g. Meeting with client'
										value={taskFormDetails?.title}
										onChange={(e) => {
											const value = e.target.value;
											setTaskFormDetails({
												...taskFormDetails,
												title: value,
											});
											setErrors((prev) => ({
												...prev,
												title: validateField("title", value, {
													...taskFormDetails,
													title: value,
												}),
											}));
										}}
									/>
									{errors.title && (
										<p className='text-xs text-red-500 mt-2'>{errors.title}</p>
									)}
								</div>
							</div>
							<div className='flex flex-col gap-1'>
								<p className='flex-[1]'>Task description: (Optional)</p>
								<div className='flex-[3]'>
									<Input
										type='text'
										id='description'
										placeholder='E.g. This meeting is about...'
										value={taskFormDetails?.description}
										onChange={(e) => {
											const value = e.target.value;
											setTaskFormDetails({
												...taskFormDetails,
												description: value,
											});
											setErrors((prev) => ({
												...prev,
												description: validateField("description", value, {
													...taskFormDetails,
													description: value,
												}),
											}));
										}}
									/>
									{errors.description && (
										<p className='text-xs text-red-500 mt-2'>
											{errors.description}
										</p>
									)}
								</div>
							</div>
							<div className='flex flex-col gap-1'>
								<p className='flex-[1]'>Priority:</p>
								<div className='flex-[3]'>
									<SelectDropdown
										value={taskFormDetails.priority}
										onChange={(val) => {
											setTaskFormDetails({ ...taskFormDetails, priority: val });
											setErrors((prev) => ({
												...prev,
												priority: validateField("priority", val, {
													...taskFormDetails,
													priority: val,
												}),
											}));
										}}
										isRounded={false}
										options={[
											{ id: 1, name: "High" },
											{ id: 2, name: "Medium" },
											{ id: 3, name: "Low" },
										]}
									/>
									{errors.priority && (
										<span className='text-xs text-red-500 mt-2'>
											{errors.priority}
										</span>
									)}
								</div>
							</div>
							<div className='flex flex-col gap-1'>
								<p className='flex-[1]'>Category:</p>
								<div className='flex-[3]'>
									<SelectDropdown
										value={taskFormDetails.category}
										onChange={(val) => {
											setTaskFormDetails({ ...taskFormDetails, category: val });
											setErrors((prev) => ({
												...prev,
												category: validateField("category", val, {
													...taskFormDetails,
													category: val,
												}),
											}));
										}}
										isRounded={false}
										options={[
											{ id: 1, name: "Personal" },
											{ id: 2, name: "Work" },
										]}
									/>
									{errors.category && (
										<span className='text-xs text-red-500 mt-2'>
											{errors.category}
										</span>
									)}
								</div>
							</div>
							{taskFormDetails.category === "Work" && (
								<>
									<div className='flex flex-col gap-1'>
										<p className='flex-[1]'>Client:</p>
										<div className='flex-[3]'>
											<Input
												type='text'
												id='client'
												placeholder='E.g. John Doe'
												value={taskFormDetails?.client}
												onChange={(e) => {
													const value = e.target.value;
													setTaskFormDetails({
														...taskFormDetails,
														client: value,
													});
													setErrors((prev) => ({
														...prev,
														client: validateField("client", value, {
															...taskFormDetails,
															client: value,
														}),
													}));
												}}
											/>
											{errors.client && (
												<p className='text-xs text-red-500 mt-2'>
													{errors.client}
												</p>
											)}
										</div>
									</div>
									<div className='flex flex-col gap-1'>
										<p className='flex-[1]'>Project Name:</p>
										<div className='flex-[3]'>
											<Input
												type='text'
												id='projectName'
												placeholder='E.g. Project A'
												value={taskFormDetails?.projectName}
												onChange={(e) => {
													const value = e.target.value;
													setTaskFormDetails({
														...taskFormDetails,
														projectName: value,
													});
													setErrors((prev) => ({
														...prev,
														projectName: validateField("projectName", value, {
															...taskFormDetails,
															projectName: value,
														}),
													}));
												}}
											/>
											{errors.projectName && (
												<p className='text-xs text-red-500 mt-2'>
													{errors.projectName}
												</p>
											)}
										</div>
									</div>
								</>
							)}
							<div className='flex flex-col gap-1'>
								<p className='flex-[1]'>Due Date:</p>
								<div className='flex-[3]'>
									<Input
										type='date'
										id='date'
										value={taskFormDetails?.date}
										onChange={(e) => {
											const value = e.target.value;
											setTaskFormDetails({
												...taskFormDetails,
												date: value,
											});
											setErrors((prev) => ({
												...prev,
												date: validateField("date", value, {
													...taskFormDetails,
													date: value,
												}),
											}));
										}}
									/>
									{errors.date && (
										<p className='text-xs text-red-500 mt-2'>{errors.date}</p>
									)}
								</div>
							</div>
							<div className='flex flex-col gap-1'>
								<p className='flex-[1]'>Due Time:</p>
								<div className='flex-[3]'>
									<Input
										type='time'
										id='time'
										value={taskFormDetails?.time}
										onChange={(e) => {
											const value = e.target.value;
											setTaskFormDetails({
												...taskFormDetails,
												time: value,
											});
											setErrors((prev) => ({
												...prev,
												time: validateField("time", value, {
													...taskFormDetails,
													time: value,
												}),
											}));
										}}
									/>
									{errors.time && (
										<p className='text-xs text-red-500 mt-2'>{errors.time}</p>
									)}
								</div>
							</div>
							<div className='flex flex-col gap-1'>
								<p className='flex-[1]'>Reminder:</p>
								<div className='flex-[3]'>
									<SelectDropdown
										value={taskFormDetails.hasReminder ? "On" : "Off"}
										onChange={(val) => {
											const booleanVal = val === "On" ? true : false;
											setTaskFormDetails({
												...taskFormDetails,
												hasReminder: booleanVal,
											});
											setErrors((prev) => ({
												...prev,
												hasReminder: validateField("hasReminder", booleanVal, {
													...taskFormDetails,
													hasReminder: booleanVal,
												}),
											}));
										}}
										isRounded={false}
										options={[
											{ id: 1, name: "On" },
											{ id: 2, name: "Off" },
										]}
									/>
								</div>
							</div>
							<button
								disabled={isLoading}
								type='button'
								onClick={selectedTask && !isAddTask ? handleEdit : handleSubmit}
								className={`active:scale-95 mt-5 w-full bg-foreground text-background px-4 py-2 rounded-[4px] cursor-pointer font-bold text-sm ${
									isDark ? "hover:bg-white" : "hover:bg-black"
								} transition-all duration-500 ease-in-out flex justify-center items-center`}>
								{isLoading ? (
									<LoaderIcon className='h-3 w-3 animate-spin stroke-background' />
								) : (
									"Submit"
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddTaskModal;
