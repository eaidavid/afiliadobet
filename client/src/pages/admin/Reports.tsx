import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground">Relatórios</h2>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Relatórios Administrativos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidade em desenvolvimento. Em breve você poderá gerar relatórios detalhados sobre:
          </p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>• Conversões por período</li>
            <li>• Performance por afiliado</li>
            <li>• Análise por casa de apostas</li>
            <li>• Funil de conversão</li>
            <li>• Relatórios financeiros</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
