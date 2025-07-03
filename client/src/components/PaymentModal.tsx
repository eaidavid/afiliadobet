import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  CreditCard, 
  Check, 
  X, 
  Eye, 
  FileText, 
  Calendar,
  DollarSign,
  User,
  Building,
  Upload,
  Download,
  History
} from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: any;
  mode: 'view' | 'approve' | 'reject';
}

export function PaymentModal({ open, onOpenChange, payment, mode }: PaymentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUrl, setProofUrl] = useState('');

  const approveMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest(`/api/admin/payments/${payment?.id}/approve`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments'] });
      toast({
        title: "Pagamento Aprovado",
        description: "O pagamento foi aprovado com sucesso!",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao aprovar pagamento",
        variant: "destructive"
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest(`/api/admin/payments/${payment?.id}/reject`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments'] });
      toast({
        title: "Pagamento Rejeitado",
        description: "O pagamento foi rejeitado.",
        variant: "destructive"
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao rejeitar pagamento",
        variant: "destructive"
      });
    }
  });

  const handleApprove = () => {
    const data = {
      notes,
      proofUrl: proofUrl || (proofFile ? URL.createObjectURL(proofFile) : null),
      approvedAt: new Date().toISOString()
    };
    approveMutation.mutate(data);
  };

  const handleReject = () => {
    const data = {
      notes,
      rejectedAt: new Date().toISOString()
    };
    rejectMutation.mutate(data);
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {mode === 'view' ? 'Detalhes do Pagamento' : 
             mode === 'approve' ? 'Aprovar Pagamento' : 'Rejeitar Pagamento'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informações do Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">ID do Pagamento</Label>
                  <p className="font-mono">#PAY-{payment.id?.toString().padStart(6, '0')}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status === 'pending' ? 'Pendente' :
                     payment.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Valor</Label>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(payment.amount || 0)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Data da Solicitação</Label>
                  <p className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(payment.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Método de Pagamento</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4" />
                  <span>{payment.paymentMethod || 'PIX'}</span>
                </div>
              </div>

              {payment.description && (
                <div>
                  <Label className="text-sm text-muted-foreground">Descrição</Label>
                  <p className="bg-slate-900/50 p-3 rounded-lg">{payment.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Afiliado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Afiliado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Nome</Label>
                  <p>{payment.affiliate?.fullName || 'Nome não disponível'}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-mono text-sm">{payment.affiliate?.email || 'Email não disponível'}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">CPF</Label>
                  <p className="font-mono">{payment.affiliate?.cpf || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Telefone</Label>
                  <p>{payment.affiliate?.phone || 'Não informado'}</p>
                </div>
              </div>

              {/* Dados Bancários */}
              <div className="bg-slate-900/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Dados Bancários</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Banco</Label>
                    <p>{payment.affiliate?.bankName || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Agência</Label>
                    <p className="font-mono">{payment.affiliate?.agency || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Conta</Label>
                    <p className="font-mono">{payment.affiliate?.account || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Ações (se viewing) */}
          {mode === 'view' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Histórico de Ações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-sm">Pagamento solicitado</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt || Date.now()).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {payment.approvedAt && (
                    <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div>
                        <p className="text-sm">Pagamento aprovado</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.approvedAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}

                  {payment.rejectedAt && (
                    <div className="flex items-center gap-3 p-3 bg-red-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div>
                        <p className="text-sm">Pagamento rejeitado</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.rejectedAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações de Aprovação/Rejeição */}
          {(mode === 'approve' || mode === 'reject') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {mode === 'approve' ? (
                    <>
                      <Check className="w-5 h-5 text-green-400" />
                      Aprovar Pagamento
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-400" />
                      Rejeitar Pagamento
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={mode === 'approve' ? 
                      'Adicione observações sobre a aprovação...' : 
                      'Informe o motivo da rejeição...'}
                    rows={3}
                  />
                </div>

                {mode === 'approve' && (
                  <div>
                    <Label htmlFor="proofUrl">Comprovante de Pagamento (URL)</Label>
                    <Input
                      id="proofUrl"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="https://..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Link para o comprovante de transferência ou documento
                    </p>
                  </div>
                )}

                <div className="bg-slate-900/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    {mode === 'approve' ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {mode === 'approve' ? 
                      'Ao aprovar, o afiliado será notificado e o pagamento será marcado como processado.' :
                      'Ao rejeitar, o afiliado será notificado sobre o motivo da rejeição.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer com ações */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {mode === 'view' ? 'Fechar' : 'Cancelar'}
            </Button>

            {mode === 'view' ? (
              <div className="flex gap-2">
                {payment.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      onClick={() => {/* Abrir modal de rejeição */}}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rejeitar
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {/* Abrir modal de aprovação */}}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                  </>
                )}
              </div>
            ) : mode === 'approve' ? (
              <Button 
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {approveMutation.isPending ? 'Aprovando...' : 'Confirmar Aprovação'}
              </Button>
            ) : (
              <Button 
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                variant="destructive"
              >
                {rejectMutation.isPending ? 'Rejeitando...' : 'Confirmar Rejeição'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}