import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState(startTime - endTime);

  useEffect(() => {
    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // Format the time left into HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>Countdown Timer</h1>
      <p>{formatTime(timeLeft)}</p>
    </div>
  );
};

// Usage example
const Counter = () => {
  const startTime = 3600; // 1 hour in seconds
  const endTime = 0; // End time in seconds

  return (
    <div>
      <CountdownTimer startTime={startTime} endTime={endTime} />
    </div>
  );
};

export default Counter;
