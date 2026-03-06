import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OikosNav from "@/components/OikosNav";
import TaskInput from "@/components/TaskInput";
import SwarmFeed from "@/components/SwarmFeed";
import { createSession, simulateRound } from "@/lib/swarmSimulator";
import type { SwarmSession } from "@/lib/swarmTypes";

const Index = () => {
  const [session, setSession] = useState<SwarmSession | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSwarm = useCallback((task: string) => {
    const newSession = createSession(task);
    newSession.status = "running";
    setSession({ ...newSession });
    setIsRunning(true);

    let current = newSession;

    const tick = () => {
      const { session: updated } = simulateRound(current);
      current = updated;

      setSession({ ...current });

      if (current.status === "complete") {
        setIsRunning(false);
        return;
      }

      intervalRef.current = setTimeout(tick, 1200 + Math.random() * 600);
    };

    intervalRef.current = setTimeout(tick, 800);
  }, []);

  const showHero = !session;

  return (
    <div className="min-h-screen bg-background">
      <OikosNav />

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
              <div className="text-center space-y-5 max-w-md">
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-4xl md:text-5xl font-serif tracking-tight text-foreground leading-[1.1]"
                >
                  A living tournament
                  <br />
                  <span className="italic">of intelligence.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-sm text-muted-foreground leading-relaxed font-light"
                >
                  Agents compete, adapt, and refine. The apex emerges
                  from conflict, not consensus.
                </motion.p>
              </div>

              <TaskInput onSubmit={runSwarm} isRunning={isRunning} />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-[11px] text-muted-foreground/50 font-light"
              >
                Try: "Write a compelling opening line for a sci-fi novel"
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-10 pt-4"
            >
              <TaskInput onSubmit={runSwarm} isRunning={isRunning} />
              <SwarmFeed session={session} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
