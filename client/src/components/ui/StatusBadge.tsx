import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "approved" | "rejected" | "processing";
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  active: {
    label: "Ativo",
    className: "bg-green-500/20 text-green-400 border-green-500/30",
    dot: "bg-green-400"
  },
  inactive: {
    label: "Inativo",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
    dot: "bg-red-400"
  },
  pending: {
    label: "Pendente",
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    dot: "bg-yellow-400"
  },
  approved: {
    label: "Aprovado",
    className: "bg-green-500/20 text-green-400 border-green-500/30",
    dot: "bg-green-400"
  },
  rejected: {
    label: "Rejeitado",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
    dot: "bg-red-400"
  },
  processing: {
    label: "Processando",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    dot: "bg-blue-400"
  }
};

const sizeConfig = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-sm",
  lg: "px-3 py-1 text-sm"
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        config.className,
        sizeConfig[size]
      )}
    >
      <div className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}