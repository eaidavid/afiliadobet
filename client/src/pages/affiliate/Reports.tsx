import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  MousePointer, 
  Download,
  Calendar,
  Target,
  Percent,
  Activity,
  RefreshCw,
  Link2,
  Users,
  Clock
} from 'lucide-react';
import { FinancialCard } from '@/components/ui/FinancialCard';

interface ReportsProps {
  type?: string;
}

export default function Reports({ type = 'overview' }: ReportsProps) {
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState(type);

  // Query para dados dos relatórios do afiliado
  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['/api/affiliate/reports', reportType, dateRange]
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
          <h1 className="text-2xl font-bold text-white">Meus Relatórios</h1>
          <p className="text-slate-400">Análise detalhada do seu desempenho como afiliado</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Visão Geral</SelectItem>
                  <SelectItem value="clicks">Cliques</SelectItem>
                  <SelectItem value="conversions">Conversões</SelectItem>
                  <SelectItem value="earnings">Ganhos</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinancialCard
          title="Total de Cliques"
          value={reportData?.totalClicks?.toLocaleString() || '2.847'}
          change="+18.3%"
          changeType="positive"
          icon={MousePointer}
          gradient="from-blue-400 to-blue-600"
        />
        
        <FinancialCard
          title="Conversões"
          value={reportData?.totalConversions?.toLocaleString() || '186'}
          change="+24.1%"
          changeType="positive"
          icon={Target}
          gradient="from-green-400 to-green-600"
        />
        
        <FinancialCard
          title="Taxa de Conversão"
          value={`${reportData?.conversionRate || '6.53'}%`}
          change="+0.4%"
          changeType="positive"
          icon={Percent}
          gradient="from-purple-400 to-purple-600"
        />
        
        <FinancialCard
          title="Comissões Ganhas"
          value={`R$ ${reportData?.totalEarnings?.toLocaleString() || '4.920'}`}
          change="+32.7%"
          changeType="positive"
          icon={DollarSign}
          gradient="from-yellow-400 to-yellow-600"
        />
      </div>

      {/* Conteúdo específico por tipo */}
      {reportType === 'overview' && <OverviewReport data={reportData} />}
      {reportType === 'clicks' && <ClicksReport data={reportData} />}
      {reportType === 'conversions' && <ConversionsReport data={reportData} />}
      {reportType === 'earnings' && <EarningsReport data={reportData} />}
    </div>
  );
}

// Componente para relatório de visão geral
function OverviewReport({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance mensal */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <BarChart3 className="w-16 h-16 opacity-50" />
            <span className="ml-4">Gráfico de performance será implementado aqui</span>
          </div>
        </CardContent>
      </Card>

      {/* Top links */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Meus Melhores Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Bet365 - Promoção Copa', clicks: 485, conversions: 42, earnings: 1890 },
              { name: 'Betano - Futebol Especial', clicks: 356, conversions: 31, earnings: 1395 },
              { name: 'Sportingbet - Cashback', clicks: 298, conversions: 24, earnings: 1080 },
              { name: 'KTO - Primeiro Depósito', clicks: 267, conversions: 18, earnings: 810 }
            ].map((link, index) => (
              <div key={link.name} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-gray-900 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <span className="text-white font-medium">{link.name}</span>
                    <p className="text-xs text-slate-400">{link.clicks} cliques • {link.conversions} conversões</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">R$ {link.earnings}</p>
                  <p className="text-xs text-slate-400">{((link.conversions / link.clicks) * 100).toFixed(1)}%</p>
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
                details: 'Bet365 - R$ 125 comissão',
                time: '2 horas atrás',
                type: 'conversion'
              },
              { 
                action: 'Cliques do seu link', 
                details: 'Betano - 15 novos cliques',
                time: '4 horas atrás',
                type: 'click'
              },
              { 
                action: 'Link criado', 
                details: 'Novo link para KTO',
                time: '1 dia atrás',
                type: 'link'
              },
              { 
                action: 'Conversão confirmada', 
                details: 'Sportingbet - R$ 89 comissão',
                time: '1 dia atrás',
                type: 'conversion'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'conversion' ? 'bg-green-400' :
                  activity.type === 'click' ? 'bg-blue-400' :
                  activity.type === 'link' ? 'bg-purple-400' : 'bg-yellow-400'
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

// Componente para relatório de cliques
function ClicksReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Análise Detalhada de Cliques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-slate-400">
            <MousePointer className="w-16 h-16 opacity-50" />
            <span className="ml-4">Análise de cliques será implementada aqui</span>
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
          <CardTitle className="text-white">Funil de Conversões</CardTitle>
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

// Componente para relatório de ganhos
function EarningsReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Histórico de Ganhos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-slate-400">
            <DollarSign className="w-16 h-16 opacity-50" />
            <span className="ml-4">Histórico de ganhos será implementado aqui</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}