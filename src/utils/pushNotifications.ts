import { supabase } from "./supabase/supabaseClient";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
	if (!buffer) return "";
	const bytes = new Uint8Array(buffer);
	let binary = "";
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

export async function subscribeToPushNotifications(userId: string) {
  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  console.log("Subscribing to push notifications...");
  // 🔥 ALWAYS sync subscription to current user
  await supabase.from("push_subscriptions").upsert(
	  {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: arrayBufferToBase64(subscription.getKey("p256dh")),
      auth: arrayBufferToBase64(subscription.getKey("auth")),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" } // 👈 IMPORTANT CHANGE
);
console.log("Subscribed to push notifications...", subscription);

  return true;
}



export async function checkForMissedReminders(userId: string) {
	const now = new Date().toISOString();

	const { data, error } = await supabase
		.from("tasks")
		.select("*")
		.eq("user_id", userId)
		.eq("has_reminder", true)
		.eq("notification_acknowledged", false)
		.eq("is_completed", false)
		.lte("date", now.split("T")[0]) // Tasks from today or earlier
		.order("date", { ascending: false })
		.order("time", { ascending: false })
		.limit(10);

	if (error) {
		console.error("Failed to fetch missed reminders:", error);
		return [];
	}

	return data || [];
}

export async function acknowledgeNotification(taskId: string) {
	const { error } = await supabase
		.from("tasks")
		.update({ notification_acknowledged: true })
		.eq("id", taskId);

	if (error) {
		console.error("Failed to acknowledge notification:", error);
	}
}
