import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Settings as SettingsIcon,
  DollarSign,
  Users,
  Bell,
  Shield,
  Globe,
  Mail,
  Database,
  Key,
  Save,
  RefreshCw,
  AlertCircle,
  Info
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SettingsProps {
  section?: string;
}

export default function Settings({ section = 'general' }: SettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para configurações
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/admin/settings']
  });

  // Mutation para salvar configurações
  const saveSettingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/settings', {
      method: 'PATCH',
      body: data
    }),
    onSuccess: () => {
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <h1 className="text-2xl font-bold text-white">Configurações do Sistema</h1>
          <p className="text-slate-400">Gerencie as configurações globais da plataforma</p>
        </div>
        <Button 
          onClick={() => saveSettingsMutation.mutate(settings)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Tabs de configurações */}
      <Tabs defaultValue={section} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="general" className="data-[state=active]:bg-slate-700">Geral</TabsTrigger>
          <TabsTrigger value="commissions" className="data-[state=active]:bg-slate-700">Comissões</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">Notificações</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">Segurança</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-slate-700">Integrações</TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="general" className="space-y-6">
          <GeneralSettings settings={settings} />
        </TabsContent>

        {/* Configurações de Comissões */}
        <TabsContent value="commissions" className="space-y-6">
          <CommissionSettings settings={settings} />
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings settings={settings} />
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="security" className="space-y-6">
          <SecuritySettings settings={settings} />
        </TabsContent>

        {/* Configurações de Integrações */}
        <TabsContent value="integrations" className="space-y-6">
          <IntegrationSettings settings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para configurações gerais
function GeneralSettings({ settings }: { settings: any }) {
  const [formData, setFormData] = useState({
    siteName: settings?.siteName || 'AfiliadosBet',
    siteDescription: settings?.siteDescription || 'Sistema de afiliação para casas de apostas',
    contactEmail: settings?.contactEmail || 'contato@afiliadosbet.com',
    timezone: settings?.timezone || 'America/Sao_Paulo',
    currency: settings?.currency || 'BRL',
    language: settings?.language || 'pt-BR',
    maintenanceMode: settings?.maintenanceMode || false
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Informações básicas */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Nome do Site</Label>
            <Input
              value={formData.siteName}
              onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
            />
          </div>

          <div>
            <Label className="text-slate-300">Descrição</Label>
            <Textarea
              value={formData.siteDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-slate-300">Email de Contato</Label>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações regionais */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Configurações Regionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Fuso Horário</Label>
            <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                <SelectItem value="Asia/Shanghai">Shanghai (UTC+8)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Moeda</Label>
            <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
                <SelectItem value="CNY">Yuan Chinês (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Idioma</Label>
            <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
                <SelectItem value="zh-CN">中文 (简体)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-300">Modo de Manutenção</Label>
              <p className="text-sm text-slate-400">Desativa o acesso para usuários</p>
            </div>
            <Switch
              checked={formData.maintenanceMode}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, maintenanceMode: checked }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para configurações de comissões
function CommissionSettings({ settings }: { settings: any }) {
  const [formData, setFormData] = useState({
    defaultCommissionRate: settings?.defaultCommissionRate || 35,
    minimumPayout: settings?.minimumPayout || 100,
    payoutFrequency: settings?.payoutFrequency || 'monthly',
    autoApprovePayments: settings?.autoApprovePayments || false,
    maxPayoutAmount: settings?.maxPayoutAmount || 10000,
    commissionTiers: settings?.commissionTiers || [
      { min: 0, max: 1000, rate: 30 },
      { min: 1001, max: 5000, rate: 35 },
      { min: 5001, max: 999999, rate: 40 }
    ]
  });

  return (
    <div className="space-y-6">
      {/* Configurações básicas de comissão */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Configurações de Comissão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Taxa Padrão (%)</Label>
              <Input
                type="number"
                value={formData.defaultCommissionRate}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultCommissionRate: Number(e.target.value) }))}
                className="bg-slate-900/50 border-slate-600"
              />
            </div>

            <div>
              <Label className="text-slate-300">Pagamento Mínimo (R$)</Label>
              <Input
                type="number"
                value={formData.minimumPayout}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumPayout: Number(e.target.value) }))}
                className="bg-slate-900/50 border-slate-600"
              />
            </div>

            <div>
              <Label className="text-slate-300">Frequência de Pagamento</Label>
              <Select value={formData.payoutFrequency} onValueChange={(value) => setFormData(prev => ({ ...prev, payoutFrequency: value }))}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">Pagamento Máximo (R$)</Label>
              <Input
                type="number"
                value={formData.maxPayoutAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPayoutAmount: Number(e.target.value) }))}
                className="bg-slate-900/50 border-slate-600"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <Label className="text-slate-300">Aprovar Pagamentos Automaticamente</Label>
              <p className="text-sm text-slate-400">Aprova pagamentos menores que R$ 1.000 automaticamente</p>
            </div>
            <Switch
              checked={formData.autoApprovePayments}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoApprovePayments: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Níveis de comissão */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Níveis de Comissão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.commissionTiers.map((tier, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg">
                <div className="flex-1">
                  <Label className="text-slate-300">De R$ {tier.min} até R$ {tier.max}</Label>
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    value={tier.rate}
                    onChange={(e) => {
                      const newTiers = [...formData.commissionTiers];
                      newTiers[index].rate = Number(e.target.value);
                      setFormData(prev => ({ ...prev, commissionTiers: newTiers }));
                    }}
                    className="bg-slate-900/50 border-slate-600"
                    placeholder="Taxa %"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para configurações de notificações
function NotificationSettings({ settings }: { settings: any }) {
  const [formData, setFormData] = useState({
    emailNotifications: settings?.emailNotifications || true,
    newAffiliateNotification: settings?.newAffiliateNotification || true,
    paymentRequestNotification: settings?.paymentRequestNotification || true,
    lowBalanceNotification: settings?.lowBalanceNotification || true,
    systemMaintenanceNotification: settings?.systemMaintenanceNotification || true,
    slackWebhook: settings?.slackWebhook || '',
    discordWebhook: settings?.discordWebhook || ''
  });

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Configurações de Notificações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notificações por email */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-300">Notificações por Email</Label>
              <p className="text-sm text-slate-400">Ativa notificações por email para eventos importantes</p>
            </div>
            <Switch
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked }))}
            />
          </div>

          <div className="ml-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Novo afiliado cadastrado</Label>
              <Switch
                checked={formData.newAffiliateNotification}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newAffiliateNotification: checked }))}
                disabled={!formData.emailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Solicitação de pagamento</Label>
              <Switch
                checked={formData.paymentRequestNotification}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, paymentRequestNotification: checked }))}
                disabled={!formData.emailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Saldo baixo</Label>
              <Switch
                checked={formData.lowBalanceNotification}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, lowBalanceNotification: checked }))}
                disabled={!formData.emailNotifications}
              />
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Integrações de Notificação</h3>
          
          <div>
            <Label className="text-slate-300">Webhook do Slack</Label>
            <Input
              value={formData.slackWebhook}
              onChange={(e) => setFormData(prev => ({ ...prev, slackWebhook: e.target.value }))}
              placeholder="https://hooks.slack.com/services/..."
              className="bg-slate-900/50 border-slate-600"
            />
          </div>

          <div>
            <Label className="text-slate-300">Webhook do Discord</Label>
            <Input
              value={formData.discordWebhook}
              onChange={(e) => setFormData(prev => ({ ...prev, discordWebhook: e.target.value }))}
              placeholder="https://discord.com/api/webhooks/..."
              className="bg-slate-900/50 border-slate-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para configurações de segurança
function SecuritySettings({ settings }: { settings: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Configurações de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-400 font-medium">Configurações de Segurança</p>
                <p className="text-sm text-slate-400 mt-1">
                  As configurações de segurança são gerenciadas automaticamente pelo sistema. 
                  Para alterações avançadas, entre em contato com o suporte técnico.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para configurações de integrações
function IntegrationSettings({ settings }: { settings: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Key className="w-5 h-5 mr-2" />
            APIs e Integrações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium">Em Desenvolvimento</p>
                <p className="text-sm text-slate-400 mt-1">
                  As integrações com APIs externas estão sendo desenvolvidas. 
                  Esta seção será atualizada em breve com opções para configurar 
                  integrações com provedores de pagamento e outras APIs.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}