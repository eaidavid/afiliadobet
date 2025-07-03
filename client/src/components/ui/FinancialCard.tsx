import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  return (
    <div className={cn(
      "bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        {change && (
          <div className={cn(
            "flex items-center text-sm font-medium",
            changeType === 'positive' && 'text-green-400',
            changeType === 'negative' && 'text-red-400',
            changeType === 'neutral' && 'text-slate-400'
          )}>
            {changeType === 'positive' && <TrendingUp className="w-4 h-4 mr-1" />}
            {changeType === 'negative' && <TrendingDown className="w-4 h-4 mr-1" />}
            {change}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}