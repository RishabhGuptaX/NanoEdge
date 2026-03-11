import { LayoutDashboard, UserSearch, History, Cpu, Activity } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, color: "text-primary" },
  { title: "Patient Analysis", url: "/analysis", icon: UserSearch, color: "text-purple" },
  { title: "Patient History", url: "/history", icon: History, color: "text-accent" },
  { title: "System Monitor", url: "/system", icon: Cpu, color: "text-success" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">NanoEdge Dx</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">AI Diagnostics</p>
          </div>
        )}
      </div>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                          active
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                        activeClassName=""
                      >
                        <item.icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${active ? item.color : ""}`} />
                        {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
