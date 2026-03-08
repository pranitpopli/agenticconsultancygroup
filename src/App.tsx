import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import { lazy, Suspense } from "react";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Index = lazy(() => import("./pages/Index"));
const Organisation = lazy(() => import("./pages/Organisation"));
const People = lazy(() => import("./pages/People"));
const PersonProfile = lazy(() => import("./pages/PersonProfile"));
const Settings = lazy(() => import("./pages/Settings"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Skip to content — accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-foreground focus:text-primary-foreground focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.12em]"
            >
              Skip to content
            </a>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
                <Route path="/briefings" element={<AuthGuard><Index /></AuthGuard>} />
                <Route path="/organisation" element={<AuthGuard><Organisation /></AuthGuard>} />
                <Route path="/people" element={<AuthGuard><People /></AuthGuard>} />
                <Route path="/people/:id" element={<AuthGuard><PersonProfile /></AuthGuard>} />
                <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
