import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserSearch, Loader2, ShieldAlert, Wind, Stethoscope, Bug, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface PredictionResult {
  pneumonia_risk: number;
  hypoxia_risk: string;
  asthma_attack_risk: string;
  respiratory_infection_risk: string;
}

const riskColor = (level: string) => {
  const l = level.toLowerCase();
  if (l.includes("low") || l.includes("safe")) return "text-success border-success/20 bg-success/5";
  if (l.includes("moderate") || l.includes("medium")) return "text-warning border-warning/20 bg-warning/5";
  return "text-critical border-critical/20 bg-critical/5";
};

const pctColor = (pct: number) => {
  if (pct < 30) return "text-success border-success/20 bg-success/5";
  if (pct < 60) return "text-warning border-warning/20 bg-warning/5";
  return "text-critical border-critical/20 bg-critical/5";
};

const getRecommendation = (result: PredictionResult) => {
  if (result.pneumonia_risk >= 60) return "Immediate medical attention recommended. Consider chest X-ray and blood tests.";
  if (result.pneumonia_risk >= 30) return "Monitor closely. Schedule follow-up within 48 hours. Consider additional tests.";
  return "Vitals appear within normal range. Continue routine monitoring.";
};

export default function PatientAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    age: "", sex: "1", diabetes: false, hypertension: false,
    obesity: false, asthma: false, tobacco: false,
    temperature: "", spo2: "", heartrate: "", gas: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const body = {
        age: Number(form.age), sex: Number(form.sex),
        diabetes: form.diabetes ? 1 : 0, hypertension: form.hypertension ? 1 : 0,
        obesity: form.obesity ? 1 : 0, asthma: form.asthma ? 1 : 0,
        tobacco: form.tobacco ? 1 : 0, temperature: Number(form.temperature),
        spo2: Number(form.spo2), heartrate: Number(form.heartrate), gas: Number(form.gas),
      };
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Failed to connect to prediction API. Ensure the backend is running at 127.0.0.1:8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Patient Analysis</h2>
        <p className="text-sm text-muted-foreground">Enter patient data for AI respiratory risk assessment</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 space-y-6"
      >
        <div className="flex items-center gap-2 text-foreground mb-2">
          <div className="p-2 rounded-xl bg-purple/10">
            <UserSearch className="h-5 w-5 text-purple" />
          </div>
          <h3 className="font-semibold">Patient Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Age</Label>
            <Input type="number" placeholder="e.g. 45" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="bg-secondary/50 border-border rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Sex</Label>
            <Select value={form.sex} onValueChange={(v) => setForm({ ...form, sex: v })}>
              <SelectTrigger className="bg-secondary/50 border-border rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Male</SelectItem>
                <SelectItem value="0">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {(["diabetes", "hypertension", "obesity", "asthma", "tobacco"] as const).map((field) => (
            <div key={field} className="flex items-center justify-between bg-secondary/50 rounded-xl p-3 border border-border/50">
              <Label className="text-xs text-muted-foreground capitalize">{field}</Label>
              <Switch checked={form[field]} onCheckedChange={(v) => setForm({ ...form, [field]: v })} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-foreground">
          <div className="p-2 rounded-xl bg-primary/10">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Sensor Readings</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Temperature (°C)", key: "temperature", placeholder: "37.0" },
            { label: "SpO2 (%)", key: "spo2", placeholder: "97" },
            { label: "Heart Rate (bpm)", key: "heartrate", placeholder: "78" },
            { label: "Gas Sensor (ppm)", key: "gas", placeholder: "42" },
          ].map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">{f.label}</Label>
              <Input type="number" step="0.1" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="bg-secondary/50 border-border rounded-xl" />
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 font-semibold px-8 rounded-xl h-12 text-base shadow-md"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Analyze Respiratory Risk
        </Button>

        {error && <p className="text-sm text-critical">{error}</p>}
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ResultCard icon={Bug} title="Pneumonia Risk" value={`${result.pneumonia_risk}%`} className={pctColor(result.pneumonia_risk)} />
              <ResultCard icon={Wind} title="Hypoxia Risk" value={result.hypoxia_risk} className={riskColor(result.hypoxia_risk)} />
              <ResultCard icon={ShieldAlert} title="Asthma Attack" value={result.asthma_attack_risk} className={riskColor(result.asthma_attack_risk)} />
              <ResultCard icon={Stethoscope} title="Resp. Infection" value={result.respiratory_infection_risk} className={riskColor(result.respiratory_infection_risk)} />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-5 border-primary/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">Health Recommendation</h4>
              </div>
              <p className="text-sm text-muted-foreground">{getRecommendation(result)}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ icon: Icon, title, value, className }: { icon: React.ElementType; title: string; value: string; className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`rounded-2xl border p-5 ${className} transition-all`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5" />
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </div>
      <span className="text-2xl font-bold mono">{value}</span>
    </motion.div>
  );
}
