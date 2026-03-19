import styles from "./eventspage.module.css"
import { useState,  } from "react";
import{Link, useNavigate} from "react-router-dom";
import { FaBars } from "react-icons/fa";
import AllEvents from "./allEvents"
import Modal from "../../services/Modal";

function EventsPagePublic(){
  const navigate = useNavigate();
      const [open , setOpen] = useState(false);
      const [isOpen, setIsOpen] = useState(false);

      function handleLoginBtn(){
        navigate("/login");
      }
    return (
    <div className={styles.container}>

      {/* HEADER */}
      <section className= {styles.header}>
        <div className={styles.logo}>
          <h1 onClick={()=>window.location.href=("/")}>Event<span>ify</span></h1>
        </div>
        <nav className={styles.nav}>
          <a href="/">Home</a>
          <a href="/register">Signup</a>
        </nav>

        {/* Mobile hamburger */}
          <FaBars
            size={24}
            onClick={() => setOpen(!open)}
            className={styles.hamburger}
          />

          {/* Mobile dropdown */}
          {open && (
            <div className={styles.mobileMenu}>
              <Link to="/" onClick={() => setOpen(false)} className={styles.whiteLink}>Home</Link>
              <Link to="/register" onClick={() => setOpen(false)} className={styles.whiteLink}>Signup</Link>
            </div>
          )}

      </section>


      {/* EVENTS SECTION */}
      <section className={styles.eventsSection}>

          <AllEvents onEventClick={() => setIsOpen(true)}/>

          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <h2>Please Login</h2>
            <p>You must login to see full event details.</p>
            <button  onClick={handleLoginBtn}>Login</button>
          </Modal>

      </section>


      {/* FOOTER */}
      <section className={styles.footer}>
        <p>© Eventify</p>
      </section>

    </div>
  );

}

export default EventsPagePublic;