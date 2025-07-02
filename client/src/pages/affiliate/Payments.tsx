import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, CreditCard, Banknote } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function AffiliatePayments() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    method: "pix",
    pixKey: ""
  });

  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["/api/payments"],
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/payments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      setIsWithdrawModalOpen(false);
      setWithdrawData({ amount: "", method: "pix", pixKey: "" });
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de saque foi enviada e será processada em breve.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao solicitar saque. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawData.amount);
    const availableBalance = Number(profile?.availableBalance || 0);
    
    if (amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > availableBalance) {
      toast({
        title: "Saldo insuficiente",
        description: "O valor solicitado é maior que seu saldo disponível.",
        variant: "destructive",
      });
      return;
    }

    createPaymentMutation.mutate({
      amount: amount.toString(),
      method: withdrawData.method,
      pixKey: withdrawData.pixKey
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Pagamentos e Saques</h2>
        <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Solicitar Saque
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Solicitar Saque</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="p-4 glass-card rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Saldo disponível:</span>
                  <span className="text-lg font-bold text-secondary">
                    R$ {Number(profile?.availableBalance || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Valor do Saque</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={withdrawData.amount}
                  onChange={(e) => setWithdrawData({...withdrawData, amount: e.target.value})}
                  required
                  className="bg-surface border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="method">Método de Pagamento</Label>
                <Select value={withdrawData.method} onValueChange={(value) => setWithdrawData({...withdrawData, method: value})}>
                  <SelectTrigger className="bg-surface border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {withdrawData.method === "pix" && (
                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave PIX</Label>
                  <Input
                    id="pixKey"
                    placeholder="Digite sua chave PIX"
                    value={withdrawData.pixKey}
                    onChange={(e) => setWithdrawData({...withdrawData, pixKey: e.target.value})}
                    required
                    className="bg-surface border-white/10"
                  />
                </div>
              )}
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 border-white/10"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={createPaymentMutation.isPending}
                >
                  {createPaymentMutation.isPending ? "Processando..." : "Solicitar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Disponível</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {Number(profile?.availableBalance || 0).toFixed(2)}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-secondary opacity-75" />
            </div>
            <div className="mt-4">
              <Button 
                size="sm" 
                onClick={() => setIsWithdrawModalOpen(true)}
                className="text-primary hover:text-primary/80"
                variant="ghost"
              >
                Solicitar Saque
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Comissão Total</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {Number(profile?.totalCommission || 0).toFixed(2)}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-primary opacity-75" />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Comissão acumulada desde o início
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendente</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {payments?.filter((p: any) => p.status === 'pending')
                    .reduce((sum: number, p: any) => sum + Number(p.amount), 0)
                    .toFixed(2) || "0.00"}
                </p>
              </div>
              <Banknote className="w-8 h-8 text-warning opacity-75" />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Aguardando processamento
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-foreground">Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-foreground">Data</TableHead>
                <TableHead className="text-foreground">Valor</TableHead>
                <TableHead className="text-foreground">Método</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Processado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="animate-pulse">Carregando pagamentos...</div>
                  </TableCell>
                </TableRow>
              ) : payments && payments.length > 0 ? (
                payments.map((payment: any) => (
                  <TableRow key={payment.id} className="border-white/5">
                    <TableCell className="text-foreground">
                      {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-foreground">
                      R$ {Number(payment.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {payment.method === 'pix' ? 'PIX' : 'Transferência Bancária'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          payment.status === 'processed' ? 'default' : 
                          payment.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {payment.status === 'processed' ? 'Processado' : 
                         payment.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {payment.processedAt 
                        ? new Date(payment.processedAt).toLocaleDateString('pt-BR')
                        : '-'
                      }
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Nenhum pagamento encontrado</p>
                      <p className="text-sm text-muted-foreground">
                        Seus pagamentos aparecerão aqui quando solicitados
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
