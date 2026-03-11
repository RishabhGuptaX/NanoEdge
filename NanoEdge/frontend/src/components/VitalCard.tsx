import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type Status = "normal" | "warning" | "critical";

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status: Status;
  subtitle?: string;
  trendData?: { value: number }[];
  color?: string;
}

const statusConfig: Record<Status, { bg: string; iconBg: string; dot: string; label: string; glow: string }> = {
  normal: { bg: "border-success/20", iconBg: "bg-success/10 text-success", dot: "bg-success", label: "Normal", glow: "glow-success" },
  warning: { bg: "border-warning/20", iconBg: "bg-warning/10 text-warning", dot: "bg-warning", label: "Warning", glow: "glow-warning" },
  critical: { bg: "border-critical/20", iconBg: "bg-critical/10 text-critical", dot: "bg-critical", label: "Critical", glow: "glow-critical" },
};

export function VitalCard({ title, value, unit, icon: Icon, status, subtitle, trendData, color = "#22c55e" }: VitalCardProps) {
  const cfg = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      className={`glass-card rounded-2xl p-5 ${cfg.bg} ${cfg.glow} transition-all duration-300 cursor-default`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${cfg.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${cfg.dot} animate-pulse-glow`} />
          <span className="text-xs text-muted-foreground font-medium">{cfg.label}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold mono text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {trendData && (
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id={`mini-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke={color} fill={`url(#mini-${title})`} strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
    </motion.div>
  );
}
