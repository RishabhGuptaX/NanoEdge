import { motion } from "framer-motion";
import { Thermometer, Heart, Wind, CheckCircle2, XCircle, Cpu } from "lucide-react";

const sensors = [
  { name: "Temperature Sensor", description: "DS18B20 Digital Temperature", icon: Thermometer, connected: true, value: "37.2°C", uptime: "99.8%", color: "text-accent" },
  { name: "MAX30102 Sensor", description: "Pulse Oximetry & Heart Rate", icon: Heart, connected: true, value: "SpO2: 97% | HR: 78 bpm", uptime: "99.5%", color: "text-primary" },
  { name: "Gas Sensor", description: "MQ-135 Air Quality Monitor", icon: Wind, connected: true, value: "42 ppm", uptime: "98.2%", color: "text-purple" },
];

export default function SystemMonitoring() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">System Monitoring</h2>
        <p className="text-sm text-muted-foreground">Sensor and system status overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sensors.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card rounded-2xl p-5 ${s.connected ? "border-success/20 glow-success" : "border-critical/20 glow-critical"}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${s.connected ? "bg-success/10" : "bg-critical/10"}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className="flex items-center gap-1.5">
                {s.connected ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <XCircle className="h-4 w-4 text-critical" />
                )}
                <span className={`text-xs font-medium ${s.connected ? "text-success" : "text-critical"}`}>
                  {s.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{s.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{s.description}</p>
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Current Value</span>
                <span className="mono text-foreground">{s.value}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Uptime</span>
                <span className="mono text-success">{s.uptime}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">AI Engine Status</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Model", value: "NanoEdge v2.1" },
            { label: "Endpoint", value: "127.0.0.1:8000" },
            { label: "Latency", value: "~45ms" },
            { label: "Status", value: "Online", isOnline: true },
          ].map((item) => (
            <div key={item.label} className="bg-secondary/50 rounded-xl p-3 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className={`text-sm font-medium mono ${"isOnline" in item ? "text-success" : "text-foreground"}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
