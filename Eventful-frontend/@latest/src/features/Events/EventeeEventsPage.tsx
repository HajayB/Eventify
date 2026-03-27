import { useNavigate } from "react-router-dom";
import Sidebar from "../../services/sideBar";
import { eventeeMenu } from "../../services/sideBarData";
import AllEvents from "./allEvents";
import { type EventsType } from "./EventsService";
import styles from "./eventeeEventsPage.module.css";

function EventeeEventsPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Sidebar menu={eventeeMenu} />
      <main className={styles.content}>
        <h2 className={styles.title}>Browse Events</h2>
        <AllEvents
          onEventClick={(event: EventsType) =>
            navigate(`/eventee/events/${event._id}`)
          }
        />
      </main>
    </div>
  );
}

export default EventeeEventsPage;
