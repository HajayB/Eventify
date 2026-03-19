//Upcoming events cards 
import {useEffect, useState} from "react";
import { getEvents, type EventsType } from "./EventsService";
import EventCards from "../../features/Events/Event-cards";

function UpcomingEvents(){
    const [events, setEvents] = useState<EventsType[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        async function loadEvents() {
        const result = await getEvents();
        setEvents(result.events);
        setLoading(false)
        }
        loadEvents();
    },[])

    const today = new Date();
    
    const upcomingEvents = events
    .filter(event => new Date(event.startTime) >= today)
    .sort(
        (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    .slice(0, 3);
    if (loading) {
        return <p>Loading events...</p>;
    }
    return (
        <div className="events-section">

        <h1 className="events-title" style={{color:"white"}}>Upcoming events</h1>

        <div className="events-wrapper">
            {upcomingEvents.map((event, index) => (
            <EventCards key={index} {...event} />
            ))}
        </div>

        </div>
  );
}

export default UpcomingEvents