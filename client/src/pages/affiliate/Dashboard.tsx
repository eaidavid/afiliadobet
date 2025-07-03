import { useQuery } from '@tanstack/react-query';
import { FinancialCard } from '@/components/ui/FinancialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  MousePointer, 
  TrendingUp, 
  Users, 
  Target,
  Link2,
  Calendar,
  ArrowUpRight,
  Plus,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from '@/hooks/useAuth';

// Mock data para demonstração
const performanceData = [
  { name: 'Seg', clicks: 24, conversions: 3, commission: 450 },
  { name: 'Ter', clicks: 31, conversions: 5, commission: 750 },
  { name: 'Qua', clicks: 28, conversions: 4, commission: 620 },
  { name: 'Qui', clicks: 45, conversions: 7, commission: 980 },
  { name: 'Sex', clicks: 52, conversions: 9, commission: 1350 },
  { name: 'Sab', clicks: 38, conversions: 6, commission: 840 },
  { name: 'Dom', clicks: 33, conversions: 4, commission: 590 }
];

const topLinksData = [
  { id: 1, url: 'bet365.com/ref/aff123', clicks: 145, conversions: 12, commission: 1800 },
  { id: 2, url: 'sportingbet.com/ref/aff123', clicks: 132, conversions: 9, commission: 1350 },
  { id: 3, url: 'betano.com/ref/aff123', clicks: 98, conversions: 7, commission: 1050 },
  { id: 4, url: 'kto.com/ref/aff123', clicks: 87, conversions: 6, commission: 900 }
];

export default function AffiliateDashboard() {
  const { user } = useAuth();
  
  // Fetch de dados reais
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/affiliate/stats'],
    refetchInterval: 30000
  });

  const { data: recentConversions } = useQuery({
    queryKey: ['/api/affiliate/recent-conversions'],
    refetchInterval: 60000
  });

  const { data: monthlyGoals } = useQuery({
    queryKey: ['/api/affiliate/goals']
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-4"></div>
              <div className="h-8 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Saudação */}
      <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-400/30">
        <h1 className="text-2xl font-bold text-white mb-2">
          Olá, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-300">
          Aqui está o resumo da sua performance hoje. Continue assim!
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialCard
          title="Comissão Total"
          value={`R$ ${stats?.totalCommissions?.toLocaleString() || '8.540'}`}
          change="+15.3%"
          changeType="positive"
          icon={DollarSign}
          gradient="from-yellow-400 to-yellow-600"
          description="Este mês: R$ 2.340"
        />
        
        <FinancialCard
          title="Cliques Únicos"
          value={stats?.totalClicks || 1247}
          change="+8.2%"
          changeType="positive"
          icon={MousePointer}
          gradient="from-blue-400 to-blue-600"
          description="Últimos 7 dias"
        />
        
        <FinancialCard
          title="Conversões"
          value={stats?.totalConversions || 89}
          change="+12.4%"
          changeType="positive"
          icon={TrendingUp}
          gradient="from-green-400 to-green-600"
          description="Taxa: 7.1%"
        />
        
        <FinancialCard
          title="Links Ativos"
          value={stats?.activeLinks || 12}
          change="+2"
          changeType="positive"
          icon={Link2}
          gradient="from-purple-400 to-purple-600"
          description="5 casas diferentes"
        />
      </div>

      {/* Gráficos e informações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance da Semana */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Performance da Semana
              <Link to="/affiliate/reports">
                <Button variant="outline" size="sm" className="text-xs">
                  Ver Relatório Completo
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="commission" 
                  stroke="#F59E0B" 
                  fillOpacity={1} 
                  fill="url(#commissionGradient)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Metas do Mês */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-yellow-400" />
              Metas do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Meta de Comissão */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Comissão</span>
                  <span className="text-sm font-medium text-white">
                    R$ {stats?.monthlyCommissions || 2340} / R$ 5000
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((stats?.monthlyCommissions || 2340) / 5000) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">47% da meta mensal</p>
              </div>

              {/* Meta de Conversões */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Conversões</span>
                  <span className="text-sm font-medium text-white">
                    {stats?.monthlyConversions || 23} / 50
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((stats?.monthlyConversions || 23) / 50) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">46% da meta mensal</p>
              </div>

              {/* Próximo Pagamento */}
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Próximo Pagamento</span>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-lg font-bold text-green-400">R$ 1.240,50</p>
                <p className="text-xs text-slate-400">Previsto para 05/08/2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Links */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Meus Top Links
              <Link to="/affiliate/links">
                <Button variant="outline" size="sm" className="text-xs">
                  Gerenciar Links
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLinksData.map((link, index) => (
                <div key={link.id} className="p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">#{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-white truncate max-w-[200px]">
                        {link.url}
                      </span>
                    </div>
                    <Link to={`/affiliate/links/${link.id}/analytics`}>
                      <Button variant="ghost" size="sm" className="text-xs p-1">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-blue-400">{link.clicks}</p>
                      <p className="text-xs text-slate-400">Cliques</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-400">{link.conversions}</p>
                      <p className="text-xs text-slate-400">Conversões</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-yellow-400">R$ {link.commission}</p>
                      <p className="text-xs text-slate-400">Comissão</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/affiliate/links/create">
              <Button className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo Link
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Conversões Recentes */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Conversões Recentes
              <Link to="/affiliate/reports/conversions">
                <Button variant="outline" size="sm" className="text-xs">
                  Ver Todas
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(recentConversions || [
                { id: 1, type: 'deposit', house: 'Bet365', value: 150, commission: 225, time: '2 min atrás' },
                { id: 2, type: 'register', house: 'Sportingbet', value: 0, commission: 50, time: '1h atrás' },
                { id: 3, type: 'deposit', house: 'Betano', value: 200, commission: 300, time: '3h atrás' },
                { id: 4, type: 'register', house: 'KTO', value: 0, commission: 40, time: '5h atrás' },
                { id: 5, type: 'deposit', house: 'Pixbet', value: 100, commission: 150, time: '1 dia atrás' }
              ]).map((conversion) => (
                <div key={conversion.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      conversion.type === 'deposit' ? 'bg-green-400' : 'bg-blue-400'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {conversion.type === 'deposit' ? 'Depósito' : 'Cadastro'} - {conversion.house}
                      </p>
                      <p className="text-xs text-slate-400">{conversion.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-400">+R$ {conversion.commission}</p>
                    {conversion.value > 0 && (
                      <p className="text-xs text-slate-400">Valor: R$ {conversion.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}