import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { type ChartParams, getRenderer } from "@/lib/chartRenderers";
import { computeStats, parseCsvFull } from "@/lib/stats";
import { TOOLS } from "@/lib/tools";
import {
  BarChart2,
  ChevronDown,
  ChevronRight,
  Download,
  Image,
  RefreshCw,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const GRAPH_TYPES = [
  { id: "bar-chart", label: "Bar Chart", icon: "📊" },
  { id: "line-chart", label: "Line Chart", icon: "📈" },
  { id: "scatter-plot", label: "Scatter Plot", icon: "🔵" },
  { id: "box-plot", label: "Box Plot", icon: "📦" },
  { id: "pie-chart", label: "Pie Chart", icon: "🥧" },
  { id: "histogram", label: "Histogram", icon: "📉" },
  { id: "heatmap", label: "Heatmap", icon: "🗺️" },
  { id: "violin-plot", label: "Violin Plot", icon: "🎻" },
  { id: "bubble-chart", label: "Bubble Chart", icon: "🫧" },
  { id: "volcano-plot", label: "Volcano Plot", icon: "🌋" },
  { id: "survival-curve", label: "Survival Curve", icon: "📋" },
  { id: "pca-plot", label: "PCA Plot", icon: "🧬" },
  { id: "correlation-matrix", label: "Correlation Matrix", icon: "🔗" },
  { id: "roc-curve", label: "ROC Curve", icon: "📐" },
  { id: "forest-plot", label: "Forest Plot", icon: "🌲" },
  { id: "waterfall-plot", label: "Waterfall Plot", icon: "💧" },
  { id: "manhattan-plot", label: "Manhattan Plot", icon: "🏙️" },
  { id: "dotplot", label: "Dot Plot", icon: "⚫" },
  { id: "venn-diagram", label: "Venn Diagram", icon: "⭕" },
  { id: "upset-plot", label: "Upset Plot", icon: "📑" },
  { id: "pathway-map", label: "Pathway Map", icon: "🗺️" },
  { id: "circos-plot", label: "Circos Plot", icon: "🔄" },
];

const COLOR_SWATCHES = [
  { label: "Teal", value: "#2dd4bf" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Orange", value: "#f97316" },
  { label: "Green", value: "#10b981" },
  { label: "Red", value: "#ef4444" },
  { label: "Pink", value: "#ec4899" },
  { label: "Yellow", value: "#eab308" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Emerald", value: "#059669" },
];

export default function SPSSPage() {
  const [csvData, setCsvData] = useState("");
  const [selectedChart, setSelectedChart] = useState("bar-chart");
  const [color, setColor] = useState("#3b82f6");
  const [title, setTitle] = useState("");
  const [xLabel, setXLabel] = useState("");
  const [yLabel, setYLabel] = useState("");
  const [outputCsv, setOutputCsv] = useState<string | null>(null);
  const [outputParams, setOutputParams] = useState<ChartParams>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chart");
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const getDataInfo = () => {
    if (!csvData.trim()) return null;
    const { rows, headers } = parseCsvFull(csvData);
    return `${rows.length} rows × ${headers.length} columns`;
  };

  const getPreviewRows = () => {
    if (!csvData.trim()) return { headers: [], rows: [] };
    const { headers, rows } = parseCsvFull(csvData);
    return { headers, rows: rows.slice(0, 5) };
  };

  const handlePlot = () => {
    if (!csvData.trim()) {
      toast.error("Please paste or upload data first.");
      return;
    }
    setOutputCsv(csvData);
    setOutputParams({
      color,
      title: title || undefined,
      xLabel: xLabel || undefined,
      yLabel: yLabel || undefined,
    });
    setActiveTab("chart");
    toast.success("Graph plotted!");
  };

  const handleLoadExample = () => {
    const tool = TOOLS.find((t) => t.id === selectedChart);
    const exampleCsv = tool?.exampleCsv ?? TOOLS[0].exampleCsv;
    setCsvData(exampleCsv);
    setOutputCsv(exampleCsv);
    setOutputParams({
      color,
      title: title || undefined,
      xLabel: xLabel || undefined,
      yLabel: yLabel || undefined,
    });
    setActiveTab("chart");
    toast.success("Example data loaded and plotted!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvData((ev.target?.result as string) ?? "");
    };
    reader.readAsText(file);
  };

  const downloadSVG = () => {
    const svg = chartContainerRef.current?.querySelector("svg");
    if (!svg) {
      toast.error("No chart to download.");
      return;
    }
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedChart}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const svg = chartContainerRef.current?.querySelector("svg");
    if (!svg) {
      toast.error("No chart to download.");
      return;
    }
    const data = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = svg.clientWidth || 800;
    canvas.height = svg.clientHeight || 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new window.Image();
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${selectedChart}.png`;
      a.click();
    };
    img.src = url;
  };

  const handleSortCol = (i: number) => {
    if (sortCol === i) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(i);
      setSortDir("asc");
    }
  };

  const Renderer = outputCsv ? getRenderer(selectedChart) : null;

  const statsData = outputCsv
    ? (() => {
        const { headers, rows, numericColumns } = parseCsvFull(outputCsv);
        return numericColumns.map((col) => {
          const idx = headers.indexOf(col);
          const vals = rows
            .map((r) => Number(r[idx]))
            .filter((v) => !Number.isNaN(v));
          return { col, stats: computeStats(vals) };
        });
      })()
    : [];

  const tableData = outputCsv
    ? parseCsvFull(outputCsv)
    : { headers: [], rows: [] };

  const sortedRows = (() => {
    if (sortCol === null) return tableData.rows;
    const colKey = tableData.headers[sortCol];
    if (!colKey) return tableData.rows;
    return [...tableData.rows].sort((a, b) => {
      const av = a[colKey] ?? "";
      const bv = b[colKey] ?? "";
      const an = Number(av);
      const bn = Number(bv);
      const cmp =
        !Number.isNaN(an) && !Number.isNaN(bn) ? an - bn : av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });
  })();

  const preview = getPreviewRows();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top Toolbar */}
      <div
        className="sticky top-0 z-10 bg-card border-b border-border px-4 py-2 flex items-center justify-between gap-4"
        data-ocid="spss.section"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Graph Builder</h1>
            <p className="text-xs text-muted-foreground">
              SPSS-style graph making
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={handlePlot}
          data-ocid="spss.primary_button"
        >
          <BarChart2 className="w-4 h-4" />
          Plot Graph
        </Button>
      </div>

      {/* 3-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Data Input */}
        <div
          className="w-[280px] shrink-0 border-r border-border flex flex-col overflow-hidden"
          data-ocid="spss.panel"
        >
          <div className="px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Data Input
            </span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 flex flex-col gap-3">
              <Textarea
                className="font-mono text-xs min-h-[200px] text-black bg-white border-border resize-none"
                placeholder="Paste CSV/TSV data here..."
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                data-ocid="spss.textarea"
              />
              {getDataInfo() && (
                <p className="text-xs text-muted-foreground">{getDataInfo()}</p>
              )}
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-7"
                  onClick={handleLoadExample}
                  data-ocid="spss.secondary_button"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Example
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-7"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="spss.upload_button"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Upload
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-7 text-destructive hover:text-destructive"
                  onClick={() => setCsvData("")}
                  data-ocid="spss.delete_button"
                >
                  Clear
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Data Preview collapsible */}
              <div className="border border-border rounded-md overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-2 py-1.5 bg-muted/30 text-xs font-medium hover:bg-muted/50"
                  onClick={() => setPreviewOpen(!previewOpen)}
                  data-ocid="spss.toggle"
                >
                  <span>Data Preview</span>
                  {previewOpen ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
                {previewOpen && preview.headers.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="text-xs w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          {preview.headers.map((h) => (
                            <th
                              key={h}
                              className="px-2 py-1 text-left font-medium text-muted-foreground border-b border-border"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.rows.map((row) => (
                          <tr
                            key={Object.values(row).join("\x1f")}
                            className="border-b border-border last:border-0"
                          >
                            {preview.headers.map((h) => (
                              <td key={h} className="px-2 py-1">
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

              <p className="text-xs text-muted-foreground">
                Paste CSV/TSV data or upload a file. First row = headers.
              </p>
            </div>
          </ScrollArea>
        </div>

        {/* MIDDLE: Graph Settings */}
        <div
          className="w-[220px] shrink-0 border-r border-border flex flex-col overflow-hidden"
          data-ocid="spss.panel"
        >
          <div className="px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Graph Settings
            </span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 flex flex-col gap-4">
              {/* Graph type list */}
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Graph Type
                </Label>
                <div className="flex flex-col gap-1">
                  {GRAPH_TYPES.map((gt) => (
                    <button
                      key={gt.id}
                      type="button"
                      onClick={() => setSelectedChart(gt.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-left transition-colors ${
                        selectedChart === gt.id
                          ? "bg-primary/10 border border-primary text-primary font-medium"
                          : "hover:bg-muted border border-transparent"
                      }`}
                      data-ocid="spss.tab"
                    >
                      <span>{gt.icon}</span>
                      <span>{gt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color swatches */}
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Chart Color
                </Label>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {COLOR_SWATCHES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onClick={() => setColor(c.value)}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                        color === c.value
                          ? "ring-2 ring-offset-2 ring-foreground scale-110"
                          : ""
                      }`}
                      style={{ backgroundColor: c.value }}
                      data-ocid="spss.toggle"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Label
                    htmlFor="custom-color"
                    className="text-xs text-muted-foreground whitespace-nowrap"
                  >
                    Custom:
                  </Label>
                  <input
                    id="custom-color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-7 w-full cursor-pointer rounded border border-border"
                    data-ocid="spss.input"
                  />
                </div>
              </div>

              {/* Labels */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Labels
                </Label>
                <div>
                  <Label htmlFor="chart-title" className="text-xs mb-1 block">
                    Chart Title
                  </Label>
                  <Input
                    id="chart-title"
                    className="h-7 text-xs text-black bg-white"
                    placeholder="Optional title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    data-ocid="spss.input"
                  />
                </div>
                <div>
                  <Label htmlFor="x-axis" className="text-xs mb-1 block">
                    X-Axis Label
                  </Label>
                  <Input
                    id="x-axis"
                    className="h-7 text-xs text-black bg-white"
                    placeholder="X axis"
                    value={xLabel}
                    onChange={(e) => setXLabel(e.target.value)}
                    data-ocid="spss.input"
                  />
                </div>
                <div>
                  <Label htmlFor="y-axis" className="text-xs mb-1 block">
                    Y-Axis Label
                  </Label>
                  <Input
                    id="y-axis"
                    className="h-7 text-xs text-black bg-white"
                    placeholder="Y axis"
                    value={yLabel}
                    onChange={(e) => setYLabel(e.target.value)}
                    data-ocid="spss.input"
                  />
                </div>
              </div>

              {/* Bottom plot button */}
              <Button
                className="w-full gap-2"
                size="sm"
                onClick={handlePlot}
                data-ocid="spss.submit_button"
              >
                <BarChart2 className="w-4 h-4" />
                Plot Graph
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT: Output */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          data-ocid="spss.panel"
        >
          <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Output
            </span>
            {outputCsv && (
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs gap-1"
                  onClick={downloadPNG}
                  data-ocid="spss.secondary_button"
                >
                  <Image className="w-3 h-3" />
                  PNG
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs gap-1"
                  onClick={downloadSVG}
                  data-ocid="spss.secondary_button"
                >
                  <Download className="w-3 h-3" />
                  SVG
                </Button>
              </div>
            )}
          </div>

          {!outputCsv ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8"
              data-ocid="spss.empty_state"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <BarChart2 className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">No chart yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a graph type and click Plot Graph
                </p>
              </div>
              <Button
                onClick={handleLoadExample}
                variant="outline"
                className="gap-2"
                data-ocid="spss.primary_button"
              >
                <RefreshCw className="w-4 h-4" />
                Load Example &amp; Plot
              </Button>
            </motion.div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList
                className="mx-3 mt-2 self-start h-8"
                data-ocid="spss.tab"
              >
                <TabsTrigger value="chart" className="text-xs h-6">
                  Chart
                </TabsTrigger>
                <TabsTrigger value="statistics" className="text-xs h-6">
                  Statistics
                </TabsTrigger>
                <TabsTrigger value="table" className="text-xs h-6">
                  Data Table
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="chart"
                className="flex-1 overflow-auto p-3 mt-0"
              >
                <motion.div
                  key={`${selectedChart}-${color}-${outputCsv.length}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow border border-border p-4"
                  ref={chartContainerRef}
                >
                  {Renderer && (
                    <Renderer csv={outputCsv} params={outputParams} />
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent
                value="statistics"
                className="flex-1 overflow-auto p-3 mt-0"
              >
                {statsData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No numeric columns found.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="text-xs w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-3 py-2 text-left font-semibold border border-border">
                            Column
                          </th>
                          <th className="px-3 py-2 text-right font-semibold border border-border">
                            Mean
                          </th>
                          <th className="px-3 py-2 text-right font-semibold border border-border">
                            Median
                          </th>
                          <th className="px-3 py-2 text-right font-semibold border border-border">
                            Std Dev
                          </th>
                          <th className="px-3 py-2 text-right font-semibold border border-border">
                            Min
                          </th>
                          <th className="px-3 py-2 text-right font-semibold border border-border">
                            Max
                          </th>
                          <th className="px-3 py-2 text-right font-semibold border border-border">
                            Range
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {statsData.map(({ col, stats }) => (
                          <tr
                            key={col}
                            className="border-b border-border hover:bg-muted/20"
                          >
                            <td className="px-3 py-1.5 font-medium border border-border">
                              {col}
                            </td>
                            <td className="px-3 py-1.5 text-right border border-border">
                              {stats.mean.toFixed(3)}
                            </td>
                            <td className="px-3 py-1.5 text-right border border-border">
                              {stats.median.toFixed(3)}
                            </td>
                            <td className="px-3 py-1.5 text-right border border-border">
                              {stats.stddev.toFixed(3)}
                            </td>
                            <td className="px-3 py-1.5 text-right border border-border">
                              {stats.min.toFixed(3)}
                            </td>
                            <td className="px-3 py-1.5 text-right border border-border">
                              {stats.max.toFixed(3)}
                            </td>
                            <td className="px-3 py-1.5 text-right border border-border">
                              {stats.range.toFixed(3)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="table"
                className="flex-1 overflow-auto p-3 mt-0"
              >
                <div className="overflow-x-auto">
                  <table className="text-xs w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        {tableData.headers.map((h, colIdx) => (
                          <th
                            key={h}
                            className="border border-border"
                            data-ocid="spss.table"
                          >
                            <button
                              type="button"
                              className="w-full px-3 py-2 text-left font-semibold hover:bg-muted select-none"
                              onClick={() => handleSortCol(colIdx)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  handleSortCol(colIdx);
                              }}
                            >
                              {h}
                              {sortCol === colIdx
                                ? sortDir === "asc"
                                  ? " ▲"
                                  : " ▼"
                                : ""}
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRows.map((row) => (
                        <tr
                          key={Object.values(row).join("\x1f")}
                          className="border-b border-border hover:bg-muted/20"
                        >
                          {tableData.headers.map((h) => (
                            <td
                              key={h}
                              className="px-3 py-1.5 border border-border"
                            >
                              {row[h]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
