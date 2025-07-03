import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "approved" | "rejected" | "processing";
  size?: "sm" | "md" | "lg";
}

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
  },
  approved: {
    label: 'Aprovado',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  rejected: {
    label: 'Rejeitado',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  processing: {
    label: 'Processando',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm'
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.inactive;
  
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium border",
      config.className,
      sizeConfig[size]
    )}>
      {config.label}
    </span>
  );
}