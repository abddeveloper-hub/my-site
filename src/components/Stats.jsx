import { motion } from "framer-motion";
import { stats } from "../data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Stats() {
  return (
    <section className="relative border-y border-line bg-panel/40 py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
          className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="flex flex-col items-center justify-center gap-2 bg-panel/80 px-6 py-10 text-center"
            >
              <dt className="font-display text-5xl font-light text-ember sm:text-6xl">
                {stat.value}
              </dt>
              <dd className="font-mono text-[10px] uppercase tracking-[0.3em] text-steel">
                {stat.label}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
