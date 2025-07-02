import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import AdminLayout from "@/components/AdminLayout";
import AffiliateLayout from "@/components/AffiliateLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminAffiliates from "@/pages/admin/Affiliates";
import AdminBettingHouses from "@/pages/admin/BettingHouses";
import AdminReports from "@/pages/admin/Reports";
import AdminPayments from "@/pages/admin/Payments";
import AdminSettings from "@/pages/admin/Settings";
import AffiliateDashboard from "@/pages/affiliate/Dashboard";
import AffiliateBettingHouses from "@/pages/affiliate/BettingHouses";
import AffiliateMyLinks from "@/pages/affiliate/MyLinks";
import AffiliateReports from "@/pages/affiliate/Reports";
import AffiliatePayments from "@/pages/affiliate/Payments";
import AffiliateProfile from "@/pages/affiliate/Profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        <AdminLayout>
          <Switch>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/affiliates" component={AdminAffiliates} />
            <Route path="/admin/betting-houses" component={AdminBettingHouses} />
            <Route path="/admin/reports" component={AdminReports} />
            <Route path="/admin/payments" component={AdminPayments} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>

      {/* Affiliate Routes */}
      <Route path="/affiliate">
        <AffiliateLayout>
          <Switch>
            <Route path="/affiliate" component={AffiliateDashboard} />
            <Route path="/affiliate/betting-houses" component={AffiliateBettingHouses} />
            <Route path="/affiliate/my-links" component={AffiliateMyLinks} />
            <Route path="/affiliate/reports" component={AffiliateReports} />
            <Route path="/affiliate/payments" component={AffiliatePayments} />
            <Route path="/affiliate/profile" component={AffiliateProfile} />
            <Route component={NotFound} />
          </Switch>
        </AffiliateLayout>
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
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
