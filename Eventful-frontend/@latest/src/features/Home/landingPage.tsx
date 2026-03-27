import styles from "./landingpage.module.css"
import {useState} from "react";
import { FaBars } from "react-icons/fa";
import UpcomingEvents from "../Events/upcomingEvents"
import{Link,useNavigate} from "react-router-dom";
import axios from "axios";

function LandingPage(){
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const contactUrl = baseUrl+"/notifications/contact"
  const[name, setName] = useState("");
  const [email, setEmail]=useState("");
  const [message, setMessage] = useState("");
  const [open , setOpen] = useState(false);
  let navigate = useNavigate();
//success or error message
  function displayMessage(message:string, type = "success") {
    const element = document.createElement("p");

    element.textContent = message;

    if (type === "success") {
        element.style.color = "green";
    } else {
        element.style.color = "red";
    }

    const container = document.getElementById("sendBtn");
    container?.append(element);

    // remove after 3 seconds
    setTimeout(() => {
      element.remove();
    }, 3000);
  }
// function to handle texts
    function handleExploreButton (){
        navigate("/login");
    }
    function handleEmailChange(event:any){
        setEmail(event.target.value)
    }
    function handleNameChange(event:any){
      setName(event.target.value)
    }
    function handleMessageChange(event:any){
        setMessage(event.target.value)
    }

    async function handleSendContact(e:any){
      e.preventDefault();

      try{
        const {data} = await axios.post (contactUrl, {
          name, email, message
        }); 

        let APIMessage:string = data.message;

        displayMessage(APIMessage,"success");

        setEmail("");setName("");setMessage("");
      }
      catch(error:any){
        console.error(error);
        displayMessage(
        error.response?.data?.message || "Something went wrong",
        "error"
        );
      }
    }

    return (
  <div className={styles.landingPage}>

    <div className={styles.header}>
      <div className={styles.logo}>
        <h1 onClick={()=>window.location.href=("/")}>Event<span>ify</span></h1>
      </div>
      <div className={styles.navbar}>
        {/* Desktop navigation */}
        <div className={styles.navLinks}>
          <Link to="/" className={`${styles.homeBtn} ${styles.navLinks}`}>Home</Link>
          <Link to="/events" className={` ${styles.navLinks}`}>Events</Link>
          <a href="/#About" className={` ${styles.navLinks}`}>About</a>
          <a href="/#Contact" className={` ${styles.navLinks}`}>Contact</a>
          <Link to="/register" className={` ${styles.navLinks}`}>Signup</Link>
        </div>

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
              <Link to="/events" onClick={() => setOpen(false)} className={styles.whiteLink}>Events</Link>
              <a href="/#About" onClick={() => setOpen(false)} className={styles.whiteLink}>About</a>
              <a href="/#Contact" onClick={() => setOpen(false)} className={styles.whiteLink}>Contact</a>
              <Link to="/register" onClick={() => setOpen(false)} className={styles.whiteLink}>Signup</Link>
            </div>
          )}

        </div>

      
    </div>

    <div className={styles.hero}>
      <h1>Discover Amazing Events Near You</h1>
      <p>Find concerts, tech meetups, and community events happening around you.</p>
      <button onClick={handleExploreButton}>Explore Events</button>
    </div>

    <div className={styles.events}>
      <div className={styles.eventCards}>
        <UpcomingEvents />
      </div>
    </div>

    <div className={styles.about} id="About">
      <p className={styles.aboutEyebrow}>Why Eventify?</p>
      <h2 className={styles.aboutHeading}>Built for people who show up — and the ones who make it happen.</h2>
      <p className={styles.aboutSubtext}>
        The big platforms were built for big corporations. Eventify was built for real events —
        the kind that fill up through word of mouth, where the organiser knows half the crowd by name.
        Simple to use, honest on fees, and actually designed for this market.
      </p>

      <div className={styles.aboutGrid}>
        <div className={styles.aboutCard}>
          <span className={styles.aboutCardIcon}>🎤</span>
          <h3 className={styles.aboutCardTitle}>For Event Creators</h3>
          <p className={styles.aboutCardText}>
            Go from idea to live event in minutes. Set your price, upload a cover, and start selling tickets
            immediately via Paystack — no approval queue, no waiting period.
            Track every sale, monitor check-ins, and see your attendance rate in real time from your analytics dashboard.
          </p>
        </div>

        <div className={styles.aboutCard}>
          <span className={styles.aboutCardIcon}>🎟️</span>
          <h3 className={styles.aboutCardTitle}>For Event Attendees</h3>
          <p className={styles.aboutCardText}>
            Find events actually worth going to. Browse what's coming up, buy your tickets securely,
            and get everything you need in one place. No spam, no dark patterns —
            just your ticket and the date to show up.
          </p>
        </div>
      </div>

      <p className={styles.aboutClosing}>
        Whether you're packing a venue or planning your weekend — Eventify keeps it simple.
      </p>
    </div>

    <div className={styles.contact}>
      <h2>Contact</h2>

      <form className={styles.contactForm} id="Contact" onSubmit={handleSendContact}>
        <input type="text" placeholder="Name" value={name} onChange={handleNameChange}/>
        <input type="email" placeholder="Email" value={email}onChange={handleEmailChange} />
        <textarea placeholder="Complaint or message" value={message} onChange={handleMessageChange}></textarea>
        <button type="submit" id="sendBtn">Send</button>
      </form>
    </div>

    <div className={styles.footer} >
      {/* <p>Instagram</p>
      <p>X</p> */}
      <p>© Eventify</p>
    </div>

  </div>
)
}
export default LandingPage