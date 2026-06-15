import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "../data/content";

const links = [
  { label: "About",   href: "#about" },
  { label: "Work",    href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Skills",  href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 1.4 }}
        className={`fixed top-0 z-40 w-full transition-colors duration-500 ${
          scrolled
            ? "border-b border-line bg-obsidian/70 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <a href="#" className="font-display text-lg font-medium tracking-tight">
            ABDDEVELOPER
          </a>

          {/* Desktop links */}
          <ul className="hidden gap-8 font-mono text-xs uppercase tracking-[0.2em] text-steel sm:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="bracket-link transition-colors hover:text-paper"
                >
                  {`[ ${link.label} ]`}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex flex-col gap-[5px] sm:hidden"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block h-px w-6 bg-paper transition-all"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-px w-6 bg-paper"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block h-px w-6 bg-paper"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-16 z-30 border-b border-line bg-obsidian/95 px-6 py-8 backdrop-blur-md sm:hidden"
          >
            <ul className="flex flex-col gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-mono text-xs uppercase tracking-[0.2em] text-steel transition-colors hover:text-paper"
                  >
                    {`[ ${link.label} ]`}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-line">
              {profile.email}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
