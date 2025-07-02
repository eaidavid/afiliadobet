import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminBettingHouses() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
    baseCpaCommission: "",
    baseRevSharePercent: "",
    cookieDuration: "90"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bettingHouses, isLoading } = useQuery({
    queryKey: ["/api/betting-houses"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/betting-houses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/betting-houses"] });
      setIsCreateOpen(false);
      setFormData({
        name: "",
        description: "",
        logoUrl: "",
        websiteUrl: "",
        baseCpaCommission: "",
        baseRevSharePercent: "",
        cookieDuration: "90"
      });
      toast({
        title: "Casa de apostas criada",
        description: "A casa de apostas foi criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar casa de apostas.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/betting-houses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/betting-houses"] });
      toast({
        title: "Casa removida",
        description: "A casa de apostas foi removida com sucesso.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      baseCpaCommission: parseFloat(formData.baseCpaCommission),
      baseRevSharePercent: parseFloat(formData.baseRevSharePercent),
      cookieDuration: parseInt(formData.cookieDuration)
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Casas de Apostas</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Casa
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Nova Casa de Apostas</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="bg-surface border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                    required
                    className="bg-surface border-white/10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-surface border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL do Logo</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                  className="bg-surface border-white/10"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseCpaCommission">CPA Comissão (R$)</Label>
                  <Input
                    id="baseCpaCommission"
                    type="number"
                    step="0.01"
                    value={formData.baseCpaCommission}
                    onChange={(e) => setFormData({...formData, baseCpaCommission: e.target.value})}
                    required
                    className="bg-surface border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baseRevSharePercent">RevShare (%)</Label>
                  <Input
                    id="baseRevSharePercent"
                    type="number"
                    step="0.01"
                    value={formData.baseRevSharePercent}
                    onChange={(e) => setFormData({...formData, baseRevSharePercent: e.target.value})}
                    required
                    className="bg-surface border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cookieDuration">Cookie (dias)</Label>
                  <Input
                    id="cookieDuration"
                    type="number"
                    value={formData.cookieDuration}
                    onChange={(e) => setFormData({...formData, cookieDuration: e.target.value})}
                    required
                    className="bg-surface border-white/10"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Criando..." : "Criar Casa"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Betting Houses Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-foreground">Casa</TableHead>
                <TableHead className="text-foreground">Website</TableHead>
                <TableHead className="text-foreground">CPA</TableHead>
                <TableHead className="text-foreground">RevShare</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
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
              ) : bettingHouses && bettingHouses.length > 0 ? (
                bettingHouses.map((house: any) => (
                  <TableRow key={house.id} className="border-white/5">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {house.logoUrl && (
                          <img 
                            src={house.logoUrl} 
                            alt={house.name}
                            className="w-8 h-8 rounded object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{house.name}</p>
                          {house.description && (
                            <p className="text-sm text-muted-foreground">{house.description}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={house.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {house.websiteUrl}
                      </a>
                    </TableCell>
                    <TableCell className="text-foreground">
                      R$ {Number(house.baseCpaCommission).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {Number(house.baseRevSharePercent).toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant={house.isActive ? "default" : "secondary"}>
                        {house.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteMutation.mutate(house.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">Nenhuma casa de apostas encontrada</p>
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
