import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Building2, 
  Link as LinkIcon, 
  DollarSign, 
  Settings, 
  Globe,
  Key,
  Zap,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  CreditCard,
  Percent,
  Clock,
  Shield,
  TestTube,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

const improvedBettingHouseSchema = z.object({
  // Informações Básicas
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  logoUrl: z.string().url("URL da logo deve ser válida").optional().or(z.literal("")),
  websiteUrl: z.string().url("URL do site deve ser válida"),
  category: z.string().min(1, "Categoria é obrigatória"),
  
  // Configurações Financeiras
  baseCpaCommission: z.string().min(1, "Comissão CPA é obrigatória"),
  baseRevSharePercent: z.string().min(1, "Percentual RevShare é obrigatório"),
  minimumPayout: z.string().default("100"),
  paymentMethods: z.array(z.string()).min(1, "Selecione pelo menos um método de pagamento"),
  
  // Configurações de Tracking
  cookieDuration: z.string().default("90"),
  postbackToken: z.string().min(8, "Token deve ter pelo menos 8 caracteres"),
  
  // URLs de Postback
  registrationPostbackUrl: z.string().url("URL de postback de registro deve ser válida").optional().or(z.literal("")),
  depositPostbackUrl: z.string().url("URL de postback de depósito deve ser válida").optional().or(z.literal("")),
  
  // Configurações Avançadas
  requiresKyc: z.boolean().default(false),
  geoRestrictions: z.array(z.string()).default([]),
  supportedCurrencies: z.array(z.string()).min(1, "Selecione pelo menos uma moeda"),
  
  // API Configuration
  apiUrl: z.string().url("URL da API deve ser válida").optional().or(z.literal("")),
  apiKey: z.string().optional(),
  authMethod: z.enum(["Bearer", "API_Key", "Basic"]).default("Bearer"),
  syncInterval: z.string().default("60"),
  integrationMethod: z.enum(["postback", "api"]).default("postback"),
  
  // Status e Configurações
  isActive: z.boolean().default(true),
  
  // Configurações Específicas
  allowSubAffiliates: z.boolean().default(false),
  customCommissionTiers: z.boolean().default(false),
  realTimeReporting: z.boolean().default(true)
});

type ImprovedBettingHouseFormData = z.infer<typeof improvedBettingHouseSchema>;

interface ImprovedBettingHouseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: any;
  mode?: 'create' | 'edit';
}

export function ImprovedBettingHouseForm({ open, onOpenChange, editData, mode = 'create' }: ImprovedBettingHouseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'basic' | 'financial' | 'tracking' | 'api' | 'advanced'>('basic');
  const [testResults, setTestResults] = useState<any>(null);

  const form = useForm<ImprovedBettingHouseFormData>({
    resolver: zodResolver(improvedBettingHouseSchema),
    defaultValues: {
      name: editData?.name || '',
      description: editData?.description || '',
      logoUrl: editData?.logoUrl || '',
      websiteUrl: editData?.websiteUrl || '',
      category: editData?.category || 'sports',
      baseCpaCommission: editData?.baseCpaCommission?.toString() || '100',
      baseRevSharePercent: editData?.baseRevSharePercent?.toString() || '25',
      minimumPayout: editData?.minimumPayout?.toString() || '100',
      paymentMethods: editData?.paymentMethods || ['pix'],
      cookieDuration: editData?.cookieDuration?.toString() || '90',
      postbackToken: editData?.postbackToken || `token_${Date.now()}`,
      registrationPostbackUrl: editData?.registrationPostbackUrl || '',
      depositPostbackUrl: editData?.depositPostbackUrl || '',
      requiresKyc: editData?.requiresKyc ?? false,
      geoRestrictions: editData?.geoRestrictions || [],
      supportedCurrencies: editData?.supportedCurrencies || ['BRL'],
      apiUrl: editData?.apiUrl || '',
      apiKey: editData?.apiKey || '',
      authMethod: editData?.authMethod || 'Bearer',
      syncInterval: editData?.syncInterval?.toString() || '60',
      integrationMethod: editData?.integrationMethod || 'postback',
      isActive: editData?.isActive ?? true,
      allowSubAffiliates: editData?.allowSubAffiliates ?? false,
      customCommissionTiers: editData?.customCommissionTiers ?? false,
      realTimeReporting: editData?.realTimeReporting ?? true
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: ImprovedBettingHouseFormData) => 
      apiRequest(mode === 'edit' ? `/api/admin/betting-houses/${editData?.id}` : '/api/admin/betting-houses', {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/betting-houses'] });
      toast({
        title: "Sucesso",
        description: mode === 'edit' ? "Casa de apostas atualizada!" : "Casa de apostas criada!",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar casa de apostas",
        variant: "destructive"
      });
    }
  });

  const testPostbackMutation = useMutation({
    mutationFn: async (testData: any) => {
      return apiRequest('/api/admin/postback-test', {
        method: 'POST',
        body: JSON.stringify(testData)
      });
    },
    onSuccess: (result) => {
      setTestResults(result);
      toast({
        title: result.success ? "Teste bem-sucedido!" : "Teste falhou",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    }
  });

  const onSubmit = (data: ImprovedBettingHouseFormData) => {
    createMutation.mutate(data);
  };

  const generateToken = () => {
    const token = `token_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    form.setValue('postbackToken', token);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência",
    });
  };

  const testSpecificPostback = () => {
    const token = form.watch('postbackToken');
    const testData = {
      token,
      type: 'registration',
      testData: {
        affid: 'test_affiliate',
        customer_id: 'test_customer_123',
        amount: '100.00',
        email: 'test@example.com'
      },
      urls: {
        registration: `${window.location.origin}/api/postback/${token}/registration`,
        deposit: `${window.location.origin}/api/postback/${token}/deposit`
      }
    };
    testPostbackMutation.mutate(testData);
  };

  const tabs = [
    { id: 'basic', label: 'Básicas', icon: Building2 },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'tracking', label: 'Tracking', icon: Zap },
    { id: 'api', label: 'API', icon: Settings },
    { id: 'advanced', label: 'Avançado', icon: Shield }
  ];

  const paymentMethodOptions = [
    { value: 'pix', label: 'PIX' },
    { value: 'ted', label: 'TED' },
    { value: 'boleto', label: 'Boleto' },
    { value: 'crypto', label: 'Criptomoedas' },
    { value: 'paypal', label: 'PayPal' }
  ];

  const currencyOptions = [
    { value: 'BRL', label: 'Real Brasileiro (BRL)' },
    { value: 'USD', label: 'Dólar Americano (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'BTC', label: 'Bitcoin (BTC)' }
  ];

  const countryOptions = [
    { value: 'BR', label: 'Brasil' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'AR', label: 'Argentina' },
    { value: 'CL', label: 'Chile' },
    { value: 'CO', label: 'Colômbia' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-200">
            <Building2 className="w-5 h-5 text-yellow-500" />
            {mode === 'edit' ? 'Editar Casa de Apostas' : 'Nova Casa de Apostas'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tabs Navigation */}
          <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg overflow-x-auto border border-slate-700/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold'
                    : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tab Content */}
            {activeTab === 'basic' && (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Building2 className="w-5 h-5 text-yellow-500" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Casa *</Label>
                      <Input
                        id="name"
                        {...form.register('name')}
                        placeholder="Ex: Bet365"
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="category">Categoria *</Label>
                      <Select value={form.watch('category')} onValueChange={(value) => form.setValue('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sports">Esportes</SelectItem>
                          <SelectItem value="casino">Casino</SelectItem>
                          <SelectItem value="poker">Poker</SelectItem>
                          <SelectItem value="esports">E-Sports</SelectItem>
                          <SelectItem value="lottery">Loteria</SelectItem>
                          <SelectItem value="fantasy">Fantasy Sports</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição Detalhada *</Label>
                    <Textarea
                      id="description"
                      {...form.register('description')}
                      placeholder="Descreva a casa de apostas, seus diferenciais, público-alvo, etc..."
                      rows={4}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="websiteUrl">Site Oficial *</Label>
                      <Input
                        id="websiteUrl"
                        {...form.register('websiteUrl')}
                        placeholder="https://bet365.com"
                      />
                      {form.formState.errors.websiteUrl && (
                        <p className="text-sm text-red-500">{form.formState.errors.websiteUrl.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="logoUrl">URL da Logo</Label>
                      <Input
                        id="logoUrl"
                        {...form.register('logoUrl')}
                        placeholder="https://example.com/logo.png"
                      />
                      {form.formState.errors.logoUrl && (
                        <p className="text-sm text-red-500">{form.formState.errors.logoUrl.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Preview da Logo */}
                  {form.watch('logoUrl') && (
                    <div className="bg-slate-900/30 p-4 rounded-lg">
                      <Label className="text-sm text-muted-foreground">Preview da Logo:</Label>
                      <div className="mt-2">
                        <img 
                          src={form.watch('logoUrl')} 
                          alt="Logo preview" 
                          className="h-16 w-auto object-contain bg-white rounded p-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'financial' && (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <DollarSign className="w-5 h-5 text-yellow-500" />
                    Configurações Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="baseCpaCommission">Comissão CPA Base (R$) *</Label>
                      <Input
                        id="baseCpaCommission"
                        type="number"
                        step="0.01"
                        {...form.register('baseCpaCommission')}
                        placeholder="100.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="baseRevSharePercent">RevShare Base (%) *</Label>
                      <Input
                        id="baseRevSharePercent"
                        type="number"
                        step="0.01"
                        {...form.register('baseRevSharePercent')}
                        placeholder="25.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="minimumPayout">Pagamento Mínimo (R$)</Label>
                      <Input
                        id="minimumPayout"
                        type="number"
                        step="0.01"
                        {...form.register('minimumPayout')}
                        placeholder="100.00"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Métodos de Pagamento Aceitos *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {paymentMethodOptions.map((method) => (
                        <label key={method.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={method.value}
                            checked={form.watch('paymentMethods').includes(method.value)}
                            onChange={(e) => {
                              const currentMethods = form.watch('paymentMethods');
                              if (e.target.checked) {
                                form.setValue('paymentMethods', [...currentMethods, method.value]);
                              } else {
                                form.setValue('paymentMethods', currentMethods.filter(m => m !== method.value));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Moedas Suportadas *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {currencyOptions.map((currency) => (
                        <label key={currency.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={currency.value}
                            checked={form.watch('supportedCurrencies').includes(currency.value)}
                            onChange={(e) => {
                              const currentCurrencies = form.watch('supportedCurrencies');
                              if (e.target.checked) {
                                form.setValue('supportedCurrencies', [...currentCurrencies, currency.value]);
                              } else {
                                form.setValue('supportedCurrencies', currentCurrencies.filter(c => c !== currency.value));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{currency.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Simulação de Ganhos */}
                  <div className="bg-slate-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Simulação de Ganhos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-green-900/20 p-3 rounded">
                        <p className="text-muted-foreground">CPA por conversão:</p>
                        <p className="font-semibold text-green-400 text-lg">R$ {form.watch('baseCpaCommission') || '0'}</p>
                      </div>
                      <div className="bg-blue-900/20 p-3 rounded">
                        <p className="text-muted-foreground">RevShare mensal:</p>
                        <p className="font-semibold text-blue-400 text-lg">{form.watch('baseRevSharePercent') || '0'}%</p>
                      </div>
                      <div className="bg-yellow-900/20 p-3 rounded">
                        <p className="text-muted-foreground">Pagamento mínimo:</p>
                        <p className="font-semibold text-yellow-400 text-lg">R$ {form.watch('minimumPayout') || '0'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'tracking' && (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Configurações de Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postbackToken">Token de Postback *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="postbackToken"
                          {...form.register('postbackToken')}
                          placeholder="token_unique_identifier"
                        />
                        <Button type="button" variant="outline" onClick={generateToken}>
                          <Key className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cookieDuration">Duração do Cookie (dias)</Label>
                      <Input
                        id="cookieDuration"
                        type="number"
                        {...form.register('cookieDuration')}
                        placeholder="90"
                      />
                    </div>
                  </div>

                  {/* URLs de Postback Geradas */}
                  <div className="bg-slate-900/30 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      URLs de Postback Específicas
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">Registro de Usuário:</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            readOnly
                            value={`${window.location.origin}/api/postback/${form.watch('postbackToken')}/registration`}
                            className="bg-slate-800 text-sm font-mono"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(`${window.location.origin}/api/postback/${form.watch('postbackToken')}/registration`)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Primeiro Depósito:</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            readOnly
                            value={`${window.location.origin}/api/postback/${form.watch('postbackToken')}/deposit`}
                            className="bg-slate-800 text-sm font-mono"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(`${window.location.origin}/api/postback/${form.watch('postbackToken')}/deposit`)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Teste de Postback Específico */}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Teste de Postback</h5>
                          <p className="text-xs text-muted-foreground">Teste as URLs específicas desta casa</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={testSpecificPostback}
                          disabled={testPostbackMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <TestTube className="w-4 h-4 mr-2" />
                          {testPostbackMutation.isPending ? 'Testando...' : 'Testar'}
                        </Button>
                      </div>
                      
                      {testResults && (
                        <div className={`mt-2 p-3 rounded flex items-center gap-2 text-sm ${
                          testResults.success ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                        }`}>
                          {testResults.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {testResults.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="registrationPostbackUrl">URL Postback Externa - Registro</Label>
                      <Input
                        id="registrationPostbackUrl"
                        {...form.register('registrationPostbackUrl')}
                        placeholder="https://casa-apostas.com/postback/registration"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        URL onde a casa de apostas receberá notificações de novos registros
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="depositPostbackUrl">URL Postback Externa - Depósito</Label>
                      <Input
                        id="depositPostbackUrl"
                        {...form.register('depositPostbackUrl')}
                        placeholder="https://casa-apostas.com/postback/deposit"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        URL onde a casa de apostas receberá notificações de novos depósitos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'api' && (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Settings className="w-5 h-5 text-yellow-500" />
                    Integração por API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="integrationMethod">Método de Integração</Label>
                    <Select value={form.watch('integrationMethod')} onValueChange={(value) => form.setValue('integrationMethod', value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="postback">Postback (Recomendado)</SelectItem>
                        <SelectItem value="api">API Polling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {form.watch('integrationMethod') === 'api' && (
                    <>
                      <div>
                        <Label htmlFor="apiUrl">URL da API</Label>
                        <Input
                          id="apiUrl"
                          {...form.register('apiUrl')}
                          placeholder="https://api.casa-apostas.com/affiliate"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="apiKey">Chave da API</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            {...form.register('apiKey')}
                            placeholder="sk_live_..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="authMethod">Método de Autenticação</Label>
                          <Select value={form.watch('authMethod')} onValueChange={(value) => form.setValue('authMethod', value as any)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bearer">Bearer Token</SelectItem>
                              <SelectItem value="API_Key">API Key</SelectItem>
                              <SelectItem value="Basic">Basic Auth</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="syncInterval">Intervalo de Sincronização (minutos)</Label>
                        <Input
                          id="syncInterval"
                          type="number"
                          {...form.register('syncInterval')}
                          placeholder="60"
                        />
                      </div>
                    </>
                  )}

                  {/* Documentação de Parâmetros */}
                  <div className="bg-slate-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Parâmetros de Postback
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Badge variant="outline" className="mb-1">affid</Badge>
                          <p className="text-muted-foreground">Username do afiliado</p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">customer_id</Badge>
                          <p className="text-muted-foreground">ID único do usuário</p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">amount</Badge>
                          <p className="text-muted-foreground">Valor do depósito (se aplicável)</p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">email</Badge>
                          <p className="text-muted-foreground">Email do usuário registrado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'advanced' && (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Shield className="w-5 h-5 text-yellow-500" />
                    Configurações Avançadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-medium">Configurações de Segurança</h5>
                      
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          {...form.register('requiresKyc')}
                          className="rounded"
                        />
                        <span className="text-sm">Requer verificação KYC</span>
                      </label>

                      <div>
                        <Label>Restrições Geográficas</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {countryOptions.map((country) => (
                            <label key={country.value} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                value={country.value}
                                checked={form.watch('geoRestrictions').includes(country.value)}
                                onChange={(e) => {
                                  const currentRestrictions = form.watch('geoRestrictions');
                                  if (e.target.checked) {
                                    form.setValue('geoRestrictions', [...currentRestrictions, country.value]);
                                  } else {
                                    form.setValue('geoRestrictions', currentRestrictions.filter(c => c !== country.value));
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-sm">{country.label}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Países onde a casa NÃO opera</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-medium">Funcionalidades Avançadas</h5>
                      
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          {...form.register('allowSubAffiliates')}
                          className="rounded"
                        />
                        <span className="text-sm">Permitir sub-afiliados</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          {...form.register('customCommissionTiers')}
                          className="rounded"
                        />
                        <span className="text-sm">Níveis de comissão personalizados</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          {...form.register('realTimeReporting')}
                          className="rounded"
                        />
                        <span className="text-sm">Relatórios em tempo real</span>
                      </label>
                    </div>
                  </div>

                  {/* Resumo da Configuração */}
                  <div className="bg-slate-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Resumo da Configuração</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Método de Pagamento:</p>
                        <p className="font-medium">{form.watch('paymentMethods').join(', ') || 'Nenhum'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Integração:</p>
                        <p className="font-medium">{form.watch('integrationMethod') === 'postback' ? 'Postback' : 'API Polling'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status:</p>
                        <p className="font-medium">{form.watch('isActive') ? 'Ativa' : 'Inativa'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Footer com ações */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...form.register('isActive')}
                    className="rounded border-slate-600 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-slate-300">Casa ativa</span>
                </label>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-yellow-400"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
                >
                  {createMutation.isPending ? 'Salvando...' : mode === 'edit' ? 'Atualizar Casa' : 'Criar Casa'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}