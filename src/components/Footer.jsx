import { motion } from "framer-motion";
import { profile } from "../data/content";
import { MagneticButton } from "./UI";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Footer() {
  return (
    <footer className="border-t border-line">
      {/* Upper footer */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="flex flex-col items-start gap-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">
              Ready to roll?
            </p>
            <h2 className="mt-2 font-display text-4xl font-light tracking-tight sm:text-5xl">
              Let's shoot.
            </h2>
            <a
              href={`mailto:${profile.email}`}
              className="bracket-link mt-4 inline-block font-mono text-sm uppercase tracking-[0.2em] text-ember"
            >
              {profile.email}
            </a>
          </div>

          <div className="flex gap-4">
            {profile.socials.map((s) => (
              <MagneticButton key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-line font-mono text-[10px] uppercase text-steel transition-colors hover:border-ember hover:text-ember"
                >
                  {s.label.slice(0, 2)}
                </a>
              </MagneticButton>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lower bar */}
      <div className="border-t border-line px-6 py-6 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-steel sm:flex-row">
          <span>
            © {new Date().getFullYear()} Abdul Wahid · ABDDEVELOPER — All scenes shot in-browser
          </span>
          <a href="#" className="bracket-link text-paper">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
