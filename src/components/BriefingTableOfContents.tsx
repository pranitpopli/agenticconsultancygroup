import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { List, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TocSection {
  number: string;
  title: string;
}

interface Props {
  sections: TocSection[];
}

const BriefingTableOfContents = ({ sections }: Props) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          setActiveSection(id);
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.number}`);
      if (el) observer.observe(el);
    });

    // Also observe executive summary
    const execEl = document.getElementById("executive-summary");
    if (execEl) observer.observe(execEl);

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (isMobile) setOpen(false);
    }
  };

  const allItems = [
    { id: "executive-summary", label: "Executive Summary" },
    ...sections.map((s) => ({ id: `section-${s.number}`, label: `${s.number} ${s.title}` })),
  ];

  // Mobile: floating button + drawer
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-40 w-10 h-10 bg-foreground text-primary-foreground flex items-center justify-center shadow-lg print:hidden"
          aria-label="Table of contents"
        >
          <List className="w-4 h-4" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40 bg-foreground/20" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-background border-l border-border p-5 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Contents</span>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="space-y-1">
                {allItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item.id)}
                    className={`block w-full text-left text-xs py-2 px-3 transition-colors ${
                      activeSection === item.id
                        ? "text-foreground bg-secondary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </>
    );
  }

  // Desktop: fixed side rail
  return (
    <nav
      className="fixed top-28 right-8 w-48 z-20 print:hidden"
      aria-label="Table of contents"
    >
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-3">Contents</p>
      <div className="space-y-0.5">
        {allItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`block w-full text-left text-[11px] py-1.5 px-3 border-l-2 transition-all duration-200 ${
              activeSection === item.id
                ? "border-foreground text-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BriefingTableOfContents;
