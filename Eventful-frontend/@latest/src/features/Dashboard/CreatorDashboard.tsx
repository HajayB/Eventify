import { useEffect, useState } from "react";
import Skeleton from "../../components/Skeleton";
import {CreatorDashboardData, type GetCreatorResponse } from "./CreatorDashboardService";
import MiniCard from "../../services/MiniCards";
import ActivityCard from "../../services/ActivityCard";
import Sidebar from "../../services/sideBar";
import { creatorMenu } from "../../services/sideBarData";
import styles from "./creatorDashboard.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";
function CreatorDashboard(){

    usePageTitle("Dashboard");
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

  if (loading || !creatorData) {
    return (
      <div className={styles.container}>
        <Sidebar menu={creatorMenu} />
        <main className={styles.content}>
          <Skeleton height="24px" width="220px" style={{ margin: "17px 30px 30px" }} />
          <div className={styles.statSection}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ background: "white", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <Skeleton height="13px" width="75%" variant="light" />
                <Skeleton height="28px" width="50%" variant="light" />
              </div>
            ))}
          </div>
          <Skeleton height="18px" width="160px" style={{ margin: "30px 30px 20px" }} />
          <div className={styles.upcomingEventsSection}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ background: "white", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <Skeleton height="13px" width="70%" variant="light" />
                <Skeleton height="20px" width="55%" variant="light" />
                <Skeleton height="12px" width="40%" variant="light" />
              </div>
            ))}
          </div>
          <Skeleton height="18px" width="180px" style={{ margin: "30px 30px 16px" }} />
          <div className={styles.recentActivitySection}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height="72px" borderRadius="10px" style={{ marginBottom: "8px" }} />
            ))}
          </div>
        </main>
      </div>
    );
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
            <div className={styles.welcomeRow}>
              <h3 className={styles.usernameH3}>Welcome back, {creatorData.userName} 👋</h3>
              <span className={styles.dateBadge}>{new Date().toLocaleDateString("en-NG", { timeZone: "Africa/Lagos", dateStyle: "long" })}</span>
            </div>

            <div className={styles.statSection}>
                <MiniCard title="Events Created" icon={"🎪"} value={creatorData.stats.eventsCreated}/>
                <MiniCard title="Tickets Sold" icon={"🎟️"} value={creatorData.stats.ticketsSold}/>
                <MiniCard title="Upcoming Events" icon={"⏰"} value={creatorData.stats.upcomingEvents}/>
            </div>

            <div className={styles.sectionHeader}>
              <h3 className={styles.h3Headers}>Upcoming Events</h3>
            </div>
            <div className={styles.upcomingEventsSection}>
                {creatorData.upComingEvents.map((event) => (
                <MiniCard
                    key={event.eventId}
                    title={event.title}
                    value={`${event.ticketsSold} tickets sold`}
                    subtitle={new Date(event.startTime).toLocaleDateString("en-NG", { timeZone: "Africa/Lagos", dateStyle: "medium" })}
                >
                    <p>Capacity Filled: {event.capacityFilled}%</p>
                </MiniCard>
                ))}
            </div>

            <div className={styles.sectionHeader}>
              <h3 className={styles.h3Headers}>Recent Activity</h3>
            </div>
            <div className={styles.recentActivitySection}>
                {creatorData.recentActivity.map((activity) => (
                <ActivityCard
                    key={`${activity.eventTitle} - ?${activity.purchasedAt}`}
                    summary={activity.summary}
                    eventTitle={activity.eventTitle}
                    amount={activity.amount}
                    date={new Date(activity.purchasedAt).toLocaleDateString("en-NG", { timeZone: "Africa/Lagos", dateStyle: "medium" })}
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