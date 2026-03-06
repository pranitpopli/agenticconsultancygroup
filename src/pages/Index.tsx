import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SwarmLeadNav from "@/components/SwarmLeadNav";
import BriefInput from "@/components/BriefInput";
import DiscoveryFeed from "@/components/DiscoveryFeed";
import { createSession, simulateStep } from "@/lib/talentSwarm";
import type { SwarmSession } from "@/lib/types";

const Index = () => {
  const [session, setSession] = useState<SwarmSession | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSwarm = useCallback((text: string) => {
    const newSession = createSession(text);
    newSession.status = "discovering";
    setSession({ ...newSession });
    setIsRunning(true);

    let current = newSession;

    const tick = () => {
      current = simulateStep(current);
      setSession({ ...current });

      if (current.status === "complete") {
        setIsRunning(false);
        return;
      }

      intervalRef.current = setTimeout(tick, 900 + Math.random() * 500);
    };

    intervalRef.current = setTimeout(tick, 600);
  }, []);

  const showHero = !session;

  return (
    <div className="min-h-screen bg-background">
      <SwarmLeadNav />

      <main className="relative px-6 pt-28 pb-20">
        <AnimatePresence mode="wait">
          {showHero ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[70vh] gap-10"
            >
              <div className="text-center space-y-5 max-w-lg">
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-4xl md:text-5xl font-serif tracking-tight text-foreground leading-[1.1]"
                >
                  Assemble the right team
                  <br />
                  <span className="italic">before the brief gets cold.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-sm text-muted-foreground leading-relaxed font-light max-w-md mx-auto"
                >
                  AI agents traverse your organisation's talent graph in parallel —
                  surfacing people, quantifying value, and explaining the shift.
                  No hierarchy. No bottlenecks.
                </motion.p>
              </div>

              <BriefInput onSubmit={runSwarm} isRunning={isRunning} />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-center space-y-2"
              >
                <p className="text-[11px] text-muted-foreground/50 font-light">
                  Try: "We need a cross-functional team for a customer-facing analytics platform"
                </p>
                <div className="flex items-center justify-center gap-6 pt-2">
                  <span className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.15em]">Talent Discovery</span>
                  <span className="text-[10px] text-muted-foreground/30">·</span>
                  <span className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.15em]">Business Value</span>
                  <span className="text-[10px] text-muted-foreground/30">·</span>
                  <span className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.15em]">Org Narrative</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-10 pt-4"
            >
              <BriefInput onSubmit={runSwarm} isRunning={isRunning} />
              <DiscoveryFeed session={session} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
