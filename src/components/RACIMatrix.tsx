import type { RACIEntry, Phase } from "@/lib/briefingData";

interface Props {
  entries: RACIEntry[];
  phases: Phase[];
}

function roleStyle(role: string) {
  switch (role) {
    case "R": return "bg-foreground text-primary-foreground font-medium";
    case "A": return "bg-foreground/80 text-primary-foreground";
    case "C": return "bg-secondary text-foreground";
    case "I": return "bg-secondary/50 text-muted-foreground";
    default: return "text-muted-foreground/30";
  }
}

function roleLabel(role: string) {
  switch (role) {
    case "R": return "Responsible";
    case "A": return "Accountable";
    case "C": return "Consulted";
    case "I": return "Informed";
    default: return "";
  }
}

const RACIMatrix = ({ entries, phases }: Props) => {
  return (
    <div>
      <p className="text-sm text-foreground/80 leading-[1.8] mb-6">
        Governance map showing each team member's accountability per delivery phase.
      </p>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="border border-border overflow-hidden min-w-[540px]">
          {/* Header */}
          <div className={`grid`} style={{ gridTemplateColumns: `2fr 1fr repeat(${phases.length}, 1fr)` }}>
            <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Team member</div>
            <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Role</div>
            {phases.map((phase) => (
              <div key={phase.number} className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border text-center">
                P{phase.number}
              </div>
            ))}
          </div>

          {/* Rows */}
          {entries.map((entry, i) => (
            <div
              key={i}
              className={`grid border-t border-border`}
              style={{ gridTemplateColumns: `2fr 1fr repeat(${phases.length}, 1fr)` }}
            >
              <div className="p-3 text-xs text-foreground font-medium">{entry.memberName}</div>
              <div className="p-3 text-xs text-muted-foreground border-l border-border">{entry.role}</div>
              {entry.phases.map((raci, pi) => (
                <div key={pi} className="p-3 border-l border-border flex items-center justify-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 text-[10px] font-mono ${roleStyle(raci)}`}>
                    {raci}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {["R", "A", "C", "I"].map((r) => (
          <div key={r} className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-5 h-5 text-[9px] font-mono ${roleStyle(r)}`}>{r}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">{roleLabel(r)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RACIMatrix;
