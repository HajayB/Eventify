import axios from "axios";
import axiosInstance from "../../services/axiosInstance";


export type PaginationType = {
  totalEvents: number;
  page: number;
  limit: number;
  totalPages: number;
}
type GetEventsResponse = {
  events: EventsType[];
  pagination:PaginationType;
};
export type CurrentEventsResponse = {
  activeEvents: EventsType[];
  pagination: PaginationType;
}

export type OldEventsResponse = {
  pastEvents: EventsType[];
  pagination: PaginationType;
}

export type GetCreatorEventsResponse = {
  CurrentEvents: CurrentEventsResponse;
  OldEvents: OldEventsResponse;
}
export type EventsType = {
  _id: string;
  eventId: string;
  coverImage: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  price: number;
  totalTickets: number;
  ticketsSold: number;
  maxTicketsPerPurchase: number;
  map: any;
};

export type GuestTodayEventsResponse = {
  events: EventsType[];
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const eventsUrl = baseUrl + "/events";
const creatorEventsUrl = baseUrl + "/events/creator/me";
const paymentsUrl = baseUrl + "/payments";

export async function getEvents(page: number = 1, search:string=""): Promise<GetEventsResponse> {

  const response = await axios.get(eventsUrl, {
    params: { page, search, }
  });

  
  return {
    events: response.data.data,
    pagination: response.data.meta
  };
}

export async function getEventById(id: string): Promise<EventsType> {
  const response = await axiosInstance.get(`${eventsUrl}/${id}`);
  return response.data;
}

export async function updateEvent(
  id: string,
  body: {
    title?: string;
    description?: string;
    location?: string;
    price?: number;
    totalTickets?: number;
    startTime?: string;
    endTime?: string;
    coverImage?: string;
    maxTicketsPerPurchase?: number;
  }
): Promise<EventsType> {
  const response = await axiosInstance.put(`${eventsUrl}/${id}`, body);
  return response.data;
}

export async function deleteEvent(id: string): Promise<void> {
  await axiosInstance.delete(`${eventsUrl}/${id}`);
}

export async function initializePayment(data: {
  eventId: string;
  quantity: number;
  email: string;
}): Promise<{ authorizationUrl: string; reference: string }> {
  const response = await axiosInstance.post(`${paymentsUrl}/initialize`, data);
  return response.data;
}

export async function scanTicket(body: {
  qrPayload: string;
  eventId: string;
}): Promise<{ valid: boolean; message: string; scannedAt?: string }> {
  const response = await axiosInstance.post(`${baseUrl}/tickets/scan`, body);
  return response.data;
}
 
export async function createEvent(body: {
  title: string;
  description: string;
  location: string;
  price?: number;
  totalTickets?: number;
  startTime?: string;
  endTime?: string;
  coverImage?: string;
  maxTicketsPerPurchase?: number;
}): Promise<{ message: string; id: string }> {
  const response = await axiosInstance.post(eventsUrl, body);
  return response.data;
}

export async function getCreatorEvents(page: number = 1, search: string = ""): Promise<GetCreatorEventsResponse> {
  try {
    const response = await axiosInstance.get(creatorEventsUrl, {
      params: { page, search }
    });

    return {
      CurrentEvents: {
        activeEvents: response.data.CurrentEvents.activeEvents,
        pagination: response.data.CurrentEvents.pagination
      },
      OldEvents: {
        pastEvents: response.data.OldEvents.pastEvents,
        pagination: response.data.OldEvents.pagination
      }
    };

  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function getTodayEvents(): Promise<EventsType[]> {
  const response = await axios.get(`${eventsUrl}/today`);
  return response.data.events;
}

export async function guestInitializePayment(data: {
  eventId: string;
  quantity: number;
  email: string;
}): Promise<{ authorizationUrl: string; reference: string }> {
  const response = await axios.post(`${paymentsUrl}/guest/initialize`, data);
  return response.data;
}

export async function guestResendTicket(data: {
  email: string;
  reference: string;
}): Promise<{ message: string }> {
  const response = await axios.post(`${paymentsUrl}/guest/resend`, data);
  return response.data;
}

