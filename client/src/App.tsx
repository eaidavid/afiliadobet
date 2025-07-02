import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";
import Login from "@/pages/Login";
import AdminLayout from "@/components/AdminLayout";
import AffiliateLayout from "@/components/AffiliateLayout";
import NotFound from "@/pages/not-found";

// Lazy load das páginas admin
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminAffiliates = lazy(() => import("@/pages/admin/Affiliates"));
const AdminBettingHouses = lazy(() => import("@/pages/admin/BettingHouses"));
const AdminReports = lazy(() => import("@/pages/admin/Reports"));
const AdminPayments = lazy(() => import("@/pages/admin/Payments"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));

// Lazy load das páginas affiliate
const AffiliateDashboard = lazy(() => import("@/pages/affiliate/Dashboard"));
const AffiliateBettingHouses = lazy(() => import("@/pages/affiliate/BettingHouses"));
const AffiliateMyLinks = lazy(() => import("@/pages/affiliate/MyLinks"));
const AffiliateReports = lazy(() => import("@/pages/affiliate/Reports"));
const AffiliatePayments = lazy(() => import("@/pages/affiliate/Payments"));
const AffiliateProfile = lazy(() => import("@/pages/affiliate/Profile"));

// Componente de loading
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <p className="text-slate-300 text-sm">Carregando...</p>
      </div>
    </div>
  );
}

// Wrapper com Suspense
function LazyRoute({ component: Component, ...props }: { component: any; [key: string]: any }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  // Rotas públicas
  if (!user) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Login} />
        <Route path="/not-found" component={NotFound} />
        <Route><Redirect to="/login" /></Route>
      </Switch>
    );
  }

  // Rotas protegidas por role
  if (user.role === 'admin') {
    return (
      <AdminLayout>
        <Switch>
          {/* Dashboard */}
          <Route path="/admin/dashboard" component={() => <LazyRoute component={AdminDashboard} />} />
          
          {/* Afiliados */}
          <Route path="/admin/affiliates/:id" component={({ params }) => <LazyRoute component={AdminAffiliates} affiliateId={params.id} />} />
          <Route path="/admin/affiliates" component={() => <LazyRoute component={AdminAffiliates} />} />
          
          {/* Casas de Apostas */}
          <Route path="/admin/betting-houses/:id/edit" component={({ params }) => <LazyRoute component={AdminBettingHouses} editId={params.id} />} />
          <Route path="/admin/betting-houses" component={() => <LazyRoute component={AdminBettingHouses} />} />
          
          {/* Relatórios */}
          <Route path="/admin/reports/revenue" component={() => <LazyRoute component={AdminReports} type="revenue" />} />
          <Route path="/admin/reports/performance" component={() => <LazyRoute component={AdminReports} type="performance" />} />
          <Route path="/admin/reports/conversions" component={() => <LazyRoute component={AdminReports} type="conversions" />} />
          <Route path="/admin/reports" component={() => <LazyRoute component={AdminReports} />} />
          
          {/* Pagamentos */}
          <Route path="/admin/payments/:id" component={({ params }) => <LazyRoute component={AdminPayments} paymentId={params.id} />} />
          <Route path="/admin/payments" component={() => <LazyRoute component={AdminPayments} />} />
          
          {/* Configurações */}
          <Route path="/admin/settings/general" component={() => <LazyRoute component={AdminSettings} section="general" />} />
          <Route path="/admin/settings/commission" component={() => <LazyRoute component={AdminSettings} section="commission" />} />
          <Route path="/admin/settings" component={() => <LazyRoute component={AdminSettings} />} />
          
          {/* Redirects */}
          <Route path="/admin"><Redirect to="/admin/dashboard" /></Route>
          <Route path="/"><Redirect to="/admin/dashboard" /></Route>
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    );
  } else if (user.role === 'affiliate') {
    return (
      <AffiliateLayout>
        <Switch>
          {/* Dashboard */}
          <Route path="/affiliate/dashboard" component={() => <LazyRoute component={AffiliateDashboard} />} />
          
          {/* Links */}
          <Route path="/affiliate/links/create" component={() => <LazyRoute component={AffiliateMyLinks} create={true} />} />
          <Route path="/affiliate/links/:id/analytics" component={({ params }) => <LazyRoute component={AffiliateMyLinks} analyticsId={params.id} />} />
          <Route path="/affiliate/links" component={() => <LazyRoute component={AffiliateMyLinks} />} />
          
          {/* Campanhas */}
          <Route path="/affiliate/campaigns/create" component={() => <LazyRoute component={AffiliateBettingHouses} createCampaign={true} />} />
          <Route path="/affiliate/campaigns" component={() => <LazyRoute component={AffiliateBettingHouses} />} />
          
          {/* Relatórios */}
          <Route path="/affiliate/reports/commissions" component={() => <LazyRoute component={AffiliateReports} type="commissions" />} />
          <Route path="/affiliate/reports/conversions" component={() => <LazyRoute component={AffiliateReports} type="conversions" />} />
          <Route path="/affiliate/reports" component={() => <LazyRoute component={AffiliateReports} />} />
          
          {/* Pagamentos */}
          <Route path="/affiliate/payments/request" component={() => <LazyRoute component={AffiliatePayments} request={true} />} />
          <Route path="/affiliate/payments" component={() => <LazyRoute component={AffiliatePayments} />} />
          
          {/* Perfil */}
          <Route path="/affiliate/profile/banking" component={() => <LazyRoute component={AffiliateProfile} section="banking" />} />
          <Route path="/affiliate/profile" component={() => <LazyRoute component={AffiliateProfile} />} />
          
          {/* Redirects */}
          <Route path="/affiliate"><Redirect to="/affiliate/dashboard" /></Route>
          <Route path="/"><Redirect to="/affiliate/dashboard" /></Route>
          <Route component={NotFound} />
        </Switch>
      </AffiliateLayout>
    );
  }

  return <Redirect to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
