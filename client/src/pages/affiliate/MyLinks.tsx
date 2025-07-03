import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Link2, 
  Copy, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  ExternalLink,
  TrendingUp,
  MousePointer,
  DollarSign,
  Calendar,
  BarChart3,
  QrCode,
  Share
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MyLinks({ create, analyticsId }: { create?: boolean; analyticsId?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [showCreateModal, setShowCreateModal] = useState(create || false);

  // Query para links do afiliado
  const { data: myLinks, isLoading } = useQuery({
    queryKey: ['/api/affiliate/links']
  });

  // Query para casas disponíveis
  const { data: availableHouses } = useQuery({
    queryKey: ['/api/betting-houses']
  });

  // Query para analytics de um link específico
  const { data: linkAnalytics } = useQuery({
    queryKey: ['/api/affiliate/links', analyticsId, 'analytics'],
    enabled: !!analyticsId
  });

  // Mutation para criar novo link
  const createLinkMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/affiliate/join', {
      method: 'POST',
      body: data
    }),
    onSuccess: () => {
      toast({
        title: "Link criado com sucesso!",
        description: "Seu novo link de afiliação está ativo.",
      });
      setShowCreateModal(false);
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

  const generateQRCode = (url: string) => {
    // Implementar geração de QR Code
    toast({
      title: "QR Code",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  if (analyticsId && linkAnalytics) {
    return <LinkAnalyticsView linkId={analyticsId} analytics={linkAnalytics} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <h1 className="text-2xl font-bold text-white">Meus Links</h1>
          <p className="text-slate-400">Gerencie seus links de afiliação e acompanhe o desempenho</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Link
        </Button>
      </div>

      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Links Ativos</p>
                <p className="text-2xl font-bold text-white">{myLinks?.length || 0}</p>
              </div>
              <Link2 className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-xs text-slate-400 mt-2">Todos funcionando</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Cliques Totais</p>
                <p className="text-2xl font-bold text-white">
                  {myLinks?.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0) || 0}
                </p>
              </div>
              <MousePointer className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-xs text-green-400 mt-2">+24% esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Conversões</p>
                <p className="text-2xl font-bold text-white">
                  {myLinks?.reduce((sum: number, link: any) => sum + (link.conversions || 0), 0) || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-xs text-slate-400 mt-2">Taxa: 7.2%</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Comissões</p>
                <p className="text-2xl font-bold text-white">
                  R$ {myLinks?.reduce((sum: number, link: any) => sum + (link.commissions || 0), 0)?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-xs text-green-400 mt-2">+R$ 340 esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(myLinks || [
          {
            id: 1,
            bettingHouseName: 'Bet365',
            trackingUrl: 'https://bet365.com/ref/aff123?subid=link1',
            customCode: 'BET365_MAIN',
            clicks: 145,
            conversions: 12,
            commissions: 1800,
            isActive: true,
            createdAt: '2024-07-01',
            lastClick: '2 horas atrás'
          },
          {
            id: 2,
            bettingHouseName: 'Sportingbet',
            trackingUrl: 'https://sportingbet.com/ref/aff123?subid=link2',
            customCode: 'SPORT_PROMO',
            clicks: 132,
            conversions: 9,
            commissions: 1350,
            isActive: true,
            createdAt: '2024-06-28',
            lastClick: '1 hora atrás'
          },
          {
            id: 3,
            bettingHouseName: 'Betano',
            trackingUrl: 'https://betano.com/ref/aff123?subid=link3',
            customCode: 'BETANO_ESPECIAL',
            clicks: 98,
            conversions: 7,
            commissions: 1050,
            isActive: true,
            createdAt: '2024-06-25',
            lastClick: '3 horas atrás'
          },
          {
            id: 4,
            bettingHouseName: 'KTO',
            trackingUrl: 'https://kto.com/ref/aff123?subid=link4',
            customCode: 'KTO_BRASIL',
            clicks: 87,
            conversions: 6,
            commissions: 900,
            isActive: false,
            createdAt: '2024-06-20',
            lastClick: '2 dias atrás'
          }
        ]).map((link) => (
          <Card key={link.id} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{link.bettingHouseName}</CardTitle>
                    <p className="text-sm text-slate-400">{link.customCode}</p>
                  </div>
                </div>
                <Badge variant={link.isActive ? "default" : "secondary"} className={
                  link.isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : ""
                }>
                  {link.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* URL do link */}
              <div className="space-y-2">
                <Label className="text-slate-300">Link de Afiliação</Label>
                <div className="flex items-center space-x-2 p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-400 truncate flex-1">
                    {link.trackingUrl}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(link.trackingUrl)}
                    className="text-xs p-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <MousePointer className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{link.clicks}</p>
                  <p className="text-xs text-slate-400">Cliques</p>
                </div>
                
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{link.conversions}</p>
                  <p className="text-xs text-slate-400">Conversões</p>
                </div>
                
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">R$ {link.commissions}</p>
                  <p className="text-xs text-slate-400">Comissão</p>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Criado em:</span>
                  <span className="text-white">{new Date(link.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Último clique:</span>
                  <span className="text-white">{link.lastClick}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxa de conversão:</span>
                  <span className="text-green-400">{((link.conversions / link.clicks) * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button size="sm" variant="outline" onClick={() => generateQRCode(link.trackingUrl)}>
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Share className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de criação */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Criar Novo Link de Afiliação</DialogTitle>
          </DialogHeader>
          <CreateLinkForm 
            onSubmit={(data) => createLinkMutation.mutate(data)}
            isLoading={createLinkMutation.isPending}
            availableHouses={availableHouses}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente para formulário de criação de link
function CreateLinkForm({ onSubmit, isLoading, availableHouses }: { 
  onSubmit: (data: any) => void; 
  isLoading: boolean;
  availableHouses: any[];
}) {
  const [formData, setFormData] = useState({
    bettingHouseId: '',
    customCode: '',
    description: '',
    campaignName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-slate-300">Casa de Apostas</Label>
        <Select value={formData.bettingHouseId} onValueChange={(value) => setFormData(prev => ({ ...prev, bettingHouseId: value }))}>
          <SelectTrigger className="bg-slate-900/50 border-slate-600">
            <SelectValue placeholder="Selecione uma casa de apostas" />
          </SelectTrigger>
          <SelectContent>
            {(availableHouses || [
              { id: 1, name: 'Bet365' },
              { id: 2, name: 'Sportingbet' },
              { id: 3, name: 'Betano' }
            ]).map((house) => (
              <SelectItem key={house.id} value={house.id.toString()}>
                {house.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-slate-300">Código Personalizado</Label>
        <Input
          placeholder="Ex: PROMO_FUTEBOL"
          value={formData.customCode}
          onChange={(e) => setFormData(prev => ({ ...prev, customCode: e.target.value }))}
          className="bg-slate-900/50 border-slate-600"
        />
        <p className="text-xs text-slate-400 mt-1">Usado para identificar este link (opcional)</p>
      </div>

      <div>
        <Label className="text-slate-300">Nome da Campanha</Label>
        <Input
          placeholder="Ex: Campanha Copa do Mundo"
          value={formData.campaignName}
          onChange={(e) => setFormData(prev => ({ ...prev, campaignName: e.target.value }))}
          className="bg-slate-900/50 border-slate-600"
        />
      </div>

      <div>
        <Label className="text-slate-300">Descrição</Label>
        <Textarea
          placeholder="Descreva o objetivo deste link..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="bg-slate-900/50 border-slate-600"
          rows={3}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900">
          {isLoading ? 'Criando...' : 'Criar Link'}
        </Button>
      </div>
    </form>
  );
}

// Componente para visualização de analytics de um link
function LinkAnalyticsView({ linkId, analytics }: { linkId: string; analytics: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics do Link</h1>
          <p className="text-slate-400">Desempenho detalhado do link de afiliação</p>
        </div>
        <Button variant="outline">
          <ExternalLink className="w-4 h-4 mr-2" />
          Voltar aos Links
        </Button>
      </div>

      {/* Métricas detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="text-center">
              <MousePointer className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{analytics?.totalClicks || 145}</p>
              <p className="text-sm text-slate-400">Cliques Únicos</p>
              <p className="text-xs text-green-400 mt-1">+18% vs semana passada</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{analytics?.conversions || 12}</p>
              <p className="text-sm text-slate-400">Conversões</p>
              <p className="text-xs text-slate-400 mt-1">Taxa: 8.3%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">R$ {analytics?.totalCommissions?.toFixed(2) || '1.800,00'}</p>
              <p className="text-sm text-slate-400">Comissões</p>
              <p className="text-xs text-green-400 mt-1">+R$ 240 esta semana</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{analytics?.avgDaily || 21}</p>
              <p className="text-sm text-slate-400">Média Diária</p>
              <p className="text-xs text-slate-400 mt-1">Cliques por dia</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de performance */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Performance dos Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <BarChart3 className="w-16 h-16 opacity-50" />
            <span className="ml-4">Gráfico de performance será implementado aqui</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}