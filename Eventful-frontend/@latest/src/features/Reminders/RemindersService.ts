import axiosInstance from "../../services/axiosInstance";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const notificationsUrl = `${baseUrl}/notifications`;

export type ReminderEvent = {
  _id: string;
  title: string;
  location: string;
  startTime: string;
};

export type Reminder = {
  _id: string;
  email: string;
  remindAt: string;
  event: ReminderEvent;
  isSent: boolean;
  sentAt?: string;
  status: "SENT" | "PENDING";
};

export async function getUserReminders(): Promise<Reminder[]> {
  const response = await axiosInstance.get(`${notificationsUrl}/reminder/me`);
  return response.data.reminders;
}

export async function createReminder(data: {
  eventId: string;
  remindAt: string;
}): Promise<void> {
  await axiosInstance.post(`${notificationsUrl}/reminder`, data);
}
