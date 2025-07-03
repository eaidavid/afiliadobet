import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/calendar';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Download,
  Filter,
  Calendar,
  MousePointer,
  Target,
  Percent,
  Activity,
  RefreshCw
} from 'lucide-react';
import { FinancialCard } from '@/components/ui/FinancialCard';

interface ReportsProps {
  type?: string;
}

export default function Reports({ type = 'overview' }: ReportsProps) {
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState(type);

  // Query para dados dos relatórios
  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/reports', reportType, dateRange]
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios e Analytics</h1>
          <p className="text-slate-400">Análise detalhada do desempenho do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Visão Geral</SelectItem>
                  <SelectItem value="revenue">Receita</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="conversions">Conversões</SelectItem>
                  <SelectItem value="affiliates">Afiliados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Período</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="1year">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Casa de Apostas</label>
              <Select>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue placeholder="Todas as casas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as casas</SelectItem>
                  <SelectItem value="bet365">Bet365</SelectItem>
                  <SelectItem value="sportingbet">Sportingbet</SelectItem>
                  <SelectItem value="betano">Betano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Status</label>
              <Select>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinancialCard
          title="Receita Total"
          value={`R$ ${reportData?.totalRevenue?.toLocaleString() || '485.720'}`}
          change="+15.3%"
          changeType="positive"
          icon={DollarSign}
          gradient="from-yellow-400 to-yellow-600"
        />
        
        <FinancialCard
          title="Total de Cliques"
          value={reportData?.totalClicks?.toLocaleString() || '24.586'}
          change="+8.7%"
          changeType="positive"
          icon={MousePointer}
          gradient="from-blue-400 to-blue-600"
        />
        
        <FinancialCard
          title="Conversões"
          value={reportData?.totalConversions?.toLocaleString() || '1.847'}
          change="+12.4%"
          changeType="positive"
          icon={Target}
          gradient="from-green-400 to-green-600"
        />
        
        <FinancialCard
          title="Taxa de Conversão"
          value={`${reportData?.conversionRate || '7.51'}%`}
          change="+0.8%"
          changeType="positive"
          icon={Percent}
          gradient="from-purple-400 to-purple-600"
        />
      </div>

      {/* Gráficos e tabelas baseados no tipo */}
      {reportType === 'overview' && <OverviewReport data={reportData} />}
      {reportType === 'revenue' && <RevenueReport data={reportData} />}
      {reportType === 'performance' && <PerformanceReport data={reportData} />}
      {reportType === 'conversions' && <ConversionsReport data={reportData} />}
      {reportType === 'affiliates' && <AffiliatesReport data={reportData} />}
    </div>
  );
}

// Componente para relatório de visão geral
function OverviewReport({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de receita mensal */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Receita por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <BarChart3 className="w-16 h-16 opacity-50" />
            <span className="ml-4">Gráfico de receita será implementado aqui</span>
          </div>
        </CardContent>
      </Card>

      {/* Top casas de apostas */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Top Casas de Apostas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Bet365', revenue: 125000, percentage: 28.5 },
              { name: 'Betano', revenue: 98000, percentage: 22.3 },
              { name: 'Sportingbet', revenue: 87000, percentage: 19.8 },
              { name: 'KTO', revenue: 65000, percentage: 14.8 },
              { name: 'Parimatch', revenue: 42000, percentage: 9.6 }
            ].map((house, index) => (
              <div key={house.name} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-gray-900 font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-white font-medium">{house.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">R$ {house.revenue.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">{house.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atividade recente */}
      <Card className="bg-slate-800/50 border-slate-700/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                action: 'Nova conversão registrada', 
                details: 'Afiliado João Silva - R$ 150 comissão',
                time: '2 minutos atrás',
                type: 'conversion'
              },
              { 
                action: 'Pagamento processado', 
                details: 'R$ 2.500 para Maria Santos',
                time: '15 minutos atrás',
                type: 'payment'
              },
              { 
                action: 'Novo afiliado cadastrado', 
                details: 'Pedro Oliveira se juntou ao programa',
                time: '1 hora atrás',
                type: 'signup'
              },
              { 
                action: 'Casa de apostas ativada', 
                details: 'Novibet está agora disponível',
                time: '2 horas atrás',
                type: 'system'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'conversion' ? 'bg-green-400' :
                  activity.type === 'payment' ? 'bg-yellow-400' :
                  activity.type === 'signup' ? 'bg-blue-400' : 'bg-purple-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-sm text-slate-400">{activity.details}</p>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para relatório de receita
function RevenueReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Análise de Receita Detalhada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-slate-400">
            <DollarSign className="w-16 h-16 opacity-50" />
            <span className="ml-4">Gráfico detalhado de receita será implementado aqui</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para relatório de performance
function PerformanceReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Análise de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-slate-400">
            <TrendingUp className="w-16 h-16 opacity-50" />
            <span className="ml-4">Métricas de performance serão implementadas aqui</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para relatório de conversões
function ConversionsReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Análise de Conversões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-slate-400">
            <Target className="w-16 h-16 opacity-50" />
            <span className="ml-4">Funil de conversões será implementado aqui</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para relatório de afiliados
function AffiliatesReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Performance dos Afiliados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-slate-400">
            <Users className="w-16 h-16 opacity-50" />
            <span className="ml-4">Ranking de afiliados será implementado aqui</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}