import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import Stack from "./pages/Stack";
import WhatsNew from "./pages/WhatsNew";
import MyStack from "./pages/MyStack";
import Learning from "./pages/Learning";
import Submit from "./pages/Submit";
import DesignKit from "./pages/DesignKit";
import PolicyTemplate from "./pages/PolicyTemplate";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import { CookieBanner } from "@/components/CookieBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/stack" element={<Stack />} />
            <Route path="/ai-news" element={<WhatsNew />} />
            <Route path="/whats-new" element={<Navigate to="/ai-news" replace />} />
            <Route path="/my-stack" element={<MyStack />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/design-kit" element={<DesignKit />} />
            <Route path="/subscribe" element={<Navigate to="/policy-template" replace />} />
            <Route path="/policy-template" element={<PolicyTemplate />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
