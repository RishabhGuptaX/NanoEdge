import { Thermometer, Heart, Wind, Droplets, ShieldCheck, TrendingUp } from "lucide-react";
import { VitalCard } from "@/components/VitalCard";
import { TrendChart } from "@/components/TrendChart";
import { generateHeartRateData, generateSpO2Data, generateTempData } from "@/lib/mockData";
import { useMemo } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const hrData = useMemo(() => generateHeartRateData(), []);
  const spo2Data = useMemo(() => generateSpO2Data(), []);
  const tempData = useMemo(() => generateTempData(), []);

  const miniHr = useMemo(() => hrData.slice(-8), [hrData]);
  const miniSpo2 = useMemo(() => spo2Data.slice(-8), [spo2Data]);
  const miniTemp = useMemo(() => tempData.slice(-8), [tempData]);
  const miniGas = useMemo(() => Array.from({ length: 8 }, () => ({ value: 30 + Math.random() * 30 })), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Patient Overview</h2>
        <p className="text-sm text-muted-foreground">Real-time vital signs monitoring</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VitalCard title="Temperature" value="37.2" unit="°C" icon={Thermometer} status="normal" subtitle="Last updated 2s ago" trendData={miniTemp} color="#14b8a6" />
        <VitalCard title="SpO2" value="97" unit="%" icon={Droplets} status="normal" subtitle="Oxygen saturation" trendData={miniSpo2} color="#0ea5e9" />
        <VitalCard title="Heart Rate" value="78" unit="bpm" icon={Heart} status="normal" subtitle="Resting rate" trendData={miniHr} color="#8b5cf6" />
        <VitalCard title="Air Quality" value="42" unit="ppm" icon={Wind} status="warning" subtitle="Gas sensor reading" trendData={miniGas} color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TrendChart title="Heart Rate Trend" data={hrData} color="#8b5cf6" unit="bpm" domain={[60, 100]} />
        <TrendChart title="SpO2 Trend" data={spo2Data} color="#0ea5e9" unit="%" domain={[90, 100]} />
        <TrendChart title="Temperature Trend" data={tempData} color="#14b8a6" unit="°C" domain={[36, 39]} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card rounded-2xl glow-success p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-success/10">
            <ShieldCheck className="h-6 w-6 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Respiratory Risk Status</h3>
            <p className="text-xs text-muted-foreground">Powered by NanoEdge AI Engine</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-success/5 rounded-xl p-4 border border-success/20">
            <p className="text-xs text-muted-foreground mb-1">Pneumonia Risk</p>
            <p className="text-2xl font-bold mono text-success">12%</p>
          </div>
          <div className="bg-success/5 rounded-xl p-4 border border-success/20">
            <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-success" />
              <p className="text-2xl font-bold mono text-success">LOW</p>
            </div>
          </div>
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Trend</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <p className="text-sm font-medium text-foreground">No concerns detected</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
