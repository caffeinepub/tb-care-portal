import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  BarChart2,
  Brain,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Heart,
  Loader2,
  Stethoscope,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddKAPResponse, useGetKAPResponses } from "../hooks/useQueries";

const STEPS = [
  { id: "patient", label: "Patient Info", icon: User },
  { id: "symptoms", label: "Symptom Screening", icon: Stethoscope },
  { id: "knowledge", label: "Knowledge", icon: Brain },
  { id: "attitudes", label: "Attitudes", icon: Heart },
  { id: "adherence", label: "Adherence", icon: Activity },
];

const emptyForm = {
  // Patient Info
  patientName: "",
  age: "",
  gender: "",
  educationLevel: "",
  // Symptom Screening
  coughDuration: "",
  hasFever: false,
  hasNightSweats: false,
  hasWeightLoss: false,
  hasHemoptysis: false,
  otherSymptoms: "",
  // Knowledge
  knowsTBTransmission: "",
  knowsTBSymptoms: false,
  knowsTreatmentDuration: "",
  believesTBCurable: "",
  // Attitudes
  feelsStigmatized: "",
  willingToDisclose: "",
  communityPerception: "",
  // Adherence
  missedDose: false,
  missedDoseReason: "",
  dotCompliance: "",
  sideEffects: "",
};

type FormState = typeof emptyForm;

function computeScores(form: FormState) {
  let knowledge = 0;
  if (form.knowsTBTransmission === "airborne") knowledge++;
  if (form.knowsTBSymptoms) knowledge++;
  if (form.knowsTreatmentDuration === "6months") knowledge++;
  if (form.believesTBCurable === "yes") knowledge++;

  let attitude = 0;
  if (form.feelsStigmatized === "no") attitude++;
  if (form.willingToDisclose === "yes") attitude++;
  if (form.communityPerception === "supportive") attitude++;

  let adherence = 0;
  if (!form.missedDose) adherence++;
  if (form.dotCompliance === "always") adherence += 2;
  else if (form.dotCompliance === "sometimes") adherence++;

  const overall = knowledge + attitude + adherence;
  return { knowledge, attitude, adherence, overall };
}

export default function QuestionnairePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [viewTab, setViewTab] = useState("form");

  const { data: responses, isLoading } = useGetKAPResponses();
  const addKAPResponse = useAddKAPResponse();

  const set = (key: keyof FormState, value: string | boolean) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!form.patientName || !form.age || !form.gender) {
      toast.error("Please fill in all required patient info fields");
      setStep(0);
      return;
    }
    const scores = computeScores(form);
    try {
      await addKAPResponse.mutateAsync({
        ...form,
        knowledgeScore: scores.knowledge,
        attitudeScore: scores.attitude,
        adherenceScore: scores.adherence,
        overallScore: scores.overall,
      });
      toast.success("KAP Questionnaire submitted successfully!");
      setForm(emptyForm);
      setStep(0);
      setViewTab("responses");
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            TB KAP Questionnaire
          </h1>
          <p className="text-muted-foreground">
            Assess Knowledge, Attitudes &amp; Practices — screen symptoms and
            measure treatment adherence.
          </p>
        </div>

        <Tabs value={viewTab} onValueChange={setViewTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="form">
              <ClipboardList className="w-4 h-4 mr-2" />
              New Assessment
            </TabsTrigger>
            <TabsTrigger value="responses">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Submitted Responses
            </TabsTrigger>
          </TabsList>

          {/* ---- FORM TAB ---- */}
          <TabsContent value="form">
            {/* Step progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setStep(i)}
                      className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                        i === step
                          ? "text-primary font-semibold"
                          : i < step
                            ? "text-accent"
                            : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          i === step
                            ? "border-primary bg-primary text-white"
                            : i < step
                              ? "border-accent bg-accent text-white"
                              : "border-border bg-background"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="hidden sm:block">{s.label}</span>
                    </button>
                  );
                })}
              </div>
              <Progress value={progress} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">
                Step {step + 1} of {STEPS.length}: {STEPS[step].label}
              </p>
            </div>

            <Card className="shadow-card border-border">
              <CardContent className="pt-6">
                {/* STEP 0 — Patient Info */}
                {step === 0 && (
                  <motion.div
                    key="patient"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <CardTitle className="flex items-center gap-2 text-base mb-4">
                      <User className="w-4 h-4 text-primary" />
                      Patient Information
                    </CardTitle>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Patient Name *</Label>
                        <Input
                          placeholder="Full name"
                          value={form.patientName}
                          onChange={(e) => set("patientName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Age *</Label>
                        <Input
                          placeholder="e.g. 35"
                          value={form.age}
                          onChange={(e) => set("age", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Gender *</Label>
                        <Select
                          value={form.gender}
                          onValueChange={(v) => set("gender", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Education Level</Label>
                        <Select
                          value={form.educationLevel}
                          onValueChange={(v) => set("educationLevel", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              No formal education
                            </SelectItem>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                            <SelectItem value="tertiary">
                              Tertiary / University
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 1 — Symptom Screening */}
                {step === 1 && (
                  <motion.div
                    key="symptoms"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <CardTitle className="flex items-center gap-2 text-base mb-4">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      Symptom Screening
                    </CardTitle>
                    <div className="space-y-1.5">
                      <Label>Duration of Cough</Label>
                      <Select
                        value={form.coughDuration}
                        onValueChange={(v) => set("coughDuration", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No cough</SelectItem>
                          <SelectItem value="lt2weeks">
                            Less than 2 weeks
                          </SelectItem>
                          <SelectItem value="2to4weeks">2 – 4 weeks</SelectItem>
                          <SelectItem value="gt4weeks">
                            More than 4 weeks (persistent)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label>Current Symptoms (check all that apply)</Label>
                      {[
                        { key: "hasFever", label: "Fever" },
                        { key: "hasNightSweats", label: "Night sweats" },
                        {
                          key: "hasWeightLoss",
                          label: "Unexplained weight loss",
                        },
                        {
                          key: "hasHemoptysis",
                          label: "Coughing up blood (hemoptysis)",
                        },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          <Checkbox
                            id={key}
                            checked={form[key as keyof FormState] as boolean}
                            onCheckedChange={(c) =>
                              set(key as keyof FormState, c === true)
                            }
                          />
                          <Label
                            htmlFor={key}
                            className="cursor-pointer font-normal"
                          >
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Other symptoms (if any)</Label>
                      <Textarea
                        placeholder="Describe any other symptoms..."
                        value={form.otherSymptoms}
                        onChange={(e) => set("otherSymptoms", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 — Knowledge */}
                {step === 2 && (
                  <motion.div
                    key="knowledge"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <CardTitle className="flex items-center gap-2 text-base mb-4">
                      <Brain className="w-4 h-4 text-primary" />
                      Knowledge Assessment
                    </CardTitle>
                    <div className="space-y-1.5">
                      <Label>
                        How is tuberculosis (TB) mainly transmitted?
                      </Label>
                      <Select
                        value={form.knowsTBTransmission}
                        onValueChange={(v) => set("knowsTBTransmission", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="airborne">
                            Through the air (coughing/sneezing)
                          </SelectItem>
                          <SelectItem value="contact">
                            Direct physical contact
                          </SelectItem>
                          <SelectItem value="water">
                            Contaminated water / food
                          </SelectItem>
                          <SelectItem value="dontknow">I don't know</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="knowsSymptoms"
                        checked={form.knowsTBSymptoms}
                        onCheckedChange={(c) =>
                          set("knowsTBSymptoms", c === true)
                        }
                      />
                      <Label
                        htmlFor="knowsSymptoms"
                        className="cursor-pointer font-normal"
                      >
                        I can identify at least 3 common TB symptoms (cough,
                        fever, night sweats, weight loss)
                      </Label>
                    </div>
                    <div className="space-y-1.5">
                      <Label>
                        How long does standard TB treatment usually last?
                      </Label>
                      <Select
                        value={form.knowsTreatmentDuration}
                        onValueChange={(v) => set("knowsTreatmentDuration", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lt3months">
                            Less than 3 months
                          </SelectItem>
                          <SelectItem value="6months">
                            About 6 months
                          </SelectItem>
                          <SelectItem value="1year">About 1 year</SelectItem>
                          <SelectItem value="dontknow">I don't know</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Do you believe TB can be completely cured?</Label>
                      <Select
                        value={form.believesTBCurable}
                        onValueChange={(v) => set("believesTBCurable", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="unsure">Unsure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 — Attitudes */}
                {step === 3 && (
                  <motion.div
                    key="attitudes"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <CardTitle className="flex items-center gap-2 text-base mb-4">
                      <Heart className="w-4 h-4 text-primary" />
                      Attitudes
                    </CardTitle>
                    <div className="space-y-1.5">
                      <Label>
                        Do you feel stigmatized because of your TB status?
                      </Label>
                      <Select
                        value={form.feelsStigmatized}
                        onValueChange={(v) => set("feelsStigmatized", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="sometimes">Sometimes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>
                        Are you willing to disclose your TB status to others?
                      </Label>
                      <Select
                        value={form.willingToDisclose}
                        onValueChange={(v) => set("willingToDisclose", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes, openly</SelectItem>
                          <SelectItem value="selectedpeople">
                            Only to selected people
                          </SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>
                        How does your community generally treat TB patients?
                      </Label>
                      <Select
                        value={form.communityPerception}
                        onValueChange={(v) => set("communityPerception", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="supportive">Supportive</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="stigmatizing">
                            Stigmatizing
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 — Treatment Adherence */}
                {step === 4 && (
                  <motion.div
                    key="adherence"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <CardTitle className="flex items-center gap-2 text-base mb-4">
                      <Activity className="w-4 h-4 text-primary" />
                      Treatment Adherence &amp; Practices
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="missedDose"
                        checked={form.missedDose}
                        onCheckedChange={(c) => set("missedDose", c === true)}
                      />
                      <Label
                        htmlFor="missedDose"
                        className="cursor-pointer font-normal"
                      >
                        I have missed a dose in the last month
                      </Label>
                    </div>
                    {form.missedDose && (
                      <div className="space-y-1.5">
                        <Label>Reason for missing dose</Label>
                        <Select
                          value={form.missedDoseReason}
                          onValueChange={(v) => set("missedDoseReason", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="forgot">Forgot</SelectItem>
                            <SelectItem value="sideeffects">
                              Side effects
                            </SelectItem>
                            <SelectItem value="stockout">
                              Drug stock-out at facility
                            </SelectItem>
                            <SelectItem value="distance">
                              Distance / travel difficulties
                            </SelectItem>
                            <SelectItem value="felt_better">
                              Felt better, thought no longer needed
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label>Directly Observed Therapy (DOT) compliance</Label>
                      <Select
                        value={form.dotCompliance}
                        onValueChange={(v) => set("dotCompliance", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select compliance level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="always">
                            Always — every dose observed
                          </SelectItem>
                          <SelectItem value="sometimes">
                            Sometimes — most doses observed
                          </SelectItem>
                          <SelectItem value="never">
                            Never / DOT not available
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Side effects experienced (if any)</Label>
                      <Textarea
                        placeholder="e.g. nausea, joint pain, vision changes..."
                        value={form.sideEffects}
                        onChange={(e) => set("sideEffects", e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Score preview */}
                    {(() => {
                      const scores = computeScores(form);
                      return (
                        <div className="rounded-lg border border-border bg-secondary/40 p-4 space-y-2">
                          <p className="text-sm font-semibold text-foreground">
                            Score Preview
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                              {
                                label: "Knowledge",
                                val: scores.knowledge,
                                max: 4,
                              },
                              {
                                label: "Attitudes",
                                val: scores.attitude,
                                max: 3,
                              },
                              {
                                label: "Adherence",
                                val: scores.adherence,
                                max: 3,
                              },
                              {
                                label: "Overall",
                                val: scores.overall,
                                max: 10,
                              },
                            ].map((s) => (
                              <div
                                key={s.label}
                                className="text-center p-2 rounded-md bg-background border border-border"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {s.label}
                                </p>
                                <p className="text-lg font-bold text-primary">
                                  {s.val}
                                  <span className="text-xs text-muted-foreground font-normal">
                                    /{s.max}
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  {step < STEPS.length - 1 ? (
                    <Button onClick={() => setStep((s) => s + 1)}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={addKAPResponse.isPending}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      {addKAPResponse.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {addKAPResponse.isPending
                        ? "Submitting..."
                        : "Submit Questionnaire"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- RESPONSES TAB ---- */}
          <TabsContent value="responses">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardCheck className="w-5 h-5 text-accent" />
                  KAP Assessment Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {["a", "b", "c"].map((k) => (
                      <Skeleton key={k} className="h-20 w-full" />
                    ))}
                  </div>
                ) : !responses || responses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No KAP assessments submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Score Overview Chart */}
                    <div className="p-4 rounded-lg border border-border bg-secondary/20">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart2 className="w-4 h-4 text-accent" />
                        <span className="font-semibold text-sm">
                          Score Overview
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {responses.length} submission
                          {responses.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {(() => {
                        const avgKnowledge =
                          responses.reduce(
                            (s, r) => s + Number(r.knowledgeScore),
                            0,
                          ) / responses.length;
                        const avgAttitude =
                          responses.reduce(
                            (s, r) => s + Number(r.attitudeScore),
                            0,
                          ) / responses.length;
                        const avgAdherence =
                          responses.reduce(
                            (s, r) => s + Number(r.adherenceScore),
                            0,
                          ) / responses.length;
                        const bars = [
                          { label: "Knowledge", value: avgKnowledge, max: 4 },
                          { label: "Attitudes", value: avgAttitude, max: 3 },
                          { label: "Adherence", value: avgAdherence, max: 3 },
                        ];
                        return (
                          <div className="space-y-3">
                            {bars.map((b) => (
                              <div
                                key={b.label}
                                className="flex items-center gap-3"
                              >
                                <span className="text-xs w-20 text-muted-foreground shrink-0">
                                  {b.label}
                                </span>
                                <div className="flex-1 bg-border rounded-full h-4 overflow-hidden">
                                  <div
                                    className="h-full bg-accent rounded-full transition-all"
                                    style={{
                                      width: `${Math.round((b.value / b.max) * 100)}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-mono w-12 text-right text-foreground">
                                  {b.value.toFixed(1)}/{b.max}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                    {responses.map((r, i) => {
                      const overall = Number(r.overallScore);
                      const pct = Math.round((overall / 10) * 100);
                      const riskLevel =
                        pct >= 70
                          ? { label: "Good", cls: "bg-accent text-white" }
                          : pct >= 40
                            ? {
                                label: "Moderate",
                                cls: "bg-yellow-500 text-white",
                              }
                            : { label: "Needs Support", cls: "" };
                      return (
                        <div
                          key={`${r.patientName}-${i}`}
                          className="p-4 rounded-lg border border-border bg-secondary/30 space-y-3"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <span className="font-semibold text-sm">
                                {r.patientName}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                Age {r.age} • {r.gender} •{" "}
                                {r.educationLevel || "N/A"}
                              </span>
                            </div>
                            <Badge
                              variant={pct < 40 ? "destructive" : "default"}
                              className={riskLevel.cls}
                            >
                              {riskLevel.label} ({overall}/10)
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <span>
                              Knowledge:{" "}
                              <strong className="text-foreground">
                                {Number(r.knowledgeScore)}/4
                              </strong>
                            </span>
                            <span>
                              Attitudes:{" "}
                              <strong className="text-foreground">
                                {Number(r.attitudeScore)}/3
                              </strong>
                            </span>
                            <span>
                              Adherence:{" "}
                              <strong className="text-foreground">
                                {Number(r.adherenceScore)}/3
                              </strong>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {r.hasFever && (
                              <Badge variant="outline" className="text-xs">
                                Fever
                              </Badge>
                            )}
                            {r.hasNightSweats && (
                              <Badge variant="outline" className="text-xs">
                                Night Sweats
                              </Badge>
                            )}
                            {r.hasWeightLoss && (
                              <Badge variant="outline" className="text-xs">
                                Weight Loss
                              </Badge>
                            )}
                            {r.hasHemoptysis && (
                              <Badge variant="outline" className="text-xs">
                                Hemoptysis
                              </Badge>
                            )}
                            {r.missedDose && (
                              <Badge variant="destructive" className="text-xs">
                                Missed Dose
                              </Badge>
                            )}
                          </div>
                          {r.sideEffects && (
                            <p className="text-xs text-muted-foreground">
                              Side effects: {r.sideEffects}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
