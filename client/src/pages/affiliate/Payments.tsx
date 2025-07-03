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
  Clock,
  Check,
  AlertCircle,
  Plus,
  Calendar,
  Download,
  RefreshCw,
  Banknote,
  FileText,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FinancialCard } from '@/components/ui/FinancialCard';
import { Textarea } from '@/components/ui/textarea';

interface PaymentsProps {
  request?: boolean;
}

export default function Payments({ request }: PaymentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showRequestModal, setShowRequestModal] = useState(request || false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Query para pagamentos do afiliado
  const { data: payments, isLoading, refetch } = useQuery({
    queryKey: ['/api/affiliate/payments']
  });

  // Query para estatísticas de pagamentos
  const { data: paymentsStats } = useQuery({
    queryKey: ['/api/affiliate/payments/stats']
  });

  // Query para saldo disponível
  const { data: balance } = useQuery({
    queryKey: ['/api/affiliate/balance']
  });

  // Mutation para solicitar pagamento
  const requestPaymentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/affiliate/payments/request', {
      method: 'POST',
      body: data
    }),
    onSuccess: () => {
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso.",
      });
      setShowRequestModal(false);
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate/payments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate/balance'] });
    },
    onError: () => {
      toast({
        title: "Erro na solicitação",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  });

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
          <h1 className="text-2xl font-bold text-white">Meus Pagamentos</h1>
          <p className="text-slate-400">Gerencie suas solicitações de pagamento e histórico</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button 
            onClick={() => setShowRequestModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900"
            disabled={!balance?.available || balance.available < 100}
          >
            <Plus className="w-4 h-4 mr-2" />
            Solicitar Pagamento
          </Button>
        </div>
      </div>

      {/* Saldo e estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinancialCard
          title="Saldo Disponível"
          value={`R$ ${balance?.available?.toLocaleString() || '1.847'}`}
          change=""
          changeType="neutral"
          icon={DollarSign}
          gradient="from-green-400 to-green-600"
          description="Pronto para saque"
        />
        
        <FinancialCard
          title="Pendente"
          value={`R$ ${balance?.pending?.toLocaleString() || '450'}`}
          change=""
          changeType="neutral"
          icon={Clock}
          gradient="from-orange-400 to-orange-600"
          description="Aguardando aprovação"
        />
        
        <FinancialCard
          title="Pago Este Mês"
          value={`R$ ${paymentsStats?.paidThisMonth?.toLocaleString() || '2.850'}`}
          change="+67.3%"
          changeType="positive"
          icon={Check}
          gradient="from-blue-400 to-blue-600"
        />
        
        <FinancialCard
          title="Total Recebido"
          value={`R$ ${paymentsStats?.totalReceived?.toLocaleString() || '12.940'}`}
          change="+42.1%"
          changeType="positive"
          icon={TrendingUp}
          gradient="from-purple-400 to-purple-600"
        />
      </div>

      {/* Aviso de saldo mínimo */}
      {balance?.available && balance.available < 100 && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium">Saldo insuficiente para saque</p>
                <p className="text-sm text-slate-400 mt-1">
                  O valor mínimo para solicitar pagamento é R$ 100,00. 
                  Seu saldo atual é R$ {balance.available.toFixed(2)}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de pagamentos */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(payments || [
              {
                id: 1,
                amount: 2500.00,
                requestDate: '2024-07-01',
                status: 'approved',
                paymentMethod: 'PIX',
                pixKey: 'meu@email.com',
                processedDate: '2024-07-02',
                commissionPeriod: 'Junho 2024'
              },
              {
                id: 2,
                amount: 1800.00,
                requestDate: '2024-06-05',
                status: 'processing',
                paymentMethod: 'PIX',
                pixKey: 'meu@email.com',
                commissionPeriod: 'Maio 2024'
              },
              {
                id: 3,
                amount: 3200.00,
                requestDate: '2024-05-01',
                status: 'approved',
                paymentMethod: 'Transferência',
                bankDetails: 'Banco: 001 - Ag: 1234 - Conta: 56789-0',
                processedDate: '2024-05-03',
                commissionPeriod: 'Abril 2024'
              },
              {
                id: 4,
                amount: 950.00,
                requestDate: '2024-04-25',
                status: 'rejected',
                paymentMethod: 'PIX',
                pixKey: 'meu@email.com',
                rejectionReason: 'Chave PIX inválida',
                commissionPeriod: 'Março 2024'
              }
            ]).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-900" />
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-sm text-slate-400">{payment.paymentMethod}</p>
                    <p className="text-xs text-slate-500">Comissões: {payment.commissionPeriod}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-white">Solicitado em:</p>
                  <p className="text-sm text-slate-400">{new Date(payment.requestDate).toLocaleDateString()}</p>
                  {payment.processedDate && (
                    <p className="text-xs text-green-400">Pago em: {new Date(payment.processedDate).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={payment.status} />
                  
                  <Button size="sm" variant="outline" onClick={() => setSelectedPayment(payment)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Informação caso não tenha pagamentos */}
          {(!payments || payments.length === 0) && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nenhum pagamento ainda</h3>
              <p className="text-slate-400 mb-4">Você ainda não fez nenhuma solicitação de pagamento.</p>
              <Button 
                onClick={() => setShowRequestModal(true)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900"
                disabled={!balance?.available || balance.available < 100}
              >
                <Plus className="w-4 h-4 mr-2" />
                Fazer Primeira Solicitação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de solicitação de pagamento */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Solicitar Pagamento</DialogTitle>
          </DialogHeader>
          <PaymentRequestForm 
            onSubmit={(data) => requestPaymentMutation.mutate(data)}
            isLoading={requestPaymentMutation.isPending}
            availableBalance={balance?.available || 0}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de detalhes do pagamento */}
      {selectedPayment && (
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-lg">
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

// Componente para formulário de solicitação
function PaymentRequestForm({ onSubmit, isLoading, availableBalance }: { 
  onSubmit: (data: any) => void; 
  isLoading: boolean;
  availableBalance: number;
}) {
  const [formData, setFormData] = useState({
    amount: availableBalance,
    paymentMethod: 'PIX',
    pixKey: '',
    bankDetails: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-slate-300">Valor a Solicitar</Label>
        <Input
          type="number"
          step="0.01"
          min="100"
          max={availableBalance}
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
          className="bg-slate-900/50 border-slate-600"
          required
        />
        <p className="text-xs text-slate-400 mt-1">
          Disponível: R$ {availableBalance.toFixed(2)} | Mínimo: R$ 100,00
        </p>
      </div>

      <div>
        <Label className="text-slate-300">Método de Pagamento</Label>
        <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
          <SelectTrigger className="bg-slate-900/50 border-slate-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PIX">PIX</SelectItem>
            <SelectItem value="Transferência">Transferência Bancária</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.paymentMethod === 'PIX' && (
        <div>
          <Label className="text-slate-300">Chave PIX</Label>
          <Input
            placeholder="email@exemplo.com, CPF ou telefone"
            value={formData.pixKey}
            onChange={(e) => setFormData(prev => ({ ...prev, pixKey: e.target.value }))}
            className="bg-slate-900/50 border-slate-600"
            required
          />
        </div>
      )}

      {formData.paymentMethod === 'Transferência' && (
        <div>
          <Label className="text-slate-300">Dados Bancários</Label>
          <Textarea
            placeholder="Banco, Agência, Conta..."
            value={formData.bankDetails}
            onChange={(e) => setFormData(prev => ({ ...prev, bankDetails: e.target.value }))}
            className="bg-slate-900/50 border-slate-600"
            rows={3}
            required
          />
        </div>
      )}

      <div>
        <Label className="text-slate-300">Observações (opcional)</Label>
        <Textarea
          placeholder="Adicione qualquer observação..."
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="bg-slate-900/50 border-slate-600"
          rows={2}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900">
          {isLoading ? 'Enviando...' : 'Solicitar Pagamento'}
        </Button>
      </div>
    </form>
  );
}

// Componente para modal de detalhes
function PaymentDetailsModal({ payment }: { payment: any }) {
  return (
    <div className="space-y-4">
      {/* Valor e status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Valor</Label>
          <p className="text-2xl font-bold text-white">R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <Label className="text-slate-300">Status</Label>
          <div className="mt-1">
            <StatusBadge status={payment.status} />
          </div>
        </div>
      </div>

      {/* Datas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Data da Solicitação</Label>
          <p className="text-white">{new Date(payment.requestDate).toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })}</p>
        </div>
        {payment.processedDate && (
          <div>
            <Label className="text-slate-300">Data do Pagamento</Label>
            <p className="text-green-400">{new Date(payment.processedDate).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}</p>
          </div>
        )}
      </div>

      {/* Método de pagamento */}
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

      {/* Período das comissões */}
      <div>
        <Label className="text-slate-300">Período das Comissões</Label>
        <p className="text-white">{payment.commissionPeriod}</p>
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