import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProjectCard({ project, index }) {
  const isEven = index % 2 === 0;
  const accent = isEven ? "ember" : "glass";

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="group grid gap-8 border-b border-line py-12 first:pt-0 last:border-none lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden border border-line transition-transform duration-700 ease-out group-hover:scale-[1.02] ${
          isEven
            ? "bg-[linear-gradient(135deg,#1a0f0a_0%,#0b0d12_55%,#11141B_100%)]"
            : "bg-[linear-gradient(135deg,#0a1413_0%,#0b0d12_55%,#11141B_100%)]"
        }`}
      >
        <span
          className={`pointer-events-none absolute -bottom-10 -left-4 font-display text-[10rem] font-light leading-none ${
            isEven ? "text-ember/10" : "text-glass/10"
          }`}
        >
          {project.scene}
        </span>
        <span
          className={`absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] ${
            isEven ? "text-ember" : "text-glass"
          }`}
        >
          Scene {project.scene}
        </span>
      </div>

      <div>
        <h3 className="font-display text-3xl font-light tracking-tight text-paper sm:text-4xl">{project.title}</h3>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-steel opacity-70 transition-opacity duration-500 group-hover:opacity-100">
          <span>{project.role}</span>
          <span aria-hidden="true">·</span>
          <span>{project.year}</span>
          <span aria-hidden="true">·</span>
          <span>{project.stack.join(" / ")}</span>
        </div>

        <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-steel sm:text-base">{project.description}</p>

        <a
          href={project.href}
          className={`bracket-link mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] ${
            isEven ? "text-ember" : "text-glass"
          }`}
        >
          View Project <span aria-hidden="true">→</span>
        </a>
      </div>
    </motion.article>
  );
}
