'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Tracker() {
  const pathname = usePathname();
  const sessionIdRef = useRef(null);
  const pageStartTimeRef = useRef(Date.now());
  const activeSectionRef = useRef(null);
  const sectionDurationsRef = useRef({});
  const sectionEnterTimeRef = useRef({});
  const observerRef = useRef(null);
  const intervalRef = useRef(null);

  // ── Helper: get or create a persistent session ID ──
  const getSessionId = () => {
    if (sessionIdRef.current) return sessionIdRef.current;
    try {
      let sid = sessionStorage.getItem('jagathi_session_id');
      if (!sid) {
        sid = 'jg_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
        sessionStorage.setItem('jagathi_session_id', sid);
      }
      sessionIdRef.current = sid;
      return sid;
    } catch {
      // sessionStorage blocked (incognito strict mode, etc.)
      if (!sessionIdRef.current) {
        sessionIdRef.current = 'jg_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      }
      return sessionIdRef.current;
    }
  };

  // ── Helper: send analytics payload to PHP backend ──
  const sendAnalytics = (sid) => {
    if (!sid) return;
    const now = Date.now();
    const pageTime = (now - pageStartTimeRef.current) / 1000;

    // Finalize current active section duration before sending
    const currSec = activeSectionRef.current;
    if (currSec) {
      const timeSpent = (now - (sectionEnterTimeRef.current[currSec] || now)) / 1000;
      sectionDurationsRef.current[currSec] = (sectionDurationsRef.current[currSec] || 0) + timeSpent;
      sectionEnterTimeRef.current[currSec] = now;
    }

    const payload = {
      session_id: sid,
      url: window.location.pathname,
      referrer: document.referrer || 'Direct',
      screen_resolution: `${window.innerWidth}x${window.innerHeight}`,
      user_agent: navigator.userAgent,
      page_time: Math.round(pageTime * 10) / 10,
      sections: Object.entries(sectionDurationsRef.current).map(([name, duration]) => ({
        name,
        duration: Math.round(duration * 10) / 10
      }))
    };

    // sendBeacon requires a Blob with proper content-type so server can JSON decode it
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track-analytics.php', blob);
      } else {
        fetch('/api/track-analytics.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      }
    } catch {
      // Silently suppress; tracking is non-critical
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sid = getSessionId();

    // Reset timers on every route change
    pageStartTimeRef.current = Date.now();
    sectionDurationsRef.current = {};
    sectionEnterTimeRef.current = {};
    activeSectionRef.current = null;

    // Disconnect any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // ── IntersectionObserver: track which section is in view ──
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        // Build a human-readable section name from id > data-attr > class > tagName
        const targetId =
          entry.target.id ||
          entry.target.getAttribute('data-section-name') ||
          (entry.target.className
            ? 'section-' + String(entry.target.className).split(' ').filter(Boolean)[0]
            : entry.target.tagName.toLowerCase());

        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          const prevSection = activeSectionRef.current;
          const now = Date.now();

          // Record time for previously active section
          if (prevSection && prevSection !== targetId) {
            const timeSpent = (now - (sectionEnterTimeRef.current[prevSection] || now)) / 1000;
            sectionDurationsRef.current[prevSection] =
              (sectionDurationsRef.current[prevSection] || 0) + timeSpent;
          }

          activeSectionRef.current = targetId;
          sectionEnterTimeRef.current[targetId] = now;

        } else if (!entry.isIntersecting && activeSectionRef.current === targetId) {
          const now = Date.now();
          const timeSpent = (now - (sectionEnterTimeRef.current[targetId] || now)) / 1000;
          sectionDurationsRef.current[targetId] =
            (sectionDurationsRef.current[targetId] || 0) + timeSpent;
          activeSectionRef.current = null;
        }
      });
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold: [0.1, 0.3, 0.5, 0.8],
      rootMargin: '-5% 0px -5% 0px'
    });

    // ── Attach observer to trackable elements after hydration ──
    const attachObserver = () => {
      const elements = document.querySelectorAll(
        'section[id], section[data-section-name], section, footer, [data-track-section], [id^="interactive-"]'
      );
      elements.forEach((el, idx) => {
        // Assign a section name if the element has none
        if (!el.id && !el.getAttribute('data-section-name')) {
          const firstClass = String(el.className || '').split(' ').filter(Boolean)[0] || '';
          el.setAttribute('data-section-name', firstClass ? `sec-${firstClass}` : `block-${idx}`);
        }
        if (observerRef.current) observerRef.current.observe(el);
      });
    };

    const hydrateTimer = setTimeout(attachObserver, 800);

    // ── Periodic flush every 15s ──
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => sendAnalytics(sid), 15000);

    // ── Flush on tab hide / page unload ──
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') sendAnalytics(sid);
    };
    const handleUnload = () => sendAnalytics(sid);

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', handleUnload);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearTimeout(hydrateTimer);
      clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', handleUnload);
      window.removeEventListener('beforeunload', handleUnload);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      // Flush before unmounting (route change)
      sendAnalytics(sid);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
