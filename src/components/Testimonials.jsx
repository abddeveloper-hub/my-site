import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "../data/content";

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (newDir) => {
    setDirection(newDir);
    setIndex((prev) => (prev + newDir + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <section className="relative overflow-hidden border-y border-line bg-panel/30 py-24 px-6 sm:px-10">
      {/* Decorative quote mark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-6 font-display text-[12rem] font-light leading-none text-paper/[0.03] sm:left-12"
      >
        "
      </span>

      <div className="mx-auto max-w-4xl">
        <p className="mb-12 font-mono text-xs uppercase tracking-[0.3em] text-glass">
          From the Audience
        </p>

        <div className="relative min-h-[14rem] overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.blockquote
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex flex-col justify-between"
            >
              <p className="font-display text-2xl font-light leading-relaxed text-paper sm:text-3xl lg:text-4xl">
                "{current.quote}"
              </p>
              <footer className="mt-8 flex items-center gap-4">
                <span className="h-px w-12 bg-ember" />
                <div>
                  <p className="font-body text-sm font-medium text-paper">{current.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel">
                    {current.role}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center gap-6">
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center border border-line text-steel transition-colors hover:border-ember hover:text-ember"
          >
            ←
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                aria-label={`Testimonial ${i + 1}`}
                className={`h-px w-8 transition-colors duration-300 ${i === index ? "bg-ember" : "bg-line"}`}
              />
            ))}
          </div>
          <button
            onClick={() => paginate(1)}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center border border-line text-steel transition-colors hover:border-ember hover:text-ember"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
