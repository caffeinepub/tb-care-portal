export interface Tool {
  id: string;
  name: string;
  category: "basic" | "statistical" | "clinical" | "omics" | "multi-omics";
  description: string;
  usageCount: number;
  tags: string[];
  icon: string;
  color: string;
  exampleCsv: string;
  implemented: boolean;
}

export const TOOLS: Tool[] = [
  {
    id: "bar-chart",
    name: "Bar Chart",
    category: "basic",
    description: "Compare categorical data with vertical or horizontal bars.",
    usageCount: 48200,
    tags: ["bar", "comparison", "categorical"],
    icon: "📊",
    color: "bg-blue-500",
    exampleCsv:
      "category,value\nGene A,45\nGene B,32\nGene C,67\nGene D,28\nGene E,55\nGene F,41",
    implemented: true,
  },
  {
    id: "line-chart",
    name: "Line Chart",
    category: "basic",
    description: "Visualize trends and changes over continuous data.",
    usageCount: 36700,
    tags: ["line", "trend", "time-series"],
    icon: "📈",
    color: "bg-teal-500",
    exampleCsv:
      "timepoint,expression\n0h,12.3\n6h,18.7\n12h,24.1\n18h,31.5\n24h,28.9\n30h,22.4\n36h,15.8\n42h,10.2",
    implemented: true,
  },
  {
    id: "scatter-plot",
    name: "Scatter Plot",
    category: "basic",
    description: "Explore correlations between two continuous variables.",
    usageCount: 29400,
    tags: ["scatter", "correlation", "bivariate"],
    icon: "🔵",
    color: "bg-indigo-500",
    exampleCsv:
      "x,y,label\n2.1,3.5,S1\n3.8,5.2,S2\n1.5,2.1,S3\n5.2,6.8,S4\n4.1,4.9,S5\n6.3,7.2,S6\n2.8,3.1,S7\n7.0,8.5,S8\n3.3,4.4,S9\n5.8,6.1,S10",
    implemented: true,
  },
  {
    id: "box-plot",
    name: "Box Plot",
    category: "statistical",
    description: "Display data distribution with quartiles and outliers.",
    usageCount: 22100,
    tags: ["box", "distribution", "quartile"],
    icon: "📦",
    color: "bg-purple-500",
    exampleCsv:
      "group,min,q1,median,q3,max\nControl,10,20,28,38,55\nTreatment A,15,25,35,48,62\nTreatment B,8,18,24,33,48\nTreatment C,20,30,42,52,70",
    implemented: true,
  },
  {
    id: "heatmap",
    name: "Heatmap",
    category: "omics",
    description: "Visualize matrix data with color intensity encoding.",
    usageCount: 31800,
    tags: ["heatmap", "matrix", "expression"],
    icon: "🌡️",
    color: "bg-orange-500",
    exampleCsv:
      "gene,Sample1,Sample2,Sample3,Sample4,Sample5\nBRCA1,2.3,4.1,1.2,5.8,3.2\nTP53,6.1,2.8,7.3,1.5,4.9\nEGFR,1.8,5.2,3.6,6.1,2.4\nMYC,4.5,1.3,5.9,2.7,7.1\nPTEN,3.2,6.8,2.1,4.3,1.9\nKRAS,7.2,3.4,4.8,2.6,5.5",
    implemented: true,
  },
  {
    id: "volcano-plot",
    name: "Volcano Plot",
    category: "omics",
    description:
      "Identify differentially expressed genes with fold-change and significance.",
    usageCount: 27600,
    tags: ["volcano", "DEG", "fold-change", "pvalue"],
    icon: "🌋",
    color: "bg-red-500",
    exampleCsv:
      "gene,log2FC,pvalue\nBRCA1,3.2,0.0001\nTP53,-2.8,0.0005\nEGFR,1.5,0.05\nMYC,4.1,0.00001\nPTEN,-1.2,0.12\nKRAS,2.9,0.002\nSRC,-3.5,0.00008\nAKT1,0.8,0.45\nMDM2,2.1,0.03\nRB1,-1.8,0.08\nCDKN2A,-4.2,0.000001\nVEGFA,3.8,0.0003",
    implemented: true,
  },
  {
    id: "pie-chart",
    name: "Pie Chart",
    category: "basic",
    description: "Show proportional composition of categorical data.",
    usageCount: 19500,
    tags: ["pie", "proportion", "composition"],
    icon: "🥧",
    color: "bg-yellow-500",
    exampleCsv:
      "category,value\nAdenocarcinoma,42\nSquamous Cell,28\nSmall Cell,15\nLarge Cell,10\nOther,5",
    implemented: true,
  },
  {
    id: "histogram",
    name: "Histogram",
    category: "statistical",
    description: "Display frequency distribution of continuous data.",
    usageCount: 17800,
    tags: ["histogram", "frequency", "distribution"],
    icon: "📉",
    color: "bg-green-500",
    exampleCsv:
      "value\n15.2\n18.5\n22.1\n19.8\n25.3\n17.6\n21.4\n23.7\n16.9\n20.2\n24.8\n18.1\n22.9\n19.5\n26.3\n14.7\n23.1\n20.8\n17.3\n21.7",
    implemented: true,
  },
  {
    id: "violin-plot",
    name: "Violin Plot",
    category: "statistical",
    description:
      "Combine box plot and kernel density for rich distribution view.",
    usageCount: 12300,
    tags: ["violin", "distribution", "density"],
    icon: "🎻",
    color: "bg-pink-500",
    exampleCsv:
      "group,value\nControl,12.1\nControl,14.5\nControl,11.8\nControl,16.2\nControl,13.4\nTreatment,18.7\nTreatment,22.3\nTreatment,19.1\nTreatment,25.6\nTreatment,20.4",
    implemented: true,
  },
  {
    id: "survival-curve",
    name: "Survival Curve",
    category: "clinical",
    description: "Kaplan-Meier survival analysis with event-time data.",
    usageCount: 15200,
    tags: ["survival", "kaplan-meier", "clinical"],
    icon: "💊",
    color: "bg-cyan-500",
    exampleCsv:
      "time,survival_A,survival_B\n0,1.00,1.00\n6,0.92,0.88\n12,0.85,0.78\n18,0.75,0.65\n24,0.68,0.54\n30,0.60,0.44\n36,0.52,0.36\n42,0.45,0.30\n48,0.38,0.24\n54,0.32,0.20",
    implemented: true,
  },
  {
    id: "pca-plot",
    name: "PCA Plot",
    category: "omics",
    description: "Principal component analysis for dimensionality reduction.",
    usageCount: 24100,
    tags: ["PCA", "dimensionality", "omics"],
    icon: "🔮",
    color: "bg-violet-500",
    exampleCsv:
      "sample,PC1,PC2,group\nS1,-2.3,1.5,TypeA\nS2,-1.8,2.1,TypeA\nS3,-2.9,0.8,TypeA\nS4,-3.1,1.2,TypeA\nS5,1.2,-1.8,TypeB\nS6,2.4,-2.2,TypeB\nS7,1.8,-1.5,TypeB\nS8,0.5,3.1,TypeC\nS9,1.2,2.8,TypeC\nS10,0.9,3.5,TypeC",
    implemented: true,
  },
  {
    id: "correlation-matrix",
    name: "Correlation Matrix",
    category: "statistical",
    description: "Visualize pairwise correlations between multiple variables.",
    usageCount: 18900,
    tags: ["correlation", "matrix", "statistics"],
    icon: "🔗",
    color: "bg-slate-500",
    exampleCsv:
      "variable,GeneA,GeneB,GeneC,GeneD,GeneE\nS1,2.3,4.1,1.9,3.5,2.8\nS2,4.5,3.8,4.2,3.1,4.6\nS3,1.2,2.9,1.5,2.7,1.8\nS4,5.1,4.7,5.3,4.2,5.0\nS5,3.3,3.5,3.1,3.8,3.2\nS6,6.2,5.8,6.0,5.5,6.4\nS7,2.8,3.2,2.5,3.0,2.9\nS8,4.9,4.5,5.1,4.0,4.8",
    implemented: true,
  },
  {
    id: "forest-plot",
    name: "Forest Plot",
    category: "clinical",
    description:
      "Meta-analysis visualization showing effect sizes and confidence intervals.",
    usageCount: 9800,
    tags: ["forest", "meta-analysis", "CI"],
    icon: "🌲",
    color: "bg-emerald-600",
    exampleCsv:
      "study,effect,lower,upper\nSmith 2018,0.72,0.55,0.94\nJohnson 2019,0.85,0.68,1.06\nWilliams 2020,0.61,0.45,0.82\nBrown 2021,0.78,0.62,0.98\nDavis 2022,0.69,0.52,0.91\nMiller 2023,0.74,0.59,0.93",
    implemented: true,
  },
  {
    id: "venn-diagram",
    name: "Venn Diagram",
    category: "omics",
    description: "Show overlaps between multiple gene/protein sets.",
    usageCount: 14300,
    tags: ["venn", "overlap", "sets"],
    icon: "⭕",
    color: "bg-rose-500",
    exampleCsv: "",
    implemented: false,
  },
  {
    id: "manhattan-plot",
    name: "Manhattan Plot",
    category: "omics",
    description: "Genome-wide association study (GWAS) visualization.",
    usageCount: 11700,
    tags: ["manhattan", "GWAS", "genomics"],
    icon: "🏙️",
    color: "bg-sky-600",
    exampleCsv: "",
    implemented: false,
  },
  {
    id: "upset-plot",
    name: "UpSet Plot",
    category: "multi-omics",
    description: "Visualize complex set intersections for multi-omics data.",
    usageCount: 8200,
    tags: ["upset", "sets", "intersection"],
    icon: "📐",
    color: "bg-amber-600",
    exampleCsv: "",
    implemented: false,
  },
  {
    id: "waterfall-plot",
    name: "Waterfall Plot",
    category: "clinical",
    description: "Show individual patient responses in oncology trials.",
    usageCount: 7600,
    tags: ["waterfall", "oncology", "response"],
    icon: "💧",
    color: "bg-blue-600",
    exampleCsv:
      "patient,response\nPT-001,-65\nPT-002,-52\nPT-003,-48\nPT-004,-41\nPT-005,-38\nPT-006,-31\nPT-007,-27\nPT-008,-22\nPT-009,-18\nPT-010,-12\nPT-011,-8\nPT-012,-3\nPT-013,5\nPT-014,12\nPT-015,18\nPT-016,24\nPT-017,31\nPT-018,38\nPT-019,45\nPT-020,58",
    implemented: true,
  },
  {
    id: "bubble-chart",
    name: "Bubble Chart",
    category: "basic",
    description:
      "Three-dimensional data visualization using bubble size encoding.",
    usageCount: 11200,
    tags: ["bubble", "3D", "scatter"],
    icon: "🫧",
    color: "bg-teal-600",
    exampleCsv: "",
    implemented: false,
  },
  {
    id: "pathway-map",
    name: "Pathway Map",
    category: "multi-omics",
    description:
      "Visualize biological pathway enrichment and gene interactions.",
    usageCount: 19800,
    tags: ["pathway", "enrichment", "KEGG"],
    icon: "🗺️",
    color: "bg-lime-600",
    exampleCsv: "",
    implemented: false,
  },
  {
    id: "roc-curve",
    name: "ROC Curve",
    category: "clinical",
    description:
      "Evaluate diagnostic test performance with receiver operating characteristic.",
    usageCount: 16400,
    tags: ["ROC", "AUC", "diagnostic"],
    icon: "📡",
    color: "bg-indigo-600",
    exampleCsv:
      "fpr,tpr,label\n0.00,0.00,Model A\n0.05,0.42,Model A\n0.10,0.63,Model A\n0.15,0.72,Model A\n0.20,0.80,Model A\n0.30,0.88,Model A\n0.50,0.94,Model A\n0.75,0.97,Model A\n1.00,1.00,Model A\n0.00,0.00,Model B\n0.05,0.28,Model B\n0.10,0.48,Model B\n0.20,0.65,Model B\n0.35,0.78,Model B\n0.50,0.86,Model B\n0.75,0.93,Model B\n1.00,1.00,Model B",
    implemented: true,
  },
  {
    id: "circos-plot",
    name: "Circos Plot",
    category: "multi-omics",
    description:
      "Circular genome visualization for structural variants and rearrangements.",
    usageCount: 6900,
    tags: ["circos", "genome", "structural"],
    icon: "🔄",
    color: "bg-purple-600",
    exampleCsv: "",
    implemented: false,
  },
  {
    id: "dotplot",
    name: "Dot Plot",
    category: "omics",
    description:
      "Visualize gene expression across cell types with size/color encoding.",
    usageCount: 13500,
    tags: ["dot", "scRNA", "expression"],
    icon: "🔴",
    color: "bg-red-600",
    exampleCsv: "",
    implemented: false,
  },
];

export const CATEGORIES = [
  { id: "all", label: "All", count: TOOLS.length },
  {
    id: "basic",
    label: "Basic",
    count: TOOLS.filter((t) => t.category === "basic").length,
  },
  {
    id: "statistical",
    label: "Statistical",
    count: TOOLS.filter((t) => t.category === "statistical").length,
  },
  {
    id: "clinical",
    label: "Clinical",
    count: TOOLS.filter((t) => t.category === "clinical").length,
  },
  {
    id: "omics",
    label: "Omics",
    count: TOOLS.filter((t) => t.category === "omics").length,
  },
  {
    id: "multi-omics",
    label: "Multi-omics",
    count: TOOLS.filter((t) => t.category === "multi-omics").length,
  },
];

export const HOME_CATEGORIES = [
  {
    id: "basic",
    label: "Basic Charts",
    icon: "📊",
    count: TOOLS.filter((t) => t.category === "basic").length,
    description: "Bar, line, scatter, pie",
  },
  {
    id: "statistical",
    label: "Advanced Stats",
    icon: "📐",
    count: TOOLS.filter((t) => t.category === "statistical").length,
    description: "Box, violin, histogram",
  },
  {
    id: "clinical",
    label: "Clinical Tools",
    icon: "🏥",
    count: TOOLS.filter((t) => t.category === "clinical").length,
    description: "Survival, ROC, forest",
  },
  {
    id: "omics",
    label: "Omics Analysis",
    icon: "🧬",
    count: TOOLS.filter((t) => t.category === "omics").length,
    description: "Heatmap, volcano, PCA",
  },
];
