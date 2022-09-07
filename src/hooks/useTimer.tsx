import React, { useEffect, useState } from "react";

const useTimer = (init: number) => {
  const [seconds, setSeconds] = useState(init);

  const reset = () => {
    setSeconds(init);
  };

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);
    
    return () => {
      clearInterval(myInterval);
    };
  });

  return { seconds, reset };
};

export default useTimer;
