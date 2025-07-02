import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link, Info } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AffiliateBettingHouses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [linkData, setLinkData] = useState({
    customName: "",
    campaign: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bettingHouses, isLoading } = useQuery({
    queryKey: ["/api/betting-houses"],
  });

  const createLinkMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/affiliate-links", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate-links"] });
      setIsLinkModalOpen(false);
      setLinkData({ customName: "", campaign: "" });
      setSelectedHouse(null);
      toast({
        title: "Link criado com sucesso!",
        description: "Seu link de afiliado foi gerado e está pronto para uso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar link",
        description: "Houve um erro ao criar o link. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateLink = (house: any) => {
    setSelectedHouse(house);
    setIsLinkModalOpen(true);
  };

  const handleSubmitLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHouse) return;

    createLinkMutation.mutate({
      bettingHouseId: selectedHouse.id,
      customName: linkData.customName || `${selectedHouse.name} - Link`,
      campaign: linkData.campaign || "direct"
    });
  };

  const filteredHouses = bettingHouses?.filter((house: any) =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Casas de Apostas Disponíveis</h2>
        <div className="flex space-x-3">
          <Input
            placeholder="Buscar casas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 bg-surface border-white/10"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32 bg-surface border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="sports">Esportes</SelectItem>
              <SelectItem value="casino">Casino</SelectItem>
              <SelectItem value="poker">Poker</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Betting Houses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredHouses.length > 0 ? (
          filteredHouses.map((house: any) => (
            <Card key={house.id} className="glass-card hover:scale-[1.02] transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {house.logoUrl ? (
                    <img 
                      src={house.logoUrl} 
                      alt={`${house.name} logo`}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {house.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{house.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {house.description || "Casa de apostas confiável"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">CPA Comissão:</span>
                    <span className="text-sm font-medium text-secondary">
                      R$ {Number(house.baseCpaCommission).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">RevShare:</span>
                    <span className="text-sm font-medium text-secondary">
                      {Number(house.baseRevSharePercent).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cookie Duration:</span>
                    <span className="text-sm font-medium text-foreground">
                      {house.cookieDuration} dias
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleGenerateLink(house)}
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Gerar Link
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-white/10 hover:bg-white/5"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Nenhuma casa de apostas encontrada</p>
          </div>
        )}
      </div>

      {/* Link Generator Modal */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="glass-card border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Gerar Link de Afiliado</DialogTitle>
          </DialogHeader>
          
          {selectedHouse && (
            <form onSubmit={handleSubmitLink} className="space-y-4">
              <div className="p-4 glass-card rounded-lg">
                <div className="flex items-center space-x-3">
                  {selectedHouse.logoUrl ? (
                    <img 
                      src={selectedHouse.logoUrl} 
                      alt={selectedHouse.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold">
                        {selectedHouse.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{selectedHouse.name}</p>
                    <p className="text-sm text-muted-foreground">
                      CPA: R$ {Number(selectedHouse.baseCpaCommission).toFixed(0)} | 
                      RevShare: {Number(selectedHouse.baseRevSharePercent).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customName">Nome Personalizado (Opcional)</Label>
                <Input
                  id="customName"
                  placeholder="Ex: Promo Copa do Mundo"
                  value={linkData.customName}
                  onChange={(e) => setLinkData({...linkData, customName: e.target.value})}
                  className="bg-surface border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign">Campanha</Label>
                <Input
                  id="campaign"
                  placeholder="Ex: instagram, facebook, blog"
                  value={linkData.campaign}
                  onChange={(e) => setLinkData({...linkData, campaign: e.target.value})}
                  className="bg-surface border-white/10"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsLinkModalOpen(false)}
                  className="flex-1 border-white/10"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={createLinkMutation.isPending}
                >
                  {createLinkMutation.isPending ? "Gerando..." : "Gerar Link"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
