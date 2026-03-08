import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BriefingDocument } from "@/lib/briefingData";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
}

interface ConversationLayerProps {
  doc: BriefingDocument;
  onUpdate: (updates: Partial<BriefingDocument>) => void;
  onFinalize: () => void;
  active: boolean;
  onActivate: () => void;
  externalInput?: string | null;
  onExternalInputHandled?: () => void;
}


const AI_RESPONSES: Record<string, { content: string; update?: Partial<BriefingDocument> }> = {
  "replace sarah": {
    content: "Understood. I've replaced Sarah Chen with Leo Martinelli — he has comparable API architecture experience and led the Payment Service Rewrite in 2023. He's currently available and has collaborated with James O'Brien on two previous projects. The cost estimate has been adjusted downward by £4,000 due to his lower rate.",
    update: {
      internalCost: 182000,
      saving: 288000,
    },
  },
  "10 weeks": {
    content: "A 10-week timeline is achievable but introduces higher risk. Phase 2 would overlap significantly with Phase 1, requiring the frontend team to begin work on assumptions rather than completed APIs. I'd recommend a 12-week compromise — it preserves parallel execution while maintaining a two-week stabilisation buffer. I've updated the phases below.",
    update: {
      phases: [
        { number: 1, title: "Foundation & API Gateway", weeks: "Weeks 1–5", description: "Accelerated API consolidation with parallel authentication service rebuild. Observability baseline established by week 3." },
        { number: 2, title: "Frontend Migration", weeks: "Weeks 4–10", description: "Begin frontend migration in parallel with API stabilisation. Higher coordination overhead but compresses timeline by 4 weeks." },
        { number: 3, title: "Stabilisation & Handover", weeks: "Weeks 10–12", description: "Compressed stabilisation phase. Load testing, documentation, and handover conducted in parallel streams." },
      ],
    },
  },
  "reduce budget": {
    content: "I've modelled a 15% budget reduction. The main lever is replacing the external security audit with an in-house review led by Omar Hassan — this saves £28,000 but extends the security sign-off by one week. I've also reduced the contingency buffer from 12% to 8%. Total revised estimate: £158,000.",
    update: {
      internalCost: 158000,
      saving: 312000,
    },
  },
  "increase budget": {
    content: "With additional budget I'd recommend three investments: (1) dedicated QA resource from week 1 rather than week 6, (2) an external accessibility audit in parallel with Phase 2, and (3) a 15% contingency buffer instead of 8%. This raises the estimate to £215,000 but significantly de-risks delivery.",
    update: {
      internalCost: 215000,
    },
  },
  "smaller team": {
    content: "A leaner team of 4 instead of 6 is feasible if we extend the timeline to 18 weeks. I'd keep the two senior engineers and the QA lead, dropping the junior frontend role and consolidating design into a part-time allocation. The trade-off is slower iteration on the frontend migration phase.",
  },
  "add someone": {
    content: "Based on the current brief, the biggest gap is frontend performance expertise. I'd recommend adding Yuki Tanaka — she led the Performance Optimization Sprint and has direct experience with the component library the frontend migration will touch. Her partial availability from week 3 aligns well with Phase 2.",
  },
  "remove phase": {
    content: "If we remove the stabilisation phase entirely, we save 2 weeks but lose the safety net for load testing and documentation. A middle ground: merge stabilisation into the final week of Phase 2 as a parallel workstream. This compresses the timeline by one week while retaining critical validation steps.",
  },
  "risk": {
    content: "The top three risks are: (1) API dependency on the legacy auth service — if the auth team's timeline slips, Phase 1 is blocked. Mitigation: build an adapter layer. (2) Frontend team starting on assumptions — partially mitigated by the 12-week compromise timeline. (3) Key person dependency on Sarah Chen for institutional knowledge — mitigated by pairing her with Leo Martinelli in weeks 1–3.",
  },
};

const ConversationLayer = ({ doc, onUpdate, onFinalize, active, onActivate, externalInput, onExternalInputHandled }: ConversationLayerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle external input from the fixed bottom bar
  useEffect(() => {
    if (externalInput && !typing) {
      processMessage(externalInput);
      onExternalInputHandled?.();
    }
  }, [externalInput]);

  const processMessage = (text: string) => {
    const userMsg: Message = { id: `user-${Date.now()}`, role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    onActivate();

    const textLower = text.toLowerCase();
    let response: { content: string; update?: Partial<BriefingDocument> } = {
      content: "Noted. I've updated the briefing to reflect your feedback — you can see the changes in the document above.",
      update: undefined as Partial<BriefingDocument> | undefined,
    };

    if (textLower.includes("replace") && textLower.includes("sarah")) {
      response = AI_RESPONSES["replace sarah"];
    } else if (textLower.includes("10 week") || textLower.includes("shorter") || textLower.includes("faster")) {
      response = AI_RESPONSES["10 weeks"];
    } else if (textLower.includes("reduce") && textLower.includes("budget") || textLower.includes("cut cost") || textLower.includes("cheaper")) {
      response = AI_RESPONSES["reduce budget"];
    } else if (textLower.includes("increase") && textLower.includes("budget") || textLower.includes("more budget") || textLower.includes("invest more")) {
      response = AI_RESPONSES["increase budget"];
    } else if (textLower.includes("smaller team") || textLower.includes("fewer people") || textLower.includes("reduce team")) {
      response = AI_RESPONSES["smaller team"];
    } else if (textLower.includes("add someone") || textLower.includes("add a") || textLower.includes("extra person") || textLower.includes("more people")) {
      response = AI_RESPONSES["add someone"];
    } else if (textLower.includes("remove phase") || textLower.includes("simplify") || textLower.includes("skip phase")) {
      response = AI_RESPONSES["remove phase"];
    } else if (textLower.includes("risk") || textLower.includes("what could go wrong") || textLower.includes("concern")) {
      response = AI_RESPONSES["risk"];
    }

    setTimeout(() => {
      const aiMsg: Message = { id: `ai-${Date.now()}`, role: "ai", content: response.content };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);

      if (response.update) {
        onUpdate(response.update);
      }
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="space-y-6"
    >
      {/* Messages */}
      <div className="space-y-5">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i === 0 ? 0 : 0.1 }}
            className={msg.role === "ai" ? "" : "pl-8"}
          >
            {msg.role === "ai" ? (
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.15em] text-foreground/50">ACG</span>
                <p className="text-sm text-foreground leading-[1.8]">{msg.content}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.15em] text-foreground/50">You</span>
                <p className="text-sm text-foreground leading-[1.7]">{msg.content}</p>
              </div>
            )}
          </motion.div>
        ))}

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
            <span className="text-[11px] uppercase tracking-[0.15em] text-foreground/50">ACG</span>
            <div className="flex gap-1.5 py-2">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>


      {/* Finalize button — appears after conversation */}
      {messages.length > 2 && !typing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-4"
        >
          <button
            onClick={onFinalize}
            className="text-xs tracking-[0.1em] uppercase text-foreground border border-foreground px-6 py-3 hover:bg-foreground hover:text-primary-foreground transition-colors"
          >
            Finalise briefing →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ConversationLayer;
