import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import SwarmBackground from "@/components/SwarmBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      login(email);
      navigate("/");
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Swarm animation */}
      <SwarmBackground />

      {/* Subtle radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_80%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-sm px-6 relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-foreground mb-2">ACG</h1>
          <p className="text-sm text-muted-foreground">Agentic Consultancy Group</p>
        </div>

        {/* Frosted card */}
        <div className="backdrop-blur-md bg-card/70 border border-border/50 p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full text-sm bg-background/60 border border-border px-4 py-2.5 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50 text-foreground"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-background/60 border border-border px-4 py-2.5 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50 text-foreground"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-xs tracking-[0.12em] uppercase bg-foreground text-primary-foreground py-3 hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {loading ? "…" : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground/60 text-center mt-8">
          Demo mode — any credentials will work
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
