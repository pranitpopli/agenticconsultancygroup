import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import type { OQRData } from "@/lib/oqrData";

interface BoardDeckExportProps {
  onClose: () => void;
  data: OQRData;
}

const SLIDES = [
  "Executive Summary",
  "The Organisational Shift",
  "AI Projects in Flight",
  "Talent Intelligence",
  "Financial Model",
  "What AI Does That Humans Couldn't",
  "Recommended Next Steps",
];

const BoardDeckExport = ({ onClose, data }: BoardDeckExportProps) => {
  const [buildingSlide, setBuildingSlide] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (buildingSlide < SLIDES.length) {
      const timer = setTimeout(() => setBuildingSlide(prev => prev + 1), 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setComplete(true), 400);
      return () => clearTimeout(timer);
    }
  }, [buildingSlide]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        className="bg-background border border-border w-full max-w-md p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-serif">
            Board Deck Generation
          </span>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-sm transition-colors">
            <X className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-2">
          {SLIDES.map((slide, i) => (
            <motion.div
              key={slide}
              initial={{ opacity: 0, x: -8 }}
              animate={{
                opacity: i < buildingSlide ? 1 : i === buildingSlide ? 0.5 : 0.2,
                x: i <= buildingSlide ? 0 : -8,
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className={`w-5 h-5 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors ${
                i < buildingSlide
                  ? "border-foreground/30 bg-foreground/5"
                  : "border-border"
              }`}>
                {i < buildingSlide ? (
                  <Check className="w-3 h-3 text-foreground" strokeWidth={2} />
                ) : i === buildingSlide ? (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-warm-accent"
                  />
                ) : null}
              </div>
              <div className="flex-1">
                <span className="text-xs text-foreground/80">
                  Slide {i + 1} — {slide}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {complete ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 pt-2"
          >
            <p className="text-xs text-foreground/70 font-light font-serif italic">
              7-slide McKinsey-format deck generated from live OQR data. Includes financial model, org maturity, and AI project inventory.
            </p>
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-foreground border border-foreground/30 px-4 py-3 rounded-sm hover:bg-foreground hover:text-background transition-colors"
            >
              Download .pptx
            </button>
            <p className="text-[9px] text-center text-muted-foreground">
              AI-generated · {data.currentQuarter} · SwarmLead
            </p>
          </motion.div>
        ) : (
          <div className="pt-2">
            <div className="h-0.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-foreground/25 rounded-full"
                animate={{ width: `${(buildingSlide / SLIDES.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[9px] text-muted-foreground mt-2 text-center">
              Generating slides from live data…
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BoardDeckExport;
