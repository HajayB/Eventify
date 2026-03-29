import { useEffect, useState } from "react";
import Skeleton from "../../components/Skeleton";
import Sidebar from "../../services/sideBar";
import { creatorMenu } from "../../services/sideBarData";
import CreatorEvents from "./creatorEvents";
import EventDetailModal from "./EventDetailModal";
import styles from "./creatorEventPage.module.css";
import { createEvent, getCreatorEvents, type GetCreatorEventsResponse, type EventsType } from "./EventsService";
import { usePageTitle } from "../../hooks/usePageTitle";


function CreatorEventPage(){
    usePageTitle("My Events");
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
    const [maxTicketsPerPurchase, setMaxTicketsPerPurchase] = useState<number>(10);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    function showMessage(msg: string, type: "success" | "error") {
        if (type === "success") {
            setSuccessMsg(msg);
            setTimeout(() => setSuccessMsg(null), 3000);
        } else {
            setErrorMsg(msg);
            setTimeout(() => setErrorMsg(null), 3000);
        }
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
            maxTicketsPerPurchase: maxTicketsPerPurchase ? Number(maxTicketsPerPurchase) : undefined,
        };

        try {
            const data = await createEvent(body);

            showMessage(data.message || "Event created successfully!", "success");

            // reset form
            setTitle(""); setDescription(""); setPrice(0);
            setLocation(""); setStartTime(""); setEndTime("");
            setTotalTickets(0); setCoverImage(""); setMaxTicketsPerPurchase(10);

            // refresh event list
            setRefreshKey((prev) => prev + 1);

        } catch (error: any) {
            showMessage(error.response?.data?.message || "Failed to create event.", "error");
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
    if (loading || !creatorData) {
        return (
            <div className={styles.container}>
                <Sidebar menu={creatorMenu} />
                <main className={styles.content}>
                    <Skeleton height="22px" width="180px" style={{ marginBottom: "20px" }} />
                    <div className={styles.createEvent}>
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <Skeleton key={i} height="44px" borderRadius="6px" />
                        ))}
                    </div>
                    <Skeleton height="22px" width="180px" style={{ marginBottom: "20px" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} height="360px" borderRadius="12px" />
                        ))}
                    </div>
                </main>
            </div>
        );
    }


    return(
        <>
            <div className={styles.container}>
                <Sidebar menu={creatorMenu}/>

                <main className={styles.content}>
                    <h3 className={styles.formTitle}>Create an event </h3>
                    <form onSubmit={handleSubmit} className={styles.createEvent} id="eventForm">
                        <label className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Event Title</span>
                            <input className={styles.input} value={title} onChange={handleTitleChange} type="text" placeholder="e.g. Lagos Tech Summit"/>
                        </label>
                        <label className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Description</span>
                            <input className={styles.input} value={description} onChange={handleDescriptionChange} type="text" placeholder="What's this event about?"/>
                        </label>
                        <label className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Ticket Price (₦)</span>
                            <input className={styles.input} value={price} onChange={handlePriceChange} type="number" placeholder="0 for free events"/>
                        </label>
                        <label className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Location</span>
                            <input className={styles.input} value={location} onChange={handleLocationChange} type="text" placeholder="e.g. Eko Hotel, Lagos"/>
                        </label>
                        <label className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Start Time</span>
                            <input className={styles.input} value={startTime} onChange={handleStartTime} type="datetime-local" id="eventStartTime"/>
                        </label>
                        <label className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>End Time</span>
                            <input className={styles.input} value={endTime} onChange={handleEndTime} type="datetime-local" id="eventEndTime"/>
                        </label>
                        <label className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Total Tickets</span>
                            <input className={styles.input} value={totalTickets} onChange={handleTotalTickets} type="number" placeholder="How many tickets available?"/>
                        </label>
                        <label className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Cover Image URL</span>
                            <input className={styles.input} value={coverImage} onChange={handleCoverImage} type="url" placeholder="https://..."/>
                        </label>
                        <label className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Max Tickets Per Purchase</span>
                            <input className={styles.input} value={maxTicketsPerPurchase} onChange={(e) => setMaxTicketsPerPurchase(Number(e.target.value))} type="number" min={1} placeholder="e.g. 10"/>
                        </label>

                        <button type="submit" className={styles.submitBtn}>Create Event</button>
                        {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
                        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
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