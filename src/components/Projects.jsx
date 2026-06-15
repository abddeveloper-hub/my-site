import { motion } from "framer-motion";
import { projects } from "../data/content";
import ProjectCard from "./ProjectCard";
import { SectionTransition } from "./UI";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Projects() {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-glass">
            Selected Work
          </p>
          <h2 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
            The Reel
          </h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel">
          {projects.length} scenes / {new Date().getFullYear()}
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
        className="mt-8 h-px w-full bg-line"
      />

      <SectionTransition>
        <div className="mt-0">
          {projects.map((project, index) => (
            <ProjectCard key={project.scene} project={project} index={index} />
          ))}
        </div>
      </SectionTransition>
    </section>
  );
}
