import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, Link } from "wouter";
import { LayoutDashboard, Users, Building, BarChart3, CreditCard, Settings, LogOut, Bell, ChevronRight, ChevronDown } from "lucide-react";
import Layout from "./Layout";
import { useState } from "react";

const adminNavItems = [
  { 
    title: "Dashboard", 
    url: "/admin/dashboard", 
    icon: LayoutDashboard,
    color: "text-yellow-400"
  },
  { 
    title: "Afiliados", 
    url: "/admin/affiliates", 
    icon: Users,
    color: "text-green-400",
    subItems: [
      { title: "Lista de Afiliados", url: "/admin/affiliates" },
      { title: "Performance", url: "/admin/affiliates/performance" }
    ]
  },
  { 
    title: "Casas de Apostas", 
    url: "/admin/betting-houses", 
    icon: Building,
    color: "text-blue-400"
  },
  { 
    title: "Relatórios", 
    url: "/admin/reports", 
    icon: BarChart3,
    color: "text-purple-400",
    subItems: [
      { title: "Receita", url: "/admin/reports/revenue" },
      { title: "Performance", url: "/admin/reports/performance" },
      { title: "Conversões", url: "/admin/reports/conversions" }
    ]
  },
  { 
    title: "Pagamentos", 
    url: "/admin/payments", 
    icon: CreditCard,
    color: "text-emerald-400"
  },
  { 
    title: "Configurações", 
    url: "/admin/settings", 
    icon: Settings,
    color: "text-slate-400",
    subItems: [
      { title: "Geral", url: "/admin/settings/general" },
      { title: "Comissões", url: "/admin/settings/commission" }
    ]
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  return (
    <Layout requiredRole="admin">
      <div className="min-h-screen bg-background">
        <SidebarProvider>
          <Sidebar className="glass-card border-r border-white/10">
            <SidebarHeader className="p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AB</span>
                </div>
                <span className="text-xl font-bold text-foreground">AfiliadosBet</span>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
              <div className="mb-4 p-4 glass-card rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.fullName?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
              </div>

              <SidebarMenu>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Administração
                </div>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      onClick={() => setLocation(item.url)}
                      isActive={location === item.url}
                      className="w-full justify-start"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 flex flex-col">
            <header className="glass-card border-b border-white/10 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="lg:hidden" />
                  <h1 className="text-2xl font-bold text-foreground">
                    {adminNavItems.find(item => item.url === location)?.title || 'Dashboard Administrativo'}
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                  </Button>
                </div>
              </div>
            </header>

            <main className="flex-1 p-4 lg:p-6 overflow-auto">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </Layout>
  );
}
