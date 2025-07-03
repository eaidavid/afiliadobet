import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Landing from "@/pages/Landing";
import AdminLayout from "@/components/AdminLayout";
import AffiliateLayout from "@/components/AffiliateLayout";
import NotFound from "@/pages/not-found";

// Lazy load das páginas admin
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminAffiliates = lazy(() => import("@/pages/admin/Affiliates"));
const AffiliateDetails = lazy(() => import("@/pages/admin/AffiliateDetails"));
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
        <Route path="/register" component={Register} />
        <Route path="/not-found" component={NotFound} />
        <Route path="/" component={Landing} />
        <Route><Redirect to="/" /></Route>
      </Switch>
    );
  }

  // Rotas protegidas por role
  if (user.role === 'admin') {
    return (
      <AdminLayout>
        <Switch>
          {/* Dashboard */}
          <Route path="/admin/dashboard">
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </Route>
          
          {/* Afiliados */}
          <Route path="/admin/affiliates/:id">
            <Suspense fallback={<PageLoader />}>
              <AffiliateDetails />
            </Suspense>
          </Route>
          <Route path="/admin/affiliates">
            <Suspense fallback={<PageLoader />}>
              <AdminAffiliates />
            </Suspense>
          </Route>
          
          {/* Casas de Apostas */}
          <Route path="/admin/betting-houses/:id/edit">
            {({ params }) => (
              <Suspense fallback={<PageLoader />}>
                <AdminBettingHouses editId={params.id} />
              </Suspense>
            )}
          </Route>
          <Route path="/admin/betting-houses">
            <Suspense fallback={<PageLoader />}>
              <AdminBettingHouses />
            </Suspense>
          </Route>
          
          {/* Relatórios */}
          <Route path="/admin/reports/revenue">
            <Suspense fallback={<PageLoader />}>
              <AdminReports type="revenue" />
            </Suspense>
          </Route>
          <Route path="/admin/reports/performance">
            <Suspense fallback={<PageLoader />}>
              <AdminReports type="performance" />
            </Suspense>
          </Route>
          <Route path="/admin/reports/conversions">
            <Suspense fallback={<PageLoader />}>
              <AdminReports type="conversions" />
            </Suspense>
          </Route>
          <Route path="/admin/reports">
            <Suspense fallback={<PageLoader />}>
              <AdminReports />
            </Suspense>
          </Route>
          
          {/* Pagamentos */}
          <Route path="/admin/payments/:id">
            {({ params }) => (
              <Suspense fallback={<PageLoader />}>
                <AdminPayments paymentId={params.id} />
              </Suspense>
            )}
          </Route>
          <Route path="/admin/payments">
            <Suspense fallback={<PageLoader />}>
              <AdminPayments />
            </Suspense>
          </Route>
          
          {/* Configurações */}
          <Route path="/admin/settings/general">
            <Suspense fallback={<PageLoader />}>
              <AdminSettings section="general" />
            </Suspense>
          </Route>
          <Route path="/admin/settings/commission">
            <Suspense fallback={<PageLoader />}>
              <AdminSettings section="commission" />
            </Suspense>
          </Route>
          <Route path="/admin/settings">
            <Suspense fallback={<PageLoader />}>
              <AdminSettings />
            </Suspense>
          </Route>
          
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
          <Route path="/affiliate/dashboard">
            <Suspense fallback={<PageLoader />}>
              <AffiliateDashboard />
            </Suspense>
          </Route>
          
          {/* Links */}
          <Route path="/affiliate/links/create">
            <Suspense fallback={<PageLoader />}>
              <AffiliateMyLinks create={true} />
            </Suspense>
          </Route>
          <Route path="/affiliate/links/:id/analytics">
            {({ params }) => (
              <Suspense fallback={<PageLoader />}>
                <AffiliateMyLinks analyticsId={params.id} />
              </Suspense>
            )}
          </Route>
          <Route path="/affiliate/links">
            <Suspense fallback={<PageLoader />}>
              <AffiliateMyLinks />
            </Suspense>
          </Route>
          
          {/* Campanhas */}
          <Route path="/affiliate/campaigns/create">
            <Suspense fallback={<PageLoader />}>
              <AffiliateBettingHouses createCampaign={true} />
            </Suspense>
          </Route>
          <Route path="/affiliate/campaigns">
            <Suspense fallback={<PageLoader />}>
              <AffiliateBettingHouses />
            </Suspense>
          </Route>
          
          {/* Relatórios */}
          <Route path="/affiliate/reports/commissions">
            <Suspense fallback={<PageLoader />}>
              <AffiliateReports type="commissions" />
            </Suspense>
          </Route>
          <Route path="/affiliate/reports/conversions">
            <Suspense fallback={<PageLoader />}>
              <AffiliateReports type="conversions" />
            </Suspense>
          </Route>
          <Route path="/affiliate/reports">
            <Suspense fallback={<PageLoader />}>
              <AffiliateReports />
            </Suspense>
          </Route>
          
          {/* Pagamentos */}
          <Route path="/affiliate/payments/request">
            <Suspense fallback={<PageLoader />}>
              <AffiliatePayments request={true} />
            </Suspense>
          </Route>
          <Route path="/affiliate/payments">
            <Suspense fallback={<PageLoader />}>
              <AffiliatePayments />
            </Suspense>
          </Route>
          
          {/* Perfil */}
          <Route path="/affiliate/profile/banking">
            <Suspense fallback={<PageLoader />}>
              <AffiliateProfile section="banking" />
            </Suspense>
          </Route>
          <Route path="/affiliate/profile">
            <Suspense fallback={<PageLoader />}>
              <AffiliateProfile />
            </Suspense>
          </Route>
          
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
