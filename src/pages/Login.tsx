import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    // Simulated auth
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("acg-auth", JSON.stringify({ email, name: email.split("@")[0] }));
      toast({ title: isSignUp ? "Account created" : "Welcome back", description: "Redirecting to dashboard…" });
      navigate("/");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF8F4" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm px-6"
      >
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-foreground mb-2">ACG</h1>
          <p className="text-sm text-muted-foreground">Agentic Consultancy Group</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full text-sm bg-background border border-border px-4 py-2.5 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
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
              className="w-full text-sm bg-background border border-border px-4 py-2.5 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
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

        <p className="text-[10px] text-muted-foreground/60 text-center mt-8">
          Demo mode — any credentials will work
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
