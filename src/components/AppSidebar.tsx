import { Shield, AlertTriangle, Settings, BarChart3 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Rules Management", url: "/rules", icon: Shield },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Control Panel", url: "/control", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50";

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} border-r border-border/40 bg-glass-primary/60 backdrop-blur-xl`} collapsible="icon">
      <SidebarContent className="bg-transparent">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow">
                <Shield className="h-5 w-5 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <span className="font-bold text-lg gradient-text">AML</span>
                  <p className="text-xs text-muted-foreground">Rules Engine</p>
                </div>
              )}
            </div>
          </SidebarGroupLabel>
          
          <SidebarGroupContent className="px-3 py-4">
            <SidebarMenu className="space-y-2">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={(navData) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                      navData.isActive 
                        ? "bg-gradient-to-r from-primary/20 to-primary-glow/20 text-primary border border-primary/30 shadow-glow-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-glass-secondary/40 hover:backdrop-blur-sm"
                    )}>
                      <item.icon className={cn(
                        "h-5 w-5 transition-all duration-300",
                        isActive(item.url) ? "text-primary" : "group-hover:scale-110"
                      )} />
                      {!collapsed && (
                        <span className="font-medium transition-all duration-300 group-hover:translate-x-1">
                          {item.title}
                        </span>
                      )}
                      {isActive(item.url) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}