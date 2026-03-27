import axiosInstance from "../../services/axiosInstance";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const analyticsUrl = baseUrl + "/stats";

export type AllTimeAnalytics = {
  totalTicketsSold: number;
  totalRevenue: number;
  totalAttendees: number;
  totalUnusedTickets: number;
};

export type PerEventPaymentAnalytics = {
  eventId: string;
  title: string;
  revenue: number;
  payments: number;
  ticketsSold: number;
};

export type PaymentAnalytics = {
  totalRevenue: number;
  totalPayments: number;
  totalTicketsSold: number;
  perEvent: PerEventPaymentAnalytics[];
};

export type EventAnalytics = {
  ticketsSold: number;
  revenue: number;
  qrVerified: number;
  qrUnverified: number;
};

export async function getCreatorAllTimeAnalytics(): Promise<AllTimeAnalytics> {
  const response = await axiosInstance.get(`${analyticsUrl}/creator`);
  return response.data;
}

export async function getCreatorPaymentAnalytics(): Promise<PaymentAnalytics> {
  const response = await axiosInstance.get(`${analyticsUrl}/creator/payments`);
  return response.data;
}

export async function getCreatorEventAnalytics(eventId: string): Promise<EventAnalytics> {
  const response = await axiosInstance.get(`${analyticsUrl}/creator/${eventId}`);
  return response.data;
}
