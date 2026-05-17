import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import OmMig from "./pages/OmMig";
import Kontakt from "./pages/Kontakt";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Privatlivspolitik from "./pages/Privatlivspolitik";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalInbox from "./pages/portal/PortalInbox";
import PortalOrders from "./pages/portal/PortalOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Portal routes — rendered outside the main Layout */}
          <Route path="/portal" element={<PortalDashboard />} />
          <Route path="/portal/inbox" element={<PortalInbox />} />
          <Route path="/portal/orders" element={<PortalOrders />} />

          {/* Public routes wrapped in Layout */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/om-mig" element={<OmMig />} />
                  <Route path="/kontakt" element={<Kontakt />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route
                    path="/privatlivspolitik"
                    element={<Privatlivspolitik />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
