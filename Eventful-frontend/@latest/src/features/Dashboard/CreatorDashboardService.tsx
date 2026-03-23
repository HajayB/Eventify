import axiosInstance from "../../services/axiosInstance";
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
    // quantity:number,
    amount:number,
    summary:string,
}
export type GetCreatorResponse ={
    userName :string, 
    stats:Record<string, number>,
    upComingEvents:UpcomingEvents[],
    checkInSummary:CheckedIn[],
    eventsNeedingAttention:EventAttention[],
    recentActivity:RecentActivity[],
} 
export async function CreatorDashboardData(): Promise<GetCreatorResponse> {
  try {
    const response = await axiosInstance.get("/creator/dashboard");

    return {
      userName: response.data.userName,
      stats: response.data.stats,
      upComingEvents: response.data.upcomingEvents,
      checkInSummary: response.data.checkInSummary,
      eventsNeedingAttention: response.data.eventsNeedingAttention,
      recentActivity: response.data.recentActivity,
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}