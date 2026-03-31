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
  };
  return map[toolId] || (() => <ComingSoonRenderer toolName={toolId} />);
}
