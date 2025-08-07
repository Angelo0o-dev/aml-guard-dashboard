import { Shield, AlertTriangle, Settings, BarChart3 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  { title: "Dashboard", url: "/", icon: BarChart3, badge: null },
  { title: "Rules Management", url: "/rules", icon: Shield, badge: null },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle, badge: "3" },
  { title: "Control Panel", url: "/control", icon: Settings, badge: null },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">AML Dashboard</span>
                  <span className="text-xs text-muted-foreground">Rules Engine</span>
                </div>
              )}
            </div>
          </SidebarGroupLabel>
          
          <Separator className="mx-4" />
          
          <SidebarGroupContent className="px-3 py-4">
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => cn(
                        "flex h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto h-5 w-5 p-0 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Status */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-3 pb-4">
            {!collapsed && (
              <div className="rounded-lg border bg-card p-3 text-card-foreground">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium">System Online</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  All services operational
                </p>
              </div>
            )}
            {collapsed && (
              <div className="flex justify-center">
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}