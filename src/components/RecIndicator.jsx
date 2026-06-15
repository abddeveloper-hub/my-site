import { useEffect, useState } from "react";

export default function RecIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setVisible((v) => !v), 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-steel">
      <span
        className="h-2 w-2 rounded-full bg-ember transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      REC
    </div>
  );
}
