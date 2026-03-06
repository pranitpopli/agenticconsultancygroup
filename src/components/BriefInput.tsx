import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Upload } from "lucide-react";

interface Integration {
  name: string;
  connected: boolean;
  pulling: boolean;
}

interface BriefInputProps {
  onSubmit: (text: string) => void;
}

const INITIAL_INTEGRATIONS: Integration[] = [
{ name: "Jira", connected: false, pulling: false },
{ name: "Trello", connected: false, pulling: false },
{ name: "Slack", connected: false, pulling: false },
{ name: "Confluence", connected: false, pulling: false },
{ name: "GitHub", connected: false, pulling: false }];


const BriefInput = ({ onSubmit }: BriefInputProps) => {
  const [value, setValue] = useState("");
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  const handleIntegrationClick = (index: number) => {
    if (integrations[index].connected || integrations[index].pulling) return;

    setIntegrations((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], pulling: true };
      return next;
    });

    setTimeout(() => {
      setIntegrations((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], pulling: false, connected: true };
        return next;
      });
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl space-y-8">
        
        <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight leading-[1.1] text-center">What is your next initative?

        </h1>

        <div className="border border-border rounded-sm focus-within:border-foreground/30 transition-colors duration-300">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Describe your project requirements or paste a brief…"
            rows={5}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm p-5 outline-none font-light resize-none leading-relaxed" />
          
          <div className="flex items-center justify-between px-5 pb-4">
            <button className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors border border-border px-2.5 py-1.5 rounded-sm">
              <Upload className="w-3 h-3" strokeWidth={1.5} />
              Upload Brief
            </button>
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-foreground border border-foreground/30 px-4 py-2 rounded-sm hover:bg-foreground hover:text-background transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
              
              Run Swarm
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Integration pills */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {integrations.map((intg, i) =>
          <button
            key={intg.name}
            onClick={() => handleIntegrationClick(i)}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground border border-border/60 px-3 py-1.5 rounded-sm hover:border-foreground/20 transition-all cursor-pointer">
            
              <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
              intg.connected ?
              "bg-green-500" :
              intg.pulling ?
              "bg-warm-accent animate-pulse" :
              "bg-muted-foreground/30"}`
              } />
            
              {intg.pulling ?
            <span className="text-warm-accent italic font-serif text-[10px] normal-case tracking-normal">
                  pulling history…
                </span> :

            intg.name
            }
            </button>
          )}
        </div>
      </motion.div>
    </div>);

};

export default BriefInput;