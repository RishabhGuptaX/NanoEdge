import { useState, useMemo } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockPatientHistory, PatientRecord } from "@/lib/mockData";
import { motion } from "framer-motion";

const riskBadge = (level: "low" | "moderate" | "high") => {
  const map = {
    low: "bg-success/10 text-success border-success/20",
    moderate: "bg-warning/10 text-warning border-warning/20",
    high: "bg-critical/10 text-critical border-critical/20",
  };
  return map[level];
};

type SortKey = "date" | "patientId" | "temperature" | "spo2" | "heartRate";

export default function PatientHistory() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = useMemo(() => {
    let data = mockPatientHistory.filter(
      (r) =>
        r.patientId.toLowerCase().includes(search.toLowerCase()) ||
        r.riskResult.toLowerCase().includes(search.toLowerCase()) ||
        r.date.includes(search)
    );
    data.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sortAsc ? cmp : -cmp;
    });
    return data;
  }, [search, sortKey, sortAsc]);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      onClick={() => handleSort(field)}
      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Patient History</h2>
        <p className="text-sm text-muted-foreground">Previous prediction records</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by patient ID, risk, or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary/50 border-border rounded-xl"
        />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <SortHeader label="Date" field="date" />
                <SortHeader label="Patient ID" field="patientId" />
                <SortHeader label="Temp (°C)" field="temperature" />
                <SortHeader label="SpO2 (%)" field="spo2" />
                <SortHeader label="HR (bpm)" field="heartRate" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pneumonia Risk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-secondary/40 transition-colors"
                >
                  <td className="px-4 py-3 mono text-xs text-muted-foreground">{r.date}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.patientId}</td>
                  <td className="px-4 py-3 mono">{r.temperature}</td>
                  <td className="px-4 py-3 mono">{r.spo2}</td>
                  <td className="px-4 py-3 mono">{r.heartRate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${riskBadge(r.riskLevel)}`}>
                      {r.riskResult}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
