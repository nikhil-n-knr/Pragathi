import { useEffect, useRef, useState } from 'react';

export default function useSpring(targetVal, stiffness = 0.15, damping = 0.8) {
  const [val, setVal] = useState(targetVal);
  const currentValRef = useRef(targetVal);
  const velocityRef = useRef(0);

  useEffect(() => {
    let animationFrameId;

    const updateSpring = () => {
      // Spring physics formula
      const force = (targetVal - currentValRef.current) * stiffness;
      velocityRef.current = (velocityRef.current + force) * damping;
      currentValRef.current += velocityRef.current;

      setVal(currentValRef.current);

      // Continue animating if we haven't quite reached target
      if (Math.abs(targetVal - currentValRef.current) > 0.001 || Math.abs(velocityRef.current) > 0.001) {
        animationFrameId = requestAnimationFrame(updateSpring);
      }
    };

    updateSpring();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetVal, stiffness, damping]);

  return val;
}
