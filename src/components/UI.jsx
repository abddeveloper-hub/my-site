import { useRef, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

/**
 * MagneticButton — wraps any element with a magnetic pull effect.
 * The child drifts toward the cursor when hovered.
 */
export function MagneticButton({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * ParallaxText — infinite marquee with a scroll-driven speed multiplier.
 */
export function ParallaxText({ children, baseVelocity = 5, className = "" }) {
  const baseX = useMotionValue(0);
  const x = useSpring(baseX, { stiffness: 40, damping: 30 });
  const scrollY = useMotionValue(0);
  const directionFactor = useRef(1);

  useEffect(() => {
    let prevScroll = window.scrollY;
    let frameId;
    let tick = 0;

    const loop = () => {
      tick += 1;
      const currentScroll = window.scrollY;
      const diff = currentScroll - prevScroll;
      directionFactor.current = diff >= 0 ? 1 : -1;
      prevScroll = currentScroll;

      baseX.set(baseX.get() + baseVelocity * directionFactor.current * 0.05 + baseVelocity * 0.015);

      // Wrap at -50% (text duplicated so seamless)
      if (baseX.get() <= -50) baseX.set(0);
      if (baseX.get() >= 0 && directionFactor.current < 0) baseX.set(-50);

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [baseVelocity, baseX]);

  const wrappedStyle = { x: `${baseX.get()}%` };

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div style={wrappedStyle} className="inline-block">
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  );
}

/**
 * SectionTransition — wraps a section with a cinematic clip-path reveal
 * that plays when the section enters the viewport.
 */
export function SectionTransition({ children, className = "" }) {
  return (
    <motion.div
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * CursorTrail — renders the custom ember dot + trailing ring cursor.
 * Import once in App.jsx and mount at root level.
 */
export function CursorTrail() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ cx: -200, cy: -200, rx: -200, ry: -200 });

  useEffect(() => {
    const onMove = (e) => { pos.current.cx = e.clientX; pos.current.cy = e.clientY; };
    document.addEventListener("mousemove", onMove);

    let frameId;
    const loop = () => {
      const p = pos.current;
      p.rx += (p.cx - p.rx) * 0.12;
      p.ry += (p.cy - p.ry) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.left = `${p.cx}px`;
        dotRef.current.style.top  = `${p.cy}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${p.rx}px`;
        ringRef.current.style.top  = `${p.ry}px`;
      }
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    const hoverables = document.querySelectorAll("a, button");
    const enter = () => {
      if (ringRef.current) { ringRef.current.style.width = "56px"; ringRef.current.style.height = "56px"; ringRef.current.style.borderColor = "var(--ember)"; }
      if (dotRef.current)  { dotRef.current.style.background = "#6FE3D9"; }
    };
    const leave = () => {
      if (ringRef.current) { ringRef.current.style.width = "36px"; ringRef.current.style.height = "36px"; ringRef.current.style.borderColor = "rgba(255,107,61,0.5)"; }
      if (dotRef.current)  { dotRef.current.style.background = "#FF6B3D"; }
    };
    hoverables.forEach(el => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frameId);
      hoverables.forEach(el => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
