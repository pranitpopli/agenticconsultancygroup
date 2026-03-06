import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Section {
  id: string;
  number: string;
  title: string;
}

const SECTIONS: Section[] = [
  { id: "section-01", number: "01", title: "The Initiative" },
  { id: "section-02", number: "02", title: "Cost & Business Value" },
  { id: "section-03", number: "03", title: "Feasibility Assessment" },
  { id: "section-04", number: "04", title: "Proposed Team" },
  { id: "section-05", number: "05", title: "Recommended Approach" },
  { id: "section-06", number: "06", title: "Org Key Results" },
];

const BriefingIndex = () => {
  const [activeSection, setActiveSection] = useState<string>("section-01");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to the top
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveSection(top.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-1"
    >
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-sm text-left transition-all duration-200 ${
              isActive
                ? "bg-foreground/5"
                : "hover:bg-foreground/[0.03]"
            }`}
          >
            <span
              className={`text-[10px] font-sans tracking-[0.1em] transition-colors duration-200 ${
                isActive ? "text-foreground" : "text-foreground/30 group-hover:text-foreground/50"
              }`}
            >
              {section.number}
            </span>
            <span
              className={`text-[11px] transition-colors duration-200 ${
                isActive ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/60"
              }`}
            >
              {section.title}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
};

export default BriefingIndex;
