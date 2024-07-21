import { useEffect, useState } from 'react';

export default function useMatchMedia(minWidth) {
  const mediaBreakpoint = window.matchMedia(`(min-width: ${minWidth}px)`);
  const [matches, setMatches] = useState(mediaBreakpoint.matches);
  useEffect(() => {
    const onMatchMediaChange = (e) => setMatches(e.matches);

    mediaBreakpoint.addEventListener('change', onMatchMediaChange);
    return () => mediaBreakpoint.removeEventListener('change', onMatchMediaChange);
  }, [mediaBreakpoint]);

  return matches;
}
