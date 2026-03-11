export const generateHeartRateData = () =>
  Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: 70 + Math.floor(Math.random() * 20),
  }));

export const generateSpO2Data = () =>
  Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: 94 + Math.floor(Math.random() * 5),
  }));

export const generateTempData = () =>
  Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: +(36.2 + Math.random() * 1.5).toFixed(1),
  }));

export type PatientRecord = {
  id: string;
  date: string;
  patientId: string;
  temperature: number;
  spo2: number;
  heartRate: number;
  riskResult: string;
  riskLevel: "low" | "moderate" | "high";
};

export const mockPatientHistory: PatientRecord[] = [
  { id: "1", date: "2026-03-09 14:30", patientId: "P-1001", temperature: 37.2, spo2: 97, heartRate: 78, riskResult: "Low Risk", riskLevel: "low" },
  { id: "2", date: "2026-03-09 12:15", patientId: "P-1002", temperature: 38.5, spo2: 93, heartRate: 95, riskResult: "High Risk", riskLevel: "high" },
  { id: "3", date: "2026-03-08 09:45", patientId: "P-1003", temperature: 36.8, spo2: 98, heartRate: 72, riskResult: "Low Risk", riskLevel: "low" },
  { id: "4", date: "2026-03-08 16:20", patientId: "P-1004", temperature: 37.8, spo2: 94, heartRate: 88, riskResult: "Moderate Risk", riskLevel: "moderate" },
  { id: "5", date: "2026-03-07 11:00", patientId: "P-1005", temperature: 39.1, spo2: 91, heartRate: 102, riskResult: "Critical Risk", riskLevel: "high" },
  { id: "6", date: "2026-03-07 08:30", patientId: "P-1006", temperature: 36.5, spo2: 99, heartRate: 65, riskResult: "Low Risk", riskLevel: "low" },
  { id: "7", date: "2026-03-06 13:45", patientId: "P-1007", temperature: 37.9, spo2: 92, heartRate: 91, riskResult: "High Risk", riskLevel: "high" },
  { id: "8", date: "2026-03-06 10:10", patientId: "P-1008", temperature: 37.1, spo2: 96, heartRate: 76, riskResult: "Low Risk", riskLevel: "low" },
];
