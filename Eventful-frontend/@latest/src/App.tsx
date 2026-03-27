import {BrowserRouter, Routes, Route} from "react-router-dom";
import EventsPagePublic from "./features/Events/eventsPagePublic";
import SignupPage from "./features/Authentication/signup";
import LoginPage from "./features/Authentication/login";
import ResetPasswordPage from "./features/Authentication/resetPassword";
import ResetPasswordFormPage from "./features/Authentication/resetPasswordForm"
import UpcomingEvents from "./features/Events/upcomingEvents";
import LandingPage from "./features/Home/landingPage";
import CreatorDashboard from "./features/Dashboard/CreatorDashboard";
import EventeeDashboard from "./features/Dashboard/EventeeDashboard";
import CreatorEventPage from "./features/Events/CreatorEventPage";
import EventeeEventsPage from "./features/Events/EventeeEventsPage";
import EventeeEventDetailPage from "./features/Events/EventeeEventDetailPage";
import PaymentCallbackPage from "./features/Payment/PaymentCallbackPage";

function App(){

  return (

    <>
    <BrowserRouter>
      <Routes>
      <Route path="/events" element={<div className="events-wrapper"> <EventsPagePublic /></div>} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password-link" element={<ResetPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordFormPage />} />
      <Route path="/upcomingevents" element={<UpcomingEvents />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/creator/dashboard" element={<CreatorDashboard />} />
      <Route path="/dashboard" element={<EventeeDashboard />} />
      <Route path="/creator/events" element={<CreatorEventPage />} />
      <Route path="/eventee/events" element={<EventeeEventsPage />} />
      <Route path="/eventee/events/:eventId" element={<EventeeEventDetailPage />} />
      <Route path="/payment/callback" element={<PaymentCallbackPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App