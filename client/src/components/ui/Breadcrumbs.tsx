import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs() {
  const [location] = useLocation();
  
  const generateBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Adiciona Home
    breadcrumbs.push({ label: "Home", href: "/" });
    
    // Processa cada segmento
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Mapeia segmentos para labels legíveis
      const labelMap: { [key: string]: string } = {
        admin: "Administração",
        affiliate: "Afiliado",
        dashboard: "Dashboard",
        affiliates: "Afiliados",
        "betting-houses": "Casas de Apostas",
        reports: "Relatórios",
        payments: "Pagamentos",
        settings: "Configurações",
        links: "Meus Links",
        campaigns: "Campanhas",
        profile: "Perfil",
        revenue: "Receita",
        performance: "Performance",
        conversions: "Conversões",
        commissions: "Comissões",
        general: "Geral",
        commission: "Comissões",
        banking: "Dados Bancários",
        create: "Criar",
        edit: "Editar",
        analytics: "Analytics",
        request: "Solicitar"
      };
      
      const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Se não é o último item, adiciona href
      if (index < segments.length - 1) {
        breadcrumbs.push({ label, href: currentPath });
      } else {
        breadcrumbs.push({ label });
      }
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs(location);
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {index === 0 && <Home className="w-4 h-4" />}
          {item.href ? (
            <Link 
              to={item.href}
              className="hover:text-yellow-400 transition-colors cursor-pointer"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}