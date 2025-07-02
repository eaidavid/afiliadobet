import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Copy, Edit, Trash2, ExternalLink, Plus } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AffiliateMyLinks() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [editData, setEditData] = useState({
    customName: "",
    campaign: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: affiliateLinks, isLoading } = useQuery({
    queryKey: ["/api/affiliate-links"],
  });

  const updateLinkMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PUT", `/api/affiliate-links/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate-links"] });
      setIsEditModalOpen(false);
      setEditingLink(null);
      toast({
        title: "Link atualizado",
        description: "O link foi atualizado com sucesso.",
      });
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/affiliate-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate-links"] });
      toast({
        title: "Link removido",
        description: "O link foi removido com sucesso.",
      });
    },
  });

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  const handleEditLink = (link: any) => {
    setEditingLink(link);
    setEditData({
      customName: link.customName || "",
      campaign: link.campaign || ""
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    updateLinkMutation.mutate({
      id: editingLink.id,
      data: editData
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Meus Links de Afiliado</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Link
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {affiliateLinks?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Links Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {affiliateLinks?.reduce((sum: number, link: any) => sum + link.clicks, 0) || 0}
              </p>
              <p className="text-sm text-muted-foreground">Total Cliques</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {affiliateLinks?.reduce((sum: number, link: any) => sum + link.conversions, 0) || 0}
              </p>
              <p className="text-sm text-muted-foreground">Total Conversões</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                R$ {affiliateLinks?.reduce((sum: number, link: any) => sum + Number(link.totalCommission), 0).toFixed(2) || "0.00"}
              </p>
              <p className="text-sm text-muted-foreground">Total Comissões</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Links Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-foreground">Link</TableHead>
                <TableHead className="text-foreground">Casa</TableHead>
                <TableHead className="text-foreground">Campanha</TableHead>
                <TableHead className="text-foreground">Cliques</TableHead>
                <TableHead className="text-foreground">Conversões</TableHead>
                <TableHead className="text-foreground">Comissão</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="animate-pulse">Carregando links...</div>
                  </TableCell>
                </TableRow>
              ) : affiliateLinks && affiliateLinks.length > 0 ? (
                affiliateLinks.map((link: any) => (
                  <TableRow key={link.id} className="border-white/5">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {link.customName || `Link ${link.id}`}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {link.linkCode}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {link.bettingHouseName || 'N/A'}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {link.campaign || 'direct'}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {link.clicks}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {link.conversions}
                    </TableCell>
                    <TableCell className="text-foreground">
                      R$ {Number(link.totalCommission).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={link.isActive ? "default" : "secondary"}>
                        {link.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCopyLink(link.fullUrl)}
                          title="Copiar link"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditLink(link)}
                          title="Editar link"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => window.open(link.fullUrl, '_blank')}
                          title="Testar link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteLinkMutation.mutate(link.id)}
                          disabled={deleteLinkMutation.isPending}
                          title="Remover link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Nenhum link de afiliado encontrado</p>
                      <p className="text-sm text-muted-foreground">
                        Crie seu primeiro link na seção "Casas Disponíveis"
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Link Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="glass-card border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar Link</DialogTitle>
          </DialogHeader>
          
          {editingLink && (
            <form onSubmit={handleUpdateLink} className="space-y-4">
              <div className="p-4 glass-card rounded-lg">
                <p className="font-medium text-foreground">{editingLink.bettingHouseName}</p>
                <p className="text-sm text-muted-foreground font-mono">
                  Código: {editingLink.linkCode}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editCustomName">Nome Personalizado</Label>
                <Input
                  id="editCustomName"
                  value={editData.customName}
                  onChange={(e) => setEditData({...editData, customName: e.target.value})}
                  className="bg-surface border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editCampaign">Campanha</Label>
                <Input
                  id="editCampaign"
                  value={editData.campaign}
                  onChange={(e) => setEditData({...editData, campaign: e.target.value})}
                  className="bg-surface border-white/10"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 border-white/10"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={updateLinkMutation.isPending}
                >
                  {updateLinkMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
