import { animate, stagger } from "motion";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduced) {
  const heroItems = document.querySelectorAll<HTMLElement>("[data-hero-seq]");
  if (heroItems.length > 0) {
    animate(
      heroItems,
      { opacity: [0, 1], transform: ["translateY(16px)", "translateY(0)"] },
      { duration: 0.55, delay: stagger(0.12), ease: [0.25, 1, 0.5, 1] },
    );
  }

  for (const path of document.querySelectorAll<SVGPathElement>("[data-route-line]")) {
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          animate(path, { strokeDashoffset: [length, 0] }, { duration: 1.4, ease: [0.25, 1, 0.5, 1] });
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    ).observe(path);
  }
}
