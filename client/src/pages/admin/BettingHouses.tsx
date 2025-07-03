import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Settings,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  Download,
  ExternalLink,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function BettingHouses({ editId }: { editId?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Query para casas de apostas
  const { data: bettingHouses, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/betting-houses', { search: searchTerm, status: statusFilter }]
  });

  // Query para casa específica (se editId fornecido)
  const { data: houseDetails } = useQuery({
    queryKey: ['/api/admin/betting-houses', editId],
    enabled: !!editId
  });

  // Query para estatísticas das casas
  const { data: housesStats } = useQuery({
    queryKey: ['/api/admin/betting-houses/stats']
  });

  // Mutation para criar casa
  const createHouseMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/betting-houses', {
      method: 'POST',
      body: data
    }),
    onSuccess: () => {
      toast({
        title: "Casa criada com sucesso!",
        description: "A nova casa de apostas foi adicionada ao sistema.",
      });
      setShowCreateModal(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/betting-houses'] });
    },
    onError: () => {
      toast({
        title: "Erro ao criar casa",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  });

  // Mutation para deletar casa
  const deleteHouseMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/betting-houses/${id}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      toast({
        title: "Casa removida",
        description: "Casa de apostas removida com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/betting-houses'] });
    }
  });

  if (editId && houseDetails) {
    return <BettingHouseEditView house={houseDetails} />;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Casas de Apostas</h1>
          <p className="text-slate-400">Configure e monitore as casas de apostas parceiras</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Casa
        </Button>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total de Casas</p>
                <p className="text-2xl font-bold text-white">{housesStats?.totalHouses || 12}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-xs text-green-400 mt-2">+2 este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Casas Ativas</p>
                <p className="text-2xl font-bold text-white">{housesStats?.activeHouses || 10}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-xs text-slate-400 mt-2">83% do total</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Receita Total</p>
                <p className="text-2xl font-bold text-white">R$ {housesStats?.totalRevenue?.toLocaleString() || '485.720'}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-xs text-green-400 mt-2">+15% vs mês passado</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Taxa Média</p>
                <p className="text-2xl font-bold text-white">{housesStats?.averageConversionRate || '7.8'}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-xs text-slate-400 mt-2">Conversão geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar casa de apostas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/50 border-slate-600 pl-10"
              />
            </div>

            {/* Status */}
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="inactive">Inativas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ações */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de casas de apostas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(bettingHouses || [
          {
            id: 1,
            name: 'Bet365',
            description: 'A maior casa de apostas do mundo com as melhores odds.',
            logoUrl: '',
            commissionType: 'CPA',
            commissionValue: 150,
            isActive: true,
            affiliatesCount: 45,
            totalRevenue: 125000,
            conversionRate: 8.5,
            rating: 4.8,
            categories: ['sports', 'casino'],
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            name: 'Sportingbet',
            description: 'Casa tradicional com foco em esportes.',
            logoUrl: '',
            commissionType: 'RevShare',
            commissionValue: 35,
            isActive: true,
            affiliatesCount: 38,
            totalRevenue: 95000,
            conversionRate: 7.2,
            rating: 4.6,
            categories: ['sports'],
            createdAt: '2024-01-20'
          },
          {
            id: 3,
            name: 'Betano',
            description: 'Casa moderna com app intuitivo.',
            logoUrl: '',
            commissionType: 'Hybrid',
            commissionValue: 200,
            isActive: true,
            affiliatesCount: 52,
            totalRevenue: 142000,
            conversionRate: 9.1,
            rating: 4.7,
            categories: ['sports', 'casino'],
            createdAt: '2024-02-01'
          },
          {
            id: 4,
            name: 'KTO',
            description: 'Casa brasileira com foco nacional.',
            logoUrl: '',
            commissionType: 'CPA',
            commissionValue: 120,
            isActive: true,
            affiliatesCount: 29,
            totalRevenue: 68000,
            conversionRate: 6.8,
            rating: 4.4,
            categories: ['sports'],
            createdAt: '2024-02-10'
          },
          {
            id: 5,
            name: 'Pixbet',
            description: 'Saque rápido via PIX.',
            logoUrl: '',
            commissionType: 'RevShare',
            commissionValue: 30,
            isActive: false,
            affiliatesCount: 23,
            totalRevenue: 45000,
            conversionRate: 5.9,
            rating: 4.2,
            categories: ['sports', 'casino'],
            createdAt: '2024-02-15'
          },
          {
            id: 6,
            name: 'Parimatch',
            description: 'Casa internacional com grandes apostas.',
            logoUrl: '',
            commissionType: 'CPA',
            commissionValue: 180,
            isActive: true,
            affiliatesCount: 31,
            totalRevenue: 89000,
            conversionRate: 8.3,
            rating: 4.6,
            categories: ['sports', 'casino'],
            createdAt: '2024-03-01'
          }
        ]).map((house) => (
          <Card key={house.id} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{house.name}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-300">{house.rating}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={house.isActive ? 'active' : 'inactive'} />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-slate-400 line-clamp-2">
                {house.description}
              </p>

              {/* Métricas principais */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-white">
                    {house.commissionType === 'RevShare' ? `${house.commissionValue}%` : `R$ ${house.commissionValue}`}
                  </p>
                  <p className="text-xs text-slate-400">{house.commissionType}</p>
                </div>
                
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-white">{house.conversionRate}%</p>
                  <p className="text-xs text-slate-400">Conversão</p>
                </div>
              </div>

              {/* Informações detalhadas */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Afiliados:</span>
                  <span className="text-white">{house.affiliatesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Receita:</span>
                  <span className="text-green-400">R$ {house.totalRevenue?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Criada em:</span>
                  <span className="text-white">{new Date(house.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Categorias */}
              <div className="flex space-x-1">
                {house.categories.map((category) => (
                  <Badge key={category} variant="outline" className="text-xs">
                    {category === 'sports' ? 'Esportes' : 'Cassino'}
                  </Badge>
                ))}
              </div>

              {/* Ações */}
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-400 hover:text-red-300"
                  onClick={() => deleteHouseMutation.mutate(house.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de criação */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Adicionar Nova Casa de Apostas</DialogTitle>
          </DialogHeader>
          <CreateHouseForm 
            onSubmit={(data) => createHouseMutation.mutate(data)}
            isLoading={createHouseMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente para formulário de criação
function CreateHouseForm({ onSubmit, isLoading }: { 
  onSubmit: (data: any) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseUrl: '',
    commissionType: 'CPA',
    commissionValue: '',
    categories: [] as string[],
    minimumDeposit: '',
    logoUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      commissionValue: parseFloat(formData.commissionValue),
      minimumDeposit: parseFloat(formData.minimumDeposit)
    });
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Nome da Casa</Label>
          <Input
            placeholder="Ex: Bet365"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="bg-slate-900/50 border-slate-600"
            required
          />
        </div>

        <div>
          <Label className="text-slate-300">URL Base</Label>
          <Input
            placeholder="https://bet365.com"
            value={formData.baseUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
            className="bg-slate-900/50 border-slate-600"
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-slate-300">Descrição</Label>
        <Textarea
          placeholder="Descreva a casa de apostas..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="bg-slate-900/50 border-slate-600"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Tipo de Comissão</Label>
          <Select value={formData.commissionType} onValueChange={(value) => setFormData(prev => ({ ...prev, commissionType: value }))}>
            <SelectTrigger className="bg-slate-900/50 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CPA">CPA (Custo Por Aquisição)</SelectItem>
              <SelectItem value="RevShare">RevShare (Divisão de Receita)</SelectItem>
              <SelectItem value="Hybrid">Hybrid (Misto)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-slate-300">
            Valor da Comissão {formData.commissionType === 'RevShare' ? '(%)' : '(R$)'}
          </Label>
          <Input
            type="number"
            placeholder={formData.commissionType === 'RevShare' ? '35' : '150'}
            value={formData.commissionValue}
            onChange={(e) => setFormData(prev => ({ ...prev, commissionValue: e.target.value }))}
            className="bg-slate-900/50 border-slate-600"
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-slate-300">Depósito Mínimo (R$)</Label>
        <Input
          type="number"
          placeholder="10"
          value={formData.minimumDeposit}
          onChange={(e) => setFormData(prev => ({ ...prev, minimumDeposit: e.target.value }))}
          className="bg-slate-900/50 border-slate-600"
          required
        />
      </div>

      <div>
        <Label className="text-slate-300">Categorias</Label>
        <div className="flex space-x-4 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.categories.includes('sports')}
              onChange={() => toggleCategory('sports')}
              className="rounded border-slate-600"
            />
            <span className="text-slate-300">Esportes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.categories.includes('casino')}
              onChange={() => toggleCategory('casino')}
              className="rounded border-slate-600"
            />
            <span className="text-slate-300">Cassino</span>
          </label>
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900">
          {isLoading ? 'Criando...' : 'Criar Casa'}
        </Button>
      </div>
    </form>
  );
}

// Componente para edição de casa
function BettingHouseEditView({ house }: { house: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Editar {house.name}</h1>
          <p className="text-slate-400">Configure as configurações da casa de apostas</p>
        </div>
        <Button variant="outline">
          <ExternalLink className="w-4 h-4 mr-2" />
          Voltar à Lista
        </Button>
      </div>

      {/* Formulário de edição será implementado aqui */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <p className="text-slate-400">Formulário de edição em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
}