import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MousePointer, Target, DollarSign, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/hooks/useAuth";

export default function AffiliateDashboard() {
  const { user, profile } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });

  const { data: performance, isLoading: performanceLoading } = useQuery({
    queryKey: ["/api/affiliate/performance"],
  });

  if (statsLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="glass-card p-6 rounded-xl">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const mockPerformanceData = [
    { name: 'Seg', clicks: 120, conversions: 5 },
    { name: 'Ter', clicks: 190, conversions: 8 },
    { name: 'Qua', clicks: 300, conversions: 12 },
    { name: 'Qui', clicks: 250, conversions: 10 },
    { name: 'Sex', clicks: 200, conversions: 8 },
    { name: 'Sab', clicks: 180, conversions: 7 },
    { name: 'Dom', clicks: 160, conversions: 6 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Bem-vindo, {user?.fullName?.split(' ')[0] || 'Afiliado'}! 👋
            </h2>
            <p className="text-muted-foreground">Aqui estão suas métricas de hoje</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Seu nível atual</div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-warning/20 text-warning rounded-full text-sm font-medium">
                {profile?.level || 'Novato'}
              </span>
              <span className="text-xs text-muted-foreground">
                {profile?.points || 0} pontos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliques Hoje</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.todayClicks || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-secondary">+18%</span>
              <span className="text-muted-foreground ml-1">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Conversões</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalConversions || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-secondary">+4.2%</span>
              <span className="text-muted-foreground ml-1">taxa de conversão</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Comissão Total</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {Number(stats?.totalCommission || 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-secondary">+25%</span>
              <span className="text-muted-foreground ml-1">este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Disponível</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {Number(stats?.availableBalance || 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-warning" />
              </div>
            </div>
            <Button size="sm" className="text-sm text-primary hover:text-primary/80 font-medium p-0 h-auto">
              Solicitar Saque
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Performance Semanal</h3>
            <Select defaultValue="7days">
              <SelectTrigger className="w-[180px] bg-surface border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                <SelectItem value="14days">Últimas 2 semanas</SelectItem>
                <SelectItem value="30days">Último mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="clicks" fill="#3B82F6" name="Cliques" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" fill="#10B981" name="Conversões" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Link Generator */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">Gerador Rápido</h3>
            <div className="space-y-3">
              <Select>
                <SelectTrigger className="w-full bg-surface border-white/10">
                  <SelectValue placeholder="Selecionar Casa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bet365">Bet365</SelectItem>
                  <SelectItem value="betano">Betano</SelectItem>
                  <SelectItem value="sportingbet">Sportingbet</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <span className="w-4 h-4 mr-2">🔗</span>
                Gerar Link
              </Button>
            </div>
          </div>

          {/* Top Performing Links */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">Melhores Links</h3>
            <div className="space-y-3">
              {stats?.activeLinks > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Bet365 - Promo</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(stats.totalClicks / 3)} cliques
                      </p>
                    </div>
                    <span className="text-xs text-secondary">8.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Betano - Copa</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(stats.totalClicks / 4)} cliques
                      </p>
                    </div>
                    <span className="text-xs text-secondary">6.2%</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    Nenhum link criado ainda
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Crie seu primeiro link de afiliado
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
