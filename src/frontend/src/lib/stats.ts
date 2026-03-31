export function computeStats(values: number[]): {
  n: number;
  mean: number;
  median: number;
  stddev: number;
  min: number;
  max: number;
  range: number;
} {
  const n = values.length;
  if (n === 0)
    return { n: 0, mean: 0, median: 0, stddev: 0, min: 0, max: 0, range: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const stddev = Math.sqrt(variance);
  const min = sorted[0];
  const max = sorted[n - 1];
  return { n, mean, median, stddev, min, max, range: max - min };
}

export function pearsonCorrelation(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n === 0) return 0;
  const meanA = a.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const meanB = b.slice(0, n).reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let dA = 0;
  let dB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    dA += da * da;
    dB += db * db;
  }
  const denom = Math.sqrt(dA * dB);
  return denom === 0 ? 0 : num / denom;
}

export function parseCsvFull(csv: string): {
  headers: string[];
  rows: Record<string, string>[];
  numericColumns: string[];
} {
  const lines = csv
    .trim()
    .split("\n")
    .filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [], numericColumns: [] };

  // Auto-detect delimiter
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = lines[0].split(delimiter).map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const vals = line.split(delimiter).map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? ""]));
  });

  const numericColumns = headers.filter((h) => {
    const values = rows.map((r) => r[h]).filter((v) => v !== "");
    const numericCount = values.filter((v) => !Number.isNaN(Number(v))).length;
    return numericCount / values.length > 0.8;
  });

  return { headers, rows, numericColumns };
}
