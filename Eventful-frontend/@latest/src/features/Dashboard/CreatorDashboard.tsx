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

  const demoData = [
  {
    eventId: "demo1",
    title: "Sample Event",
    ticketsSold: 120,
    checkedIn: 45,
  },
  {
    eventId: "demo2",
    title: "Another Event",
    ticketsSold: 80,
    checkedIn: 0,
  },
];
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
                    // icon={"‣"}
                    
                    summary={`◉ ${activity.summary}` }
                    eventTitle={` ${activity.eventTitle}`}
                    amount={activity.amount} 
                    date={new Date(activity.purchasedAt).toLocaleDateString()}
                    
                >
                </ActivityCard>
                ))}
            </div>

            <div className={styles.footSection}>

              <div className={styles.checkedIn}>
                <h3 className={styles.sectionTitle}>Checked In Summary 
                    <span className={styles.tooltip}>ⓘ<span className={styles.tooltipText}>
                    Live count of attendees checked in
                    </span></span>
                </h3>
                <div className={styles.cardsGrid}>
                    {(creatorData.checkInSummary.length === 0
                    ? demoData
                    : creatorData.checkInSummary
                    ).map((checkInSum) => (
                    <MiniCard
                            key={`${checkInSum.eventId}-${checkInSum.title}`}
                            title={checkInSum.title}
                            value={`${checkInSum.ticketsSold} tickets sold`}
                    >
                        <p>
                        Users Checked in:{" "}
                        {checkInSum.checkedIn === 0
                            ? "No Users Checked In yet"
                            : checkInSum.checkedIn}
                        </p>
                        {<small>Demo Data</small>}
                    </MiniCard>
                ))}
                </div>  
              </div>
                
              <div className={styles.ena}>
                <h3 className={styles.sectionTitle}>Events Needing Attention 
                    <span className={styles.tooltip}>ⓘ<span className={styles.tooltipText}>
                    Events with less than 30% ticket sales and starting within 20 days.
                    </span></span>
                </h3>
                <div className={styles.cardsGrid}>
                    {creatorData.eventsNeedingAttention.map((ena)=>(
                    <MiniCard key={`${ena.daysLeft}-${ena.ticketsSold}`}
                              title={ena.title}
                              value={`Days left: ${ena.daysLeft}`}
                              subtitle={`Tickets sold: ${ena.ticketsSold} `} 
                    >
                        <p>Capacity filled: {(ena.capacityPercent * 100).toFixed(1)}%</p>

                    </MiniCard>
                    ))}
                </div>
              </div>   
            </div>
        </main>
        </div>
    )
}

export default CreatorDashboard