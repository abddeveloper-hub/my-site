import { motion } from "framer-motion";
import { profile } from "../data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 py-28 sm:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="mx-auto max-w-6xl border border-line bg-paper px-8 py-16 text-obsidian sm:px-16 sm:py-24"
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-ember">Cut To — Contact</p>
        <h2 className="max-w-2xl font-display text-4xl font-light leading-tight tracking-tight sm:text-6xl">
          Let's make something worth watching.
        </h2>
        <p className="mt-6 max-w-md font-body text-sm text-obsidian/70 sm:text-base">
          Open to freelance projects, collaborations, and full-time roles where motion and engineering meet.
        </p>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 font-mono text-xs uppercase tracking-[0.2em]">
          <a href={`mailto:${profile.email}`} className="bracket-link">
            [ {profile.email} ]
          </a>
          {profile.socials.map((social) => (
            <a key={social.label} href={social.href} className="bracket-link" target="_blank" rel="noreferrer">
              [ {social.label} ]
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
