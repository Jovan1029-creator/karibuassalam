import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Shared header state so the utility bar and the header agree on when they are
 * floating over the hero photograph and when they have become solid chrome.
 */
export default function useHeaderState() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return undefined;
    }

    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return { isHome, scrolled };
}
