import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { parseCsvFull, pearsonCorrelation } from "./stats";

const PALETTE = [
  "#2dd4bf",
  "#3b82f6",
  "#a855f7",
  "#f97316",
  "#10b981",
  "#ec4899",
  "#eab308",
  "#6366f1",
];

function parseCsv(csv: string): {
  headers: string[];
  rows: Record<string, string>[];
} {
  const lines = csv
    .trim()
    .split("\n")
    .filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  // Auto-detect delimiter
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = lines[0].split(delimiter).map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const vals = line.split(delimiter).map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? ""]));
  });
  return { headers, rows };
}

export interface ChartParams {
  color?: string;
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

type RendererProps = { csv: string; params: ChartParams };

export function BarChartRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const xKey = headers[0];
  const yKey = headers[1];
  const data = rows.map((r) => ({
    [xKey]: r[xKey],
    [yKey]: Number.parseFloat(r[yKey]) || 0,
  }));
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey={xKey}
            label={{
              value: params.xLabel || xKey,
              position: "insideBottom",
              offset: -30,
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: params.yLabel || yKey,
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar
            dataKey={yKey}
            fill={params.color || PALETTE[0]}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChartRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const xKey = headers[0];
  const yKeys = headers.slice(1);
  const data = rows.map((r) => {
    const entry: Record<string, string | number> = { [xKey]: r[xKey] };
    for (const k of yKeys) {
      entry[k] = Number.parseFloat(r[k]) || 0;
    }
    return entry;
  });
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey={xKey}
            label={{
              value: params.xLabel || xKey,
              position: "insideBottom",
              offset: -30,
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: params.yLabel || yKeys[0],
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          {yKeys.length > 1 && <Legend />}
          {yKeys.map((k, i) => (
            <Line
              key={k}
              type="monotone"
              dataKey={k}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScatterChartRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const xKey = headers[0];
  const yKey = headers[1];
  const data = rows.map((r) => ({
    x: Number.parseFloat(r[xKey]) || 0,
    y: Number.parseFloat(r[yKey]) || 0,
  }));
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="x"
            name={xKey}
            label={{
              value: params.xLabel || xKey,
              position: "insideBottom",
              offset: -30,
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            dataKey="y"
            name={yKey}
            label={{
              value: params.yLabel || yKey,
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            data={data}
            fill={params.color || PALETTE[0]}
            fillOpacity={0.8}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BoxPlotRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const data = rows
    .map((r) => ({
      group: r[headers[0]],
      min: Number.parseFloat(r.min) || 0,
      q1: Number.parseFloat(r.q1) || 0,
      median: Number.parseFloat(r.median) || 0,
      q3: Number.parseFloat(r.q3) || 0,
      max: Number.parseFloat(r.max) || 0,
    }))
    .map((d) => ({
      group: d.group,
      whiskerBottom: d.min,
      iqrBottom: d.q1 - d.min,
      medianLine: d.median - d.q1,
      iqrTop: d.q3 - d.median,
      whiskerTop: d.max - d.q3,
    }));
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="group" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(val, name) => [val, name]} />
          <Bar
            dataKey="whiskerBottom"
            stackId="a"
            fill="transparent"
            stroke="transparent"
          />
          <Bar
            dataKey="iqrBottom"
            stackId="a"
            fill={PALETTE[2]}
            fillOpacity={0.6}
          />
          <Bar dataKey="medianLine" stackId="a" fill={PALETTE[0]} />
          <Bar
            dataKey="iqrTop"
            stackId="a"
            fill={PALETTE[2]}
            fillOpacity={0.6}
          />
          <Bar
            dataKey="whiskerTop"
            stackId="a"
            fill="transparent"
            stroke="transparent"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HeatmapRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const rowLabel = headers[0];
  const colHeaders = headers.slice(1);
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const r of rows) {
    for (const c of colHeaders) {
      const v = Number.parseFloat(r[c]);
      if (!Number.isNaN(v)) {
        min = Math.min(min, v);
        max = Math.max(max, v);
      }
    }
  }
  const range = max - min || 1;
  function getColor(val: string) {
    const v = (Number.parseFloat(val) - min) / range;
    const r = Math.round(30 + v * 220);
    const g = Math.round(180 - v * 100);
    const b = Math.round(200 - v * 180);
    return `rgb(${r},${g},${b})`;
  }
  return (
    <div className="overflow-auto">
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <table className="text-xs border-collapse mx-auto">
        <thead>
          <tr>
            <th className="p-1 text-muted-foreground font-medium" />
            {colHeaders.map((c) => (
              <th
                key={c}
                className="p-1 text-muted-foreground font-medium min-w-[60px]"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[rowLabel]}>
              <td className="p-1 font-medium text-foreground pr-3">
                {r[rowLabel]}
              </td>
              {colHeaders.map((c) => (
                <td
                  key={c}
                  className="p-0 border border-white"
                  style={{
                    backgroundColor: getColor(r[c]),
                    width: 60,
                    height: 36,
                  }}
                  title={`${r[rowLabel]} × ${c}: ${r[c]}`}
                >
                  <span className="flex items-center justify-center h-full text-white text-xs font-mono">
                    {Number.parseFloat(r[c]).toFixed(1)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function VolcanoPlotRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const data = rows.map((r) => {
    const fc = Number.parseFloat(r.log2FC) || 0;
    const pv = Number.parseFloat(r.pvalue) || 1;
    const negLogP = -Math.log10(pv);
    let color = "#94a3b8";
    if (Math.abs(fc) > 2 && pv < 0.05) color = fc > 0 ? "#ef4444" : "#3b82f6";
    else if (pv < 0.05) color = "#f97316";
    return { x: fc, y: negLogP, name: r.gene || r[headers[0]], color };
  });
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <div className="text-xs text-muted-foreground flex gap-4 justify-center mb-2">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />{" "}
          Up-regulated
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />{" "}
          Down-regulated
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />{" "}
          Not significant
        </span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="x"
            name="log2FC"
            label={{
              value: "log2(Fold Change)",
              position: "insideBottom",
              offset: -30,
            }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            dataKey="y"
            name="-log10(p)"
            label={{
              value: "-log10(p-value)",
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 11 }}
          />
          <ReferenceLine x={2} stroke="#ef4444" strokeDasharray="4 4" />
          <ReferenceLine x={-2} stroke="#3b82f6" strokeDasharray="4 4" />
          <ReferenceLine
            y={-Math.log10(0.05)}
            stroke="#f97316"
            strokeDasharray="4 4"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.length) {
                const d = payload[0]?.payload;
                return (
                  <div className="bg-popover border border-border rounded p-2 text-xs shadow">
                    <div className="font-semibold">{d?.name}</div>
                    <div>log2FC: {d?.x?.toFixed(2)}</div>
                    <div>-log10(p): {d?.y?.toFixed(2)}</div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter
            data={data}
            fill={PALETTE[0]}
            shape={(props: {
              cx?: number;
              cy?: number;
              payload?: { color: string };
            }) => (
              <circle
                cx={props.cx}
                cy={props.cy}
                r={5}
                fill={props.payload?.color || PALETTE[0]}
                fillOpacity={0.8}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChartRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const nameKey = headers[0];
  const valueKey = headers[1];
  const data = rows.map((r) => ({
    name: r[nameKey],
    value: Number.parseFloat(r[valueKey]) || 0,
  }));
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={40}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={true}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name ?? i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HistogramRenderer({ csv, params }: RendererProps) {
  const { rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const values = rows
    .map((r) => Number.parseFloat(Object.values(r)[0]))
    .filter((v) => !Number.isNaN(v));
  if (values.length === 0) return <EmptyChart />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const bins = 8;
  const binWidth = (max - min) / bins;
  const binCounts = Array.from({ length: bins }, (_, i) => ({
    bin: `${(min + i * binWidth).toFixed(1)}-${(min + (i + 1) * binWidth).toFixed(1)}`,
    count: values.filter(
      (v) => v >= min + i * binWidth && v < min + (i + 1) * binWidth,
    ).length,
  }));
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={binCounts}
          margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="bin"
            tick={{ fontSize: 10 }}
            angle={-30}
            textAnchor="end"
          />
          <YAxis
            label={{ value: "Frequency", angle: -90, position: "insideLeft" }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar
            dataKey="count"
            fill={params.color || PALETTE[2]}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ViolinPlotRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const groupKey = headers[0];
  const valKey = headers[1];
  const groups = [...new Set(rows.map((r) => r[groupKey]))];
  const data: Record<string, number>[] = [];
  const allVals = rows
    .map((r) => Number.parseFloat(r[valKey]))
    .filter((v) => !Number.isNaN(v));
  const globalMin = Math.min(...allVals);
  const globalMax = Math.max(...allVals);
  const points = 20;
  for (let i = 0; i <= points; i++) {
    const y = globalMin + (i / points) * (globalMax - globalMin);
    const entry: Record<string, number> = { y };
    for (const g of groups) {
      const gVals = rows
        .filter((r) => r[groupKey] === g)
        .map((r) => Number.parseFloat(r[valKey]))
        .filter((v) => !Number.isNaN(v));
      const bw = 2;
      entry[g] =
        (gVals.reduce(
          (sum, v) =>
            sum +
            Math.exp(-0.5 * ((y - v) / bw) ** 2) /
              (bw * Math.sqrt(2 * Math.PI)),
          0,
        ) /
          gVals.length) *
        100;
    }
    data.push(entry);
  }
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            label={{ value: "Density", position: "insideBottom", offset: -5 }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            dataKey="y"
            type="number"
            label={{
              value: params.yLabel || valKey,
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip />
          <Legend />
          {groups.map((g, i) => (
            <Line
              key={g}
              type="monotone"
              dataKey={g}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SurvivalCurveRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const xKey = headers[0];
  const yKeys = headers.slice(1);
  const data = rows.map((r) => {
    const entry: Record<string, string | number> = {
      [xKey]: Number.parseFloat(r[xKey]) || 0,
    };
    for (const k of yKeys) {
      entry[k] = Number.parseFloat(r[k]) || 0;
    }
    return entry;
  });
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey={xKey}
            label={{
              value: params.xLabel || "Time (months)",
              position: "insideBottom",
              offset: -30,
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 1]}
            label={{
              value: params.yLabel || "Survival Probability",
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 12 }}
          />
          <ReferenceLine y={0.5} stroke="#94a3b8" strokeDasharray="4 4" />
          <Tooltip />
          <Legend />
          {yKeys.map((k, i) => (
            <Line
              key={k}
              type="stepAfter"
              dataKey={k}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2.5}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---- NEW RENDERERS ----

export function PcaPlotRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const groupKey = headers[3] || headers[headers.length - 1];
  const groups = [...new Set(rows.map((r) => r[groupKey]))];
  const dataByGroup = groups.map((g, i) => ({
    name: g,
    color: PALETTE[i % PALETTE.length],
    data: rows
      .filter((r) => r[groupKey] === g)
      .map((r) => ({
        x: Number.parseFloat(r[headers[1]]) || 0,
        y: Number.parseFloat(r[headers[2]]) || 0,
        name: r[headers[0]],
      })),
  }));
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="x"
            type="number"
            name={headers[1]}
            label={{
              value: params.xLabel || headers[1],
              position: "insideBottom",
              offset: -30,
            }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            dataKey="y"
            type="number"
            name={headers[2]}
            label={{
              value: params.yLabel || headers[2],
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.length) {
                const d = payload[0]?.payload;
                return (
                  <div className="bg-popover border border-border rounded p-2 text-xs shadow">
                    <div className="font-semibold">{d?.name}</div>
                    <div>PC1: {d?.x?.toFixed(3)}</div>
                    <div>PC2: {d?.y?.toFixed(3)}</div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          {dataByGroup.map((g) => (
            <Scatter
              key={g.name}
              name={g.name}
              data={g.data}
              fill={g.color}
              fillOpacity={0.8}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CorrelationMatrixRenderer({ csv, params }: RendererProps) {
  const { headers, rows, numericColumns } = parseCsvFull(csv);
  if (rows.length === 0 || numericColumns.length < 2) return <EmptyChart />;
  // Use numeric columns only
  const cols = numericColumns.slice(0, 8); // limit to 8 cols
  const matrix: number[][] = cols.map((a) =>
    cols.map((b) => {
      const va = rows.map((r) => Number(r[a])).filter((v) => !Number.isNaN(v));
      const vb = rows.map((r) => Number(r[b])).filter((v) => !Number.isNaN(v));
      return pearsonCorrelation(va, vb);
    }),
  );
  function corrColor(val: number) {
    // -1 = blue, 0 = white, 1 = red
    if (val > 0) {
      const r = Math.round(180 + val * 75);
      const g = Math.round(180 - val * 150);
      const b = Math.round(180 - val * 150);
      return `rgb(${r},${g},${b})`;
    }
    const abs = Math.abs(val);
    const r = Math.round(180 - abs * 150);
    const g = Math.round(180 - abs * 150);
    const b = Math.round(180 + abs * 75);
    return `rgb(${r},${g},${b})`;
  }
  // ignore unused headers warning
  void headers;
  return (
    <div className="overflow-auto">
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <div className="text-xs text-muted-foreground text-center mb-2">
        Pearson correlation (n={rows.length} samples)
      </div>
      <table className="text-xs border-collapse mx-auto">
        <thead>
          <tr>
            <th className="p-1" />
            {cols.map((c) => (
              <th
                key={c}
                className="p-1 text-muted-foreground font-medium min-w-[64px] text-center"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cols.map((rowCol, ri) => (
            <tr key={rowCol}>
              <td className="p-1 font-medium text-foreground pr-2 text-right">
                {rowCol}
              </td>
              {cols.map((colKey, ci) => {
                const val = matrix[ri][ci];
                return (
                  <td
                    key={colKey}
                    className="border border-white"
                    style={{
                      backgroundColor: corrColor(val),
                      width: 64,
                      height: 36,
                    }}
                    title={`${rowCol} × ${cols[ci]}: ${val.toFixed(3)}`}
                  >
                    <span
                      className="flex items-center justify-center h-full text-xs font-mono font-semibold"
                      style={{ color: Math.abs(val) > 0.5 ? "white" : "#333" }}
                    >
                      {val.toFixed(2)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-center gap-3 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-4 h-3 rounded"
            style={{ backgroundColor: "rgb(255,30,30)" }}
          />{" "}
          +1.0
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-4 h-3 rounded"
            style={{ backgroundColor: "rgb(180,180,180)" }}
          />{" "}
          0
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-4 h-3 rounded"
            style={{ backgroundColor: "rgb(30,30,255)" }}
          />{" "}
          -1.0
        </span>
      </div>
    </div>
  );
}

export function RocCurveRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const fprKey = headers[0];
  const tprKey = headers[1];
  const labelKey = headers[2];
  const labels = labelKey
    ? [...new Set(rows.map((r) => r[labelKey]))]
    : ["Model"];

  // Compute AUC via trapezoidal rule per label
  function computeAuc(pts: { x: number; y: number }[]) {
    const sorted = [...pts].sort((a, b) => a.x - b.x);
    let auc = 0;
    for (let i = 1; i < sorted.length; i++) {
      auc +=
        (sorted[i].x - sorted[i - 1].x) * ((sorted[i].y + sorted[i - 1].y) / 2);
    }
    return auc;
  }

  const curves = labels.map((lbl, i) => {
    const pts = rows
      .filter((r) => !labelKey || r[labelKey] === lbl)
      .map((r) => ({
        x: Number.parseFloat(r[fprKey]) || 0,
        y: Number.parseFloat(r[tprKey]) || 0,
      }));
    const auc = computeAuc(pts);
    return { label: lbl, color: PALETTE[i % PALETTE.length], pts, auc };
  });

  // Build combined data for recharts LineChart keyed by fpr
  const allFprs = [
    ...new Set(rows.map((r) => Number.parseFloat(r[fprKey]) || 0)),
  ].sort((a, b) => a - b);
  const chartData = allFprs.map((fpr) => {
    const entry: Record<string, number> = { fpr, diagonal: fpr };
    for (const c of curves) {
      const match = c.pts.find((p) => p.x === fpr);
      if (match) entry[c.label] = match.y;
    }
    return entry;
  });

  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <div className="text-xs text-muted-foreground flex flex-wrap gap-3 justify-center mb-2">
        {curves.map((c) => (
          <span key={c.label} className="flex items-center gap-1">
            <span
              className="inline-block w-4 h-0.5"
              style={{
                backgroundColor: c.color,
                display: "inline-block",
                verticalAlign: "middle",
              }}
            />
            {c.label} (AUC={c.auc.toFixed(3)})
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="fpr"
            domain={[0, 1]}
            type="number"
            label={{
              value: "False Positive Rate",
              position: "insideBottom",
              offset: -30,
            }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={[0, 1]}
            label={{
              value: "True Positive Rate",
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip />
          <Legend />
          <Line
            dataKey="diagonal"
            stroke="#94a3b8"
            strokeDasharray="6 4"
            strokeWidth={1}
            dot={false}
            name="Random (AUC=0.500)"
          />
          {curves.map((c) => (
            <Line
              key={c.label}
              dataKey={c.label}
              stroke={c.color}
              strokeWidth={2.5}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WaterfallPlotRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const patientKey = headers[0];
  const responseKey = headers[1];
  const data = rows
    .map((r) => ({
      patient: r[patientKey],
      response: Number.parseFloat(r[responseKey]) || 0,
    }))
    .sort((a, b) => b.response - a.response);
  return (
    <div>
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <div className="text-xs text-muted-foreground flex gap-4 justify-center mb-2">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />{" "}
          Response (≤-20%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-yellow-500 inline-block" />{" "}
          Stable
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />{" "}
          Progression
        </span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 20, bottom: 60 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="patient"
            tick={{ fontSize: 9 }}
            angle={-45}
            textAnchor="end"
            label={{
              value: "Patient",
              position: "insideBottom",
              offset: -45,
            }}
          />
          <YAxis
            label={{
              value: "Best Response (%)",
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />
          <ReferenceLine
            y={-20}
            stroke="#22c55e"
            strokeDasharray="5 3"
            strokeWidth={1}
          />
          <ReferenceLine
            y={20}
            stroke="#ef4444"
            strokeDasharray="5 3"
            strokeWidth={1}
          />
          <Tooltip formatter={(val) => [`${val}%`, "Response"]} />
          <Bar dataKey="response" radius={[2, 2, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.patient}
                fill={
                  entry.response <= -20
                    ? "#22c55e"
                    : entry.response >= 20
                      ? "#ef4444"
                      : "#eab308"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ForestPlotRenderer({ csv, params }: RendererProps) {
  const { headers, rows } = parseCsv(csv);
  if (rows.length === 0) return <EmptyChart />;
  const studyKey = headers[0];
  const effectKey = headers[1];
  const lowerKey = headers[2];
  const upperKey = headers[3];
  const data = rows.map((r) => ({
    study: r[studyKey],
    effect: Number.parseFloat(r[effectKey]) || 0,
    lower: Number.parseFloat(r[lowerKey]) || 0,
    upper: Number.parseFloat(r[upperKey]) || 0,
  }));

  // Compute pooled estimate (simple inverse-variance weighted)
  const allEffects = data.map((d) => d.effect);
  const pooled = allEffects.reduce((s, v) => s + v, 0) / allEffects.length;

  // Determine axis extent
  const allVals = data.flatMap((d) => [d.lower, d.upper]);
  const xMin = Math.min(...allVals) * 0.85;
  const xMax = Math.max(...allVals) * 1.15;

  const height = data.length * 44 + 80;

  return (
    <div className="overflow-auto">
      {params.title && (
        <h3 className="text-center font-semibold mb-3 text-foreground">
          {params.title}
        </h3>
      )}
      <svg
        width="100%"
        viewBox={`0 0 520 ${height}`}
        style={{
          minWidth: 400,
          maxWidth: 600,
          display: "block",
          margin: "0 auto",
        }}
      >
        <title>Forest Plot</title>
        {/* Column headers */}
        <text x={140} y={20} fontSize={11} fill="#64748b" fontWeight={600}>
          Study
        </text>
        <text
          x={300}
          y={20}
          fontSize={11}
          fill="#64748b"
          fontWeight={600}
          textAnchor="middle"
        >
          Effect Size
        </text>
        <text
          x={430}
          y={20}
          fontSize={11}
          fill="#64748b"
          fontWeight={600}
          textAnchor="middle"
        >
          OR [95% CI]
        </text>

        {/* Reference line at 1.0 */}
        {(() => {
          const plotLeft = 180;
          const plotRight = 360;
          const mapX = (v: number) =>
            plotLeft + ((v - xMin) / (xMax - xMin)) * (plotRight - plotLeft);
          const refX = mapX(1.0);
          return (
            <>
              <line
                x1={refX}
                y1={30}
                x2={refX}
                y2={height - 40}
                stroke="#94a3b8"
                strokeDasharray="5 3"
                strokeWidth={1}
              />
              {data.map((d, i) => {
                const cy = 44 + i * 44;
                const cx = mapX(d.effect);
                const lx = mapX(d.lower);
                const rx = mapX(d.upper);
                return (
                  <g key={d.study}>
                    {/* Study name */}
                    <text
                      x={140}
                      y={cy + 4}
                      fontSize={11}
                      fill="#334155"
                      textAnchor="end"
                    >
                      {d.study}
                    </text>
                    {/* CI line */}
                    <line
                      x1={lx}
                      y1={cy}
                      x2={rx}
                      y2={cy}
                      stroke="#475569"
                      strokeWidth={2}
                    />
                    {/* CI caps */}
                    <line
                      x1={lx}
                      y1={cy - 5}
                      x2={lx}
                      y2={cy + 5}
                      stroke="#475569"
                      strokeWidth={2}
                    />
                    <line
                      x1={rx}
                      y1={cy - 5}
                      x2={rx}
                      y2={cy + 5}
                      stroke="#475569"
                      strokeWidth={2}
                    />
                    {/* Effect square */}
                    <rect
                      x={cx - 6}
                      y={cy - 6}
                      width={12}
                      height={12}
                      fill={PALETTE[0]}
                      stroke="white"
                      strokeWidth={1}
                    />
                    {/* OR [CI] label */}
                    <text
                      x={430}
                      y={cy + 4}
                      fontSize={10}
                      fill="#475569"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {d.effect.toFixed(2)} [{d.lower.toFixed(2)}-
                      {d.upper.toFixed(2)}]
                    </text>
                  </g>
                );
              })}
              {/* Pooled estimate diamond */}
              {(() => {
                const cy = 44 + data.length * 44;
                const cx = mapX(pooled);
                const dx = 10;
                return (
                  <g>
                    <line
                      x1={140}
                      y1={cy - 8}
                      x2={380}
                      y2={cy - 8}
                      stroke="#cbd5e1"
                      strokeWidth={1}
                    />
                    <text
                      x={140}
                      y={cy + 4}
                      fontSize={11}
                      fill="#1e293b"
                      textAnchor="end"
                      fontWeight={600}
                    >
                      Pooled
                    </text>
                    <polygon
                      points={`${cx},${cy - 9} ${cx + dx * 2},${cy} ${cx},${cy + 9} ${cx - dx * 2},${cy}`}
                      fill={PALETTE[1]}
                      stroke="white"
                      strokeWidth={1}
                    />
                    <text
                      x={430}
                      y={cy + 4}
                      fontSize={10}
                      fill="#1e293b"
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontWeight={600}
                    >
                      {pooled.toFixed(2)}
                    </text>
                  </g>
                );
              })()}
              {/* X axis */}
              <line
                x1={plotLeft}
                y1={height - 35}
                x2={plotRight}
                y2={height - 35}
                stroke="#94a3b8"
                strokeWidth={1}
              />
              {[xMin, 1.0, xMax].map((v) => (
                <g key={v}>
                  <line
                    x1={mapX(v)}
                    y1={height - 35}
                    x2={mapX(v)}
                    y2={height - 30}
                    stroke="#94a3b8"
                    strokeWidth={1}
                  />
                  <text
                    x={mapX(v)}
                    y={height - 18}
                    fontSize={10}
                    fill="#64748b"
                    textAnchor="middle"
                  >
                    {v.toFixed(2)}
                  </text>
                </g>
              ))}
            </>
          );
        })()}
      </svg>
    </div>
  );
}

function BubbleChartRenderer({ csv, params }: RendererProps) {
  const { rows } = parseCsv(csv);
  const data = rows
    .map((r) => ({
      x: Number(r.x ?? r.X ?? 0),
      y: Number(r.y ?? r.Y ?? 0),
      size: Math.max(1, Number(r.size ?? r.Size ?? r.radius ?? 10)),
      group: r.group ?? r.Group ?? r.label ?? "Data",
    }))
    .filter((d) => !Number.isNaN(d.x) && !Number.isNaN(d.y));
  if (!data.length) return <EmptyChart />;
  const groups = [...new Set(data.map((d) => d.group))];
  const maxSize = Math.max(...data.map((d) => d.size));
  return (
    <div style={{ background: "white", padding: "16px", borderRadius: "8px" }}>
      {params.title && (
        <div className="text-center font-semibold mb-2 text-gray-800">
          {params.title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid stroke="#e2e8f0" />
          <XAxis
            dataKey="x"
            name={params.xLabel || "X"}
            label={{
              value: params.xLabel || "X",
              position: "insideBottom",
              offset: -10,
              fontSize: 12,
            }}
            fontSize={12}
          />
          <YAxis
            dataKey="y"
            name={params.yLabel || "Y"}
            label={{
              value: params.yLabel || "Y",
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
            }}
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            content={({ payload }) => {
              if (!payload?.length) return null;
              const d = payload[0]?.payload;
              return (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "8px",
                    fontSize: "12px",
                  }}
                >
                  <div>
                    <b>X:</b> {d?.x}
                  </div>
                  <div>
                    <b>Y:</b> {d?.y}
                  </div>
                  <div>
                    <b>Size:</b> {d?.size}
                  </div>
                  {d?.group && (
                    <div>
                      <b>Group:</b> {d.group}
                    </div>
                  )}
                </div>
              );
            }}
          />
          <Legend />
          {groups.map((g, gi) => (
            <Scatter
              key={g}
              name={g}
              data={data.filter((d) => d.group === g)}
              fill={PALETTE[gi % PALETTE.length]}
              shape={(props: {
                cx?: number;
                cy?: number;
                payload?: { size?: number };
              }) => {
                const { cx = 0, cy = 0, payload } = props;
                const r = 4 + ((payload?.size ?? 10) / maxSize) * 28;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={PALETTE[gi % PALETTE.length]}
                    fillOpacity={0.7}
                    stroke={PALETTE[gi % PALETTE.length]}
                    strokeWidth={1}
                  />
                );
              }}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function ManhattanPlotRenderer({ csv, params }: RendererProps) {
  const { rows } = parseCsv(csv);
  const data = rows
    .map((r) => {
      const chr = r.chromosome ?? r.chr ?? r.CHR ?? "1";
      const pos = Number(r.position ?? r.pos ?? r.POS ?? 0);
      const pval = Number(r.pvalue ?? r.p ?? r.PVALUE ?? r.P ?? 1);
      return { chr, pos, pval, negLogP: pval > 0 ? -Math.log10(pval) : 0 };
    })
    .filter((d) => !Number.isNaN(d.pos) && !Number.isNaN(d.negLogP));
  if (!data.length) return <EmptyChart />;
  const chrList = [...new Set(data.map((d) => d.chr))].sort((a, b) => {
    const na = Number.parseInt(a);
    const nb = Number.parseInt(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });
  const scatterData = data.map((d) => ({
    x: d.pos,
    y: d.negLogP,
    chr: d.chr,
    chrIdx: chrList.indexOf(d.chr),
  }));
  const gwLine = -Math.log10(5e-8);
  const sugLine = -Math.log10(1e-5);
  return (
    <div style={{ background: "white", padding: "16px", borderRadius: "8px" }}>
      {params.title && (
        <div className="text-center font-semibold mb-2 text-gray-800">
          {params.title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 50 }}>
          <CartesianGrid stroke="#e2e8f0" />
          <XAxis
            dataKey="x"
            name={params.xLabel || "Position"}
            label={{
              value: params.xLabel || "Genomic Position",
              position: "insideBottom",
              offset: -10,
              fontSize: 12,
            }}
            fontSize={12}
          />
          <YAxis
            dataKey="y"
            name="-log10(p)"
            label={{
              value: params.yLabel || "-log10(p-value)",
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
            }}
            fontSize={12}
          />
          <ReferenceLine
            y={gwLine}
            stroke="#ef4444"
            strokeDasharray="4 2"
            label={{ value: "GW sig", fill: "#ef4444", fontSize: 10 }}
          />
          <ReferenceLine
            y={sugLine}
            stroke="#f97316"
            strokeDasharray="4 2"
            label={{ value: "Suggestive", fill: "#f97316", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            content={({ payload }) => {
              if (!payload?.length) return null;
              const d = payload[0]?.payload;
              return (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "8px",
                    fontSize: "12px",
                  }}
                >
                  <div>
                    <b>Chr:</b> {d?.chr}
                  </div>
                  <div>
                    <b>Pos:</b> {d?.x?.toLocaleString()}
                  </div>
                  <div>
                    <b>-log10(p):</b> {d?.y?.toFixed(3)}
                  </div>
                </div>
              );
            }}
          />
          {chrList.map((chr, ci) => (
            <Scatter
              key={chr}
              name={`Chr ${chr}`}
              data={scatterData.filter((d) => d.chr === chr)}
              fill={PALETTE[ci % PALETTE.length]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function DotPlotRenderer({ csv, params }: RendererProps) {
  const { rows } = parseCsv(csv);
  if (!rows.length) return <EmptyChart />;
  const genes = [...new Set(rows.map((r) => r.gene ?? r.Gene ?? ""))].filter(
    Boolean,
  );
  const conditions = [
    ...new Set(rows.map((r) => r.condition ?? r.Condition ?? "")),
  ].filter(Boolean);
  const lookup: Record<string, { avg: number; pct: number }> = {};
  for (const r of rows) {
    const g = r.gene ?? r.Gene ?? "";
    const c = r.condition ?? r.Condition ?? "";
    const avg = Number(r.avg_exp ?? r.avgExp ?? r.expression ?? 0);
    const pct = Number(r.pct_exp ?? r.pctExp ?? r.percent ?? 50);
    lookup[`${g}__${c}`] = { avg, pct };
  }
  const allAvg = rows
    .map((r) => Number(r.avg_exp ?? r.avgExp ?? r.expression ?? 0))
    .filter((v) => !Number.isNaN(v));
  const minAvg = Math.min(...allAvg);
  const maxAvg = Math.max(...allAvg);
  const padL = 80;
  const padT = 50;
  const padR = 30;
  const padB = 80;
  const cellW = Math.max(
    50,
    Math.min(80, (600 - padL - padR) / conditions.length),
  );
  const cellH = Math.max(40, Math.min(60, (400 - padT - padB) / genes.length));
  const svgW = padL + conditions.length * cellW + padR;
  const svgH = padT + genes.length * cellH + padB;
  function interpolateColor(t: number) {
    const r = Math.round(220 - t * 170);
    const g = Math.round(235 - t * 130);
    const b = Math.round(255 - t * 80);
    return `rgb(${r},${g},${b})`;
  }
  return (
    <div
      style={{
        background: "white",
        padding: "16px",
        borderRadius: "8px",
        overflowX: "auto",
      }}
    >
      {params.title && (
        <div className="text-center font-semibold mb-2 text-gray-800">
          {params.title}
        </div>
      )}
      <svg width={svgW} height={svgH} role="img" aria-label="chart">
        {conditions.map((cond, ci) => (
          <text
            key={cond}
            x={padL + ci * cellW + cellW / 2}
            y={padT - 10}
            textAnchor="middle"
            fontSize={11}
            fill="#374151"
            transform={`rotate(-30, ${padL + ci * cellW + cellW / 2}, ${padT - 10})`}
          >
            {cond}
          </text>
        ))}
        {genes.map((gene, gi) => (
          <text
            key={gene}
            x={padL - 8}
            y={padT + gi * cellH + cellH / 2 + 4}
            textAnchor="end"
            fontSize={11}
            fill="#374151"
          >
            {gene}
          </text>
        ))}
        {genes.map((gene, gi) =>
          conditions.map((cond, ci) => {
            const d = lookup[`${gene}__${cond}`] ?? { avg: 0, pct: 0 };
            const t =
              maxAvg > minAvg ? (d.avg - minAvg) / (maxAvg - minAvg) : 0.5;
            const maxR = Math.min(cellW, cellH) / 2 - 4;
            const r = (d.pct / 100) * maxR;
            return (
              <g key={`${gene}-${cond}`}>
                <circle
                  cx={padL + ci * cellW + cellW / 2}
                  cy={padT + gi * cellH + cellH / 2}
                  r={Math.max(2, r)}
                  fill={interpolateColor(t)}
                  stroke="#94a3b8"
                  strokeWidth={0.5}
                />
              </g>
            );
          }),
        )}
        <text
          x={padL + (conditions.length * cellW) / 2}
          y={svgH - 10}
          textAnchor="middle"
          fontSize={11}
          fill="#374151"
        >
          {params.xLabel || "Condition"}
        </text>
        <text
          x={-svgH / 2}
          y={15}
          textAnchor="middle"
          fontSize={11}
          fill="#374151"
          transform="rotate(-90)"
        >
          {params.yLabel || "Gene"}
        </text>
        <g transform={`translate(${svgW - padR - 80}, ${padT})`}>
          <text fontSize={10} fill="#374151" y={-5}>
            % Expressed
          </text>
          {[25, 50, 75, 100].map((pct, i) => {
            const r = (pct / 100) * 12;
            return (
              <g key={pct} transform={`translate(${i * 22}, 16)`}>
                <circle
                  r={r}
                  fill="#93c5fd"
                  stroke="#94a3b8"
                  strokeWidth={0.5}
                />
                <text y={20} textAnchor="middle" fontSize={8} fill="#374151">
                  {pct}%
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function VennDiagramRenderer({ csv, params }: RendererProps) {
  const { rows } = parseCsv(csv);
  if (!rows.length) return <EmptyChart />;
  const setRows = rows.filter((r) => !(r.set ?? "").includes(","));
  const interRows = rows.filter((r) => (r.set ?? "").includes(","));
  const sets = setRows.map((r) => ({
    name: r.set ?? "",
    size: Number(r.size ?? 0),
  }));
  if (sets.length < 2) return <EmptyChart />;
  function getIntersection(names: string[]) {
    const key = names.sort().join(",");
    const row = interRows.find((r) => {
      const parts = (r.set ?? "")
        .split(",")
        .map((s: string) => s.trim())
        .sort()
        .join(",");
      return parts === key;
    });
    return row ? Number(row.size ?? 0) : 0;
  }
  const W = 480;
  const H = 360;
  const cx = W / 2;
  const cy = H / 2;
  if (sets.length === 2) {
    const r = 110;
    const ox = 55;
    const [A, B] = sets;
    const ab = getIntersection([A.name, B.name]);
    return (
      <div
        style={{ background: "white", padding: "16px", borderRadius: "8px" }}
      >
        {params.title && (
          <div className="text-center font-semibold mb-2 text-gray-800">
            {params.title}
          </div>
        )}
        <svg width={W} height={H} role="img" aria-label="chart">
          <circle
            cx={cx - ox}
            cy={cy}
            r={r}
            fill={PALETTE[0]}
            fillOpacity={0.35}
            stroke={PALETTE[0]}
            strokeWidth={2}
          />
          <circle
            cx={cx + ox}
            cy={cy}
            r={r}
            fill={PALETTE[1]}
            fillOpacity={0.35}
            stroke={PALETTE[1]}
            strokeWidth={2}
          />
          <text
            x={cx - ox - 40}
            y={cy + 5}
            textAnchor="middle"
            fontSize={14}
            fill="#111"
          >
            {A.size}
          </text>
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fill="#111">
            {ab}
          </text>
          <text
            x={cx + ox + 40}
            y={cy + 5}
            textAnchor="middle"
            fontSize={14}
            fill="#111"
          >
            {B.size}
          </text>
          <text
            x={cx - ox - 40}
            y={cy + 130}
            textAnchor="middle"
            fontSize={13}
            fontWeight="bold"
            fill={PALETTE[0]}
          >
            {A.name}
          </text>
          <text
            x={cx + ox + 40}
            y={cy + 130}
            textAnchor="middle"
            fontSize={13}
            fontWeight="bold"
            fill={PALETTE[1]}
          >
            {B.name}
          </text>
        </svg>
      </div>
    );
  }
  const [A, B, C] = sets;
  const r = 95;
  const dy = 30;
  const posA = { x: cx, y: cy - 60 };
  const posB = { x: cx - 70, y: cy + 50 };
  const posC = { x: cx + 70, y: cy + 50 };
  const ab = getIntersection([A.name, B.name]);
  const ac = getIntersection([A.name, C.name]);
  const bc = getIntersection([B.name, C.name]);
  const abc = getIntersection([A.name, B.name, C.name]);
  return (
    <div style={{ background: "white", padding: "16px", borderRadius: "8px" }}>
      {params.title && (
        <div className="text-center font-semibold mb-2 text-gray-800">
          {params.title}
        </div>
      )}
      <svg width={W} height={H} role="img" aria-label="chart">
        <circle
          cx={posA.x}
          cy={posA.y}
          r={r}
          fill={PALETTE[0]}
          fillOpacity={0.3}
          stroke={PALETTE[0]}
          strokeWidth={2}
        />
        <circle
          cx={posB.x}
          cy={posB.y}
          r={r}
          fill={PALETTE[1]}
          fillOpacity={0.3}
          stroke={PALETTE[1]}
          strokeWidth={2}
        />
        <circle
          cx={posC.x}
          cy={posC.y}
          r={r}
          fill={PALETTE[2]}
          fillOpacity={0.3}
          stroke={PALETTE[2]}
          strokeWidth={2}
        />
        <text
          x={posA.x}
          y={posA.y - r - 8}
          textAnchor="middle"
          fontSize={13}
          fontWeight="bold"
          fill={PALETTE[0]}
        >
          {A.name}
        </text>
        <text
          x={posB.x - r - 8}
          y={posB.y}
          textAnchor="end"
          fontSize={13}
          fontWeight="bold"
          fill={PALETTE[1]}
        >
          {B.name}
        </text>
        <text
          x={posC.x + r + 8}
          y={posC.y}
          textAnchor="start"
          fontSize={13}
          fontWeight="bold"
          fill={PALETTE[2]}
        >
          {C.name}
        </text>
        <text
          x={posA.x}
          y={posA.y - 20}
          textAnchor="middle"
          fontSize={12}
          fill="#111"
        >
          {A.size}
        </text>
        <text
          x={posB.x - 25}
          y={posB.y + 25}
          textAnchor="middle"
          fontSize={12}
          fill="#111"
        >
          {B.size}
        </text>
        <text
          x={posC.x + 25}
          y={posC.y + 25}
          textAnchor="middle"
          fontSize={12}
          fill="#111"
        >
          {C.size}
        </text>
        <text
          x={(posA.x + posB.x) / 2 - 5}
          y={(posA.y + posB.y) / 2 + dy}
          textAnchor="middle"
          fontSize={11}
          fill="#333"
        >
          {ab}
        </text>
        <text
          x={(posA.x + posC.x) / 2 + 5}
          y={(posA.y + posC.y) / 2 + dy}
          textAnchor="middle"
          fontSize={11}
          fill="#333"
        >
          {ac}
        </text>
        <text
          x={(posB.x + posC.x) / 2}
          y={(posB.y + posC.y) / 2}
          textAnchor="middle"
          fontSize={11}
          fill="#333"
        >
          {bc}
        </text>
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fontSize={12}
          fontWeight="bold"
          fill="#111"
        >
          {abc}
        </text>
      </svg>
    </div>
  );
}

function UpsetPlotRenderer({ csv, params }: RendererProps) {
  const { rows } = parseCsv(csv);
  if (!rows.length) return <EmptyChart />;
  const setRows = rows.filter((r) => !(r.set ?? "").includes(","));
  const setNames = setRows.map((r) => r.set ?? "").filter(Boolean);
  if (!setNames.length) return <EmptyChart />;
  const intersections = rows
    .map((r) => ({
      sets: (r.set ?? "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      size: Number(r.size ?? 0),
    }))
    .filter((d) => d.size > 0)
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
  const maxSize = Math.max(...intersections.map((d) => d.size));
  const setBarMax = Math.max(...setRows.map((r) => Number(r.size ?? 0)));
  const dotR = 10;
  const colW = 55;
  const rowH = 35;
  const topBarH = 150;
  const leftW = 100;
  const padTop = 20;
  const svgW = leftW + intersections.length * colW + 40;
  const svgH = padTop + topBarH + setNames.length * rowH + 40;
  return (
    <div
      style={{
        background: "white",
        padding: "16px",
        borderRadius: "8px",
        overflowX: "auto",
      }}
    >
      {params.title && (
        <div className="text-center font-semibold mb-2 text-gray-800">
          {params.title}
        </div>
      )}
      <svg width={svgW} height={svgH} role="img" aria-label="chart">
        {intersections.map((inter, ci) => {
          const barH =
            maxSize > 0 ? (inter.size / maxSize) * (topBarH - 30) : 0;
          const bx = leftW + ci * colW + colW / 2;
          return (
            <g key={`inter-${inter.sets.join("-")}`}>
              <rect
                x={bx - 12}
                y={padTop + topBarH - barH - 20}
                width={24}
                height={barH}
                fill={PALETTE[0]}
                rx={2}
              />
              <text
                x={bx}
                y={padTop + topBarH - barH - 24}
                textAnchor="middle"
                fontSize={10}
                fill="#374151"
              >
                {inter.size}
              </text>
            </g>
          );
        })}
        {setNames.map((sn, si) => {
          const barW =
            setBarMax > 0
              ? (Number(setRows.find((r) => r.set === sn)?.size ?? 0) /
                  setBarMax) *
                (leftW - 20)
              : 0;
          const sy = padTop + topBarH + si * rowH + rowH / 2;
          return (
            <g key={sn}>
              <text
                x={leftW - barW - 6}
                y={sy + 4}
                textAnchor="end"
                fontSize={10}
                fill="#374151"
              >
                {sn}
              </text>
              <rect
                x={leftW - barW - 4}
                y={sy - 7}
                width={barW}
                height={14}
                fill={PALETTE[si % PALETTE.length]}
                fillOpacity={0.5}
                rx={2}
              />
              {intersections.map((inter, ci) => {
                const active = inter.sets.includes(sn);
                const bx = leftW + ci * colW + colW / 2;
                return (
                  <circle
                    key={`upsetdot-${sn}-${inter.sets.join("-")}`}
                    cx={bx}
                    cy={sy}
                    r={dotR}
                    fill={active ? PALETTE[si % PALETTE.length] : "#e2e8f0"}
                  />
                );
              })}
              {intersections.map((inter, ci) => {
                if (inter.sets.length < 2) return null;
                const activeSets = inter.sets.filter((s) =>
                  setNames.includes(s),
                );
                if (activeSets.length < 2) return null;
                const firstIdx = setNames.indexOf(activeSets[0]);
                const lastIdx = setNames.indexOf(
                  activeSets[activeSets.length - 1],
                );
                if (firstIdx === si || lastIdx === si) return null;
                if (si > firstIdx && si < lastIdx && activeSets.includes(sn)) {
                  const bx = leftW + ci * colW + colW / 2;
                  return (
                    <line
                      key={`upsetline-${sn}-${inter.sets.join("-")}`}
                      x1={bx}
                      y1={padTop + topBarH + firstIdx * rowH + rowH / 2}
                      x2={bx}
                      y2={padTop + topBarH + lastIdx * rowH + rowH / 2}
                      stroke={PALETTE[0]}
                      strokeWidth={3}
                    />
                  );
                }
                return null;
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function PathwayMapRenderer({ csv, params }: RendererProps) {
  const { rows } = parseCsv(csv);
  if (!rows.length) return <EmptyChart />;
  const edges = rows
    .map((r) => ({
      source: r.source ?? r.from ?? "",
      target: r.target ?? r.to ?? "",
      weight: Number(r.weight ?? 1),
    }))
    .filter((e) => e.source && e.target);
  const nodeNames = [
    ...new Set([...edges.map((e) => e.source), ...edges.map((e) => e.target)]),
  ];
  if (!nodeNames.length) return <EmptyChart />;
  const degree: Record<string, number> = {};
  for (const e of edges) {
    degree[e.source] = (degree[e.source] ?? 0) + 1;
    degree[e.target] = (degree[e.target] ?? 0) + 1;
  }
  const W = 500;
  const H = 400;
  const cx = W / 2;
  const cy = H / 2;
  const r = 150;
  const nodePos: Record<string, { x: number; y: number }> = {};
  nodeNames.forEach((name, i) => {
    const angle = (2 * Math.PI * i) / nodeNames.length - Math.PI / 2;
    nodePos[name] = {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
  const color = params.color ?? PALETTE[0];
  return (
    <div style={{ background: "white", padding: "16px", borderRadius: "8px" }}>
      {params.title && (
        <div className="text-center font-semibold mb-2 text-gray-800">
          {params.title}
        </div>
      )}
      <svg width={W} height={H} role="img" aria-label="chart">
        {edges.map((e) => {
          const s = nodePos[e.source];
          const t = nodePos[e.target];
          if (!s || !t) return null;
          return (
            <line
              key={`pathline-${e.source}-${e.target}`}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke="#94a3b8"
              strokeWidth={Math.max(1, e.weight)}
              strokeOpacity={0.6}
            />
          );
        })}
        {nodeNames.map((name) => {
          const p = nodePos[name];
          const d = degree[name] ?? 1;
          const nr = 12 + d * 3;
          return (
            <g key={name}>
              <circle
                cx={p.x}
                cy={p.y}
                r={nr}
                fill={color}
                fillOpacity={0.8}
                stroke={color}
                strokeWidth={2}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize={10}
                fill="white"
                fontWeight="bold"
              >
                {name.length > 6 ? `${name.slice(0, 6)}…` : name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CircosPlotRenderer({ csv, params }: RendererProps) {
  const { rows } = parseCsv(csv);
  if (!rows.length) return <EmptyChart />;
  const chords = rows
    .map((r) => ({
      from: r.from ?? r.source ?? "",
      to: r.to ?? r.target ?? "",
      value: Number(r.value ?? r.weight ?? 1),
    }))
    .filter((c) => c.from && c.to && !Number.isNaN(c.value));
  if (!chords.length) return <EmptyChart />;
  const nodes = [
    ...new Set([...chords.map((c) => c.from), ...chords.map((c) => c.to)]),
  ];
  const totals: Record<string, number> = {};
  for (const c of chords) {
    totals[c.from] = (totals[c.from] ?? 0) + c.value;
    totals[c.to] = (totals[c.to] ?? 0) + c.value;
  }
  const total = Object.values(totals).reduce((a, b) => a + b, 0) / 2;
  const W = 460;
  const H = 460;
  const cx = W / 2;
  const cy = H / 2;
  const outerR = 180;
  const innerR = 160;
  const gap = 0.04;
  const arcAngles: Record<string, { start: number; end: number }> = {};
  let angle = 0;
  for (const node of nodes) {
    const span =
      ((totals[node] ?? 0) / (total * 2)) * (2 * Math.PI - nodes.length * gap);
    arcAngles[node] = { start: angle, end: angle + span };
    angle += span + gap;
  }
  function polarX(r: number, a: number) {
    return cx + r * Math.cos(a - Math.PI / 2);
  }
  function polarY(r: number, a: number) {
    return cy + r * Math.sin(a - Math.PI / 2);
  }
  function arcPath(r: number, start: number, end: number, inner: number) {
    const x1 = polarX(r, start);
    const y1 = polarY(r, start);
    const x2 = polarX(r, end);
    const y2 = polarY(r, end);
    const xi1 = polarX(inner, end);
    const yi1 = polarY(inner, end);
    const xi2 = polarX(inner, start);
    const yi2 = polarY(inner, start);
    const large = end - start > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} L${xi1},${yi1} A${inner},${inner},0,${large},0,${xi2},${yi2} Z`;
  }
  const fromAngles: Record<string, number> = {};
  for (const node of nodes) fromAngles[node] = arcAngles[node]?.start ?? 0;
  return (
    <div style={{ background: "white", padding: "16px", borderRadius: "8px" }}>
      {params.title && (
        <div className="text-center font-semibold mb-2 text-gray-800">
          {params.title}
        </div>
      )}
      <svg width={W} height={H} role="img" aria-label="chart">
        {nodes.map((node, ni) => {
          const { start, end } = arcAngles[node];
          const midA = (start + end) / 2;
          const labelR = outerR + 18;
          return (
            <g key={node}>
              <path
                d={arcPath(outerR, start, end, innerR)}
                fill={PALETTE[ni % PALETTE.length]}
              />
              <text
                x={polarX(labelR, midA)}
                y={polarY(labelR, midA) + 4}
                textAnchor="middle"
                fontSize={11}
                fill="#374151"
              >
                {node}
              </text>
            </g>
          );
        })}
        {chords.map((chord) => {
          const fromArc = arcAngles[chord.from];
          const toArc = arcAngles[chord.to];
          if (!fromArc || !toArc) return null;
          const fromSpan =
            (chord.value / (totals[chord.from] ?? 1)) *
            (fromArc.end - fromArc.start);
          const toSpan =
            (chord.value / (totals[chord.to] ?? 1)) * (toArc.end - toArc.start);
          const fa = fromAngles[chord.from] ?? fromArc.start;
          const ta = fromAngles[chord.to] ?? toArc.start;
          fromAngles[chord.from] = fa + fromSpan;
          fromAngles[chord.to] = ta + toSpan;
          const x1 = polarX(innerR, fa);
          const y1 = polarY(innerR, fa);
          const x2 = polarX(innerR, fa + fromSpan);
          const y2 = polarY(innerR, fa + fromSpan);
          const x3 = polarX(innerR, ta);
          const y3 = polarY(innerR, ta);
          const x4 = polarX(innerR, ta + toSpan);
          const y4 = polarY(innerR, ta + toSpan);
          const path = `M${x1},${y1} Q${cx},${cy} ${x3},${y3} A${innerR},${innerR},0,0,1,${x4},${y4} Q${cx},${cy} ${x2},${y2} A${innerR},${innerR},0,0,0,${x1},${y1} Z`;
          const fromNode = nodes.indexOf(chord.from);
          return (
            <path
              key={`chord-${chord.from}-${chord.to}`}
              d={path}
              fill={PALETTE[fromNode % PALETTE.length]}
              fillOpacity={0.45}
              stroke="white"
              strokeWidth={0.5}
            />
          );
        })}
      </svg>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
      No data to display
    </div>
  );
}

export function ComingSoonRenderer({ toolName }: { toolName: string }) {
  return (
    <div className="h-72 flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <div className="text-5xl">🚧</div>
      <div className="font-semibold text-lg">{toolName}</div>
      <div className="text-sm">This plugin is coming soon.</div>
    </div>
  );
}

export function getRenderer(toolId: string): React.FC<RendererProps> {
  const map: Record<string, React.FC<RendererProps>> = {
    "bar-chart": BarChartRenderer,
    "line-chart": LineChartRenderer,
    "scatter-plot": ScatterChartRenderer,
    "box-plot": BoxPlotRenderer,
    heatmap: HeatmapRenderer,
    "volcano-plot": VolcanoPlotRenderer,
    "pie-chart": PieChartRenderer,
    histogram: HistogramRenderer,
    "violin-plot": ViolinPlotRenderer,
    "survival-curve": SurvivalCurveRenderer,
    "pca-plot": PcaPlotRenderer,
    "correlation-matrix": CorrelationMatrixRenderer,
    "roc-curve": RocCurveRenderer,
    "waterfall-plot": WaterfallPlotRenderer,
    "forest-plot": ForestPlotRenderer,
    "bubble-chart": BubbleChartRenderer,
    "manhattan-plot": ManhattanPlotRenderer,
    dotplot: DotPlotRenderer,
    "venn-diagram": VennDiagramRenderer,
    "upset-plot": UpsetPlotRenderer,
    "pathway-map": PathwayMapRenderer,
    "circos-plot": CircosPlotRenderer,
  };
  return map[toolId] || (() => <ComingSoonRenderer toolName={toolId} />);
}
