import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Search, 
  Star, 
  TrendingUp, 
  DollarSign, 
  Building2,
  Link2,
  Copy,
  ExternalLink,
  Filter,
  ChevronDown,
  Users,
  Calendar,
  Award
} from 'lucide-react';

export default function BettingHouses({ createCampaign }: { createCampaign?: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCommissionType, setSelectedCommissionType] = useState('all');

  // Query para casas de apostas disponíveis
  const { data: bettingHouses, isLoading } = useQuery({
    queryKey: ['/api/betting-houses', { search: searchTerm, category: selectedCategory, commissionType: selectedCommissionType }]
  });

  // Query para links já criados pelo afiliado
  const { data: myLinks } = useQuery({
    queryKey: ['/api/affiliate/links']
  });

  // Mutation para criar link de afiliação
  const createLinkMutation = useMutation({
    mutationFn: (houseId: number) => apiRequest(`/api/affiliate/join`, {
      method: 'POST',
      body: { bettingHouseId: houseId }
    }),
    onSuccess: () => {
      toast({
        title: "Link criado com sucesso!",
        description: "Seu link de afiliação foi gerado e já está ativo.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate/links'] });
    },
    onError: () => {
      toast({
        title: "Erro ao criar link",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Link copiado para a área de transferência.",
    });
  };

  const getCommissionBadgeColor = (type: string) => {
    switch (type) {
      case 'CPA': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'RevShare': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hybrid': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const isLinkedToHouse = (houseId: number) => {
    return myLinks?.some((link: any) => link.bettingHouseId === houseId);
  };

  const getMyLinkForHouse = (houseId: number) => {
    return myLinks?.find((link: any) => link.bettingHouseId === houseId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-white">Casas de Apostas</h1>
          <p className="text-slate-400">Explore e se afilie às melhores casas de apostas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
            {myLinks?.length || 0} Links Ativos
          </Badge>
        </div>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar casa de apostas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/50 border-slate-600 pl-10"
              />
            </div>

            {/* Categoria */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">Todas as categorias</option>
                <option value="sports">Esportes</option>
                <option value="casino">Cassino</option>
                <option value="both">Ambos</option>
              </select>
            </div>

            {/* Tipo de comissão */}
            <div>
              <select
                value={selectedCommissionType}
                onChange={(e) => setSelectedCommissionType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">Todos os tipos</option>
                <option value="CPA">CPA</option>
                <option value="RevShare">RevShare</option>
                <option value="Hybrid">Hybrid</option>
              </select>
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
            description: 'A maior casa de apostas do mundo com as melhores odds e promoções.',
            logoUrl: '',
            commissionType: 'CPA',
            commissionValue: 150,
            conversionRate: 8.5,
            rating: 4.8,
            categories: ['sports', 'casino'],
            isActive: true,
            minimumDeposit: 10
          },
          {
            id: 2,
            name: 'Sportingbet',
            description: 'Casa tradicional com foco em esportes e excelentes promoções.',
            logoUrl: '',
            commissionType: 'RevShare',
            commissionValue: 35,
            conversionRate: 7.2,
            rating: 4.6,
            categories: ['sports'],
            isActive: true,
            minimumDeposit: 20
          },
          {
            id: 3,
            name: 'Betano',
            description: 'Casa moderna com app intuitivo e odds competitivas.',
            logoUrl: '',
            commissionType: 'Hybrid',
            commissionValue: 200,
            conversionRate: 9.1,
            rating: 4.7,
            categories: ['sports', 'casino'],
            isActive: true,
            minimumDeposit: 15
          },
          {
            id: 4,
            name: 'KTO',
            description: 'Casa brasileira com foco no mercado nacional.',
            logoUrl: '',
            commissionType: 'CPA',
            commissionValue: 120,
            conversionRate: 6.8,
            rating: 4.4,
            categories: ['sports'],
            isActive: true,
            minimumDeposit: 5
          },
          {
            id: 5,
            name: 'Pixbet',
            description: 'Saque rápido via PIX e odds especiais para brasileiros.',
            logoUrl: '',
            commissionType: 'RevShare',
            commissionValue: 30,
            conversionRate: 7.9,
            rating: 4.5,
            categories: ['sports', 'casino'],
            isActive: true,
            minimumDeposit: 10
          },
          {
            id: 6,
            name: 'Parimatch',
            description: 'Casa internacional com grandes apostas e eventos especiais.',
            logoUrl: '',
            commissionType: 'CPA',
            commissionValue: 180,
            conversionRate: 8.3,
            rating: 4.6,
            categories: ['sports', 'casino'],
            isActive: true,
            minimumDeposit: 25
          }
        ]).map((house) => {
          const isLinked = isLinkedToHouse(house.id);
          const myLink = getMyLinkForHouse(house.id);

          return (
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
                  <Badge 
                    className={getCommissionBadgeColor(house.commissionType)}
                  >
                    {house.commissionType}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400 line-clamp-2">
                  {house.description}
                </p>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-white">
                      {house.commissionType === 'RevShare' ? `${house.commissionValue}%` : `R$ ${house.commissionValue}`}
                    </p>
                    <p className="text-xs text-slate-400">Comissão</p>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-white">{house.conversionRate}%</p>
                    <p className="text-xs text-slate-400">Conversão</p>
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Depósito mínimo:</span>
                    <span className="text-white">R$ {house.minimumDeposit}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Categorias:</span>
                    <div className="flex space-x-1">
                      {house.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category === 'sports' ? 'Esportes' : 'Cassino'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="space-y-2">
                  {isLinked ? (
                    <>
                      <div className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <Link2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400 font-medium">Afiliado ativo</span>
                      </div>
                      
                      {myLink && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                            <span className="text-xs text-slate-400 truncate flex-1 mr-2">
                              {myLink.trackingUrl}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(myLink.trackingUrl)}
                              className="text-xs p-1"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-sm font-bold text-blue-400">{myLink.clicks || 0}</p>
                              <p className="text-xs text-slate-400">Cliques</p>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-green-400">{myLink.conversions || 0}</p>
                              <p className="text-xs text-slate-400">Conversões</p>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-yellow-400">R$ {myLink.commissions?.toFixed(2) || '0.00'}</p>
                              <p className="text-xs text-slate-400">Comissão</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={() => createLinkMutation.mutate(house.id)}
                      disabled={createLinkMutation.isPending}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700"
                    >
                      {createLinkMutation.isPending ? (
                        'Criando...'
                      ) : (
                        <>
                          <Link2 className="w-4 h-4 mr-2" />
                          Afiliar-se
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Visitar Site
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Seção de estatísticas gerais */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Suas Estatísticas Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Building2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{myLinks?.length || 0}</p>
              <p className="text-sm text-slate-400">Casas Afiliadas</p>
            </div>
            
            <div className="text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {myLinks?.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0) || 0}
              </p>
              <p className="text-sm text-slate-400">Cliques Totais</p>
            </div>
            
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {myLinks?.reduce((sum: number, link: any) => sum + (link.conversions || 0), 0) || 0}
              </p>
              <p className="text-sm text-slate-400">Conversões</p>
            </div>
            
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                R$ {myLinks?.reduce((sum: number, link: any) => sum + (link.commissions || 0), 0)?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-slate-400">Comissões</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}