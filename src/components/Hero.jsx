import { motion } from "framer-motion";
import LensScene from "./LensScene";
import RecIndicator from "./RecIndicator";
import Timecode from "./Timecode";
import { MagneticButton } from "./UI";
import { profile } from "../data/content";

const titleLine = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const word = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function RevealWords({ text, className }) {
  return (
    <motion.span
      variants={titleLine}
      initial="hidden"
      animate="visible"
      className={`inline-block overflow-hidden ${className}`}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} className="mr-[0.28em] inline-block overflow-hidden last:mr-0">
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* HI highlight inside "Wahid" */
function WahidName() {
  return (
    <span className="inline-flex items-baseline">
      <span className="mr-[0.28em] inline-block overflow-hidden">
        <motion.span
          variants={word}
          className="inline-block"
        >
          Wa
        </motion.span>
      </span>
      <motion.span
        initial={{ opacity: 0, y: "60%", scale: 0.6, rotate: -8 }}
        animate={{ opacity: 1, y: "0%", scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block text-ember"
        style={{
          textShadow: "0 0 24px rgba(255,107,61,0.6), 0 0 60px rgba(255,107,61,0.25)",
          animation: "hiGlow 2.8s ease-in-out 1.3s infinite",
        }}
      >
        HI
      </motion.span>
      <span className="inline-block overflow-hidden">
        <motion.span variants={word} className="inline-block">
          d
        </motion.span>
      </span>
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden">
      <LensScene />

      {/* HUD row */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-24 sm:px-10">
        <RecIndicator />
        <Timecode />
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 pb-24 sm:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-glass"
        >
          {profile.role} — {profile.location}
        </motion.p>

        <h1 className="font-display text-5xl font-light leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
          <motion.div variants={titleLine} initial="hidden" animate="visible">
            <RevealWords text={profile.name.split(" ")[0]} />
            {" "}
            <WahidName />
          </motion.div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl font-body text-base text-steel sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton>
            <a
              href="#work"
              className="inline-flex items-center gap-2 border border-ember bg-ember/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ember transition-colors duration-300 hover:bg-ember hover:text-obsidian"
            >
              View the Reel →
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-steel transition-colors duration-300 hover:border-paper hover:text-paper"
            >
              [ Get in Touch ]
            </a>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-8 right-6 z-10 hidden flex-col items-end gap-2 sm:right-10 sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-steel">
          Scroll — 00
        </span>
        <span className="h-10 w-px bg-line" />
      </motion.div>
    </section>
  );
}
