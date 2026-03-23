import axios from "axios";

type GetEventsResponse = {
  events: EventsType[];
  pagination:any;
};

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
  map: any;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const eventsUrl = baseUrl + "/events";

export async function getEvents(page: number = 1, search:string=""): Promise<GetEventsResponse> {

  const response = await axios.get(eventsUrl, {
    params: { page, search }
  });

  
  return {
    events: response.data.data,
    pagination: response.data.meta
  };
}

