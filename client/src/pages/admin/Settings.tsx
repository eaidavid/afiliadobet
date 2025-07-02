import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidade em desenvolvimento. Em breve você poderá configurar:
          </p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>• Comissões padrão</li>
            <li>• Regras de negócio</li>
            <li>• Integrações de API</li>
            <li>• Configurações de email</li>
            <li>• Configurações de segurança</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
