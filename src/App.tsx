import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import Radar from "./pages/Radar";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* TooltipProvider has no <Tooltip> under it anywhere in src/, so it is
        currently inert. Kept deliberately, unlike the two toasters removed
        alongside it on 31 Aug 2026: radix throws if a Tooltip mounts without a
        provider, so this one line is what makes adding a tooltip later just
        work. The toasters had the opposite property — mounted with nothing
        calling toast(), they rendered nothing and could not. */}
    <TooltipProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/radar" element={<Radar />} />
            <Route path="/stack" element={<Navigate to="/tools" replace />} />
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
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
