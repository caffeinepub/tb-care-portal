import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "@tanstack/react-router";
import { Loader2, UserPlus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddPatient, useGetPatients } from "../hooks/useQueries";

export default function PatientPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: "",
    drugName: "",
    frequency: "",
  });
  const { data: patients, isLoading } = useGetPatients();
  const addPatient = useAddPatient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.drugName || !form.frequency) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addPatient.mutateAsync({
        name: form.name,
        age: Number(form.age),
        drugName: form.drugName,
        frequency: form.frequency,
      });
      toast.success("Patient registered successfully!");
      setForm({ name: "", age: "", drugName: "", frequency: "" });
      setTimeout(() => router.navigate({ to: "/" }), 1500);
    } catch {
      toast.error("Failed to register patient. Please try again.");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Patient Entry
          </h1>
          <p className="text-muted-foreground">
            Register a new patient and their prescribed TB medication details.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="w-5 h-5 text-primary" />
                New Patient Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. John Mensah"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="patient.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="e.g. 34"
                    value={form.age}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, age: e.target.value }))
                    }
                    data-ocid="patient.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="drug">Drug Name</Label>
                  <Input
                    id="drug"
                    placeholder="e.g. Isoniazid"
                    value={form.drugName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, drugName: e.target.value }))
                    }
                    data-ocid="patient.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g. Once daily"
                    value={form.frequency}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, frequency: e.target.value }))
                    }
                    data-ocid="patient.input"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={addPatient.isPending}
                  data-ocid="patient.submit_button"
                >
                  {addPatient.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {addPatient.isPending ? "Registering..." : "Register Patient"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-accent" />
                Registered Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3" data-ocid="patients.loading_state">
                  {["a", "b", "c"].map((k) => (
                    <Skeleton key={k} className="h-10 w-full" />
                  ))}
                </div>
              ) : !patients || patients.length === 0 ? (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="patients.empty_state"
                >
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No patients registered yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto" data-ocid="patients.table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Drug</TableHead>
                        <TableHead>Frequency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((p, i) => (
                        <TableRow
                          key={`${p.name}-${i}`}
                          data-ocid={`patients.item.${i + 1}`}
                        >
                          <TableCell className="font-medium">
                            {p.name}
                          </TableCell>
                          <TableCell>{p.age.toString()}</TableCell>
                          <TableCell>{p.drugName}</TableCell>
                          <TableCell>{p.frequency}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
