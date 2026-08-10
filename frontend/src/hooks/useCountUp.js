import { useEffect, useRef, useState } from 'react';

export default function useCountUp(target, { duration = 1500 } = {}) {
  const [value, setValue] = useState(0);
  const frameRef = useRef();

  useEffect(() => {
    if (!target) {
      setValue(0);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}
