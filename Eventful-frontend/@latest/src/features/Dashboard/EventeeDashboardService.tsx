import axiosInstance from "../../services/axiosInstance";
type UpcomingEvent = {
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
    upcomingEvents:UpcomingEvent[],
    stats:Stats,
    paymentHistory:PaymentHistory[],
}

export async function EventeeDashboardData ():Promise<GetEventeeResponse>{
    try{
        const response = await axiosInstance.get("/dashboard");
        return {
            userName:response.data.userName,
            upcomingEvents:response.data.upcomingEvents,
            stats:response.data.stats,
            paymentHistory:response.data.paymentHistory,
        }
    }catch (error: any) {
    console.log(error);
    throw error;
  }
}