import { UserAuth } from "@/context/AuthContext";
import { UseTaskManager, type Task } from "@/context/TaskManagerContext";
import { formatReadableDate, formatReadableTime } from "@/utils";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

interface MissedTask extends Task {
	notification_id?: string;
}

const MissedRemindersModal = () => {
	const { session } = UserAuth();
	const { setSelectedTask, setShowViewTaskModal } = UseTaskManager();
	const [missedReminders, setMissedReminders] = useState<MissedTask[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (session?.user) {
			checkMissedReminders();
		}
	}, [session]);

	const checkMissedReminders = async () => {
		if (!session?.user) return;

		const now = new Date();

		try {
			// Get tasks that had reminders, haven't been acknowledged, and are past due
			const { data, error } = await supabase
				.from("tasks")
				.select("*")
				.eq("user_id", session.user.id)
				.eq("has_reminder", true)
				.eq("notification_acknowledged", false)
				.eq("is_completed", false)
				.order("date", { ascending: false })
				.order("time", { ascending: false })
				.limit(10);

			if (error) {
				console.error("Failed to fetch missed reminders:", error);
				return;
			}

			// Filter to only show tasks that are actually past their due time
			const actuallyMissed = (data || []).filter((task) => {
				const taskDateTime = new Date(`${task.date}T${task.time}`);
				return taskDateTime.getTime() < now.getTime();
			});

			if (actuallyMissed.length > 0) {
				// Map to your Task type
				const mappedTasks: MissedTask[] = actuallyMissed.map((task) => ({
					id: task.id,
					title: task.title,
					description: task.description || "",
					date: formatReadableDate(task.date),
					time: formatReadableTime(task.time),
					priority: task.priority as "High" | "Medium" | "Low",
					category: task.category as "Personal" | "Work",
					client: task.client || "",
					projectName: task.project_name || "",
					isCompleted: task.is_completed,
					hasReminder: task.has_reminder,
				}));

				setMissedReminders(mappedTasks);
				setIsOpen(true);
			}
		} catch (err) {
			console.error("Error checking missed reminders:", err);
		}
	};

	const acknowledgeReminder = async (taskId: string) => {
		try {
			const { error } = await supabase
				.from("tasks")
				.update({ notification_acknowledged: true })
				.eq("id", taskId);

			if (error) {
				console.error("Failed to acknowledge reminder:", error);
				return;
			}

			// Remove from local state
			setMissedReminders((prev) => prev.filter((r) => r.id !== taskId));

			// Close modal if no more reminders
			if (missedReminders.length <= 1) {
				setIsOpen(false);
			}
		} catch (err) {
			console.error("Error acknowledging reminder:", err);
		}
	};

	const acknowledgeAll = async () => {
		try {
			const ids = missedReminders.map((r) => r.id);

			const { error } = await supabase
				.from("tasks")
				.update({ notification_acknowledged: true })
				.in("id", ids);

			if (error) {
				console.error("Failed to acknowledge all:", error);
				return;
			}

			setMissedReminders([]);
			setIsOpen(false);
		} catch (err) {
			console.error("Error acknowledging all:", err);
		}
	};

	const viewTask = (task: MissedTask) => {
		setSelectedTask(task);
		acknowledgeReminder(task.id);
		setTimeout(() => setShowViewTaskModal(true), 300);
	};

	if (!isOpen || missedReminders.length === 0) return null;

	return (
		<div
			onClick={acknowledgeAll}
			className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[990] p-4'>
			<div
				onClick={(e) => e.stopPropagation()}
				className='bg-background border border-foreground/20 border-foreground-20 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl'>
				{/* Header */}
				<div className='p-4 border-b border-foreground/20 border-foreground-20 flex items-center justify-between'>
					<div>
						<h2 className='text-xl font-bold'>⏰ Missed Reminders</h2>
						<p className='text-sm text-foreground/60 text-foreground-60 mt-1'>
							You have {missedReminders.length} missed reminder
							{missedReminders.length > 1 ? "s" : ""}
						</p>
					</div>
					<button
						onClick={acknowledgeAll}
						className='text-2xl hover:opacity-70 transition-opacity cursor-pointer'
						aria-label='Close and dismiss all'>
						<IoClose />
					</button>
				</div>

				{/* Reminders List */}
				<div className='flex-1 overflow-y-auto p-4 space-y-3'>
					{missedReminders.map((reminder) => (
						<div
							key={reminder.id}
							className='border border-foreground/20 border-foreground-20 rounded-lg p-4 hover:bg-foreground/2 hover:bg-foreground-2 cursor-pointer transition-colors'>
							<div className='flex flex-col md:flex-row items-start justify-between gap-3'>
								<div className='flex-1'>
									<h3 className='font-semibold line-clamp-2'>{reminder.title}</h3>
									{reminder.description && (
										<p className='text-sm text-foreground/70 text-foreground-70 mt-1 line-clamp-2'>
											{reminder.description}
										</p>
									)}
									<div className='flex flex-wrap items-center gap-2 mt-2 text-xs text-foreground/60 text-foreground-60'>
										<span>📅 {reminder.date}</span>
										<span>•</span>
										<span>🕐 {reminder.time}</span>
									</div>
									<div className='flex items-center gap-2 mt-2'>
										<span
											className={`text-xs px-2 py-1 rounded ${
												reminder.priority === "High"
													? "bg-red-500/20 text-red-600"
													: reminder.priority === "Medium"
													? "bg-yellow-500/20 text-yellow-600"
													: "bg-green-500/20 text-green-600"
											}`}>
											{reminder.priority}
										</span>
										<span className='text-xs px-2 py-1 rounded bg-foreground/10 bg-foreground-10'>
											{reminder.category}
										</span>
									</div>
								</div>
								<div className='flex flex-row md:flex-col gap-2'>
									<button
										onClick={() => viewTask(reminder)}
										className='text-xs px-3 py-1 bg-foreground text-background rounded whitespace-nowrap cursor-pointer'>
										View
									</button>
									<button
										onClick={() => acknowledgeReminder(reminder.id)}
										className='text-xs px-3 py-1 border border-foreground/20 border-foreground-20 rounded hover:bg-foreground/5 hover:bg-foreground-5 transition-colors whitespace-nowrap cursor-pointer'>
										Dismiss
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Footer */}
				<div className='p-4 border-t border-foreground/20 border-foreground-20'>
					<button
						onClick={acknowledgeAll}
						className='w-full py-2 bg-foreground text-background rounded-lg font-semibold cursor-pointer'>
						Dismiss All
					</button>
				</div>
			</div>
		</div>
	);
};

export default MissedRemindersModal;
