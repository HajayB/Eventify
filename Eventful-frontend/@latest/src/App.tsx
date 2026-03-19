import {BrowserRouter, Routes, Route} from "react-router-dom";
import EventsPagePublic from "./features/Events/eventsPagePublic";
import SignupPage from "./features/Authentication/signup";
import LoginPage from "./features/Authentication/login"
import UpcomingEvents from "./features/Events/upcomingEvents";
import LandingPage from "./features/Home/landingPage";
import CreatorDashboard from "./features/Dashboard/CreatorDashboard";
import EventeeDashboard from "./features/Dashboard/EventeeDashboard";
function App(){

  return (

    <>
    <BrowserRouter>
      <Routes>
      <Route path="/events" element={<div className="events-wrapper"> <EventsPagePublic /></div>} />  
      <Route path="/register" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/upcomingevents" element={<UpcomingEvents />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/creator/dashboard" element={<CreatorDashboard />} />
      <Route path="/dashboard" element={<EventeeDashboard />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App