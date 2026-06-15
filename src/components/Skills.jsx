import { techMarquee } from "../data/content";

function Row({ direction, accent }) {
  const items = [...techMarquee, ...techMarquee];
  const animationClass = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  return (
    <div className="overflow-hidden border-y border-line py-4">
      <div className={`marquee-track ${animationClass}`}>
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-3 flex items-center gap-3 whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-steel"
          >
            <span className={`h-1 w-1 rounded-full ${accent}`} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-16">
      <div className="mx-auto mb-10 max-w-6xl px-6 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-glass">Toolkit</p>
      </div>
      <div className="space-y-2">
        <Row direction="left" accent="bg-ember" />
        <Row direction="right" accent="bg-glass" />
      </div>
    </section>
  );
}
