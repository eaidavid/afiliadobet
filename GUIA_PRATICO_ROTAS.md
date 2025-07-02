# 🚀 GUIA PRÁTICO - IMPLEMENTAÇÃO DE ROTAS AFILIADOSBET

## 📊 ANÁLISE DO SISTEMA ATUAL
- Sistema base funcional com autenticação
- Tema financeiro dourado implementado
- APIs REST funcionais no backend
- Database PostgreSQL configurado
- Problema SQL corrigido (getAffiliatePerformance)

## 🎯 IMPLEMENTAÇÃO OTIMIZADA (SEM CRÉDITOS)

### ETAPA 1: ESTRUTURA DE ROTAS (1 hora)

#### Modificar App.tsx para roteamento completo
```typescript
// Em client/src/App.tsx, substitua o Router existente por:

function Router() {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();

  // Rotas públicas
  if (!user && !isLoading) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/unauthorized" component={Unauthorized} />
        <Route path="/not-found" component={NotFound} />
        <Route><Redirect to="/login" /></Route>
      </Switch>
    );
  }

  // Rotas protegidas por role
  if (user?.role === 'admin') {
    return <AdminRoutes />;
  } else if (user?.role === 'affiliate') {
    return <AffiliateRoutes />;
  }

  return <Redirect to="/unauthorized" />;
}

// Componente separado para rotas admin
function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/affiliates" component={AffiliatesList} />
        <Route path="/admin/affiliates/:id" component={AffiliateDetails} />
        <Route path="/admin/betting-houses" component={BettingHousesList} />
        <Route path="/admin/betting-houses/:id/edit" component={BettingHouseEdit} />
        <Route path="/admin/reports" component={ReportsPage} />
        <Route path="/admin/reports/:type" component={SpecificReport} />
        <Route path="/admin/payments" component={PaymentsPage} />
        <Route path="/admin/payments/:id" component={PaymentDetails} />
        <Route path="/admin/settings" component={SettingsPage} />
        <Route path="/admin/settings/:section" component={SettingsSection} />
        <Route path="/admin"><Redirect to="/admin/dashboard" /></Route>
        <Route><Redirect to="/not-found" /></Route>
      </Switch>
    </AdminLayout>
  );
}

// Componente separado para rotas affiliate
function AffiliateRoutes() {
  return (
    <AffiliateLayout>
      <Switch>
        <Route path="/affiliate/dashboard" component={AffiliateDashboard} />
        <Route path="/affiliate/links" component={LinksPage} />
        <Route path="/affiliate/links/create" component={CreateLink} />
        <Route path="/affiliate/links/:id/analytics" component={LinkAnalytics} />
        <Route path="/affiliate/campaigns" component={CampaignsPage} />
        <Route path="/affiliate/campaigns/create" component={CreateCampaign} />
        <Route path="/affiliate/reports" component={AffiliateReports} />
        <Route path="/affiliate/reports/:type" component={SpecificAffiliateReport} />
        <Route path="/affiliate/payments" component={AffiliatePayments} />
        <Route path="/affiliate/payments/request" component={RequestPayment} />
        <Route path="/affiliate/profile" component={ProfilePage} />
        <Route path="/affiliate/profile/:section" component={ProfileSection} />
        <Route path="/affiliate"><Redirect to="/affiliate/dashboard" /></Route>
        <Route><Redirect to="/not-found" /></Route>
      </Switch>
    </AffiliateLayout>
  );
}
```

### ETAPA 2: LAYOUTS APRIMORADOS (30 minutos)

#### AdminLayout.tsx - Navegação hierárquica
```typescript
// Modifique client/src/components/AdminLayout.tsx

const adminMenuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/admin/dashboard",
    color: "text-yellow-400"
  },
  {
    title: "Afiliados",
    icon: Users,
    href: "/admin/affiliates",
    color: "text-green-400",
    subItems: [
      { title: "Lista de Afiliados", href: "/admin/affiliates" },
      { title: "Análise de Performance", href: "/admin/affiliates/performance" }
    ]
  },
  {
    title: "Casas de Apostas",
    icon: Building2,
    href: "/admin/betting-houses",
    color: "text-blue-400"
  },
  {
    title: "Relatórios",
    icon: FileText,
    href: "/admin/reports",
    color: "text-purple-400",
    subItems: [
      { title: "Receita", href: "/admin/reports/revenue" },
      { title: "Performance", href: "/admin/reports/performance" },
      { title: "Conversões", href: "/admin/reports/conversions" }
    ]
  },
  {
    title: "Pagamentos",
    icon: CreditCard,
    href: "/admin/payments",
    color: "text-emerald-400"
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/admin/settings",
    color: "text-slate-400"
  }
];

// Adicione breadcrumbs automáticos
function Breadcrumbs() {
  const [location] = useLocation();
  const pathSegments = location.split('/').filter(Boolean);
  
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {pathSegments.map((segment, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400 mx-2" />}
            <Link 
              to={`/${pathSegments.slice(0, index + 1).join('/')}`}
              className="text-slate-300 hover:text-yellow-400 capitalize transition-colors"
            >
              {segment.replace('-', ' ')}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### ETAPA 3: PÁGINAS FUNCIONAIS (2 horas)

#### Dashboard Admin Avançado
```typescript
// client/src/pages/admin/Dashboard.tsx

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 30000 // Atualiza a cada 30s
  });

  const { data: topAffiliates } = useQuery({
    queryKey: ['/api/admin/top-affiliates']
  });

  const { data: revenueData } = useQuery({
    queryKey: ['/api/admin/revenue-chart']
  });

  return (
    <div className="space-y-8">
      {/* Header com métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Receita Total"
          value={`R$ ${stats?.totalRevenue?.toLocaleString() || '0'}`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          gradient="from-yellow-400 to-yellow-600"
        />
        
        <MetricCard
          title="Afiliados Ativos"
          value={stats?.activeAffiliates || 0}
          change="+3"
          changeType="positive"
          icon={Users}
          gradient="from-green-400 to-green-600"
        />
        
        <MetricCard
          title="Conversões"
          value={stats?.totalConversions || 0}
          change="+8.2%"
          changeType="positive"
          icon={TrendingUp}
          gradient="from-blue-400 to-blue-600"
        />
        
        <MetricCard
          title="Comissões"
          value={`R$ ${stats?.totalCommissions?.toLocaleString() || '0'}`}
          change="-2.1%"
          changeType="negative"
          icon={CreditCard}
          gradient="from-purple-400 to-purple-600"
        />
      </div>

      {/* Gráficos e tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart data={revenueData} />
        <TopAffiliatesTable data={topAffiliates} />
      </div>

      {/* Atividade recente */}
      <RecentActivity />
    </div>
  );
}

// Componente MetricCard reutilizável
function MetricCard({ title, value, change, changeType, icon: Icon, gradient }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center text-sm font-medium ${
          changeType === 'positive' ? 'text-green-400' : 'text-red-400'
        }`}>
          {changeType === 'positive' ? '↗' : '↘'} {change}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
```

#### Lista de Afiliados com Filtros
```typescript
// client/src/pages/admin/AffiliatesList.tsx

export default function AffiliatesList() {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all'
  });

  const { data: affiliates, isLoading } = useQuery({
    queryKey: ['/api/admin/affiliates', filters],
    keepPreviousData: true
  });

  return (
    <div className="space-y-6">
      {/* Filtros avançados */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-slate-300">Buscar Afiliado</Label>
            <Input
              placeholder="Nome, email ou CPF..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="bg-slate-900/50 border-slate-600"
            />
          </div>
          
          <div>
            <Label className="text-slate-300">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
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
            <Select
              value={filters.dateRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger className="bg-slate-900/50 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo período</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabela de afiliados */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white">Afiliados</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">CPF</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Comissões</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {affiliates?.map((affiliate) => (
                <tr key={affiliate.id} className="hover:bg-slate-700/25 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-900">
                          {affiliate.fullName[0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">{affiliate.fullName}</p>
                        <p className="text-xs text-slate-400">ID: {affiliate.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{affiliate.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{affiliate.cpf || '-'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={affiliate.status} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-400">
                    R$ {affiliate.totalCommissions?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/admin/affiliates/${affiliate.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

### ETAPA 4: COMPONENTES REUTILIZÁVEIS (45 minutos)

#### Componente de Status Badge
```typescript
// client/src/components/ui/StatusBadge.tsx

const statusConfig = {
  active: {
    label: 'Ativo',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  inactive: {
    label: 'Inativo', 
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  pending: {
    label: 'Pendente',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  }
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.inactive;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
```

#### Tabela Inteligente Reutilizável
```typescript
// client/src/components/ui/SmartTable.tsx

export function SmartTable({ 
  columns, 
  data, 
  isLoading, 
  onSort, 
  sortField, 
  sortDirection 
}) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-900/50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key}
                className="px-6 py-4 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => column.sortable && onSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <ArrowUpDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-slate-700/25 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### ETAPA 5: PAINEL AFILIADO (1 hora)

#### Dashboard do Afiliado
```typescript
// client/src/pages/affiliate/Dashboard.tsx

export default function AffiliateDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['/api/affiliate/stats']
  });

  const { data: performance } = useQuery({
    queryKey: ['/api/affiliate/performance']
  });

  return (
    <div className="space-y-8">
      {/* Métricas pessoais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PersonalMetricCard
          title="Cliques Totais"
          value={stats?.totalClicks || 0}
          icon={MousePointer}
          gradient="from-blue-400 to-blue-600"
        />
        
        <PersonalMetricCard
          title="Conversões"
          value={stats?.totalConversions || 0}
          icon={Target}
          gradient="from-green-400 to-green-600"
        />
        
        <PersonalMetricCard
          title="Comissões"
          value={`R$ ${stats?.totalCommissions?.toLocaleString() || '0'}`}
          icon={DollarSign}
          gradient="from-yellow-400 to-yellow-600"
        />
      </div>

      {/* Gráfico de performance */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Performance dos Últimos 7 Dias</h3>
        <PerformanceChart data={performance} />
      </div>

      {/* Links mais performáticos */}
      <TopPerformingLinks />
      
      {/* Próximos pagamentos */}
      <UpcomingPayments />
    </div>
  );
}
```

### ETAPA 6: OTIMIZAÇÕES (30 minutos)

#### Lazy Loading de Componentes
```typescript
// client/src/App.tsx - Adicione lazy loading

import { lazy, Suspense } from 'react';

// Lazy load das páginas
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AffiliatesList = lazy(() => import('./pages/admin/AffiliatesList'));
const AffiliateDashboard = lazy(() => import('./pages/affiliate/Dashboard'));

// Wrapper com Suspense
function LazyRoute({ Component, ...props }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
}

// Componente de loading
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
    </div>
  );
}
```

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

### Estrutura Base ⏱️ 1h30
- [ ] Configurar roteamento com URLs reais
- [ ] Criar layouts com navegação
- [ ] Implementar breadcrumbs
- [ ] Configurar proteção de rotas

### Páginas Admin ⏱️ 2h
- [ ] Dashboard com métricas em tempo real
- [ ] Lista de afiliados com filtros
- [ ] Gestão de casas de apostas
- [ ] Sistema de relatórios
- [ ] Gestão de pagamentos

### Páginas Afiliado ⏱️ 1h30
- [ ] Dashboard pessoal
- [ ] Gestão de links
- [ ] Relatórios pessoais
- [ ] Solicitações de pagamento
- [ ] Perfil e configurações

### Componentes Visuais ⏱️ 1h
- [ ] Cards financeiros
- [ ] Tabelas inteligentes
- [ ] Gráficos interativos
- [ ] Sistema de busca
- [ ] Badges e indicadores

### Otimizações ⏱️ 30min
- [ ] Lazy loading
- [ ] Cache inteligente
- [ ] Loading states
- [ ] Error boundaries
- [ ] Performance monitoring

## 📊 ESTIMATIVA TOTAL: 6 HORAS

### Distribuição:
- **Estrutura**: 1h30 (25%)
- **Admin Pages**: 2h (33%)
- **Affiliate Pages**: 1h30 (25%)
- **Components**: 1h (17%)

## 💡 DICAS DE IMPLEMENTAÇÃO EFICIENTE

1. **Comece pela estrutura**: Implemente as rotas primeiro
2. **Reutilize componentes**: Use o máximo de componentes existentes
3. **Teste incrementalmente**: Valide cada página conforme implementa
4. **Use o tema existente**: Mantenha as cores douradas já implementadas
5. **Focalize na funcionalidade**: Priorize função sobre forma

## 🔧 PONTOS DE ATENÇÃO

- **URLs amigáveis**: Cada página deve ter URL única
- **Navegação real**: Browser history funcionando
- **Performance**: Lazy loading implementado
- **Responsividade**: Mobile-first approach
- **Acessibilidade**: Navegação por teclado

Este guia fornece implementação prática em 6 horas sem consumir créditos adicionais, focando em eficiência e resultado profissional.