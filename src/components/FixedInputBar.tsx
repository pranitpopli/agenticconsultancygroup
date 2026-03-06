import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileDown, Presentation, ChevronUp, FileText } from "lucide-react";

interface FixedInputBarProps {
  onSend: (text: string) => void;
  onExportPDF: () => void;
  onExportPPT: () => void;
  onExportDocx?: () => void;
  oqrOpen?: boolean;
}

const FixedInputBar = ({ onSend, onExportPDF, onExportPPT, onExportDocx, oqrOpen }: FixedInputBarProps) => {
  const [input, setInput] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div
      className={`fixed bottom-0 left-0 z-30 border-t border-border transition-all duration-300 ${oqrOpen ? "right-[360px]" : "right-0"}`}
      style={{ backgroundColor: "#FAF8F4" }}
    >
      <div className="max-w-[780px] mx-auto px-8 py-3 flex items-center gap-3">
        {/* Input */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 border border-border bg-background">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Adjust the briefing…"
            className="flex-1 text-sm bg-transparent px-4 py-2.5 outline-none placeholder:text-muted-foreground/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <Send className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </form>

        {/* Export button with dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(prev => !prev)}
            className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase border border-foreground px-4 py-2.5 text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" strokeWidth={1.5} />
            Export
            <ChevronUp className={`w-3 h-3 transition-transform ${exportOpen ? "" : "rotate-180"}`} strokeWidth={1.5} />
          </button>

          <AnimatePresence>
            {exportOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-2 right-0 w-56 border border-border shadow-sm"
                style={{ backgroundColor: "#FAF8F4" }}
              >
                <button
                  onClick={() => { onExportPDF(); setExportOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-foreground hover:bg-muted transition-colors text-left"
                >
                  <FileDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <p className="tracking-[0.05em] uppercase">Export as PDF</p>
                    <p className="text-muted-foreground normal-case tracking-normal mt-0.5">Feasibility brief document</p>
                  </div>
                </button>
                <div className="h-px bg-border" />
                <button
                  onClick={() => { onExportPPT(); setExportOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-foreground hover:bg-muted transition-colors text-left"
                >
                  <Presentation className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <p className="tracking-[0.05em] uppercase">Export as PPT</p>
                    <p className="text-muted-foreground normal-case tracking-normal mt-0.5">Board-ready presentation</p>
                  </div>
                </button>
                <div className="h-px bg-border" />
                <button
                  onClick={() => { onExportDocx?.(); setExportOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-foreground hover:bg-muted transition-colors text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <p className="tracking-[0.05em] uppercase">Export as DOCX</p>
                    <p className="text-muted-foreground normal-case tracking-normal mt-0.5">Editable Word document</p>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FixedInputBar;
