import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserAnalyticsProvider } from "@/contexts/UserAnalyticsContext";
import { OfflineModeBanner } from "@/components/OfflineModeBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PublicLayout } from "@/components/PublicLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ConditionalHomePage } from "@/components/ConditionalHomePage";
import Index from "./pages/Index";
import Practice from "./pages/Practice";
import InterviewPractice from "./pages/InterviewPractice";
import RestaurantPractice from "./pages/RestaurantPractice";
import ShoppingPractice from "./pages/ShoppingPractice";
import GrammarTutor from "./pages/GrammarTutor";
import PresentationPractice from "./pages/PresentationPractice";
import SocialPractice from "./pages/SocialPractice";
import BusinessPractice from "./pages/BusinessPractice";
import SpeakingPractice from "./pages/SpeakingPractice";
import CulturalPractice from "./pages/CulturalPractice";
import HumanoidPractice from "./pages/HumanoidPractice";
import InterviewChat from "./pages/InterviewChat";
import RestaurantChat from "./pages/RestaurantChat";
import ShoppingChat from "./pages/ShoppingChat";
import GrammarChat from "./pages/GrammarChat";
import PresentationChat from "./pages/PresentationChat";
import SocialChat from "./pages/SocialChat";
import BusinessChat from "./pages/BusinessChat";
import SpeakingChat from "./pages/SpeakingChat";
import CulturalChat from "./pages/CulturalChat";
import HumanoidChat from "./pages/HumanoidChat";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import GameArena from "./pages/GameArena";
import GrammarDetective from "./pages/GrammarDetective";

const queryClient = new QueryClient();

// Layout component that includes navigation
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <OfflineModeBanner />
    {children}
  </div>
);

// Placeholder component for unimplemented pages
const PlaceholderPage = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Layout>
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-gradient-to-br from-nova-500/20 to-electric-500/20 rounded-2xl flex items-center justify-center mx-auto glow">
          <span className="text-4xl">🚧</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          This page is under development. Continue prompting to help build out
          this section!
        </p>
      </div>
    </div>
  </Layout>
);

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="aangilam-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <UserAnalyticsProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Home Route - Public for unauthenticated users, redirects to dashboard for authenticated */}
                <Route path="/" element={<ConditionalHomePage />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/practice"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Practice />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/practice/interview"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <InterviewPractice />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/practice/restaurant"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <RestaurantPractice />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/practice/shopping"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ShoppingPractice />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/grammar"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <GrammarTutor />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/practice/interview/chat"
                  element={
                    <ProtectedRoute>
                      <InterviewChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/practice/restaurant/chat"
                  element={
                    <ProtectedRoute>
                      <RestaurantChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/practice/shopping/chat"
                  element={
                    <ProtectedRoute>
                      <ShoppingChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/grammar/chat"
                  element={
                    <ProtectedRoute>
                      <GrammarChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/presentation"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PresentationPractice />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/presentation/chat"
                  element={
                    <ProtectedRoute>
                      <PresentationChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/social"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <SocialPractice />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/social/chat"
                  element={
                    <ProtectedRoute>
                      <SocialChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/business"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <BusinessPractice />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/business/chat"
                  element={
                    <ProtectedRoute>
                      <BusinessChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/speaking"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <SpeakingPractice />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/speaking/chat"
                  element={
                    <ProtectedRoute>
                      <SpeakingChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cultural"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CulturalPractice />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cultural/chat"
                  element={
                    <ProtectedRoute>
                      <CulturalChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/humanoid"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <HumanoidPractice />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/humanoid/chat"
                  element={
                    <ProtectedRoute>
                      <HumanoidChat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pronunciation"
                  element={
                    <ProtectedRoute>
                      <PlaceholderPage
                        title="Pronunciation Coach"
                        description="Perfect your pronunciation with real-time feedback and coaching."
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stories"
                  element={
                    <ProtectedRoute>
                      <PlaceholderPage
                        title="Story Mode"
                        description="Learn through immersive storytelling and interactive role-play."
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/game-arena"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <GameArena />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/grammar-detective"
                  element={
                    <ProtectedRoute>
                      <GrammarDetective />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <NotFound />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </UserAnalyticsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
