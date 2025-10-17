"use client";
import { useEffect, useRef, useState } from "react";

/**
 * useTimer
 * - durationSeconds: total seconds
 * - onExpire: callback when time reaches zero
 * - autoStart: boolean
 */
export default function useTimer({ durationSeconds, onExpire, autoStart = true }) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (!running) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          onExpire && onExpire();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const pause = () => setRunning(false);
  const resume = () => setRunning(true);
  const reset = (secs = durationSeconds) => {
    setSecondsLeft(secs);
    setRunning(true);
  };

  return {
    secondsLeft,
    running,
    pause,
    resume,
    reset,
  };
}
