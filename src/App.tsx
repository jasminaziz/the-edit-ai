import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";

// Every page but the homepage loads its own chunk on first visit, the same way
// Index.tsx already lazy-loads HomeGravity. Gates 2.2, 9 Oct 2026: with all
// twelve pages imported statically the main chunk sat over Vite's 500 kB
// warning. The homepage stays static because it is the most common first load.
const Tools = lazy(() => import("./pages/Tools"));
const Radar = lazy(() => import("./pages/Radar"));
const WhatsNew = lazy(() => import("./pages/WhatsNew"));
const MyStack = lazy(() => import("./pages/MyStack"));
const Learning = lazy(() => import("./pages/Learning"));
const Submit = lazy(() => import("./pages/Submit"));
const DesignKit = lazy(() => import("./pages/DesignKit"));
const PolicyTemplate = lazy(() => import("./pages/PolicyTemplate"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
          <Suspense fallback={null}>
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
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
