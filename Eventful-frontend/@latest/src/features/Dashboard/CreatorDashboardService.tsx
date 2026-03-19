import axios from "axios";

type UpcomingEvents = {
    eventId: string,
    title:string,
    startTime: string,
    ticketsSold: number,
    capacityFilled: number,
}
type CheckedIn={
    eventId: string,
    title:string,
    ticketsSold:number,
    checkedIn:number
}
type EventAttention = {
    eventId:string,
    title:string,
    ticketsSold:number,
    daysLeft:number,
    capacityPercent:number,
}
type RecentActivity = {
    eventTitle:string,
    purchasedAt:string,
}
export type GetCreatorResponse ={
    userName :string, 
    stats:Record<string, number>,
    upComingEvents:UpcomingEvents[],
    checkInSummary:CheckedIn[],
    eventsNeedingAttention:EventAttention[],
    recentActivity:RecentActivity[],
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const creatorUrl = baseUrl +"/dashboard/creator";



export async function CreatorDashboardData ():Promise<GetCreatorResponse>{
    const token = localStorage.getItem("creatorToken") || sessionStorage.getItem("creatorToken");
if (!token){
    alert("No token provided");
    window.location.href = "http://localhost:5173"

}

const headers = {
    "Content-Type":"application/json",
    Authorization:`Bearer ${token}`
}
    const response = await axios.get(creatorUrl, {headers});

    return {
        userName:response.data.userName,
        stats:response.data.stats,
        upComingEvents:response.data.upcomingEvents,
        checkInSummary:response.data.checkInSummary,
        eventsNeedingAttention:response.data.eventsNeedingAttention,
        recentActivity:response.data.recentActivity
    }
}

