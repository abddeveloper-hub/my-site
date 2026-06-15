import { useEffect, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function Timecode() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const s = pad(time.getSeconds());

  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-steel tabular-nums">
      {h}:{m}:{s}
    </span>
  );
}
