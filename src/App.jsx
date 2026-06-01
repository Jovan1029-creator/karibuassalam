import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsAppHelp from "./components/FloatingWhatsAppHelp";
import Home from "./pages/Home";
import About from "./pages/About";
import Retreats from "./pages/Retreats";
import RetreatDetail from "./pages/RetreatDetail";
import Zanzibar from "./pages/Zanzibar";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Campus from "./pages/Campus";
import Rooms from "./pages/Rooms";
import Food from "./pages/Food";
import { useLanguage } from "./context/LanguageContext";

const Booking = lazy(() => import("./pages/Booking"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function NotFound() {
  const { tx } = useLanguage();
  return (
    <main id="main-content" className="page-shell">
      <section className="container page-hero compact">
        <p className="eyebrow">{tx("Not Found")}</p>
        <h1>{tx("Page not found")}</h1>
        <p className="lead">
          {tx(
            "The page you requested is not available. You can browse retreats or contact the team for help."
          )}
        </p>
        <div className="inline-actions">
          <Link className="btn btn-primary" to="/retreats">
            {tx("Browse Retreats")}
          </Link>
          <Link className="btn btn-secondary" to="/booking">
            {tx("Contact Booking Team")}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const { tx } = useLanguage();
  return (
    <>
      <a className="skip-link" href="#main-content">
        {tx("Skip to main content")}
      </a>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<main id="main-content" className="page-shell"><section className="container page-hero compact"><p>{tx("Loading...")}</p></section></main>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/retreats" element={<Retreats />} />
          <Route path="/retreats/:slug" element={<RetreatDetail />} />
          <Route path="/zanzibar" element={<Zanzibar />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/campus" element={<Campus />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/food" element={<Food />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <FloatingWhatsAppHelp />
      <Footer />
    </>
  );
}
