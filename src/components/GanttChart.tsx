import { motion } from "framer-motion";
import type { Phase } from "@/lib/briefingData";

interface GanttChartProps {
  phases: Phase[];
}

const GanttChart = ({ phases }: GanttChartProps) => {
  // Parse all phase weeks to find the total range
  const ranges = phases.map((phase) => {
    const match = phase.weeks.match(/(\d+)[–-](\d+)/);
    return {
      start: match ? parseInt(match[1]) : 1,
      end: match ? parseInt(match[2]) : 16,
    };
  });
  const maxWeek = Math.max(...ranges.map((r) => r.end));

  // Group weeks into months (4 weeks each)
  const months = Array.from({ length: Math.ceil(maxWeek / 4) }, (_, i) => ({
    label: `Month ${i + 1}`,
    startWeek: i * 4 + 1,
    endWeek: Math.min((i + 1) * 4, maxWeek),
  }));

  return (
    <div className="border border-border">
      {/* Header */}
      <div className="flex items-center border-b border-border">
        <div className="w-[180px] flex-shrink-0 p-3 border-r border-border">
          <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Phase</span>
        </div>
        <div className="flex-1 flex">
          {months.map((month, i) => (
            <div
              key={i}
              className="flex-1 p-3 text-center border-r border-border last:border-r-0"
            >
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {month.label}
              </span>
              <div className="flex mt-1.5">
                {Array.from({ length: month.endWeek - month.startWeek + 1 }, (_, wi) => (
                  <div key={wi} className="flex-1 text-center">
                    <span className="text-[9px] text-muted-foreground/50">W{month.startWeek + wi}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase rows */}
      {phases.map((phase, pi) => {
        const { start, end } = ranges[pi];
        return (
          <div
            key={phase.number}
            className={`flex items-center ${pi > 0 ? "border-t border-border" : ""}`}
          >
            <div className="w-[180px] flex-shrink-0 p-3 border-r border-border">
              <p className="text-xs text-foreground font-medium">Phase {phase.number}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{phase.title}</p>
            </div>
            <div className="flex-1 relative h-12">
              {/* Grid lines */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: maxWeek }, (_, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${i > 0 ? "border-l border-border/30" : ""} ${
                      (i + 1) % 4 === 0 ? "border-r border-border/60" : ""
                    }`}
                  />
                ))}
              </div>
              {/* Bar */}
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + pi * 0.15, ease: "easeOut" }}
                className="absolute top-2 bottom-2 rounded-sm bg-foreground/12 flex items-center px-2.5"
                style={{
                  left: `${((start - 1) / maxWeek) * 100}%`,
                  width: `${((end - start + 1) / maxWeek) * 100}%`,
                }}
              >
                <span className="text-[10px] text-foreground/50 truncate">{phase.weeks}</span>
              </motion.div>
              {/* Overlap indicator */}
              {pi > 0 && ranges[pi - 1].end >= start && (
                <div
                  className="absolute top-0 bottom-0 bg-foreground/5 border-l border-dashed border-foreground/20"
                  style={{
                    left: `${((start - 1) / maxWeek) * 100}%`,
                    width: `${((Math.min(ranges[pi - 1].end, end) - start + 1) / maxWeek) * 100}%`,
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center gap-4 p-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-foreground/12" />
          <span className="text-[10px] text-muted-foreground">Active phase</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-foreground/5 border-l border-dashed border-foreground/20" />
          <span className="text-[10px] text-muted-foreground">Overlap period</span>
        </div>
        <span className="text-[10px] text-muted-foreground ml-auto">
          Total: {maxWeek} weeks
        </span>
      </div>
    </div>
  );
};

export default GanttChart;