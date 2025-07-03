import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  FileText,
  Shield,
  Save,
  Edit,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  Percent,
  TrendingUp,
  Award
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialCard } from '@/components/ui/FinancialCard';

interface ProfileProps {
  section?: string;
}

export default function Profile({ section = 'personal' }: ProfileProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para dados do perfil
  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/affiliate/profile']
  });

  // Query para estatísticas do perfil
  const { data: profileStats } = useQuery({
    queryKey: ['/api/affiliate/profile/stats']
  });

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/affiliate/profile', {
      method: 'PATCH',
      body: data
    }),
    onSuccess: () => {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate/profile'] });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
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
          <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
          <p className="text-slate-400">Gerencie suas informações pessoais e configurações</p>
        </div>
        <Button 
          onClick={() => updateProfileMutation.mutate(profile)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Estatísticas do perfil */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinancialCard
          title="Membro desde"
          value={profileStats?.memberSince || 'Jan 2024'}
          change=""
          changeType="neutral"
          icon={Calendar}
          gradient="from-blue-400 to-blue-600"
          description="Data de cadastro"
        />
        
        <FinancialCard
          title="Total Ganho"
          value={`R$ ${profileStats?.totalEarnings?.toLocaleString() || '12.540'}`}
          change="+23.5%"
          changeType="positive"
          icon={DollarSign}
          gradient="from-green-400 to-green-600"
        />
        
        <FinancialCard
          title="Taxa de Conversão"
          value={`${profileStats?.conversionRate || '7.8'}%`}
          change="+0.3%"
          changeType="positive"
          icon={Percent}
          gradient="from-purple-400 to-purple-600"
        />
        
        <FinancialCard
          title="Nível Atual"
          value={profileStats?.currentLevel || 'Ouro'}
          change="Próximo: Platina"
          changeType="positive"
          icon={Award}
          gradient="from-yellow-400 to-yellow-600"
        />
      </div>

      {/* Tabs do perfil */}
      <Tabs defaultValue={section} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="personal" className="data-[state=active]:bg-slate-700">Pessoal</TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-slate-700">Pagamento</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">Segurança</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-slate-700">Documentos</TabsTrigger>
        </TabsList>

        {/* Informações pessoais */}
        <TabsContent value="personal" className="space-y-6">
          <PersonalInfoSection profile={profile} />
        </TabsContent>

        {/* Informações de pagamento */}
        <TabsContent value="payment" className="space-y-6">
          <PaymentInfoSection profile={profile} />
        </TabsContent>

        {/* Configurações de segurança */}
        <TabsContent value="security" className="space-y-6">
          <SecuritySection profile={profile} />
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documents" className="space-y-6">
          <DocumentsSection profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para informações pessoais
function PersonalInfoSection({ profile }: { profile: any }) {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || 'João Silva Afiliado',
    email: profile?.email || 'joao@email.com',
    phone: profile?.phone || '(11) 99999-9999',
    cpf: profile?.cpf || '123.456.789-00',
    birthDate: profile?.birthDate || '1990-01-01',
    address: profile?.address || 'Rua das Flores, 123',
    city: profile?.city || 'São Paulo',
    state: profile?.state || 'SP',
    zipCode: profile?.zipCode || '01234-567',
    bio: profile?.bio || ''
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Informações básicas */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Nome Completo</Label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
            />
          </div>

          <div>
            <Label className="text-slate-300">Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
            />
          </div>

          <div>
            <Label className="text-slate-300">Telefone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
            />
          </div>

          <div>
            <Label className="text-slate-300">CPF</Label>
            <Input
              value={formData.cpf}
              onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
              disabled
            />
            <p className="text-xs text-slate-400 mt-1">O CPF não pode ser alterado</p>
          </div>

          <div>
            <Label className="text-slate-300">Data de Nascimento</Label>
            <Input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Endereço Completo</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Cidade</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="bg-slate-900/50 border-slate-600"
              />
            </div>

            <div>
              <Label className="text-slate-300">Estado</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  {/* Adicionar outros estados */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-slate-300">CEP</Label>
            <Input
              value={formData.zipCode}
              onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
            />
          </div>

          <div>
            <Label className="text-slate-300">Biografia (Opcional)</Label>
            <Textarea
              placeholder="Conte um pouco sobre você..."
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para informações de pagamento
function PaymentInfoSection({ profile }: { profile: any }) {
  const [formData, setFormData] = useState({
    preferredMethod: profile?.preferredPaymentMethod || 'PIX',
    pixKey: profile?.pixKey || 'joao@email.com',
    bankName: profile?.bankName || '',
    agency: profile?.agency || '',
    account: profile?.account || '',
    accountType: profile?.accountType || 'checking'
  });

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Métodos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Método Preferido</Label>
            <Select value={formData.preferredMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredMethod: value }))}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.preferredMethod === 'PIX' && (
            <div>
              <Label className="text-slate-300">Chave PIX</Label>
              <Input
                placeholder="Email, CPF ou telefone"
                value={formData.pixKey}
                onChange={(e) => setFormData(prev => ({ ...prev, pixKey: e.target.value }))}
                className="bg-slate-900/50 border-slate-600"
              />
              <p className="text-xs text-slate-400 mt-1">
                Use uma chave PIX válida cadastrada no seu nome
              </p>
            </div>
          )}

          {formData.preferredMethod === 'bank_transfer' && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Banco</Label>
                <Input
                  placeholder="Nome do banco"
                  value={formData.bankName}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                  className="bg-slate-900/50 border-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Agência</Label>
                  <Input
                    placeholder="1234"
                    value={formData.agency}
                    onChange={(e) => setFormData(prev => ({ ...prev, agency: e.target.value }))}
                    className="bg-slate-900/50 border-slate-600"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Conta</Label>
                  <Input
                    placeholder="56789-0"
                    value={formData.account}
                    onChange={(e) => setFormData(prev => ({ ...prev, account: e.target.value }))}
                    className="bg-slate-900/50 border-slate-600"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Tipo de Conta</Label>
                <Select value={formData.accountType} onValueChange={(value) => setFormData(prev => ({ ...prev, accountType: value }))}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Conta Corrente</SelectItem>
                    <SelectItem value="savings">Conta Poupança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para configurações de segurança
function SecuritySection({ profile }: { profile: any }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Senha Atual</Label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="bg-slate-900/50 border-slate-600 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-slate-300">Nova Senha</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="bg-slate-900/50 border-slate-600 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              A senha deve ter pelo menos 8 caracteres
            </p>
          </div>

          <div>
            <Label className="text-slate-300">Confirmar Nova Senha</Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
            />
          </div>

          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900">
            Alterar Senha
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para documentos
function DocumentsSection({ profile }: { profile: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RG */}
            <div className="p-4 border border-slate-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">RG (Identidade)</h4>
                <span className="text-green-400 text-sm">Verificado</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Documento de identidade</p>
              <Button size="sm" variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
            </div>

            {/* CPF */}
            <div className="p-4 border border-slate-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">CPF</h4>
                <span className="text-green-400 text-sm">Verificado</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Cadastro de Pessoa Física</p>
              <Button size="sm" variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
            </div>

            {/* Comprovante de residência */}
            <div className="p-4 border border-slate-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Comprovante de Residência</h4>
                <span className="text-yellow-400 text-sm">Pendente</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Conta de luz, água ou telefone</p>
              <Button size="sm" variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </div>

            {/* Foto com documento */}
            <div className="p-4 border border-slate-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Selfie com RG</h4>
                <span className="text-green-400 text-sm">Verificado</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Foto segurando o documento</p>
              <Button size="sm" variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2">Status da Verificação</h4>
            <p className="text-sm text-slate-400">
              Sua conta está <span className="text-green-400">parcialmente verificada</span>. 
              Envie o comprovante de residência para completar a verificação e aumentar seus limites de saque.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}