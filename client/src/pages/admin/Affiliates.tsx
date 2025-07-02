import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Eye, Edit, Trash2, Search, Filter, Download, Mail, Phone, Calendar, TrendingUp, User, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FinancialCard } from "@/components/ui/FinancialCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useState } from "react";
import { Link } from "wouter";

export default function AdminAffiliates({ affiliateId }: { affiliateId?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const { data: affiliates, isLoading } = useQuery({
    queryKey: ["/api/admin/affiliates", { search: searchTerm, status: statusFilter, dateRange }],
    keepPreviousData: true,
  });

  // Se está visualizando um afiliado específico
  if (affiliateId) {
    return <AffiliateDetails affiliateId={affiliateId} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-8 bg-slate-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredAffiliates = affiliates?.filter((affiliate: any) => {
    const matchesSearch = affiliate.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.cpf?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || affiliate.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-8 p-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestão de Afiliados</h1>
          <p className="text-slate-300 mt-2">
            Gerencie todos os afiliados cadastrados na plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 font-semibold">
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Afiliado
          </Button>
        </div>
      </div>

      {/* Métricas de Afiliados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinancialCard
          title="Total de Afiliados"
          value={filteredAffiliates.length}
          change="+8"
          changeType="positive"
          icon={User}
          gradient="from-blue-400 to-blue-600"
        />
        
        <FinancialCard
          title="Afiliados Ativos"
          value={filteredAffiliates.filter(a => a.status === 'active').length}
          change="+12.5%"
          changeType="positive"
          icon={TrendingUp}
          gradient="from-green-400 to-green-600"
        />
        
        <FinancialCard
          title="Novos este Mês"
          value={filteredAffiliates.filter(a => new Date(a.createdAt).getMonth() === new Date().getMonth()).length}
          change="+25%"
          changeType="positive"
          icon={Calendar}
          gradient="from-yellow-400 to-yellow-600"
        />
        
        <FinancialCard
          title="Pendentes"
          value={filteredAffiliates.filter(a => a.status === 'pending').length}
          change="-5"
          changeType="negative"
          icon={User}
          gradient="from-orange-400 to-orange-600"
        />
      </div>

      {/* Filtros Avançados */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-yellow-400" />
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-slate-300">Buscar Afiliado</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-600"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-slate-300">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-slate-300">Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo período</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" className="w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Afiliados */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">
            Afiliados ({filteredAffiliates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50 hover:bg-slate-700/25">
                  <TableHead className="text-slate-300 font-semibold">Afiliado</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Contato</TableHead>
                  <TableHead className="text-slate-300 font-semibold">CPF</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Comissões</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Data Cadastro</TableHead>
                  <TableHead className="text-slate-300 font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAffiliates.length > 0 ? (
                  filteredAffiliates.map((affiliate: any) => (
                    <TableRow key={affiliate.id} className="border-slate-700/50 hover:bg-slate-700/25 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 font-bold">
                              {affiliate.fullName?.charAt(0) || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-white">{affiliate.fullName}</p>
                            <p className="text-xs text-slate-400">ID: #{affiliate.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm text-white flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {affiliate.email}
                          </p>
                          {affiliate.phone && (
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {affiliate.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-mono text-sm">
                        {affiliate.cpf || '-'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={affiliate.status || 'inactive'} />
                      </TableCell>
                      <TableCell className="font-semibold text-green-400">
                        R$ {(affiliate.totalCommissions || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(affiliate.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" asChild>
                            <Link to={`/admin/affiliates/${affiliate.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                                Ver Performance
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                                Histórico de Pagamentos
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                Desativar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-slate-400">Nenhum afiliado encontrado</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para detalhes de um afiliado específico
function AffiliateDetails({ affiliateId }: { affiliateId: string }) {
  const { data: affiliate, isLoading } = useQuery({
    queryKey: [`/api/admin/affiliates/${affiliateId}`],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumbs />
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Detalhes do Afiliado</h1>
          <p className="text-slate-300 mt-2">
            Informações completas e performance de {affiliate?.fullName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-yellow-400 border-yellow-500/30">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" className="text-blue-400 border-blue-500/30">
            <Download className="w-4 h-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Informações do afiliado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 font-bold text-xl">
                  {affiliate?.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-white">{affiliate?.fullName}</h3>
                <p className="text-slate-400">ID: #{affiliate?.id}</p>
                <StatusBadge status={affiliate?.status || 'inactive'} />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-slate-400">Email</Label>
                <p className="text-white">{affiliate?.email}</p>
              </div>
              <div>
                <Label className="text-slate-400">CPF</Label>
                <p className="text-white font-mono">{affiliate?.cpf || 'Não informado'}</p>
              </div>
              <div>
                <Label className="text-slate-400">Data de Cadastro</Label>
                <p className="text-white">
                  {new Date(affiliate?.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FinancialCard
                  title="Comissões Totais"
                  value={`R$ ${(affiliate?.totalCommissions || 0).toLocaleString('pt-BR')}`}
                  change="+15.2%"
                  changeType="positive"
                  gradient="from-green-400 to-green-600"
                />
                <FinancialCard
                  title="Links Ativos"
                  value={affiliate?.activeLinks || 0}
                  change="+3"
                  changeType="positive"
                  gradient="from-blue-400 to-blue-600"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-surface border-white/10">
                <SelectValue placeholder="Todos os níveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                <SelectItem value="novato">Novato</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="prata">Prata</SelectItem>
                <SelectItem value="ouro">Ouro</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary">
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Affiliates Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-foreground">Afiliado</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground">Nível</TableHead>
                <TableHead className="text-foreground">Conversões</TableHead>
                <TableHead className="text-foreground">Comissão Total</TableHead>
                <TableHead className="text-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-white/5">
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum afiliado encontrado</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Os afiliados aparecerão aqui quando se registrarem no sistema
                  </p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
