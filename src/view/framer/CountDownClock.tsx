import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const CountdownClock = ({ duration = 10 }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const controls = useAnimation();

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    controls.start({ strokeDashoffset: 1 - timeRemaining / duration });

    return () => {
      clearTimeout(timer);
    };
  }, [timeRemaining, controls, duration]);

  return (
    <div>
      <h1>{timeRemaining} seconds remaining</h1>
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#eee" strokeWidth="10" />
        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="black"
          strokeWidth="5"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          initial={{ strokeDashoffset: 1 }}
          animate={controls}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </svg>
    </div>
  );
};



export default CountdownClock;
