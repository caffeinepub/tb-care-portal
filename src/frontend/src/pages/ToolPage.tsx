import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { type ChartParams, getRenderer } from "@/lib/chartRenderers";
import { computeStats, parseCsvFull } from "@/lib/stats";
import { TOOLS } from "@/lib/tools";
import { Link, useParams } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Play,
  RefreshCw,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const COLOR_SCHEMES = [
  { value: "#2dd4bf", label: "Teal" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#a855f7", label: "Purple" },
  { value: "#f97316", label: "Orange" },
  { value: "#10b981", label: "Green" },
  { value: "#ef4444", label: "Red" },
];

function fmt(n: number): string {
  return Number.isFinite(n) ? n.toFixed(3) : "N/A";
}

export default function ToolPage() {
  const { toolId } = useParams({ from: "/tool/$toolId" });
  const tool = TOOLS.find((t) => t.id === toolId);

  const [csvData, setCsvData] = useState("");
  const [params, setParams] = useState<ChartParams>({
    color: "#2dd4bf",
    title: "",
    xLabel: "",
    yLabel: "",
  });
  const [outputCsv, setOutputCsv] = useState<string | null>(null);
  const [outputParams, setOutputParams] = useState<ChartParams>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Refs to allow keyboard handler to access latest state without stale closure
  const csvDataRef = useRef(csvData);
  csvDataRef.current = csvData;
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // All hooks must be above any early returns
  function handleRun() {
    if (!csvDataRef.current.trim()) {
      toast.error("Please enter or load data first");
      return;
    }
    setOutputCsv(csvDataRef.current);
    setOutputParams({ ...paramsRef.current });
    toast.success("Visualization rendered!");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
  }

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-5xl">404</div>
        <div className="text-xl font-semibold">Tool not found</div>
        <Link to="/gallery">
          <Button>Back to Gallery</Button>
        </Link>
      </div>
    );
  }

  const Renderer = getRenderer(tool.id);

  function handleLoadExample() {
    if (!tool) return;
    setCsvData(tool.exampleCsv);
    setOutputCsv(tool.exampleCsv);
    setOutputParams({ ...params });
    setPreviewOpen(true);
    toast.success("Example data loaded & rendered");
  }

  function handleCopy() {
    if (!outputCsv) return;
    navigator.clipboard.writeText(outputCsv);
    toast.success("Data copied to clipboard");
  }

  function handleReset() {
    setCsvData("");
    setOutputCsv(null);
    setParams({ color: "#2dd4bf", title: "", xLabel: "", yLabel: "" });
    setSortCol(null);
  }

  function handleDownloadSvg() {
    const svg = chartContainerRef.current?.querySelector("svg");
    if (!svg) {
      toast.error("No chart SVG found. Run the visualization first.");
      return;
    }
    const serialized = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([serialized], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool?.id ?? toolId}-chart.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Chart downloaded as SVG");
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCsvData(text);
      setPreviewOpen(true);
      toast.success(`Loaded: ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  // Parsed data for preview & stats
  const parsed = csvData.trim() ? parseCsvFull(csvData) : null;
  const previewRows = parsed?.rows.slice(0, 5) ?? [];

  // Sorted table rows
  let tableRows = parsed?.rows ?? [];
  if (sortCol) {
    tableRows = [...tableRows].sort((a, b) => {
      const av = a[sortCol] ?? "";
      const bv = b[sortCol] ?? "";
      const an = Number(av);
      const bn = Number(bv);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) {
        return sortDir === "asc" ? an - bn : bn - an;
      }
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  function toggleSort(col: string) {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  // Stats per numeric column
  const statsData =
    parsed && parsed.numericColumns.length > 0
      ? parsed.numericColumns.map((col) => {
          const vals = parsed.rows
            .map((r) => Number(r[col]))
            .filter((v) => !Number.isNaN(v));
          return { col, stats: computeStats(vals) };
        })
      : [];

  return (
    <div
      className="flex h-[calc(100vh-3.5rem)] overflow-hidden"
      data-ocid="tool.panel"
    >
      {/* Left panel - Input */}
      <div className="w-72 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{tool.icon}</span>
            <div>
              <h1 className="font-bold text-sidebar-foreground">{tool.name}</h1>
              <Badge
                variant="secondary"
                className="text-xs mt-0.5 bg-sidebar-accent text-sidebar-accent-foreground"
              >
                {tool.category}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-sidebar-foreground/60 mt-2">
            {tool.description}
          </p>
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <Label className="text-xs font-semibold text-sidebar-foreground/80 uppercase tracking-wide mb-2 block">
              Input Data
            </Label>
            <Textarea
              placeholder={`Paste CSV/TSV data here...\n\nExample:\n${tool.exampleCsv.split("\n").slice(0, 3).join("\n")}`}
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              onKeyDown={handleKeyDown}
              className="font-mono text-xs min-h-[160px] bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30 resize-none"
              data-ocid="tool.textarea"
            />
          </div>

          {/* File upload + Example row */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLoadExample}
              data-ocid="tool.secondary_button"
            >
              <FileText className="w-3 h-3 mr-1" /> Example
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="tool.upload_button"
            >
              <Upload className="w-3 h-3 mr-1" /> Upload
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleReset}
              data-ocid="tool.delete_button"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,.txt"
            className="hidden"
            onChange={handleFileUpload}
            data-ocid="tool.dropzone"
          />

          <p className="text-xs text-sidebar-foreground/40">
            CSV, TSV supported · Ctrl+Enter to run
          </p>

          {/* Data preview */}
          {parsed && parsed.headers.length > 0 && (
            <div className="border border-sidebar-border rounded-md overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors"
                onClick={() => setPreviewOpen((v) => !v)}
                data-ocid="tool.toggle"
              >
                <span>
                  Data Preview · {parsed.headers.length} cols ×{" "}
                  {parsed.rows.length} rows
                </span>
                {previewOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
              {previewOpen && (
                <div className="overflow-auto max-h-48 bg-sidebar-accent/30">
                  <table className="text-xs w-full">
                    <thead>
                      <tr className="border-b border-sidebar-border">
                        {parsed.headers.map((h) => (
                          <th
                            key={h}
                            className="px-2 py-1 text-left font-semibold text-sidebar-foreground/60 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row) => (
                        <tr
                          key={Object.values(row).join("-")}
                          className="border-b border-sidebar-border/40"
                        >
                          {parsed.headers.map((h) => (
                            <td
                              key={h}
                              className="px-2 py-1 text-sidebar-foreground/80 font-mono whitespace-nowrap"
                            >
                              {row[h]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Middle panel - Parameters */}
      <div className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-sm text-foreground">Parameters</h2>
        </div>
        <div className="p-4 flex flex-col gap-4 flex-1">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Chart Title
            </Label>
            <Input
              placeholder="Enter chart title"
              value={params.title}
              onChange={(e) =>
                setParams((p) => ({ ...p, title: e.target.value }))
              }
              className="text-sm h-8"
              data-ocid="tool.input"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              X-Axis Label
            </Label>
            <Input
              placeholder="X axis"
              value={params.xLabel}
              onChange={(e) =>
                setParams((p) => ({ ...p, xLabel: e.target.value }))
              }
              className="text-sm h-8"
              data-ocid="tool.input"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Y-Axis Label
            </Label>
            <Input
              placeholder="Y axis"
              value={params.yLabel}
              onChange={(e) =>
                setParams((p) => ({ ...p, yLabel: e.target.value }))
              }
              className="text-sm h-8"
              data-ocid="tool.input"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Color Scheme
            </Label>
            <Select
              value={params.color}
              onValueChange={(v) => setParams((p) => ({ ...p, color: v }))}
            >
              <SelectTrigger className="h-8 text-sm" data-ocid="tool.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLOR_SCHEMES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: c.value }}
                      />
                      {c.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-auto pt-4">
            <Button
              className="w-full gap-2"
              onClick={handleRun}
              data-ocid="tool.submit_button"
            >
              <Play className="w-4 h-4" /> Run
            </Button>
          </div>
        </div>
      </div>

      {/* Right panel - Output */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm text-foreground">Output</h2>
          {outputCsv && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={handleCopy}
                data-ocid="tool.secondary_button"
              >
                <Copy className="w-3 h-3" /> Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={handleDownloadSvg}
                data-ocid="tool.secondary_button"
              >
                <Download className="w-3 h-3" /> SVG
              </Button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto p-6">
          {outputCsv ? (
            <Tabs defaultValue="chart" className="h-full">
              <TabsList className="mb-4" data-ocid="tool.tab">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="datatable">Data Table</TabsTrigger>
              </TabsList>

              <TabsContent value="chart">
                <div
                  ref={chartContainerRef}
                  className="bg-card border border-border rounded-xl p-6 shadow-card"
                  data-ocid="tool.success_state"
                >
                  <Renderer csv={outputCsv} params={outputParams} />
                </div>
              </TabsContent>

              <TabsContent value="statistics">
                <div
                  className="bg-card border border-border rounded-xl p-4"
                  data-ocid="tool.panel"
                >
                  {statsData.length === 0 ? (
                    <div className="text-muted-foreground text-sm text-center py-8">
                      No numeric columns found for statistical analysis.
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-muted-foreground mb-3">
                        Descriptive statistics for {statsData.length} numeric
                        column(s), n={parsed?.rows.length ?? 0} rows
                      </div>
                      <div className="overflow-auto">
                        <table className="text-xs w-full border-collapse">
                          <thead>
                            <tr className="border-b border-border">
                              {[
                                "Column",
                                "n",
                                "Mean",
                                "Median",
                                "Std Dev",
                                "Min",
                                "Max",
                                "Range",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {statsData.map(({ col, stats }, i) => (
                              <tr
                                key={col}
                                className={`border-b border-border/50 ${
                                  i % 2 === 0 ? "bg-muted/30" : ""
                                }`}
                              >
                                <td className="px-3 py-2 font-semibold text-foreground">
                                  {col}
                                </td>
                                <td className="px-3 py-2 font-mono">
                                  {stats.n}
                                </td>
                                <td className="px-3 py-2 font-mono">
                                  {fmt(stats.mean)}
                                </td>
                                <td className="px-3 py-2 font-mono">
                                  {fmt(stats.median)}
                                </td>
                                <td className="px-3 py-2 font-mono">
                                  {fmt(stats.stddev)}
                                </td>
                                <td className="px-3 py-2 font-mono">
                                  {fmt(stats.min)}
                                </td>
                                <td className="px-3 py-2 font-mono">
                                  {fmt(stats.max)}
                                </td>
                                <td className="px-3 py-2 font-mono">
                                  {fmt(stats.range)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="datatable">
                <div
                  className="bg-card border border-border rounded-xl overflow-hidden"
                  data-ocid="tool.table"
                >
                  <div className="overflow-auto max-h-[60vh]">
                    <table className="text-xs w-full border-collapse">
                      <thead className="sticky top-0 bg-card z-10">
                        <tr className="border-b border-border">
                          {(parsed?.headers ?? []).map((h) => (
                            <th
                              key={h}
                              className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground hover:bg-muted/50 select-none"
                              onClick={() => toggleSort(h)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  toggleSort(h);
                                }
                              }}
                            >
                              {h}
                              {sortCol === h
                                ? sortDir === "asc"
                                  ? " ▲"
                                  : " ▼"
                                : " ↕"}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((row) => (
                          <tr
                            key={Object.values(row).join("-")}
                            className="border-b border-border/40"
                          >
                            {(parsed?.headers ?? []).map((h) => (
                              <td
                                key={h}
                                className="px-3 py-1.5 font-mono text-foreground/80 whitespace-nowrap"
                              >
                                {row[h]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border">
                    {parsed?.rows.length ?? 0} rows ·{" "}
                    {parsed?.headers.length ?? 0} columns · click headers to
                    sort
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div
              className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground"
              data-ocid="tool.empty_state"
            >
              <div className="text-6xl opacity-40">{tool.icon}</div>
              <div className="text-center">
                <div className="font-medium">
                  Click Run to generate visualization
                </div>
                <div className="text-sm mt-1">
                  Load example data or paste your own CSV
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-2 gap-2"
                onClick={handleLoadExample}
                data-ocid="tool.secondary_button"
              >
                <FileText className="w-4 h-4" /> Load Example Data
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
