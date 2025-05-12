import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Fragment, useEffect } from "react";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import Donate from "./pages/Donate";
import Chat from "./pages/Chat";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import ProtectedRoute from "./providers/ProtectedRoute";
import ActivateAccount from "./pages/ActivateAccount";

const queryClient = new QueryClient();

// Page transition wrapper component
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [location]);

  return <Fragment key={location.pathname}>{children}</Fragment>;
};

function Logout(){
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Signup/>
}

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes location={location}>
      <Route path="/" element={
        <PageTransition>
          <Index />
        </PageTransition>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <PageTransition>
            <Tasks />
          </PageTransition>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <PageTransition>
            <Analytics />
          </PageTransition>
        </ProtectedRoute>
      } />
      <Route path="/login" element={
        <PageTransition>
          <Login />
        </PageTransition>
      } />
      <Route path="/logout" element={
        <PageTransition>
          <Logout />
        </PageTransition>
      } />
      <Route path="/signup" element={
        <PageTransition>
          <RegisterAndLogout />
        </PageTransition>
      } />
      <Route path="/documentation" element={
        <ProtectedRoute>
          <PageTransition>
            <Documentation />
          </PageTransition>
        </ProtectedRoute>
      } />
      <Route path="/donate" element={
        <PageTransition>
          <Donate />
        </PageTransition>
      } />
      <Route path="/activate/:uid/:token" element={
        <PageTransition>
          <ActivateAccount />
        </PageTransition>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
        <PageTransition>
          <Chat />
        </PageTransition>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <PageTransition>
            <Profile />
          </PageTransition>
        </ProtectedRoute>
      } />
      <Route path="*" element={
        <PageTransition>
          <NotFound />
        </PageTransition>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;