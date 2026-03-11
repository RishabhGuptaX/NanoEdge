import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface TrendChartProps {
  title: string;
  data: { time: string; value: number }[];
  color: string;
  unit: string;
  domain?: [number, number];
}

export function TrendChart({ title, data, color, unit, domain }: TrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
          <XAxis dataKey="time" tick={{ fill: "hsl(215 16% 47%)", fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis domain={domain} tick={{ fill: "hsl(215 16% 47%)", fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid hsl(214 32% 91%)",
              borderRadius: "12px",
              color: "hsl(222 47% 11%)",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            formatter={(val: number) => [`${val} ${unit}`, title]}
          />
          <Area type="monotone" dataKey="value" stroke={color} fill={`url(#grad-${color})`} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
