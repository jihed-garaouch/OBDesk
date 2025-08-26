// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
	console.log("🚀 Function Triggered!");
	try {
		const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

		const { data: tasks, error: tasksError } = await supabase.rpc(
			"get_tasks_needing_notification"
		);

		if (tasksError) {
			console.error("RPC Error:", tasksError);
			throw tasksError;
		}

		console.log(`Tasks found: ${tasks?.length || 0}`);

		if (!tasks || tasks.length === 0) {
			return new Response(JSON.stringify({ message: "No tasks to process" }), {
				status: 200,
			});
		}

		// 2. GROUP SUBSCRIPTIONS BY TASK
		const taskMap = new Map();
		tasks.forEach((row) => {
			if (!taskMap.has(row.task_id)) {
				taskMap.set(row.task_id, {
					id: row.task_id,
					title: row.title,
					description: row.description,
					date: row.date, // Make sure these are returned by your RPC
					time: row.time,
					subs: [],
				});
			}
			taskMap.get(row.task_id).subs.push({
				endpoint: row.endpoint,
				p256dh: row.p256dh,
				auth: row.auth,
			});
		});

		const uniqueTasks = Array.from(taskMap.values());
		const successfulTaskIds = [];

		// Helper functions
		const formatReadableTime = (time24: string) => {
			if (!time24) return "";
			const [hourStr, minute] = time24.split(":");
			let hour = parseInt(hourStr, 10);
			const period = hour >= 12 ? "PM" : "AM";
			hour = hour % 12 || 12;
			return `${hour}:${minute} ${period}`;
		};

		const formatReadableDate = (dateString: string) => {
			const date = new Date(dateString);
			const day = date.getDate();
			const month = date.toLocaleString("en-US", { month: "long" });
			const year = date.getFullYear();
			const ordinal = [11, 12, 13].includes(day)
				? "th"
				: day % 10 === 1
				? "st"
				: day % 10 === 2
				? "nd"
				: day % 10 === 3
				? "rd"
				: "th";
			return `${day}${ordinal} ${month} ${year}`;
		};

		// 3. SEND PUSH NOTIFICATIONS
		const taskPromises = uniqueTasks.map(async (task) => {
			// FIXED: Moved body formatting INSIDE the loop so 'task' exists
			const truncatedDesc =
				task.description && task.description.length > 100
					? task.description.slice(0, 100) + "..."
					: task.description || "";

			const bodyText = truncatedDesc
				? `${truncatedDesc} | Due: ${formatReadableDate(
						task.date
				  )} - ${formatReadableTime(task.time)}`
				: `Due at ${formatReadableDate(task.date)} - ${formatReadableTime(
						task.time
				  )}`;

			const payload = JSON.stringify({
				title: `⏰ ${task.title}`,
				body: bodyText,
				taskId: task.id,
			});

			const pushPromises = task.subs.map(async (sub) => {
				try {
					await webpush.sendNotification(
						{
							endpoint: sub.endpoint,
							keys: { p256dh: sub.p256dh, auth: sub.auth },
						},
						payload,
						{
							vapidDetails: {
								subject: "mailto:pjinadu02@gmail.com",
								publicKey: VAPID_PUBLIC_KEY,
								privateKey: VAPID_PRIVATE_KEY,
							},
						}
					);
				} catch (err) {
					console.error(`Push failed for task ${task.id}:`, err.message);
					if (err.statusCode === 410 || err.statusCode === 404) {
						await supabase
							.from("push_subscriptions")
							.delete()
							.eq("endpoint", sub.endpoint);
					}
				}
			});

			await Promise.allSettled(pushPromises);
			successfulTaskIds.push(task.id);
		});

		await Promise.allSettled(taskPromises);

		// 4. BATCH UPDATE
		if (successfulTaskIds.length > 0) {
			await supabase
				.from("tasks")
				.update({ notification_sent: true })
				.in("id", successfulTaskIds);
		}

		return new Response(
			JSON.stringify({ success: true, processed: uniqueTasks.length }),
			{ status: 200 }
		);
	} catch (err) {
		// Enhanced logging to see WHY it failed
		console.error(
			`Push failed for task ${task.id}. Status: ${err.statusCode}. Message: ${err.message}`
		);

		// If the subscription is no longer valid, delete it so we don't try again next minute
		if (
			err.statusCode === 410 ||
			err.statusCode === 404 ||
			err.message.includes("410") ||
			err.message.includes("404")
		) {
			console.log(
				`🧹 Cleaning up expired subscription for endpoint: ${sub.endpoint.substring(
					0,
					30
				)}...`
			);
			await supabase
				.from("push_subscriptions")
				.delete()
				.eq("endpoint", sub.endpoint);
		}
	}
});
