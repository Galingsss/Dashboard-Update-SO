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
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 mb-1 w-full">
          <div className="bg-slate-50 p-1 rounded-full shrink-0">
            <Icon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-[13px] uppercase font-black text-slate-500 tracking-widest truncate">{title}</p>
        </div>
        <div className="min-w-0 w-full">
          <h3 className="text-6xl font-black tracking-tighter transition-all truncate leading-none py-1">{value}</h3>
        </div>
      </div>
    </motion.div>
  );
}
