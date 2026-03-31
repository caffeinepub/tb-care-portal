import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { ClipboardList, LogIn, Users } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetKAPResponses, useGetPatients } from "../hooks/useQueries";

function scoreBadge(score: number) {
  if (score >= 7)
    return (
      <Badge className="bg-green-600 hover:bg-green-600 text-white">Good</Badge>
    );
  if (score >= 4) return <Badge variant="secondary">Moderate</Badge>;
  return <Badge variant="destructive">Needs Support</Badge>;
}

const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3"];

function LoadingRows({ cols }: { cols: number }) {
  const colKeys = Array.from({ length: cols }, (_, i) => `col-${i}`);
  return (
    <>
      {SKELETON_ROWS.map((rowKey) => (
        <TableRow key={rowKey}>
          {colKeys.map((colKey) => (
            <TableCell key={colKey}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default function ResultsPage() {
  const { loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const { data: kapResponses, isLoading: kapLoading } = useGetKAPResponses();
  const { data: patients, isLoading: patientsLoading } = useGetPatients();

  if (!isLoggedIn) {
    return (
      <div className="max-w-[480px] mx-auto px-6 py-20 flex flex-col items-center">
        <Card className="w-full shadow-md" data-ocid="results.card">
          <CardHeader className="items-center pb-2">
            <div className="bg-primary/10 rounded-full p-4 mb-3">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Login Required
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-2">
            <p className="text-muted-foreground text-center text-sm">
              You need to be signed in to view questionnaire results and patient
              records.
            </p>
            <Link to="/login" className="w-full">
              <Button
                className="w-full gap-2"
                data-ocid="results.primary_button"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Results</h1>
        <p className="text-muted-foreground mt-1">
          View KAP questionnaire responses and patient records.
        </p>
      </div>

      <Tabs defaultValue="kap">
        <TabsList className="mb-6" data-ocid="results.tab">
          <TabsTrigger value="kap" className="gap-2">
            <ClipboardList className="w-4 h-4" /> KAP Responses
          </TabsTrigger>
          <TabsTrigger value="patients" className="gap-2">
            <Users className="w-4 h-4" /> Patient Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kap">
          <Card data-ocid="results.table">
            <CardHeader>
              <CardTitle className="text-lg">
                KAP Questionnaire Responses
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Knowledge</TableHead>
                    <TableHead>Attitude</TableHead>
                    <TableHead>Adherence</TableHead>
                    <TableHead>Overall</TableHead>
                    <TableHead>Badge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kapLoading ? (
                    <LoadingRows cols={8} />
                  ) : !kapResponses || kapResponses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-12 text-muted-foreground"
                        data-ocid="results.empty_state"
                      >
                        No KAP responses submitted yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    kapResponses.map((r: any, i: number) => (
                      <TableRow
                        key={r.patientName + String(i)}
                        data-ocid={`results.item.${i + 1}`}
                      >
                        <TableCell className="font-medium">
                          {r.patientName}
                        </TableCell>
                        <TableCell>{r.age}</TableCell>
                        <TableCell>{r.gender}</TableCell>
                        <TableCell>{Number(r.knowledgeScore)}/4</TableCell>
                        <TableCell>{Number(r.attitudeScore)}/3</TableCell>
                        <TableCell>{Number(r.adherenceScore)}/3</TableCell>
                        <TableCell>{Number(r.overallScore)}/10</TableCell>
                        <TableCell>
                          {scoreBadge(Number(r.overallScore))}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card data-ocid="results.table">
            <CardHeader>
              <CardTitle className="text-lg">Patient Records</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Frequency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientsLoading ? (
                    <LoadingRows cols={4} />
                  ) : !patients || patients.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-12 text-muted-foreground"
                        data-ocid="results.empty_state"
                      >
                        No patient records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((p: any, i: number) => (
                      <TableRow
                        key={p.name + String(i)}
                        data-ocid={`results.item.${i + 1}`}
                      >
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{Number(p.age)}</TableCell>
                        <TableCell>{p.drugName}</TableCell>
                        <TableCell>{p.frequency}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
