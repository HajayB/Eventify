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
import CreatorAnalyticsPage from "./features/Analytics/CreatorAnalyticsPage";
import RemindersPage from "./features/Reminders/RemindersPage";
import EventeeAnalyticsPage from "./features/Eventee/EventeeAnalyticsPage";
import TicketsPage from "./features/Eventee/TicketsPage";
import PaymentHistoryPage from "./features/Eventee/PaymentHistoryPage";
import EventeeRemindersPage from "./features/Eventee/EventeeRemindersPage";

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
      <Route path="/creator/analytics" element={<CreatorAnalyticsPage />} />
      <Route path="/creator/reminder" element={<RemindersPage />} />
      <Route path="/analytics" element={<EventeeAnalyticsPage />} />
      <Route path="/tickets" element={<TicketsPage />} />
      <Route path="/payments" element={<PaymentHistoryPage />} />
      <Route path="/reminder" element={<EventeeRemindersPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App