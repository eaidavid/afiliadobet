import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "affiliate";
}

export default function Layout({ children, requiredRole }: LayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation("/login");
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard
        if (user?.role === "admin") {
          setLocation("/admin");
        } else {
          setLocation("/affiliate");
        }
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
