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
  if (l.includes("low")) return "text-green-600";
  if (l.includes("moderate")) return "text-yellow-600";
  return "text-red-600";
};

const pctColor = (pct: number) => {
  if (pct < 30) return "text-green-600";
  if (pct < 60) return "text-yellow-600";
  return "text-red-600";
};

const getRecommendation = (result: PredictionResult) => {
  if (result.pneumonia_risk >= 60)
    return "Immediate medical attention recommended. Consider chest X-ray and blood tests.";
  if (result.pneumonia_risk >= 30)
    return "Monitor closely. Schedule follow-up within 48 hours.";
  return "Vitals appear within normal range.";
};

export default function PatientAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    age: "",
    sex: "1",
    diabetes: false,
    hypertension: false,
    obesity: false,
    asthma: false,
    tobacco: false,
    temperature: "",
    spo2: "",
    heartrate: "",
    gas: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const body = {
        age: Number(form.age),
        sex: Number(form.sex),
        diabetes: form.diabetes ? 1 : 0,
        hypertension: form.hypertension ? 1 : 0,
        obesity: form.obesity ? 1 : 0,
        asthma: form.asthma ? 1 : 0,
        tobacco: form.tobacco ? 1 : 0,
        temperature: Number(form.temperature),
        spo2: Number(form.spo2),
        heartrate: Number(form.heartrate),
        gas: Number(form.gas),
      };

      const res = await fetch("https://nanoedge-api.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to connect to prediction API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">

      <div>
        <h2 className="text-2xl font-bold">Patient Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Enter patient data for AI respiratory risk assessment
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border p-6 space-y-6"
      >

        <div className="flex items-center gap-2">
          <UserSearch className="w-5 h-5"/>
          <h3 className="font-semibold">Patient Information</h3>
        </div>

        {/* Age + Sex */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Age</Label>
            <Input
              type="number"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Sex</Label>
            <Select
              value={form.sex}
              onValueChange={(v) =>
                setForm({ ...form, sex: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Male</SelectItem>
                <SelectItem value="0">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Health Conditions */}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          {(["diabetes","hypertension","obesity","asthma","tobacco"] as const).map((field)=>(
            <div
              key={field}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <Label className="capitalize text-sm">{field}</Label>

              <Switch
                checked={form[field]}
                onCheckedChange={(v)=>
                  setForm({...form,[field]:v})
                }
              />
            </div>
          ))}

        </div>

        {/* Sensor Readings */}

        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5"/>
          <h3 className="font-semibold">Sensor Readings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <Label>Temperature (°C)</Label>
            <Input
              type="number"
              value={form.temperature}
              onChange={(e)=>
                setForm({...form,temperature:e.target.value})
              }
            />
          </div>

          <div>
            <Label>SpO2 (%)</Label>
            <Input
              type="number"
              value={form.spo2}
              onChange={(e)=>
                setForm({...form,spo2:e.target.value})
              }
            />
          </div>

          <div>
            <Label>Heart Rate</Label>
            <Input
              type="number"
              value={form.heartrate}
              onChange={(e)=>
                setForm({...form,heartrate:e.target.value})
              }
            />
          </div>

          <div>
            <Label>Gas Sensor</Label>
            <Input
              type="number"
              value={form.gas}
              onChange={(e)=>
                setForm({...form,gas:e.target.value})
              }
            />
          </div>

        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2"/>}
          Analyze Respiratory Risk
        </Button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

      </motion.div>

      {/* RESULTS */}

      <AnimatePresence>

        {result && (

          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            className="space-y-4"
          >

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <ResultCard
                icon={Bug}
                title="Pneumonia Risk"
                value={`${result.pneumonia_risk}%`}
                color={pctColor(result.pneumonia_risk)}
              />

              <ResultCard
                icon={Wind}
                title="Hypoxia Risk"
                value={result.hypoxia_risk}
                color={riskColor(result.hypoxia_risk)}
              />

              <ResultCard
                icon={ShieldAlert}
                title="Asthma Risk"
                value={result.asthma_attack_risk}
                color={riskColor(result.asthma_attack_risk)}
              />

              <ResultCard
                icon={Stethoscope}
                title="Resp Infection"
                value={result.respiratory_infection_risk}
                color={riskColor(result.respiratory_infection_risk)}
              />

            </div>

            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5"/>
                <h4 className="font-semibold">Recommendation</h4>
              </div>

              <p className="text-sm">
                {getRecommendation(result)}
              </p>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}

function ResultCard({icon:Icon,title,value,color}:{icon:any,title:string,value:string,color:string}){

  return(
    <div className="border rounded-xl p-4">

      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4"/>
        <span className="text-xs uppercase">{title}</span>
      </div>

      <p className={`text-xl font-bold ${color}`}>
        {value}
      </p>

    </div>
  )
}
