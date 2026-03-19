import axios from "axios";

type UpcomingEvents = {
    eventId: string,
    title:string,
    location:string,
    startTime: string,
    endTime: string,
    ticketCount: number,
}
type Stats={
    ticketsOwned:number,
    eventsAttended:number
}
type PaymentHistory = {
    amount:number,
    reference:string,
    quantity:number,
    paidAt:string,
    eventTitle:string,
    eventDate:string,
}
export type GetEventeeResponse ={
    userName :string, 
    upComingEvents:UpcomingEvents[],
    stats:Stats[],
    paymentHistory:PaymentHistory[],
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const eventeeUrl = baseUrl +"/dashboard";



export async function EventeeDashboardData ():Promise<GetEventeeResponse>{
    const token = localStorage.getItem("eventeeToken") || sessionStorage.getItem("eventeeToken");
if (!token){
    alert("No token provided");
    window.location.href = "http://localhost:5173"

}

const headers = {
    "Content-Type":"application/json",
    Authorization:`Bearer ${token}`
}
    const response = await axios.get(eventeeUrl, {headers});

    return {
        userName:response.data.userName,
        upComingEvents:response.data.upcomingEvents,
        stats:response.data.stats,
        paymentHistory:response.data.paymentHistory,
    }
}