import { motion } from "framer-motion";
import { process } from "../data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const lineGrow = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 } },
};

export default function Process() {
  return (
    <section id="process" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <p className="label label--glass mb-4 font-mono text-xs uppercase tracking-[0.3em] text-glass">
          How It's Made
        </p>
        <h2 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
          The Process
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="relative mt-16 grid gap-0 lg:grid-cols-4"
      >
        {/* Horizontal connector line */}
        <motion.div
          variants={lineGrow}
          style={{ originY: 0 }}
          className="absolute left-0 right-0 top-5 hidden h-px bg-line lg:block"
        />

        {process.map((item, i) => (
          <motion.div
            key={item.step}
            variants={fadeUp}
            className="relative flex flex-col border-b border-line pb-10 pt-0 last:border-none lg:border-b-0 lg:border-r lg:px-8 lg:pb-0 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
          >
            {/* Step node */}
            <div className="relative z-10 mb-6 flex items-center gap-3 lg:mb-8">
              <span className="flex h-10 w-10 items-center justify-center border border-ember bg-obsidian font-mono text-[10px] uppercase tracking-widest text-ember">
                {item.step}
              </span>
              <span className="hidden h-px flex-1 bg-line lg:block" />
            </div>

            <h3 className="font-display text-xl font-light text-paper">{item.title}</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-steel">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
