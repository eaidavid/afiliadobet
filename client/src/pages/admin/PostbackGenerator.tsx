import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Copy, 
  TestTube, 
  Settings, 
  Link, 
  Code, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Plus,
  Save
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function PostbackGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedHouse, setSelectedHouse] = useState('');
  const [eventType, setEventType] = useState('registration');
  const [postbackUrl, setPostbackUrl] = useState('');
  const [testData, setTestData] = useState({
    subid: 'TEST123',
    customer_id: 'customer123',
    amount: '100.00',
    currency: 'BRL'
  });

  // Query para casas de apostas
  const { data: bettingHouses, isLoading } = useQuery({
    queryKey: ['/api/betting-houses']
  });

  // Query para configurações de postback existentes
  const { data: postbackConfigs } = useQuery({
    queryKey: ['/api/admin/postback-configs']
  });

  // Mutation para salvar configuração
  const saveConfigMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/admin/postback-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuração salva!",
        description: "Postback configurado com sucesso."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/postback-configs'] });
    }
  });

  // Mutation para testar postback
  const testPostbackMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/postback-test', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: (result: any) => {
      toast({
        title: result.success ? "Teste bem-sucedido!" : "Teste falhou",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    }
  });

  const generatePostbackUrl = () => {
    if (!selectedHouse || !eventType) return '';
    
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      house_id: selectedHouse,
      event: eventType,
      subid: '{subid}',
      customer_id: '{customer_id}',
      amount: '{amount}',
      currency: '{currency}',
      timestamp: '{timestamp}'
    });
    
    return `${baseUrl}/api/postback/receive?${params.toString()}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "URL copiada para a área de transferência."
    });
  };

  const handleSaveConfig = () => {
    if (!selectedHouse || !postbackUrl) {
      toast({
        title: "Dados incompletos",
        description: "Selecione uma casa e configure a URL.",
        variant: "destructive"
      });
      return;
    }

    saveConfigMutation.mutate({
      bettingHouseId: parseInt(selectedHouse),
      eventType,
      postbackUrl,
      isActive: true
    });
  };

  const handleTestPostback = () => {
    if (!selectedHouse || !eventType) {
      toast({
        title: "Dados incompletos",
        description: "Selecione uma casa e tipo de evento.",
        variant: "destructive"
      });
      return;
    }

    testPostbackMutation.mutate({
      bettingHouseId: parseInt(selectedHouse),
      eventType,
      testData
    });
  };

  const eventTypes = [
    { value: 'registration', label: 'Registro', description: 'Usuário se cadastrou na casa' },
    { value: 'deposit', label: 'Depósito', description: 'Usuário fez um depósito' },
    { value: 'bet', label: 'Aposta', description: 'Usuário fez uma aposta' },
    { value: 'revenue', label: 'Receita', description: 'Receita gerada pelo usuário' }
  ];

  const availableParams = [
    { param: '{subid}', description: 'ID do link de afiliação' },
    { param: '{customer_id}', description: 'ID do cliente na casa' },
    { param: '{amount}', description: 'Valor da transação' },
    { param: '{currency}', description: 'Moeda (BRL, USD, etc.)' },
    { param: '{timestamp}', description: 'Timestamp do evento' },
    { param: '{event_id}', description: 'ID único do evento' }
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumbs />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerador de Postbacks</h1>
          <p className="text-slate-300 mt-2">Configure postbacks para receber conversões das casas de apostas</p>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="configs">Configurações</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Configuração */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuração
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Casa de Apostas</Label>
                  <Select value={selectedHouse} onValueChange={setSelectedHouse}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Selecione a casa" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {bettingHouses?.map((house: any) => (
                        <SelectItem key={house.id} value={house.id.toString()}>
                          {house.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Tipo de Evento</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-slate-400">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">URL Personalizada (Opcional)</Label>
                  <Input
                    value={postbackUrl}
                    onChange={(e) => setPostbackUrl(e.target.value)}
                    placeholder="https://seusite.com/postback"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Deixe vazio para usar a URL gerada automaticamente
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* URL Gerada */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  URL do Postback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">URL Gerada</Label>
                  <div className="flex gap-2">
                    <Input
                      value={postbackUrl || generatePostbackUrl()}
                      readOnly
                      className="bg-slate-700/50 border-slate-600 text-white font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(postbackUrl || generatePostbackUrl())}
                      className="border-slate-600"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Parâmetros Disponíveis</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {availableParams.map((param) => (
                      <div key={param.param} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                        <code className="text-xs text-blue-300">{param.param}</code>
                        <span className="text-xs text-slate-400">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveConfig}
                    className="flex-1"
                    disabled={saveConfigMutation.isPending}
                  >
                    {saveConfigMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Salvar Configuração
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teste de Postback */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Teste de Postback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-white">SubID</Label>
                  <Input
                    value={testData.subid}
                    onChange={(e) => setTestData({...testData, subid: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Customer ID</Label>
                  <Input
                    value={testData.customer_id}
                    onChange={(e) => setTestData({...testData, customer_id: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Valor</Label>
                  <Input
                    value={testData.amount}
                    onChange={(e) => setTestData({...testData, amount: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Moeda</Label>
                  <Input
                    value={testData.currency}
                    onChange={(e) => setTestData({...testData, currency: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <Button 
                onClick={handleTestPostback}
                variant="outline"
                disabled={testPostbackMutation.isPending}
                className="border-slate-600"
              >
                {testPostbackMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <TestTube className="w-4 h-4 mr-2" />}
                Enviar Teste
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configs">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Configurações Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {postbackConfigs?.map((config: any) => (
                  <div key={config.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white">{config.bettingHouse?.name}</h3>
                        <Badge variant="outline" className="border-blue-500 text-blue-300">
                          {config.eventType}
                        </Badge>
                        {config.isActive ? (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inativo
                          </Badge>
                        )}
                      </div>
                      <code className="text-xs text-slate-400 mt-2 block">{config.postbackUrl}</code>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Logs de Postback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Implementação de logs em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}