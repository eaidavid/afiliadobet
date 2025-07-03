import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  Users, 
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  MoreHorizontal,
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/AdminLayout';
import { ImprovedBettingHouseForm } from '@/components/ImprovedBettingHouseForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function BettingHousesFixed({ editId }: { editId?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editHouse, setEditHouse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; house: any }>({ open: false, house: null });

  // Query para casas de apostas
  const { data: houses = [], isLoading } = useQuery({
    queryKey: ['/api/betting-houses']
  });

  // Query para estatísticas
  const { data: stats = {} } = useQuery({
    queryKey: ['/api/admin/stats']
  });

  // Mutation para deletar casa
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/betting-houses/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/betting-houses'] });
      toast({
        title: "Casa deletada",
        description: "Casa de apostas removida com sucesso",
      });
      setDeleteDialog({ open: false, house: null });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao deletar casa",
        variant: "destructive"
      });
    }
  });

  // Se houver editId, mostrar formulário de edição
  if (editId) {
    const houseToEdit = houses.find((h: any) => h.id.toString() === editId);
    
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Voltar à Lista
            </Button>
          </div>

          <ImprovedBettingHouseForm 
            open={true}
            onOpenChange={() => window.history.back()}
            editData={houseToEdit}
            mode="edit"
          />
        </div>
      </AdminLayout>
    );
  }

  // Filtros
  const filteredHouses = houses.filter((house: any) => {
    const matchesSearch = house.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         house.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || house.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'sports', 'casino', 'poker', 'esports', 'lottery', 'fantasy'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Casas de Apostas</h1>
            <p className="text-muted-foreground">Gerencie as casas de apostas e suas configurações</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Casa
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Casas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHouses || houses.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Casas Ativas</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeHouses || houses.filter((h: any) => h.isActive).length}</div>
              <p className="text-xs text-muted-foreground">
                Operando normalmente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.totalRevenue || '125,430'}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageConversionRate || '3.2'}%</div>
              <p className="text-xs text-muted-foreground">
                +0.4% desde o mês passado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar casas de apostas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category === 'all' ? 'Todas' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Casas */}
        {isLoading ? (
          <div className="text-center py-8">
            <p>Carregando casas de apostas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHouses.map((house: any) => (
              <Card key={house.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {house.logoUrl ? (
                        <img 
                          src={house.logoUrl} 
                          alt={house.name}
                          className="w-10 h-10 rounded object-contain bg-white p-1"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center">
                          <Building2 className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{house.name}</CardTitle>
                        <Badge variant={house.category === 'sports' ? 'default' : 'secondary'}>
                          {house.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditHouse(house)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(house.websiteUrl, '_blank')}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visitar Site
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setDeleteDialog({ open: true, house })}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {house.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">CPA Base</p>
                      <p className="font-semibold text-green-400">R$ {house.baseCpaCommission || '0'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">RevShare</p>
                      <p className="font-semibold text-blue-400">{house.baseRevSharePercent || '0'}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      {house.isActive ? (
                        <Badge variant="default" className="bg-green-600">
                          <Zap className="w-3 h-3 mr-1" />
                          Ativa
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Inativa
                        </Badge>
                      )}
                      
                      {house.postbackToken && (
                        <Badge variant="outline">
                          <Shield className="w-3 h-3 mr-1" />
                          Postback
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditHouse(house)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredHouses.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma casa encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando sua primeira casa de apostas'}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Casa de Apostas
            </Button>
          </div>
        )}

        {/* Modal de Criação/Edição */}
        <ImprovedBettingHouseForm 
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          mode="create"
        />
        
        {editHouse && (
          <ImprovedBettingHouseForm 
            open={!!editHouse}
            onOpenChange={(open) => !open && setEditHouse(null)}
            editData={editHouse}
            mode="edit"
          />
        )}

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, house: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar a casa "{deleteDialog.house?.name}"? 
                Esta ação não pode ser desfeita e removerá todos os dados relacionados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteMutation.mutate(deleteDialog.house?.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Deletar Casa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}