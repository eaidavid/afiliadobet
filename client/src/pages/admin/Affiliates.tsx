import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Link } from 'wouter';
import { 
  Search, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AffiliateFilters {
  search: string;
  status: string;
  dateRange: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function Affiliates({ affiliateId }: { affiliateId?: string }) {
  const [filters, setFilters] = useState<AffiliateFilters>({
    search: '',
    status: 'all',
    dateRange: 'all',
    sortBy: 'created',
    sortOrder: 'desc'
  });

  const [selectedAffiliates, setSelectedAffiliates] = useState<number[]>([]);

  // Query para lista de afiliados
  const { data: affiliates, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/affiliates', filters],
    keepPreviousData: true
  });

  // Query para afiliado específico (se ID fornecido)
  const { data: affiliateDetails } = useQuery({
    queryKey: ['/api/admin/affiliates', affiliateId],
    enabled: !!affiliateId
  });

  // Query para estatísticas gerais
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/affiliates/stats']
  });

  const updateFilters = (key: keyof AffiliateFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSelectAffiliate = (id: number) => {
    setSelectedAffiliates(prev => 
      prev.includes(id) 
        ? prev.filter(affId => affId !== id)
        : [...prev, id]
    );
  };

  const selectAllAffiliates = () => {
    setSelectedAffiliates(
      selectedAffiliates.length === (affiliates?.length || 0) 
        ? [] 
        : affiliates?.map((a: any) => a.id) || []
    );
  };

  if (affiliateId && affiliateDetails) {
    return <AffiliateDetailView affiliate={affiliateDetails} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
    <div className="space-y-6">
      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total de Afiliados</p>
                <p className="text-2xl font-bold text-white">{stats?.totalAffiliates || 247}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-xs text-green-400 mt-2">+12 este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Afiliados Ativos</p>
                <p className="text-2xl font-bold text-white">{stats?.activeAffiliates || 189}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-xs text-slate-400 mt-2">76% do total</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Comissões Pagas</p>
                <p className="text-2xl font-bold text-white">R$ {stats?.totalCommissionsPaid?.toLocaleString() || '145.230'}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-xs text-green-400 mt-2">+8.5% vs mês passado</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Performance Média</p>
                <p className="text-2xl font-bold text-white">{stats?.averageConversionRate || '5.8'}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-xs text-slate-400 mt-2">Taxa de conversão</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros avançados */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros e Busca
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Busca */}
            <div className="md:col-span-2">
              <Label className="text-slate-300">Buscar Afiliado</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Nome, email, CPF ou ID..."
                  value={filters.search}
                  onChange={(e) => updateFilters('search', e.target.value)}
                  className="bg-slate-900/50 border-slate-600 pl-10"
                />
              </div>
            </div>
            
            {/* Status */}
            <div>
              <Label className="text-slate-300">Status</Label>
              <Select value={filters.status} onValueChange={(value) => updateFilters('status', value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="banned">Banidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Período */}
            <div>
              <Label className="text-slate-300">Período</Label>
              <Select value={filters.dateRange} onValueChange={(value) => updateFilters('dateRange', value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo período</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ordenação */}
            <div>
              <Label className="text-slate-300">Ordenar por</Label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilters('sortBy', value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Data de cadastro</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="commissions">Comissões</SelectItem>
                  <SelectItem value="conversions">Conversões</SelectItem>
                  <SelectItem value="lastActivity">Última atividade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de afiliados */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div>
              Afiliados ({affiliates?.length || 0})
              {selectedAffiliates.length > 0 && (
                <span className="ml-2 text-sm text-yellow-400">
                  {selectedAffiliates.length} selecionados
                </span>
              )}
            </div>
            {selectedAffiliates.length > 0 && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ativar
                </Button>
                <Button variant="outline" size="sm">
                  <Ban className="w-4 h-4 mr-2" />
                  Desativar
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAffiliates.length === (affiliates?.length || 0)}
                      onChange={selectAllAffiliates}
                      className="rounded border-slate-600"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Afiliado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">CPF</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Comissões</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Conversões</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Última Atividade</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {(affiliates || [
                  { id: 1, fullName: 'João Silva', email: 'joao@email.com', cpf: '123.456.789-00', status: 'active', totalCommissions: 8500, conversions: 145, lastActivity: '2 horas atrás' },
                  { id: 2, fullName: 'Maria Santos', email: 'maria@email.com', cpf: '987.654.321-00', status: 'active', totalCommissions: 7200, conversions: 132, lastActivity: '1 dia atrás' },
                  { id: 3, fullName: 'Carlos Lima', email: 'carlos@email.com', cpf: '456.789.123-00', status: 'pending', totalCommissions: 0, conversions: 0, lastActivity: '3 dias atrás' },
                  { id: 4, fullName: 'Ana Costa', email: 'ana@email.com', cpf: '789.123.456-00', status: 'active', totalCommissions: 5900, conversions: 97, lastActivity: '5 horas atrás' },
                  { id: 5, fullName: 'Pedro Oliveira', email: 'pedro@email.com', cpf: '321.654.987-00', status: 'inactive', totalCommissions: 5200, conversions: 89, lastActivity: '1 semana atrás' }
                ]).map((affiliate) => (
                  <tr key={affiliate.id} className="hover:bg-slate-700/25 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAffiliates.includes(affiliate.id)}
                        onChange={() => toggleSelectAffiliate(affiliate.id)}
                        className="rounded border-slate-600"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-900">
                            {affiliate.fullName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{affiliate.fullName}</p>
                          <p className="text-xs text-slate-400">{affiliate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">{affiliate.cpf}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={affiliate.status as any} />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-green-400">
                      R$ {affiliate.totalCommissions?.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">
                      {affiliate.conversions}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">
                      {affiliate.lastActivity}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <Link to={`/admin/affiliates/${affiliate.id}`}>
                          <Button size="sm" variant="ghost" className="text-xs">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost" className="text-xs">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs text-red-400">
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para visualização detalhada de um afiliado
function AffiliateDetailView({ affiliate }: { affiliate: any }) {
  const { data: affiliateStats } = useQuery({
    queryKey: ['/api/admin/affiliates', affiliate.id, 'stats']
  });

  const { data: affiliateActivity } = useQuery({
    queryKey: ['/api/admin/affiliates', affiliate.id, 'activity']
  });

  return (
    <div className="space-y-6">
      {/* Header do afiliado */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">
                  {affiliate.fullName[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{affiliate.fullName}</h1>
                <p className="text-slate-400">{affiliate.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <StatusBadge status={affiliate.status} />
                  <span className="text-sm text-slate-400">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Cadastrado em {new Date(affiliate.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button variant="outline" size="sm">
                {affiliate.status === 'active' ? 'Desativar' : 'Ativar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">R$ {affiliateStats?.totalCommissions?.toLocaleString() || '8.500'}</p>
              <p className="text-sm text-slate-400">Comissões Totais</p>
              <p className="text-xs text-green-400 mt-1">+15% este mês</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{affiliateStats?.totalConversions || 145}</p>
              <p className="text-sm text-slate-400">Conversões</p>
              <p className="text-xs text-slate-400 mt-1">Taxa: 7.2%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{affiliateStats?.totalClicks || 2016}</p>
              <p className="text-sm text-slate-400">Cliques Totais</p>
              <p className="text-xs text-slate-400 mt-1">Este mês: 512</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividade recente e outros detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividade Recente */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(affiliateActivity || [
                { type: 'conversion', message: 'Nova conversão - Bet365', time: '2 horas atrás', value: 300 },
                { type: 'click', message: 'Clique registrado - Sportingbet', time: '4 horas atrás', value: 0 },
                { type: 'payment', message: 'Pagamento processado', time: '1 dia atrás', value: 1240 },
                { type: 'link', message: 'Novo link criado - Betano', time: '2 dias atrás', value: 0 }
              ]).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'conversion' ? 'bg-green-400' : 
                      activity.type === 'payment' ? 'bg-yellow-400' : 'bg-blue-400'
                    }`}></div>
                    <div>
                      <p className="text-sm text-white">{activity.message}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                  {activity.value > 0 && (
                    <span className="text-sm font-medium text-green-400">
                      +R$ {activity.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informações Pessoais */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">CPF</p>
                  <p className="text-sm font-medium text-white">{affiliate.cpf || '123.456.789-00'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Telefone</p>
                  <p className="text-sm font-medium text-white">{affiliate.phone || '(11) 99999-9999'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Data de Nascimento</p>
                  <p className="text-sm font-medium text-white">{affiliate.birthDate || '01/01/1990'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Último Acesso</p>
                  <p className="text-sm font-medium text-white">{affiliate.lastAccess || '2 horas atrás'}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Chave PIX</p>
                <p className="text-sm font-medium text-white bg-slate-700/30 p-2 rounded">
                  {affiliate.pixKey || 'joao@email.com'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}