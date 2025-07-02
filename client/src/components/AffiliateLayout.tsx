import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Home, Building, Link, TrendingUp, Wallet, User, LogOut, Bell } from "lucide-react";
import Layout from "./Layout";

const affiliateNavItems = [
  { title: "Dashboard", url: "/affiliate", icon: Home },
  { title: "Casas Disponíveis", url: "/affiliate/betting-houses", icon: Building },
  { title: "Meus Links", url: "/affiliate/my-links", icon: Link },
  { title: "Relatórios", url: "/affiliate/reports", icon: TrendingUp },
  { title: "Pagamentos", url: "/affiliate/payments", icon: Wallet },
  { title: "Perfil", url: "/affiliate/profile", icon: User },
];

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, profile } = useAuth();
  const [location, setLocation] = useLocation();

  return (
    <Layout requiredRole="affiliate">
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
                    <p className="text-xs text-muted-foreground">Afiliado</p>
                  </div>
                </div>
                {profile && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Nível:</span>
                      <span className="px-2 py-1 bg-warning/20 text-warning rounded-full text-xs">
                        {profile.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-muted-foreground">Pontos:</span>
                      <span className="text-foreground">{profile.points}</span>
                    </div>
                  </div>
                )}
              </div>

              <SidebarMenu>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Painel Afiliado
                </div>
                {affiliateNavItems.map((item) => (
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
                    {affiliateNavItems.find(item => item.url === location)?.title || 'Meu Dashboard'}
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                  </Button>
                  {profile && (
                    <div className="hidden md:flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-secondary">R$ {Number(profile.availableBalance).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Disponível</div>
                      </div>
                    </div>
                  )}
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
