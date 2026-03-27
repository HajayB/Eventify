import { useEffect, useState } from "react";
import { getEvents, type EventsType } from "./EventsService";
import styles from "./eventspage.module.css";
import EventCards from "./Event-cards";
import EventCardSkeleton from "../../components/EventCardSkeleton";
import Skeleton from "../../components/Skeleton";
 
type Props = {
  onEventClick?: (event: EventsType) => void;
};

function AllEvents({ onEventClick }: Props) {
  const [events, setEvents] = useState<EventsType[]>([]);
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: page,
    totalPages: 1
  });
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  async function loadEvents(page:number) {
    setLoading(true);

    const result = await getEvents(page, debouncedSearch);

    setEvents(result.events);
    setPagination(result.pagination);

    setLoading(false);
  }
    const handleNext = () => {
    if (page < pagination.totalPages) {
      setPage(prev => prev + 1);
    }
    
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(prev=> prev - 1);
    }
   
  };
  function handleSearchInput(e:any){
    setSearch(e.target.value);
    setPage(1);

  }
  useEffect(() => {
    const timer = setTimeout(() => {
    setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);
    useEffect(() => {
      loadEvents(page);
    }, [page, debouncedSearch]);

  if (loading) {
    return (
      <>
        <div className={styles.eventsHeader}>
          <Skeleton height="40px" borderRadius="20px" style={{ maxWidth: "200px" }} />
        </div>
        <div className={styles.eventsGrid}>
          {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      </>
    );
  }



  return (
    <>
      <div className= {styles.eventsHeader}>
          <input  className={styles.searchInput} type="text" placeholder="search events" value={search} onChange={handleSearchInput}/>
        </div>
      <div className={styles.eventsGrid}>
      {!loading && events.length === 0 && (
        <p className={styles.noResult}>No results found for "{search}"</p>
      )}
        {events.map((event) => (
          <EventCards key={event._id} {...event} onClick={() => onEventClick?.(event)}/>
        ))}
      </div>

      <div className={styles.pagination}>
        <button type="button" onClick={handlePrev} disabled={loading || pagination.page === 1}>
          {loading ? "Loading..." : "Previous"}
        </button>

        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={loading || page === pagination.totalPages}
        >
          {loading ? "Loading..." : "Next"}
        </button>
      </div>
    </>
  );
}

export default AllEvents;