import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Briefcase, Users, Star, DollarSign } from "lucide-react";
import BriefingNav from "@/components/BriefingNav";
import { EMPLOYEES } from "@/lib/simulatedData";

const priorityStyle: Record<string, string> = {
  critical: "text-destructive border-destructive/30 bg-destructive/10",
  high: "text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning)/0.3)] bg-[hsl(var(--status-warning-bg))]",
  medium: "text-muted-foreground border-border bg-muted",
  low: "text-muted-foreground/60 border-border/50 bg-muted/50",
};

const availabilityStyle: Record<string, string> = {
  available: "text-[hsl(var(--status-positive))] border-[hsl(var(--status-positive)/0.3)] bg-[hsl(var(--status-positive-bg))]",
  partial: "text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning)/0.3)] bg-[hsl(var(--status-warning-bg))]",
  committed: "text-muted-foreground border-border bg-muted",
};

const PersonProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const employee = EMPLOYEES.find((e) => e.id === id);

  if (!employee) {
    return (
      <div className="min-h-screen bg-background">
        <BriefingNav activeTab="people" onTabChange={(tab) => { if (tab === "briefings") navigate("/"); }} />
        <main className="max-w-[800px] mx-auto px-4 sm:px-8 pt-28 pb-24 text-center">
          <p className="text-sm text-muted-foreground">Person not found.</p>
          <button onClick={() => navigate("/people")} className="mt-4 text-xs text-foreground underline underline-offset-4">
            ← Back to People
          </button>
        </main>
      </div>
    );
  }

  const activeProjects = employee.pastProjects.filter((p) => p.status === "active");
  const completedProjects = employee.pastProjects
    .filter((p) => p.status === "completed")
    .sort((a, b) => b.year - a.year);

  const collaborators = employee.collaborators
    .map((cId) => EMPLOYEES.find((e) => e.id === cId))
    .filter(Boolean);

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <BriefingNav
        activeTab="people"
        onTabChange={(tab) => {
          if (tab === "briefings") navigate("/");
        }}
      />

      <motion.main
        className="max-w-[800px] mx-auto px-4 sm:px-8 pt-28 pb-24"
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
      >
        {/* Back link */}
        <motion.div variants={item} className="mb-8">
          <button
            onClick={() => navigate("/people")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Back to People
          </button>
        </motion.div>

        {/* Header */}
        <motion.div variants={item} className="flex items-start gap-5 mb-10">
          <span className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-lg text-muted-foreground font-medium shrink-0">
            {employee.avatarInitials}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl text-foreground">{employee.name}</h1>
              <span className={`text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 border ${availabilityStyle[employee.availability] || ""}`}>
                {employee.availability}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{employee.role}</p>
            <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" strokeWidth={1.5} />{employee.location}</span>
              <span>{employee.department}</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3" strokeWidth={1.5} />{employee.seniorityLevel}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" strokeWidth={1.5} />{employee.yearsExperience} yrs</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" strokeWidth={1.5} />£{employee.hourlyRate}/hr</span>
            </div>
          </div>
        </motion.div>

        {/* Skills & Technologies */}
        <motion.div variants={item} className="border border-border p-5 mb-5 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {employee.skills.map((s) => (
              <span key={s} className="text-[11px] text-foreground border border-border px-2.5 py-1">{s}</span>
            ))}
          </div>

          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground block pt-2">Technologies</span>
          <div className="flex flex-wrap gap-1.5">
            {employee.technologies.map((t) => (
              <span key={t} className="text-[11px] text-muted-foreground border border-border/60 px-2.5 py-1">{t}</span>
            ))}
          </div>

          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground block pt-2">Domain expertise</span>
          <div className="flex flex-wrap gap-1.5">
            {employee.domainExpertise.map((d) => (
              <span key={d} className="text-[11px] text-foreground/80 border border-border px-2.5 py-1 bg-muted/30">{d}</span>
            ))}
          </div>
        </motion.div>

        {/* Active Projects */}
        {activeProjects.length > 0 && (
          <motion.div variants={item} className="border border-border p-5 mb-5 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="w-3 h-3" strokeWidth={1.5} />
              Active projects ({activeProjects.length})
            </span>
            <div className="space-y-2">
              {activeProjects.map((p) => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm text-foreground">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.role} · {p.year}</p>
                  </div>
                  {p.priority && (
                    <span className={`text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 border ${priorityStyle[p.priority] || ""}`}>
                      {p.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Completed Projects */}
        {completedProjects.length > 0 && (
          <motion.div variants={item} className="border border-border p-5 mb-5 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Past projects ({completedProjects.length})
            </span>
            <div className="space-y-2">
              {completedProjects.map((p) => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm text-foreground/70">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.role} · {p.year}</p>
                  </div>
                  {p.priority && (
                    <span className="text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 border border-border/50 text-muted-foreground/60">
                      {p.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Collaborators */}
        {collaborators.length > 0 && (
          <motion.div variants={item} className="border border-border p-5 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
              <Users className="w-3 h-3" strokeWidth={1.5} />
              Frequent collaborators ({collaborators.length})
            </span>
            <div className="space-y-2">
              {collaborators.map((c) => c && (
                <Link
                  key={c.id}
                  to={`/people/${c.id}`}
                  className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0 hover:bg-muted/30 -mx-2 px-2 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-medium shrink-0">
                    {c.avatarInitials}
                  </span>
                  <div>
                    <p className="text-sm text-foreground">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.role} · {c.department}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default PersonProfile;
