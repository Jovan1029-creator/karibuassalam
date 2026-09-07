import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import SocialRail from "./components/SocialRail";
import Footer from "./components/Footer";
import ContactDock from "./components/ContactDock";
import Home from "./pages/Home";
import About from "./pages/About";
import Retreats from "./pages/Retreats";
import RetreatDetail from "./pages/RetreatDetail";
import Experiences from "./pages/Experiences";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Campus from "./pages/Campus";
import Accommodations from "./pages/Accommodations";
import EcoResort from "./pages/EcoResort";
import Restaurant from "./pages/Restaurant";
import Campers from "./pages/Campers";
import { useLanguage } from "./context/LanguageContext";
import useScrollReveal from "./hooks/useScrollReveal";

const Booking = lazy(() => import("./pages/Booking"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

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
  const { pathname } = useLocation();
  useScrollReveal([pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        {tx("Skip to main content")}
      </a>
      <ScrollToTop />
      <TopBar />
      <Navbar />
      <Suspense fallback={<main id="main-content" className="page-shell"><section className="container page-hero compact"><p>{tx("Loading...")}</p></section></main>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/retreats" element={<Retreats />} />
          <Route path="/retreats/:slug" element={<RetreatDetail />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/eco-resort" element={<EcoResort />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/campus" element={<Campus />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/campers" element={<Campers />} />
          {/* Old paths, kept so shared links and search results still land. */}
          <Route path="/zanzibar" element={<Navigate to="/experiences" replace />} />
          <Route path="/rooms" element={<Navigate to="/accommodations" replace />} />
          <Route path="/food" element={<Navigate to="/restaurant" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <SocialRail />
      <ContactDock />
      <Footer />
    </>
  );
}
