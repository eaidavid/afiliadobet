import { useLocation, Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs() {
  const [location] = useLocation();
  const pathSegments = location.split('/').filter(Boolean);
  
  // Mapear segmentos para nomes legíveis
  const segmentMap: Record<string, string> = {
    admin: 'Administração',
    affiliate: 'Afiliado',
    dashboard: 'Dashboard',
    affiliates: 'Afiliados',
    'betting-houses': 'Casas de Apostas',
    reports: 'Relatórios',
    payments: 'Pagamentos',
    settings: 'Configurações',
    links: 'Meus Links',
    profile: 'Perfil',
    campaigns: 'Campanhas',
    revenue: 'Receita',
    performance: 'Performance',
    conversions: 'Conversões',
    commissions: 'Comissões',
    banking: 'Dados Bancários',
    general: 'Geral',
    commission: 'Comissão',
    create: 'Criar',
    edit: 'Editar',
    analytics: 'Analytics',
    request: 'Solicitar'
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Início', href: '/' }
  ];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // Pular IDs numéricos nos breadcrumbs
    if (/^\d+$/.test(segment)) return;
    
    breadcrumbs.push({
      label: segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: isLast ? undefined : currentPath
    });
  });

  if (breadcrumbs.length === 1) return null;

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400 mx-2" />}
            {index === 0 && <Home className="w-4 h-4 mr-2 text-slate-400" />}
            {breadcrumb.href ? (
              <Link 
                to={breadcrumb.href}
                className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium"
              >
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="text-yellow-400 text-sm font-medium">
                {breadcrumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}