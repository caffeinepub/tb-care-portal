import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, ClipboardList, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddResponse, useGetResponses } from "../hooks/useQueries";

export default function QuestionnairePage() {
  const [form, setForm] = useState({
    patientName: "",
    missedDose: "",
    sideEffects: "",
  });
  const { data: responses, isLoading } = useGetResponses();
  const addResponse = useAddResponse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName || !form.missedDose) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addResponse.mutateAsync({
        patientName: form.patientName,
        missedDose: form.missedDose === "yes",
        sideEffects: form.sideEffects,
      });
      toast.success("Questionnaire submitted successfully!");
      setForm({ patientName: "", missedDose: "", sideEffects: "" });
    } catch {
      toast.error("Submission failed. Please try again.");
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
            Patient Questionnaire
          </h1>
          <p className="text-muted-foreground">
            Record patient adherence and side effect information.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="w-5 h-5 text-primary" />
                TB Patient Questionnaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="pname">Patient Name *</Label>
                  <Input
                    id="pname"
                    placeholder="e.g. Amara Diallo"
                    value={form.patientName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, patientName: e.target.value }))
                    }
                    data-ocid="questionnaire.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Missed Dose? *</Label>
                  <Select
                    value={form.missedDose}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, missedDose: v }))
                    }
                  >
                    <SelectTrigger data-ocid="questionnaire.select">
                      <SelectValue placeholder="Select answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="effects">Side Effects (if any)</Label>
                  <Textarea
                    id="effects"
                    placeholder="Describe any side effects experienced..."
                    value={form.sideEffects}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, sideEffects: e.target.value }))
                    }
                    data-ocid="questionnaire.textarea"
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={addResponse.isPending}
                  data-ocid="questionnaire.submit_button"
                >
                  {addResponse.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {addResponse.isPending
                    ? "Submitting..."
                    : "Submit Questionnaire"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardCheck className="w-5 h-5 text-accent" />
                Submitted Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3" data-ocid="responses.loading_state">
                  {["a", "b", "c"].map((k) => (
                    <Skeleton key={k} className="h-16 w-full" />
                  ))}
                </div>
              ) : !responses || responses.length === 0 ? (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="responses.empty_state"
                >
                  <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No questionnaire responses yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {responses.map((r, i) => (
                    <div
                      key={`${r.patientName}-${i}`}
                      className="p-4 rounded-lg border border-border bg-secondary/50"
                      data-ocid={`responses.item.${i + 1}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {r.patientName}
                        </span>
                        <Badge
                          variant={r.missedDose ? "destructive" : "default"}
                          className={r.missedDose ? "" : "bg-accent text-white"}
                        >
                          {r.missedDose ? "Missed Dose" : "Adherent"}
                        </Badge>
                      </div>
                      {r.sideEffects && (
                        <p className="text-xs text-muted-foreground">
                          Side effects: {r.sideEffects}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
