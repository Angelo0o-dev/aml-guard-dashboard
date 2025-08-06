import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import RulesManagement from "./pages/RulesManagement";
import Alerts from "./pages/Alerts";
import ControlPanel from "./pages/ControlPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background-secondary to-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-16 flex items-center border-b border-border/40 bg-glass-primary/60 backdrop-blur-xl px-6">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
                <div className="ml-4">
                  <h1 className="text-lg font-semibold gradient-text">AML Rules Engine</h1>
                </div>
              </header>
              <main className="flex-1 p-8 overflow-auto bg-gradient-to-br from-transparent via-glass-primary/20 to-transparent">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/rules" element={<RulesManagement />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/control" element={<ControlPanel />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
