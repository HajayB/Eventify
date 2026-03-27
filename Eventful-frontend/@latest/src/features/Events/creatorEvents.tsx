import { useEffect, useState } from "react";
import { getCreatorEvents, type PaginationType, type EventsType } from "./EventsService";
import styles from "./eventspage.module.css";
import EventCards from "./Event-cards";
import EventCardSkeleton from "../../components/EventCardSkeleton";
import Skeleton from "../../components/Skeleton";

type Props = {
  onEventClick?: (event: EventsType) => void;
};

type FilterType = "current" | "previous";

function CreatorEvents({ onEventClick }: Props) {
  const [page, setPage] = useState(1);
  const [currentEvents, setCurrentEvents] = useState<EventsType[]>([]);
  const [oldEvents, setOldEvents] = useState<EventsType[]>([]);
  const [activePagination, setActivePagination] = useState<PaginationType | null>(null);
  const [oldPagination, setOldPagination] = useState<PaginationType | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("current");

  // Derive the active data based on filter
  const displayedEvents = filter === "current" ? currentEvents : oldEvents;
  const pagination = filter === "current" ? activePagination : oldPagination;

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await getCreatorEvents(page, debouncedSearch);
        setCurrentEvents(data.CurrentEvents.activeEvents);
        setOldEvents(data.OldEvents.pastEvents);
        setActivePagination(data.CurrentEvents.pagination);
        setOldPagination(data.OldEvents.pagination);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [page, debouncedSearch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleNext = () => {
    if (pagination && page < pagination.totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  function handleSearchInput(e: any) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilter(e.target.value as FilterType);
  }

  if (loading) {
    return (
      <>
        <div className={styles.eventsHeader}>
          <Skeleton height="40px" borderRadius="20px" style={{ maxWidth: "200px" }} />
          <Skeleton height="40px" borderRadius="20px" style={{ maxWidth: "120px" }} />
        </div>
        <div className={styles.eventsGrid}>
          {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.eventsHeader}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search events"
          value={search}
          onChange={handleSearchInput}
        />
        <select
          className={styles.filterDropdown}
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="current">Current</option>
          <option value="previous">Previous</option>
        </select>
      </div>

      <div className={styles.eventsGrid}>
        {displayedEvents.length === 0 && (
          <p className={styles.noResult}>
            {search ? `No results found for "${search}"` : `No ${filter} events found.`}
          </p>
        )}
        {displayedEvents.map((event) => (
          <EventCards
            key={event._id}
            {...event}
            onClick={() => onEventClick?.(event)}
          />
        ))}
      </div>

      {pagination && (
        <div className={styles.pagination}>
          <button type="button" onClick={handlePrev} disabled={loading || page === 1}>
            Previous
          </button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button type="button" onClick={handleNext} disabled={loading || page === pagination.totalPages}>
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default CreatorEvents;