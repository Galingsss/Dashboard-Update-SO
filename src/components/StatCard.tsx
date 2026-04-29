import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white p-4 rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase font-black text-slate-500 tracking-widest mb-1 truncate">{title}</p>
          <h3 className="text-4xl font-black tracking-tight transition-all truncate">{value}</h3>
          {(description || trend) && (
            <div className="flex items-center mt-1 space-x-2">
              {trend && (
                <span className={cn(
                  "text-[10px] font-bold flex items-center shrink-0",
                  trend.isUp ? "text-emerald-600" : "text-red-600"
                )}>
                  {trend.isUp ? '↑' : '↓'} {trend.value}%
                </span>
              )}
              {description && <p className="text-[10px] text-slate-500 font-medium truncate">{description}</p>}
            </div>
          )}
        </div>
        <div className="bg-slate-50 p-1.5 rounded shrink-0 ml-2">
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </motion.div>
  );
}
