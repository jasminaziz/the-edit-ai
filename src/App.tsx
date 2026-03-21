import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import WhatsNew from "./pages/WhatsNew";
import MyStack from "./pages/MyStack";
import Learning from "./pages/Learning";
import Submit from "./pages/Submit";
import DesignKit from "./pages/DesignKit";
import NotFound from "./pages/NotFound";

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
            <Route path="/whats-new" element={<WhatsNew />} />
            <Route path="/my-stack" element={<MyStack />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/design-kit" element={<DesignKit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
