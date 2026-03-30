import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, Pill, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

const drugs = [
  {
    name: "Isoniazid (INH)",
    resistance: "Common in MDR-TB",
    description:
      "A first-line bactericidal drug that inhibits mycolic acid synthesis in the TB cell wall. Resistance is a key marker of MDR-TB.",
    severity: "High",
    icon: <ShieldAlert className="w-6 h-6" />,
    badgeColor: "bg-red-100 text-red-700",
    cardAccent: "border-red-200",
    num: "01",
  },
  {
    name: "Rifampicin (RIF)",
    resistance: "Key drug resistance marker",
    description:
      "Critical first-line drug inhibiting RNA polymerase. Rifampicin resistance is used as a surrogate marker for MDR-TB in rapid diagnostics.",
    severity: "Critical",
    icon: <AlertTriangle className="w-6 h-6" />,
    badgeColor: "bg-orange-100 text-orange-700",
    cardAccent: "border-orange-200",
    num: "02",
  },
  {
    name: "Ethambutol (EMB)",
    resistance: "Less frequent resistance",
    description:
      "A bacteriostatic drug that disrupts cell wall biosynthesis. Resistance is less common but can emerge when used without companion drugs.",
    severity: "Moderate",
    icon: <Info className="w-6 h-6" />,
    badgeColor: "bg-blue-100 text-blue-700",
    cardAccent: "border-blue-200",
    num: "03",
  },
  {
    name: "Pyrazinamide (PZA)",
    resistance: "Variable resistance",
    description:
      "Active in acidic environments, effective against dormant bacilli. Resistance is variable and testing can be technically challenging.",
    severity: "Variable",
    icon: <Pill className="w-6 h-6" />,
    badgeColor: "bg-teal-100 text-teal-700",
    cardAccent: "border-teal-200",
    num: "04",
  },
];

export default function DrugResistancePage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Drug Resistance Information
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Understanding drug resistance is critical for effective TB
            treatment. Below are key first-line drugs and their resistance
            profiles.
          </p>
        </div>

        {/* Info banner */}
        <div
          className="mb-8 p-4 rounded-xl border"
          style={{
            background: "oklch(0.94 0.02 210)",
            borderColor: "oklch(0.85 0.04 210)",
          }}
        >
          <p className="text-sm font-medium text-foreground">
            ⚠️ <strong>MDR-TB Alert:</strong> Multi-drug resistant TB (MDR-TB) is
            defined as resistance to at least Isoniazid and Rifampicin. Early
            detection is essential.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {drugs.map((drug, i) => (
            <motion.div
              key={drug.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`shadow-card h-full border-2 ${drug.cardAccent} relative overflow-hidden`}
              >
                <span className="absolute top-3 right-4 text-5xl font-black opacity-5 select-none text-foreground">
                  {drug.num}
                </span>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-primary">{drug.icon}</span>
                      {drug.name}
                    </CardTitle>
                    <Badge
                      className={`${drug.badgeColor} border-0 shrink-0 text-xs font-semibold`}
                    >
                      {drug.severity}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-accent">
                    {drug.resistance}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {drug.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Treatment note */}
        <div className="mt-10 p-6 rounded-xl bg-primary text-white">
          <h3 className="font-bold text-lg mb-2">Treatment Reminder</h3>
          <p className="text-sm text-white/85">
            All TB patients must complete their full course of treatment.
            Incomplete treatment leads to drug resistance and treatment failure.
            Contact your healthcare provider immediately if you experience side
            effects or wish to stop medication.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
