import axiosInstance from "../../services/axiosInstance";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// ── TYPES ──────────────────────────────────────────────────────────────────

export type EventSummary = {
  _id: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  price: number;
};

export type PaidEvent = {
  _id: string;
  eventId: EventSummary;
  amount: number;
  quantity: number;
  email: string;
  reference: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
};

export type AttendedEvent = {
  _id: string;
  eventId: EventSummary;
  eventeeId: string;
  isScanned: true;
  scannedAt: string;
  createdAt: string;
  status: "USED";
  hasQr: false;
};

export type UnattendedEvent = {
  _id: string;
  eventId: EventSummary;
  eventeeId: string;
  isScanned: false;
  createdAt: string;
  status: "UNUSED";
  hasQr: true;
};

export type Ticket = {
  _id: string;
  paymentRef: string;
  createdAt: string;
  isScanned: boolean;
  eventId: EventSummary;
  status: "USED" | "UNUSED";
  hasQr: boolean;
};

// ── ANALYTICS ──────────────────────────────────────────────────────────────

export async function getPaidEvents(): Promise<PaidEvent[]> {
  const url = baseUrl+"/stats/eventee/paid";
  const res = await axiosInstance.get(url);
  return res.data;
}

export async function getAttendedEvents(): Promise<AttendedEvent[]> {
  const res = await axiosInstance.get(`${baseUrl}/stats/eventee/attended`);
  return res.data;
}

export async function getUnattendedEvents(): Promise<UnattendedEvent[]> {
  const res = await axiosInstance.get(`${baseUrl}/stats/eventee/unattended`);
  return res.data;
}

// ── TICKETS ────────────────────────────────────────────────────────────────

export async function getMyTickets(status?: "used" | "unused"): Promise<Ticket[]> {
  const url = status
    ? `${baseUrl}/tickets/me?status=${status}`
    : `${baseUrl}/tickets/me`;
  const res = await axiosInstance.get(url);
  return res.data;
}

export async function getTicketQr(ticketId: string): Promise<string> {
  const res = await axiosInstance.get(`${baseUrl}/tickets/${ticketId}/qr`);
  return res.data.qrPayload;
}

// ── PAYMENTS ───────────────────────────────────────────────────────────────

export type PaymentHistoryItem = {
  _id: string;
  amount: number;
  quantity: number;
  reference: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  paidAt: string;
  event: {
    _id: string;
    title: string;
    location: string;
    startTime: string;
  };
};

export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  const res = await axiosInstance.get(`${baseUrl}/payments/history`);
  return res.data.payments;
}

export async function resendTicket(paymentRef: string): Promise<void> {
  await axiosInstance.post(`${baseUrl}/payments/resend-ticket/${paymentRef}`);
}
