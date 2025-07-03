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
  Image as ImageIcon
} from 'lucide-react';

const bettingHouseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  logoUrl: z.string().url("URL da logo deve ser válida").optional().or(z.literal("")),
  websiteUrl: z.string().url("URL do site deve ser válida"),
  baseCpaCommission: z.string().min(1, "Comissão CPA é obrigatória"),
  baseRevSharePercent: z.string().min(1, "Percentual RevShare é obrigatório"),
  cookieDuration: z.string().default("90"),
  category: z.string().default("sports"),
  commissionType: z.enum(["CPA", "RevShare", "Hybrid"]),
  
  // Configurações de postback
  postbackToken: z.string().min(8, "Token deve ter pelo menos 8 caracteres"),
  registrationPostbackUrl: z.string().url("URL de postback de registro deve ser válida").optional().or(z.literal("")),
  depositPostbackUrl: z.string().url("URL de postback de depósito deve ser válida").optional().or(z.literal("")),
  
  // Configurações de API
  apiUrl: z.string().url("URL da API deve ser válida").optional().or(z.literal("")),
  apiKey: z.string().optional(),
  authMethod: z.enum(["Bearer", "API_Key", "Basic"]).default("Bearer"),
  syncInterval: z.string().default("60"),
  integrationMethod: z.enum(["postback", "api"]).default("postback"),
  
  isActive: z.boolean().default(true)
});

type BettingHouseFormData = z.infer<typeof bettingHouseSchema>;

interface BettingHouseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: any;
  mode?: 'create' | 'edit';
}

export function BettingHouseForm({ open, onOpenChange, editData, mode = 'create' }: BettingHouseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'basic' | 'commission' | 'postback' | 'api'>('basic');

  const form = useForm<BettingHouseFormData>({
    resolver: zodResolver(bettingHouseSchema),
    defaultValues: {
      name: editData?.name || '',
      description: editData?.description || '',
      logoUrl: editData?.logoUrl || '',
      websiteUrl: editData?.websiteUrl || '',
      baseCpaCommission: editData?.baseCpaCommission?.toString() || '100',
      baseRevSharePercent: editData?.baseRevSharePercent?.toString() || '25',
      cookieDuration: editData?.cookieDuration?.toString() || '90',
      category: editData?.category || 'sports',
      commissionType: editData?.commissionType || 'CPA',
      postbackToken: editData?.postbackToken || `token_${Date.now()}`,
      registrationPostbackUrl: editData?.registrationPostbackUrl || '',
      depositPostbackUrl: editData?.depositPostbackUrl || '',
      apiUrl: editData?.apiUrl || '',
      apiKey: editData?.apiKey || '',
      authMethod: editData?.authMethod || 'Bearer',
      syncInterval: editData?.syncInterval?.toString() || '60',
      integrationMethod: editData?.integrationMethod || 'postback',
      isActive: editData?.isActive ?? true
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: BettingHouseFormData) => 
      apiRequest(mode === 'edit' ? `/api/admin/betting-houses/${editData?.id}` : '/api/admin/betting-houses', {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/betting-houses'] });
      toast({
        title: "Sucesso",
        description: mode === 'edit' ? "Casa de apostas atualizada!" : "Casa de apostas criada!",
        variant: "default"
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

  const onSubmit = (data: BettingHouseFormData) => {
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

  const tabs = [
    { id: 'basic', label: 'Informações Básicas', icon: Building2 },
    { id: 'commission', label: 'Comissões', icon: DollarSign },
    { id: 'postback', label: 'Postbacks', icon: Zap },
    { id: 'api', label: 'API & Integração', icon: Settings }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {mode === 'edit' ? 'Editar Casa de Apostas' : 'Nova Casa de Apostas'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Casa</Label>
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
                      <Label htmlFor="category">Categoria</Label>
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
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      {...form.register('description')}
                      placeholder="Descreva a casa de apostas..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="websiteUrl">Site Oficial</Label>
                      <Input
                        id="websiteUrl"
                        {...form.register('websiteUrl')}
                        placeholder="https://..."
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
                        placeholder="https://..."
                      />
                      {form.formState.errors.logoUrl && (
                        <p className="text-sm text-red-500">{form.formState.errors.logoUrl.message}</p>
                      )}
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
                </CardContent>
              </Card>
            )}

            {activeTab === 'commission' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Configurações de Comissão
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="commissionType">Tipo de Comissão</Label>
                    <Select value={form.watch('commissionType')} onValueChange={(value) => form.setValue('commissionType', value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CPA">CPA - Custo Por Aquisição</SelectItem>
                        <SelectItem value="RevShare">RevShare - Compartilhamento de Receita</SelectItem>
                        <SelectItem value="Hybrid">Híbrido - CPA + RevShare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="baseCpaCommission">Comissão CPA Base (R$)</Label>
                      <Input
                        id="baseCpaCommission"
                        type="number"
                        step="0.01"
                        {...form.register('baseCpaCommission')}
                        placeholder="100.00"
                      />
                      {form.formState.errors.baseCpaCommission && (
                        <p className="text-sm text-red-500">{form.formState.errors.baseCpaCommission.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="baseRevSharePercent">RevShare Base (%)</Label>
                      <Input
                        id="baseRevSharePercent"
                        type="number"
                        step="0.01"
                        {...form.register('baseRevSharePercent')}
                        placeholder="25.00"
                      />
                      {form.formState.errors.baseRevSharePercent && (
                        <p className="text-sm text-red-500">{form.formState.errors.baseRevSharePercent.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Simulação de Ganhos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">CPA por conversão:</p>
                        <p className="font-semibold text-green-400">R$ {form.watch('baseCpaCommission') || '0'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">RevShare mensal:</p>
                        <p className="font-semibold text-blue-400">{form.watch('baseRevSharePercent') || '0'}% da receita</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cookie válido por:</p>
                        <p className="font-semibold text-yellow-400">{form.watch('cookieDuration') || '0'} dias</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'postback' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Configurações de Postback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="postbackToken">Token de Postback</Label>
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
                    {form.formState.errors.postbackToken && (
                      <p className="text-sm text-red-500">{form.formState.errors.postbackToken.message}</p>
                    )}
                  </div>

                  <div className="bg-slate-900/30 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold">URLs de Postback Geradas</h4>
                    
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">Registro de Usuário:</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            readOnly
                            value={`${window.location.origin}/api/postback/${form.watch('postbackToken')}/registration`}
                            className="bg-slate-800 text-sm"
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
                            className="bg-slate-800 text-sm"
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
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

                  <div className="bg-slate-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Parâmetros de Postback</h4>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Badge variant="outline">affid</Badge>
                          <p className="text-muted-foreground">ID do afiliado</p>
                        </div>
                        <div>
                          <Badge variant="outline">conversion_type</Badge>
                          <p className="text-muted-foreground">registration, deposit</p>
                        </div>
                        <div>
                          <Badge variant="outline">user_id</Badge>
                          <p className="text-muted-foreground">ID único do usuário</p>
                        </div>
                        <div>
                          <Badge variant="outline">amount</Badge>
                          <p className="text-muted-foreground">Valor do depósito (se aplicável)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...form.register('isActive')}
                  className="rounded"
                />
                <Label htmlFor="isActive">Casa ativa</Label>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Salvando...' : mode === 'edit' ? 'Atualizar' : 'Criar Casa'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}