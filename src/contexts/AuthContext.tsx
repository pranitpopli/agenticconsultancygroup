import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  email: string;
  name: string;
  initials: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

function deriveUser(email: string): User {
  const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const parts = name.split(" ");
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
  return { email, name, initials };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("acg-auth");
      if (stored) {
        const { email } = JSON.parse(stored);
        return deriveUser(email);
      }
    } catch {}
    return null;
  });

  const login = useCallback((email: string) => {
    const u = deriveUser(email);
    localStorage.setItem("acg-auth", JSON.stringify({ email }));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("acg-auth");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
