import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | undefined;
  icon: typeof LucideIcon;
  trend?: number;
  color?: string;
}


export default function StatsCard ({ title, value, icon: Icon, trend }: StatsCardProps) {
    return (
        <motion.div
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden glass rounded-2xl p-6 transition hover:bg-white/[0.1]"
        >
          <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-600/20 blur-2xl transition-opacity opacity-60 group-hover:opacity-100" />
          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-white/55 text-sm">{title}</p>
              <h3 className="mt-3 text-3xl font-bold font-display gradient-text">{value}</h3>
              {trend && (
                <p className={`text-sm mt-2 font-semibold ${trend > 0 ? 'text-cyber-400' : 'text-red-400'}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </p>
              )}
            </div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white glow transition group-hover:scale-110">
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      );
}