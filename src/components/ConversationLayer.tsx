import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import type { BriefingDocument } from "@/lib/briefingData";
import { EMPLOYEES } from "@/lib/simulatedData";

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
}

const SUGGESTIONS = [
  "Can we replace Sarah Chen? She's on another project.",
  "What if we run this in 10 weeks instead of 14?",
];

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
};

const ConversationLayer = ({ doc, onUpdate, onFinalize, active, onActivate }: ConversationLayerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "ai-intro",
      role: "ai",
      content: "This is my recommended team and approach. Would you like to adjust anything — swap a team member, revisit the timeline, or explore a different delivery model?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const processMessage = (text: string) => {
    const userMsg: Message = { id: `user-${Date.now()}`, role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    onActivate();

    const textLower = text.toLowerCase();
    let response = {
      content: "I've noted your feedback. Let me adjust the briefing accordingly. The document above has been updated to reflect this change.",
      update: undefined as Partial<BriefingDocument> | undefined,
    };

    if (textLower.includes("replace") && textLower.includes("sarah")) {
      response = AI_RESPONSES["replace sarah"];
    } else if (textLower.includes("10 week") || textLower.includes("shorter") || textLower.includes("faster")) {
      response = AI_RESPONSES["10 weeks"];
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    processMessage(input.trim());
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
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">ACG</span>
                <p className="text-sm text-foreground/80 leading-[1.8] font-serif italic">{msg.content}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">You</span>
                <p className="text-sm text-foreground leading-[1.7]">{msg.content}</p>
              </div>
            )}
          </motion.div>
        ))}

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">ACG</span>
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

      {/* Suggestion chips — only show initially */}
      {messages.length === 1 && !active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-2"
        >
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => processMessage(suggestion)}
              className="text-xs text-muted-foreground border border-border px-4 py-2 hover:border-foreground/30 hover:text-foreground transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 border border-border p-1">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Adjust the briefing…"
          className="flex-1 text-sm bg-transparent px-3 py-2.5 outline-none placeholder:text-muted-foreground/50"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          className="p-2.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <Send className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </form>

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
