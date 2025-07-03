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
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Check,
  X,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Banknote
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FinancialCard } from '@/components/ui/FinancialCard';

interface PaymentsProps {
  paymentId?: string;
}

export default function Payments({ paymentId }: PaymentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Query para pagamentos
  const { data: payments, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/payments', { search: searchTerm, status: statusFilter }]
  });

  // Query para estatísticas de pagamentos
  const { data: paymentsStats } = useQuery({
    queryKey: ['/api/admin/payments/stats']
  });

  // Query para pagamento específico
  const { data: paymentDetails } = useQuery({
    queryKey: ['/api/admin/payments', paymentId],
    enabled: !!paymentId
  });

  // Mutation para aprovar pagamento
  const approvePaymentMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/payments/${id}/approve`, {
      method: 'PATCH'
    }),
    onSuccess: () => {
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments'] });
    }
  });

  // Mutation para rejeitar pagamento
  const rejectPaymentMutation = useMutation({
    mutationFn: (data: { id: number; reason: string }) => apiRequest(`/api/admin/payments/${data.id}/reject`, {
      method: 'PATCH',
      body: { reason: data.reason }
    }),
    onSuccess: () => {
      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments'] });
    }
  });

  if (paymentId && paymentDetails) {
    return <PaymentDetailView payment={paymentDetails} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-white">Gerenciar Pagamentos</h1>
          <p className="text-slate-400">Processe e monitore pagamentos de comissões</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinancialCard
          title="Total Pendente"
          value={`R$ ${paymentsStats?.totalPending?.toLocaleString() || '15.420'}`}
          change="+8.3%"
          changeType="neutral"
          icon={Clock}
          gradient="from-orange-400 to-orange-600"
        />
        
        <FinancialCard
          title="Pago Este Mês"
          value={`R$ ${paymentsStats?.paidThisMonth?.toLocaleString() || '87.650'}`}
          change="+24.1%"
          changeType="positive"
          icon={Check}
          gradient="from-green-400 to-green-600"
        />
        
        <FinancialCard
          title="Total de Solicitações"
          value={paymentsStats?.totalRequests || '127'}
          change="+5.2%"
          changeType="positive"
          icon={FileText}
          gradient="from-blue-400 to-blue-600"
        />
        
        <FinancialCard
          title="Taxa de Aprovação"
          value={`${paymentsStats?.approvalRate || '94.2'}%`}
          change="+1.1%"
          changeType="positive"
          icon={TrendingUp}
          gradient="from-purple-400 to-purple-600"
        />
      </div>

      {/* Filtros */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por afiliado ou valor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/50 border-slate-600 pl-10"
              />
            </div>

            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de pagamentos */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Solicitações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(payments || [
              {
                id: 1,
                affiliateName: 'João Silva',
                affiliateEmail: 'joao@email.com',
                amount: 2500.00,
                requestDate: '2024-07-01',
                status: 'pending',
                paymentMethod: 'PIX',
                pixKey: 'joao@email.com',
                commissionPeriod: 'Junho 2024'
              },
              {
                id: 2,
                affiliateName: 'Maria Santos',
                affiliateEmail: 'maria@email.com',
                amount: 1800.00,
                requestDate: '2024-07-02',
                status: 'approved',
                paymentMethod: 'Transferência',
                bankDetails: 'Banco: 001 - Ag: 1234 - Conta: 56789-0',
                commissionPeriod: 'Junho 2024'
              },
              {
                id: 3,
                affiliateName: 'Pedro Oliveira',
                affiliateEmail: 'pedro@email.com',
                amount: 3200.00,
                requestDate: '2024-06-30',
                status: 'processing',
                paymentMethod: 'PIX',
                pixKey: '123.456.789-00',
                commissionPeriod: 'Junho 2024'
              },
              {
                id: 4,
                affiliateName: 'Ana Costa',
                affiliateEmail: 'ana@email.com',
                amount: 950.00,
                requestDate: '2024-07-01',
                status: 'rejected',
                paymentMethod: 'PIX',
                pixKey: 'ana@email.com',
                rejectionReason: 'Documentação incompleta',
                commissionPeriod: 'Junho 2024'
              }
            ]).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-900" />
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold">{payment.affiliateName}</h3>
                    <p className="text-sm text-slate-400">{payment.affiliateEmail}</p>
                    <p className="text-xs text-slate-500">Comissões: {payment.commissionPeriod}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-lg font-bold text-white">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-sm text-slate-400">{payment.paymentMethod}</p>
                  <p className="text-xs text-slate-500">{new Date(payment.requestDate).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={payment.status} />
                  
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => setSelectedPayment(payment)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {payment.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => approvePaymentMutation.mutate(payment.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              Mostrando 1-10 de 45 solicitações
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>Anterior</Button>
              <Button variant="outline" size="sm">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalhes do pagamento */}
      {selectedPayment && (
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Detalhes do Pagamento</DialogTitle>
            </DialogHeader>
            <PaymentDetailsModal payment={selectedPayment} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Componente para modal de detalhes
function PaymentDetailsModal({ payment }: { payment: any }) {
  return (
    <div className="space-y-6">
      {/* Informações do afiliado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Afiliado</Label>
          <p className="text-white font-semibold">{payment.affiliateName}</p>
          <p className="text-sm text-slate-400">{payment.affiliateEmail}</p>
        </div>
        <div>
          <Label className="text-slate-300">Status</Label>
          <div className="mt-1">
            <StatusBadge status={payment.status} />
          </div>
        </div>
      </div>

      {/* Detalhes financeiros */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Valor</Label>
          <p className="text-2xl font-bold text-white">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <Label className="text-slate-300">Período das Comissões</Label>
          <p className="text-white">{payment.commissionPeriod}</p>
        </div>
      </div>

      {/* Informações de pagamento */}
      <div>
        <Label className="text-slate-300">Método de Pagamento</Label>
        <div className="mt-2 p-3 bg-slate-700/30 rounded-lg">
          <p className="text-white font-medium">{payment.paymentMethod}</p>
          {payment.pixKey && (
            <p className="text-slate-400">Chave PIX: {payment.pixKey}</p>
          )}
          {payment.bankDetails && (
            <p className="text-slate-400">{payment.bankDetails}</p>
          )}
        </div>
      </div>

      {/* Data da solicitação */}
      <div>
        <Label className="text-slate-300">Data da Solicitação</Label>
        <p className="text-white">{new Date(payment.requestDate).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        })}</p>
      </div>

      {/* Motivo de rejeição (se aplicável) */}
      {payment.status === 'rejected' && payment.rejectionReason && (
        <div>
          <Label className="text-slate-300">Motivo da Rejeição</Label>
          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{payment.rejectionReason}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para visualização detalhada de um pagamento
function PaymentDetailView({ payment }: { payment: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pagamento #{payment.id}</h1>
          <p className="text-slate-400">Detalhes completos da solicitação de pagamento</p>
        </div>
        <Button variant="outline">
          Voltar aos Pagamentos
        </Button>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <PaymentDetailsModal payment={payment} />
        </CardContent>
      </Card>
    </div>
  );
}