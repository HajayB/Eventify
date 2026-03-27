import { useEffect, useState } from "react";
import Skeleton from "../../components/Skeleton";
import {EventeeDashboardData, type GetEventeeResponse } from "./EventeeDashboardService";
import MiniCard from "../../services/MiniCards";
import ActivityCard from "../../services/ActivityCard";
import Sidebar from "../../services/sideBar";
import { eventeeMenu } from "../../services/sideBarData";
import styles from "./creatorDashboard.module.css";
function EventeeDashboard(){

    const [eventeeData, setEventeeData] = useState<GetEventeeResponse|null>(null);
    const [loading, setLoading] = useState(true);

    async function loadEventeeData(){
        setLoading(true);
        const result:any = await EventeeDashboardData();
        setEventeeData(result)
        setLoading(false)
    }
    useEffect(()=>{
        loadEventeeData();
    },[])

  if (loading || !eventeeData) {
    return (
      <div className={styles.container}>
        <Sidebar menu={eventeeMenu} />
        <main className={styles.content}>
          <Skeleton height="24px" width="220px" style={{ margin: "17px 30px 30px" }} />
          <div className={styles.statSection}>
            {[0, 1].map((i) => (
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
          <Skeleton height="18px" width="160px" style={{ margin: "30px 30px 16px" }} />
          <div className={styles.recentActivitySection}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} height="72px" borderRadius="10px" style={{ marginBottom: "8px" }} />
            ))}
          </div>
        </main>
      </div>
    );
  }

    return(
        <div className={styles.container}>
        <Sidebar menu={eventeeMenu}/>
        <main className={styles.content}>
            <h3 className={styles.usernameH3}>Welcome, {eventeeData.userName}</h3>
            <div className={styles.statSection}> 
                <MiniCard title="Total Tickets Purchased" icon={"🎟️"} value={eventeeData.stats.ticketsOwned}/>
                <MiniCard title="Events Attended" icon={"📺"} value={eventeeData.stats.eventsAttended}/>
                
            </div>
        <h3 className={styles.h3Headers}>Upcoming Events</h3>
            <div className={styles.upcomingEventsSection}> 
                
                {eventeeData.upcomingEvents.map((event) => (
                <MiniCard
                    key={event.eventId}
                    title={`${event.location}`}
                    value={event.title}
                    
                    subtitle={new Date(event.startTime).toLocaleDateString()}
                >
                    <p>You have: {event.ticketCount} {event.ticketCount == 1 ? "ticket" : "tickets"}</p>
                </MiniCard>
                ))}
            </div>
            <h3 className={styles.h3Headers}>Payment History</h3>    
            <div className={styles.recentActivitySection}>
                {eventeeData.paymentHistory.map((payment) => (
                <ActivityCard
                    key={`${payment.eventTitle} - ?${payment.paidAt}`}                    
                    eventTitle={`◉ ${payment.eventTitle}`}
                    quantity={`${payment.quantity} ${payment.quantity == 1 ? "ticket" : "tickets"}`}
                    amount={payment.amount} 
                    date={new Date(payment.paidAt).toLocaleDateString()}
                    
                >
                </ActivityCard>
                ))}
            </div>

            {/* <div className={styles.footSection}>

              <div className={styles.checkedIn}>
                <h3 className={styles.sectionTitle}>Checked In Summary 
                    <span className={styles.tooltip}>ⓘ<span className={styles.tooltipText}>
                    Live count of attendees checked in
                    </span></span>
                </h3>
                <div className={styles.cardsGrid}>
                    {(eventeeData.checkInSummary.length === 0
                    ? demoData
                    : eventeeData.checkInSummary
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
                    {eventeeData.eventsNeedingAttention.map((ena)=>(
                    <MiniCard key={`${ena.daysLeft}-${ena.ticketsSold}`}
                              title={ena.title}
                              value={`Days left: ${ena.daysLeft}`}
                              subtitle={`Tickets sold: ${ena.ticketsSold} `} 
                    >
                        <p>Capacity filled: {(ena.capacityPercent * 100).toFixed(1)}%</p>

                    </MiniCard>
                    ))}
                </div>
              </div>    */}
            {/* </div> */}
        </main>
        </div> 
    )
}

export default EventeeDashboard


// {
//     "userName": "HajayB",
//     "upcomingEvents": [
//         {
//             "eventId": "69b192c0b84aa5eff7f9cede",
//             "title": "Hauwa's Grand 18th",
//             "location": "Chois Garden Estate, Lekki, Lagos",
//             "startTime": "2026-04-10T17:00:00.000Z",
//             "endTime": "2026-04-11T01:00:00.000Z",
//             "ticketCount": 5
//         },
//         {
//             "eventId": "69a9be8c9af63a4a487b673b",
//             "title": "Vibes with Samba",
//             "location": "Row Way Park",
//             "startTime": "2026-05-23T16:00:00.000Z",
//             "endTime": "2026-05-23T22:00:00.000Z",
//             "ticketCount": 1
//         }
//     ],
//     "stats": {
//         "ticketsOwned": 14,
//         "eventsAttended": 2
//     },
//     "paymentHistory": [
//         {
//             "amount": 15000,
//             "reference": "eebbf850-7684-45f5-b041-24335905d424",
//             "quantity": 1,
//             "paidAt": "2026-03-23T20:15:14.777Z",
//             "eventTitle": "Vibes with Samba",
//             "eventDate": "2026-05-23T16:00:00.000Z"
//         },
//         {
//             "amount": 125000,
//             "reference": "e63177a2-375f-4194-a5d9-855fb3676da9",
//             "quantity": 5,
//             "paidAt": "2026-03-23T17:28:52.561Z",
//             "eventTitle": "Hauwa's Grand 18th",
//             "eventDate": "2026-04-10T17:00:00.000Z"
//         },
//         {
//             "amount": 25000,
//             "reference": "55bf7387-ac53-4393-ad5b-6b460ab4da48",
//             "quantity": 5,
//             "paidAt": "2026-03-13T17:43:01.092Z",
//             "eventTitle": "Wade's Award Celebration",
//             "eventDate": "2026-03-20T15:00:00.000Z"
//         }
//     ]
// }