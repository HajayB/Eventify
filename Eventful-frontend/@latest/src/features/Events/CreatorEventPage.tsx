import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Sidebar from "../../services/sideBar";
import { creatorMenu } from "../../services/sideBarData";
import CreatorEvents from "./creatorEvents";
import EventDetailModal from "./EventDetailModal";
import styles from "./creatorEventPage.module.css";
import { getCreatorEvents, type GetCreatorEventsResponse, type EventsType } from "./EventsService"


function CreatorEventPage(){
    const [loading, setLoading] = useState(true);
    // const [open , setOpen] = useState(false);
    const [creatorData, setCreatorData] = useState<GetCreatorEventsResponse| null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [location, setLocation] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [totalTickets, setTotalTickets] = useState(0);
    const [coverImage, setCoverImage] = useState("");

    function handleTitleChange(event:any){
        setTitle(event.target.value)
    }
    function handleDescriptionChange(event:any){
        setDescription(event.target.value)
    }
    function handlePriceChange(event:any){
        setPrice(event.target.value)
    }
    function handleLocationChange(event:any){
        setLocation(event.target.value)
    }
    function handleStartTime(event:any){
        setStartTime(event.target.value)
    }
    function handleEndTime(event:any){
        setEndTime(event.target.value)
    }
    function handleTotalTickets(event:any){
        setTotalTickets(event.target.value)
    }
    function handleCoverImage(event:any){
        setCoverImage(event.target.value)
    }
    function displayMessage(message:string, type = "success") {
        const element = document.createElement("p");

        element.textContent = message;

        if (type === "success") {
            element.style.color = "green";
        } else {
            element.style.color = "red";
        }

        const container = document.getElementById("eventForm");
        container?.append(element);
    }

    async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const body = {
        title,
        description,
        location,
        startTime: startTime ? new Date(startTime).toISOString() : undefined,
        endTime: endTime ? new Date(endTime).toISOString() : undefined,
        price: price ? Number(price) : undefined,
        totalTickets: totalTickets ? Number(totalTickets) : undefined,
        coverImage,
    };

    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const url = baseUrl+"/events";
        const response = await axiosInstance.post(url, body, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        const data = response.data;
        if (!data) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        displayMessage(data.message, "success");

    } catch (error) {
        console.error("Error creating event:", error);
    }
    }
        async function loadCreatorData(){
            setLoading(true);
            const result:any = await getCreatorEvents();
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
        <>
            <div className={styles.container}>
                <Sidebar menu={creatorMenu}/>

                <main className={styles.content}>
                    <h3 className={styles.formTitle}>Create an event </h3>
                    <form onSubmit={handleSubmit} className={styles.createEvent} id="eventForm">
                        <input className={styles.input} value={title} onChange={handleTitleChange} type="text" placeholder="Event Title"/>
                        <input className={styles.input} value={description} onChange={handleDescriptionChange} type="textarea" placeholder="Describe your event"/>
                        <input className={styles.input} value={price} onChange={handlePriceChange} type="number" placeholder="Ticket price"/>

                        <input className={styles.input} value={location} onChange={handleLocationChange} type="text" placeholder="Event Location"/>
                        <input className={styles.input} value={startTime} onChange={handleStartTime} type="datetime-local" id="eventStartTime" placeholder=""/>
                        <input className={styles.input} value={endTime} onChange={handleEndTime} type="datetime-local" id="eventEndTime" placeholder=""/>

                        <input className={styles.input} value={totalTickets} onChange={handleTotalTickets} type="number" placeholder="Total Tickets "/>
                        <input className={styles.input} value={coverImage} onChange={handleCoverImage} type="text" placeholder="Add Cover Image URL"/>

                        <button type="submit" className={styles.submitBtn}>Create Event</button>

                    </form>

                    <div className={styles.createdEvents}>
                        <h3 className={styles.createdH3}>Created Events</h3>
                        <CreatorEvents key={refreshKey} onEventClick={(event: EventsType) => setSelectedEventId(event._id)}/>
                    </div>
                </main>
            </div>

            {selectedEventId && (
                <EventDetailModal
                    eventId={selectedEventId}
                    onClose={() => setSelectedEventId(null)}
                    onSuccess={() => {
                        setSelectedEventId(null);
                        setRefreshKey(prev => prev + 1);
                    }}
                />
            )}
        </>
    )
}
export default CreatorEventPage