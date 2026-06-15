import { motion } from "framer-motion";
import { about, specSheet } from "../data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-10">
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-glass"
      >
        Scene 00 — About
      </motion.p>

      <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="space-y-6"
        >
          {about.paragraphs.map((para, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              className="font-display text-2xl font-light leading-relaxed text-paper sm:text-3xl"
            >
              {para}
            </motion.p>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="border border-line bg-panel/60 p-6 sm:p-8"
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-steel">Spec Sheet</p>
          <dl className="space-y-4">
            {specSheet.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                className="flex flex-col gap-1 border-b border-line pb-4 last:border-none last:pb-0 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-ember">{item.label}</dt>
                <dd className="font-body text-sm text-paper sm:text-right">{item.value}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
