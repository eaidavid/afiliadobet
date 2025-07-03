import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialCard } from '@/components/ui/FinancialCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  CreditCard,
  TrendingUp,
  MousePointer,
  UserCheck,
  DollarSign,
  Star,
  Activity,
  FileText,
  Banknote
} from 'lucide-react';

export default function AffiliateDetails() {
  const params = useParams() as { id: string };
  const affiliateId = parseInt(params.id);

  // Buscar detalhes do afiliado
  const { data: affiliate, isLoading } = useQuery({
    queryKey: ['/api/admin/affiliates', affiliateId],
    enabled: !!affiliateId
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Afiliado não encontrado</h2>
        <Link href="/admin/affiliates">
          <Button>Voltar para Afiliados</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/affiliates">
            <Button variant="ghost" className="mb-4 text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Afiliados
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={affiliate.profilePhoto} alt={affiliate.fullName} />
                <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900">
                  {affiliate.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white">{affiliate.fullName}</h1>
                <p className="text-slate-300">@{affiliate.username}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant={affiliate.isActive ? "default" : "secondary"}>
                    {affiliate.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    {affiliate.level || 'Novato'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-400">Membro desde</div>
              <div className="text-lg font-semibold">
                {new Date(affiliate.createdAt).toLocaleDateString('pt-BR', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinancialCard
            title="Comissões Totais"
            value={`R$ ${Number(affiliate.totalCommissions || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            gradient="from-emerald-400 to-emerald-600"
          />
          <FinancialCard
            title="Cliques"
            value={Number(affiliate.totalClicks || 0).toLocaleString('pt-BR')}
            icon={MousePointer}
            gradient="from-blue-400 to-blue-600"
          />
          <FinancialCard
            title="Conversões"
            value={Number(affiliate.totalConversions || 0).toLocaleString('pt-BR')}
            icon={UserCheck}
            gradient="from-purple-400 to-purple-600"
          />
          <FinancialCard
            title="Links Ativos"
            value={Number(affiliate.activeLinks || 0).toLocaleString('pt-BR')}
            icon={Activity}
            gradient="from-yellow-400 to-yellow-600"
          />
        </div>

        {/* Tabs com informações detalhadas */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações pessoais */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400">Nome Completo</label>
                      <p className="text-white">{affiliate.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Email</label>
                      <p className="text-white">{affiliate.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Telefone</label>
                      <p className="text-white">{affiliate.phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">CPF</label>
                      <p className="text-white">{affiliate.cpf || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Data de Nascimento</label>
                      <p className="text-white">
                        {affiliate.birthDate 
                          ? new Date(affiliate.birthDate).toLocaleDateString('pt-BR')
                          : 'Não informado'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">Endereço</label>
                    <p className="text-white">{affiliate.address || 'Não informado'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400">Cidade</label>
                      <p className="text-white">{affiliate.city || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Estado</label>
                      <p className="text-white">{affiliate.state || 'Não informado'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">CEP</label>
                    <p className="text-white">{affiliate.zipCode || 'Não informado'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Informações de pagamento */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Informações de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">Chave PIX</label>
                    <p className="text-white">{affiliate.pixKey || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Conta Bancária</label>
                    <p className="text-white">{affiliate.bankAccount || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Saldo Disponível</label>
                    <p className="text-white font-semibold text-lg">
                      R$ {Number(affiliate.availableBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Nível e pontos */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Nível e Pontos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400">Nível Atual</label>
                      <p className="text-white font-semibold">{affiliate.level || 'Novato'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Pontos</label>
                      <p className="text-white font-semibold">{affiliate.points || 0}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Progresso para próximo nível</label>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((affiliate.points || 0) / 1000 * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {affiliate.points || 0} / 1000 pontos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
                <CardDescription>Acompanhe o desempenho do afiliado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Gráficos de performance em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>Todos os pagamentos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Banknote className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Histórico de pagamentos em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas atividades do afiliado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Log de atividades em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}