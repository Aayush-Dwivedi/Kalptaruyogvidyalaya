import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets window scroll to top when navigating between routes
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
}
