import { useEffect, useState } from "react";
import {EventeeDashboardData, type GetEventeeResponse } from "./EventeeDashboardService"
function EventeeDashboard(){

    const [eventeeData, setEventeeData] = useState<GetEventeeResponse[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadEventeeData(){
        setLoading(true);
        const result:any = await EventeeDashboardData();
        console.log(result);
        setEventeeData(result)
        setLoading(false)
    }

    useEffect(()=>{
        loadEventeeData();
    },[])


  if (loading) {
    return <p>Loading events...</p>;
  }
    return(
        <div>

        </div>
    )
}

export default EventeeDashboard