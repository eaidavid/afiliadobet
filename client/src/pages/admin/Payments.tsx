import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export default function AdminPayments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["/api/payments"],
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Pagamentos</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <CreditCard className="w-4 h-4 mr-2" />
          Processar Pagamentos
        </Button>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-foreground">Afiliado</TableHead>
                <TableHead className="text-foreground">Valor</TableHead>
                <TableHead className="text-foreground">Método</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Data</TableHead>
                <TableHead className="text-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="animate-pulse">Carregando...</div>
                  </TableCell>
                </TableRow>
              ) : payments && payments.length > 0 ? (
                payments.map((payment: any) => (
                  <TableRow key={payment.id} className="border-white/5">
                    <TableCell className="text-foreground">
                      {payment.affiliateName || 'N/A'}
                    </TableCell>
                    <TableCell className="text-foreground">
                      R$ {Number(payment.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {payment.method}
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
                      {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {payment.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          Processar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum pagamento encontrado</p>
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
