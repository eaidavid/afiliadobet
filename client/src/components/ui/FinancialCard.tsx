import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface FinancialCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  gradient?: string;
  description?: string;
  className?: string;
}

export function FinancialCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  gradient = "from-yellow-400 to-yellow-600",
  description,
  className
}: FinancialCardProps) {
  const changeIcon = changeType === "positive" ? TrendingUp : TrendingDown;
  const ChangeIcon = changeIcon;
  
  return (
    <div className={cn(
      "bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={cn(
            "w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center shadow-lg",
            gradient
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        {change && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            changeType === "positive" ? "text-green-400" : "text-red-400"
          )}>
            <ChangeIcon className="w-4 h-4" />
            {change}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}