import { useEffect, useState } from "react";
import {CreatorDashboardData, type GetCreatorResponse } from "./CreatorDashboardService";
import MiniCard from "../../services/MiniCards";
import ActivityCard from "../../services/ActivityCard";
import Sidebar from "../../services/sideBar";
import { creatorMenu } from "../../services/sideBarData";
import styles from "./creatorDashboard.module.css"
function CreatorDashboard(){

    const [creatorData, setCreatorData] = useState<GetCreatorResponse| null>(null);
    const [loading, setLoading] = useState(true);

    async function loadCreatorData(){
        setLoading(true);
        const result:any = await CreatorDashboardData();
        setCreatorData(result)
        setLoading(false)
    }
    useEffect(()=>{
        loadCreatorData();
    },[])

    if (!creatorData) return <p>Loading...</p>;
  if (loading) {
    return <p>Loading ...</p>;
  }
    return(
    <div className={styles.container}>
        <Sidebar menu={creatorMenu}/>
        <main className={styles.content}>
            <h3 className={styles.usernameH3}>Welcome, {creatorData.userName}</h3>
            <div className={styles.statSection}> 
                <MiniCard title="Events Created" icon={"📺"} value={creatorData.stats.eventsCreated}/>
                <MiniCard title="Tickets Sold" icon={"🎟️"} value={creatorData.stats.ticketsSold}/>
                <MiniCard title="Upcoming Events" icon={"⏰"} value={creatorData.stats.upcomingEvents}/>
            </div>
        <h3 className={styles.h3Headers}>Upcoming Events</h3>
            <div className={styles.upcomingEventsSection}> 
                
                {creatorData.upComingEvents.map((event) => (
                <MiniCard
                    key={event.eventId}
                    title={event.title}
                    value={`${event.ticketsSold} tickets sold`}
                    subtitle={new Date(event.startTime).toLocaleDateString()}
                >
                    <p>Capacity Filled: {event.capacityFilled}%</p>
                </MiniCard>
                ))}
            </div>
            <h3 className={styles.h3Headers}>Recent Activities </h3>    
            <div className={styles.recentActivitySection}>
                {creatorData.recentActivity.map((activity) => (
                <ActivityCard
                    key={`${activity.eventTitle} - ?${activity.purchasedAt}`}
                    icon={"‣"}
                    
                    summary={`${activity.summary}` }
                    eventTitle={` ${activity.eventTitle}`}
                    amount={activity.amount} 
                    date={new Date(activity.purchasedAt).toLocaleDateString()}
                    
                >
                </ActivityCard>
                ))}
            </div>
            
            
            
            
        </main>
        </div>
    )
}

export default CreatorDashboard