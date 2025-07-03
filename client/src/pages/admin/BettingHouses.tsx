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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Casas de Apostas</h1>
            <p className="text-slate-400">Gerencie as casas de apostas e suas configurações</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Nova Casa
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total de Casas</CardTitle>
              <Building2 className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{(stats as any)?.totalHouses || (houses as any[])?.length || 0}</div>
              <p className="text-xs text-emerald-400">
                +2 desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border-emerald-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Casas Ativas</CardTitle>
              <Zap className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{(stats as any)?.activeHouses || (houses as any[])?.filter((h: any) => h.isActive)?.length || 0}</div>
              <p className="text-xs text-emerald-300">
                Operando normalmente
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">R$ {(stats as any)?.totalRevenue || '125,430'}</div>
              <p className="text-xs text-emerald-400">
                +20.1% desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{(stats as any)?.averageConversionRate || '3.2'}%</div>
              <p className="text-xs text-emerald-400">
                +0.4% desde o mês passado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="relative w-full lg:flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar casas de apostas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap w-full lg:w-auto lg:justify-end">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className={selectedCategory === category 
                  ? "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" 
                  : "border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-yellow-400"
                }
              >
                {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
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
              <Card key={house.id} className="group hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-yellow-500/30">
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
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-yellow-400" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg text-slate-100">{house.name}</CardTitle>
                        <Badge variant={house.category === 'sports' ? 'default' : 'secondary'} 
                               className={house.category === 'sports' 
                                 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                                 : 'bg-slate-700/50 text-slate-300 border-slate-600/50'
                               }>
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
                  <p className="text-sm text-slate-300 line-clamp-2">
                    {house.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-emerald-900/20 p-3 rounded border border-emerald-700/30">
                      <p className="text-slate-400 text-xs">CPA Base</p>
                      <p className="font-semibold text-emerald-400 text-lg">R$ {house.baseCpaCommission || '0'}</p>
                    </div>
                    <div className="bg-blue-900/20 p-3 rounded border border-blue-700/30">
                      <p className="text-slate-400 text-xs">RevShare</p>
                      <p className="font-semibold text-blue-400 text-lg">{house.baseRevSharePercent || '0'}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      {house.isActive ? (
                        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">
                          <Zap className="w-3 h-3 mr-1" />
                          Ativa
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-700/50 text-slate-400 border-slate-600/50">
                          Inativa
                        </Badge>
                      )}
                      
                      {house.postbackToken && (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                          <Shield className="w-3 h-3 mr-1" />
                          Postback
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditHouse(house)}
                      className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
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
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-12 h-12 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-200">Nenhuma casa encontrada</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando sua primeira casa de apostas'}
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
            >
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
          <AlertDialogContent className="bg-slate-900 border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-200">Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                Tem certeza que deseja deletar a casa "<span className="text-yellow-400 font-semibold">{deleteDialog.house?.name}</span>"? 
                Esta ação não pode ser desfeita e removerá todos os dados relacionados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-800">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteMutation.mutate(deleteDialog.house?.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
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