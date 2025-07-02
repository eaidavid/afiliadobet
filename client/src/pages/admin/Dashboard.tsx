import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Target, Percent } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AdminStats {
  activeAffiliates: number;
  totalRevenue: number;
  totalConversions: number;
  conversionRate: string;
}

interface TopAffiliate {
  id: number;
  fullName: string;
  totalCommission: number;
}

function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: topAffiliates, isLoading: affiliatesLoading } = useQuery<TopAffiliate[]>({
    queryKey: ["/api/admin/top-affiliates"],
  });

  if (statsLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
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

  const mockRevenueData = [
    { name: 'Jan', value: 12000 },
    { name: 'Fev', value: 19000 },
    { name: 'Mar', value: 15000 },
    { name: 'Abr', value: 25000 },
    { name: 'Mai', value: 22000 },
    { name: 'Jun', value: 30000 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card stats-card-neutral">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Afiliados Ativos</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats?.activeAffiliates || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-emerald-400 font-semibold">↗ +12%</span>
              <span className="text-muted-foreground ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card stats-card-gold">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Receita Total</p>
                <p className="text-3xl font-bold text-yellow-400">
                  R$ {Number(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-14 h-14 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-emerald-400 font-semibold">↗ +8.5%</span>
              <span className="text-muted-foreground ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card stats-card-profit">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Conversões</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {stats?.totalConversions || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-emerald-400 font-semibold">↗ +15.3%</span>
              <span className="text-muted-foreground ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card stats-card-neutral">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Taxa Conversão</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats?.conversionRate || '0.0'}%
                </p>
              </div>
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Percent className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-red-400 font-semibold">↘ -2.1%</span>
              <span className="text-muted-foreground ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Receita Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,215,0,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#CBD5E1" 
                    fontSize={12}
                    fontWeight={500}
                  />
                  <YAxis 
                    stroke="#CBD5E1" 
                    fontSize={12}
                    fontWeight={500}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(26, 35, 50, 0.95)', 
                      border: '1px solid rgba(255,215,0,0.3)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                    }}
                    labelStyle={{ color: '#FFD700', fontWeight: 600 }}
                    itemStyle={{ color: '#16A34A', fontWeight: 500 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#FFD700" 
                    strokeWidth={3}
                    dot={{ 
                      fill: '#FFD700', 
                      strokeWidth: 2, 
                      r: 5,
                      stroke: '#B8860B'
                    }}
                    activeDot={{ 
                      r: 7, 
                      fill: '#FFD700',
                      stroke: '#16A34A',
                      strokeWidth: 2
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Affiliates */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Top Afiliados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {affiliatesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : topAffiliates && topAffiliates.length > 0 ? (
                topAffiliates.map((affiliate: any, index: number) => (
                  <div key={affiliate.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {affiliate.fullName?.charAt(0) || '#'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{affiliate.fullName}</p>
                        <p className="text-xs text-muted-foreground">ID: #{affiliate.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        R$ {Number(affiliate.totalCommission || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-secondary">+8.5%</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum afiliado encontrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Atividade Recente
            </CardTitle>
            <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold bg-yellow-500/10 hover:bg-yellow-500/20 px-4 py-2 rounded-lg transition-all duration-200">
              Ver todas →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  Sistema inicializado com sucesso
                </p>
                <p className="text-xs text-muted-foreground">Agora mesmo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
