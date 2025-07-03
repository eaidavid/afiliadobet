import { useQuery } from '@tanstack/react-query';
import { FinancialCard } from '@/components/ui/FinancialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Building2,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock data para demonstração - será substituído por dados reais
const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Fev', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Abr', value: 61000 },
  { name: 'Mai', value: 58000 },
  { name: 'Jun', value: 67000 },
  { name: 'Jul', value: 72000 }
];

const conversionData = [
  { name: 'Bet365', conversions: 145, revenue: 28500 },
  { name: 'Sportingbet', conversions: 132, revenue: 24200 },
  { name: 'Betano', conversions: 98, revenue: 18900 },
  { name: 'KTO', conversions: 87, revenue: 16800 },
  { name: 'Pixbet', conversions: 76, revenue: 14200 }
];

const pieData = [
  { name: 'CPA', value: 45, color: '#10B981' },
  { name: 'RevShare', value: 35, color: '#F59E0B' },
  { name: 'Hybrid', value: 20, color: '#3B82F6' }
];

export default function AdminDashboard() {
  // Fetch de dados reais
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 30000 // Atualiza a cada 30s
  });

  const { data: topAffiliates } = useQuery({
    queryKey: ['/api/admin/top-affiliates'],
    refetchInterval: 60000
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['/api/admin/recent-activity'],
    refetchInterval: 15000
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
      {/* Header com métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialCard
          title="Receita Total"
          value={`R$ ${stats?.totalRevenue?.toLocaleString() || '128.450'}`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          gradient="from-yellow-400 to-yellow-600"
          description="Últimos 30 dias"
        />
        
        <FinancialCard
          title="Afiliados Ativos"
          value={stats?.activeAffiliates || 247}
          change="+8"
          changeType="positive"
          icon={Users}
          gradient="from-green-400 to-green-600"
          description="Novos este mês"
        />
        
        <FinancialCard
          title="Conversões"
          value={stats?.totalConversions || 1854}
          change="+18.2%"
          changeType="positive"
          icon={TrendingUp}
          gradient="from-blue-400 to-blue-600"
          description="Este mês"
        />
        
        <FinancialCard
          title="Comissões Pagas"
          value={`R$ ${stats?.totalCommissions?.toLocaleString() || '45.230'}`}
          change="-2.1%"
          changeType="negative"
          icon={CreditCard}
          gradient="from-purple-400 to-purple-600"
          description="Aguardando: R$ 12.340"
        />
      </div>

      {/* Gráficos e tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Receita */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Receita Mensal
              <Button variant="outline" size="sm" className="text-xs">
                Ver Detalhes
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
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
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Casas de Apostas */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Performance por Casa
              <Link to="/admin/betting-houses">
                <Button variant="outline" size="sm" className="text-xs">
                  Ver Todas
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData}>
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
                <Bar dataKey="conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Seção inferior com tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Afiliados */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Top Afiliados
              <Link to="/admin/affiliates">
                <Button variant="outline" size="sm" className="text-xs">
                  Ver Todos
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(topAffiliates || [
                { id: 1, fullName: 'João Silva', totalCommissions: 8500, conversions: 145 },
                { id: 2, fullName: 'Maria Santos', totalCommissions: 7200, conversions: 132 },
                { id: 3, fullName: 'Carlos Lima', totalCommissions: 6800, conversions: 118 },
                { id: 4, fullName: 'Ana Costa', totalCommissions: 5900, conversions: 97 },
                { id: 5, fullName: 'Pedro Oliveira', totalCommissions: 5200, conversions: 89 }
              ]).map((affiliate, index) => (
                <div key={affiliate.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-900">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{affiliate.fullName}</p>
                      <p className="text-xs text-slate-400">{affiliate.conversions} conversões</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-400">R$ {affiliate.totalCommissions?.toLocaleString()}</p>
                    <Link to={`/admin/affiliates/${affiliate.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs p-1">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Comissões */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Tipos de Comissão</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(recentActivity || [
                { type: 'conversion', message: 'Nova conversão - João Silva', time: '2 min atrás', status: 'success' },
                { type: 'payment', message: 'Pagamento aprovado - Maria Santos', time: '15 min atrás', status: 'success' },
                { type: 'affiliate', message: 'Novo afiliado cadastrado', time: '1h atrás', status: 'info' },
                { type: 'error', message: 'Erro na integração Bet365', time: '2h atrás', status: 'error' },
                { type: 'conversion', message: 'Nova conversão - Carlos Lima', time: '3h atrás', status: 'success' }
              ]).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-400' : 
                    activity.status === 'error' ? 'bg-red-400' : 'bg-blue-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.message}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                  {activity.status === 'success' && <ArrowUpRight className="w-4 h-4 text-green-400" />}
                  {activity.status === 'error' && <ArrowDownRight className="w-4 h-4 text-red-400" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}