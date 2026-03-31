export interface Tool {
  id: string;
  name: string;
  category: "screening" | "assessment" | "clinical" | "research" | "advanced";
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
    name: "KAP Knowledge Assessment",
    category: "screening",
    description:
      "Assess TB knowledge levels across patient groups with structured scoring.",
    usageCount: 48200,
    tags: ["KAP", "knowledge", "screening", "questionnaire"],
    icon: "📊",
    color: "bg-blue-500",
    exampleCsv:
      "category,value\nGene A,45\nGene B,32\nGene C,67\nGene D,28\nGene E,55\nGene F,41",
    implemented: true,
  },
  {
    id: "line-chart",
    name: "Treatment Adherence Tracker",
    category: "screening",
    description: "Track patient adherence to TB treatment protocols over time.",
    usageCount: 36700,
    tags: ["adherence", "treatment", "monitoring", "DOT"],
    icon: "📈",
    color: "bg-teal-500",
    exampleCsv:
      "timepoint,expression\n0h,12.3\n6h,18.7\n12h,24.1\n18h,31.5\n24h,28.9\n30h,22.4\n36h,15.8\n42h,10.2",
    implemented: true,
  },
  {
    id: "scatter-plot",
    name: "Symptom Screening Form",
    category: "screening",
    description:
      "Screen patients for TB symptoms including cough, fever, and weight loss.",
    usageCount: 29400,
    tags: ["symptoms", "screening", "cough", "fever"],
    icon: "🔵",
    color: "bg-indigo-500",
    exampleCsv:
      "x,y,label\n2.1,3.5,S1\n3.8,5.2,S2\n1.5,2.1,S3\n5.2,6.8,S4\n4.1,4.9,S5\n6.3,7.2,S6\n2.8,3.1,S7\n7.0,8.5,S8\n3.3,4.4,S9\n5.8,6.1,S10",
    implemented: true,
  },
  {
    id: "box-plot",
    name: "Drug Resistance Questionnaire",
    category: "assessment",
    description:
      "Evaluate drug resistance patterns and treatment history distributions.",
    usageCount: 22100,
    tags: ["drug-resistance", "MDR", "assessment", "treatment"],
    icon: "📦",
    color: "bg-purple-500",
    exampleCsv:
      "group,min,q1,median,q3,max\nControl,10,20,28,38,55\nTreatment A,15,25,35,48,62\nTreatment B,8,18,24,33,48\nTreatment C,20,30,42,52,70",
    implemented: true,
  },
  {
    id: "heatmap",
    name: "Contact Tracing Survey",
    category: "research",
    description:
      "Map contact exposure patterns with intensity-coded heatmap visualization.",
    usageCount: 31800,
    tags: ["contact-tracing", "exposure", "heatmap", "survey"],
    icon: "🌡️",
    color: "bg-orange-500",
    exampleCsv:
      "gene,Sample1,Sample2,Sample3,Sample4,Sample5\nBRCA1,2.3,4.1,1.2,5.8,3.2\nTP53,6.1,2.8,7.3,1.5,4.9\nEGFR,1.8,5.2,3.6,6.1,2.4\nMYC,4.5,1.3,5.9,2.7,7.1\nPTEN,3.2,6.8,2.1,4.3,1.9\nKRAS,7.2,3.4,4.8,2.6,5.5",
    implemented: true,
  },
  {
    id: "volcano-plot",
    name: "Risk Factor Assessment",
    category: "research",
    description:
      "Identify significant TB risk factors with fold-change and statistical significance.",
    usageCount: 27600,
    tags: ["risk-factors", "significance", "assessment", "research"],
    icon: "🌋",
    color: "bg-red-500",
    exampleCsv:
      "gene,log2FC,pvalue\nBRCA1,3.2,0.0001\nTP53,-2.8,0.0005\nEGFR,1.5,0.05\nMYC,4.1,0.00001\nPTEN,-1.2,0.12\nKRAS,2.9,0.002\nSRC,-3.5,0.00008\nAKT1,0.8,0.45\nMDM2,2.1,0.03\nRB1,-1.8,0.08\nCDKN2A,-4.2,0.000001\nVEGFA,3.8,0.0003",
    implemented: true,
  },
  {
    id: "pie-chart",
    name: "Patient Demographics Survey",
    category: "screening",
    description:
      "Visualize proportional breakdown of patient demographics and TB types.",
    usageCount: 19500,
    tags: ["demographics", "patient", "proportion", "survey"],
    icon: "🥧",
    color: "bg-yellow-500",
    exampleCsv:
      "category,value\nAdenocarcinoma,42\nSquamous Cell,28\nSmall Cell,15\nLarge Cell,10\nOther,5",
    implemented: true,
  },
  {
    id: "histogram",
    name: "Side Effects Monitoring",
    category: "assessment",
    description:
      "Monitor and assess frequency distributions of TB drug side effects.",
    usageCount: 17800,
    tags: ["side-effects", "monitoring", "frequency", "drugs"],
    icon: "📉",
    color: "bg-green-500",
    exampleCsv:
      "value\n15.2\n18.5\n22.1\n19.8\n25.3\n17.6\n21.4\n23.7\n16.9\n20.2\n24.8\n18.1\n22.9\n19.5\n26.3\n14.7\n23.1\n20.8\n17.3\n21.7",
    implemented: true,
  },
  {
    id: "violin-plot",
    name: "Outcome Assessment",
    category: "assessment",
    description:
      "Compare treatment outcome distributions between patient cohorts.",
    usageCount: 12300,
    tags: ["outcome", "comparison", "cohort", "assessment"],
    icon: "🎻",
    color: "bg-pink-500",
    exampleCsv:
      "group,value\nControl,12.1\nControl,14.5\nControl,11.8\nControl,16.2\nControl,13.4\nTreatment,18.7\nTreatment,22.3\nTreatment,19.1\nTreatment,25.6\nTreatment,20.4",
    implemented: true,
  },
  {
    id: "survival-curve",
    name: "TB Treatment Outcome",
    category: "clinical",
    description:
      "Kaplan-Meier analysis of TB treatment success and survival outcomes.",
    usageCount: 15200,
    tags: ["survival", "treatment-outcome", "kaplan-meier", "clinical"],
    icon: "💊",
    color: "bg-cyan-500",
    exampleCsv:
      "time,survival_A,survival_B\n0,1.00,1.00\n6,0.92,0.88\n12,0.85,0.78\n18,0.75,0.65\n24,0.68,0.54\n30,0.60,0.44\n36,0.52,0.36\n42,0.45,0.30\n48,0.38,0.24\n54,0.32,0.20",
    implemented: true,
  },
  {
    id: "pca-plot",
    name: "Community Awareness Survey",
    category: "research",
    description:
      "Analyze community TB awareness patterns with dimensionality reduction.",
    usageCount: 24100,
    tags: ["community", "awareness", "PCA", "survey"],
    icon: "🔮",
    color: "bg-violet-500",
    exampleCsv:
      "sample,PC1,PC2,group\nS1,-2.3,1.5,TypeA\nS2,-1.8,2.1,TypeA\nS3,-2.9,0.8,TypeA\nS4,-3.1,1.2,TypeA\nS5,1.2,-1.8,TypeB\nS6,2.4,-2.2,TypeB\nS7,1.8,-1.5,TypeB\nS8,0.5,3.1,TypeC\nS9,1.2,2.8,TypeC\nS10,0.9,3.5,TypeC",
    implemented: true,
  },
  {
    id: "correlation-matrix",
    name: "Co-morbidity Assessment",
    category: "assessment",
    description:
      "Visualize pairwise correlations between TB co-morbidities and risk variables.",
    usageCount: 18900,
    tags: ["co-morbidity", "correlation", "assessment", "risk"],
    icon: "🔗",
    color: "bg-slate-500",
    exampleCsv:
      "variable,GeneA,GeneB,GeneC,GeneD,GeneE\nS1,2.3,4.1,1.9,3.5,2.8\nS2,4.5,3.8,4.2,3.1,4.6\nS3,1.2,2.9,1.5,2.7,1.8\nS4,5.1,4.7,5.3,4.2,5.0\nS5,3.3,3.5,3.1,3.8,3.2\nS6,6.2,5.8,6.0,5.5,6.4\nS7,2.8,3.2,2.5,3.0,2.9\nS8,4.9,4.5,5.1,4.0,4.8",
    implemented: true,
  },
  {
    id: "forest-plot",
    name: "Meta-Analysis Questionnaire",
    category: "clinical",
    description:
      "Meta-analysis visualization of TB intervention effect sizes and confidence intervals.",
    usageCount: 9800,
    tags: ["meta-analysis", "effect-size", "CI", "research"],
    icon: "🌲",
    color: "bg-emerald-600",
    exampleCsv:
      "study,effect,lower,upper\nSmith 2018,0.72,0.55,0.94\nJohnson 2019,0.85,0.68,1.06\nWilliams 2020,0.61,0.45,0.82\nBrown 2021,0.78,0.62,0.98\nDavis 2022,0.69,0.52,0.91\nMiller 2023,0.74,0.59,0.93",
    implemented: true,
  },
  {
    id: "venn-diagram",
    name: "Multi-Drug Resistance Screen",
    category: "research",
    description:
      "Show overlaps between MDR-TB, XDR-TB, and treatment-resistant patient sets.",
    usageCount: 14300,
    tags: ["MDR", "XDR", "resistance", "screening"],
    icon: "⭕",
    color: "bg-rose-500",
    exampleCsv: "set,size\nA,100\nB,80\nC,60\nA,B,30\nA,C,20\nB,C,25\nA,B,C,10",
    implemented: true,
  },
  {
    id: "manhattan-plot",
    name: "Genome Association Survey",
    category: "research",
    description:
      "Genome-wide association study for TB susceptibility gene identification.",
    usageCount: 11700,
    tags: ["GWAS", "genomics", "susceptibility", "research"],
    icon: "🏙️",
    color: "bg-sky-600",
    exampleCsv:
      "chromosome,position,pvalue\n1,100000,0.05\n1,200000,0.001\n1,300000,0.0000001\n2,150000,0.02\n2,250000,0.000001\n3,100000,0.8\n3,200000,0.00000001",
    implemented: true,
  },
  {
    id: "upset-plot",
    name: "Multi-omics Questionnaire",
    category: "advanced",
    description:
      "Visualize complex intersections across multi-omics TB datasets.",
    usageCount: 8200,
    tags: ["multi-omics", "intersection", "advanced", "research"],
    icon: "📐",
    color: "bg-amber-600",
    exampleCsv: "set,size\nA,100\nB,80\nC,60\nA,B,30\nA,C,20\nB,C,25\nA,B,C,10",
    implemented: true,
  },
  {
    id: "waterfall-plot",
    name: "Patient Response Tracker",
    category: "clinical",
    description: "Track individual patient responses to TB treatment regimens.",
    usageCount: 7600,
    tags: ["patient-response", "treatment", "monitoring", "clinical"],
    icon: "💧",
    color: "bg-blue-600",
    exampleCsv:
      "patient,response\nPT-001,-65\nPT-002,-52\nPT-003,-48\nPT-004,-41\nPT-005,-38\nPT-006,-31\nPT-007,-27\nPT-008,-22\nPT-009,-18\nPT-010,-12\nPT-011,-8\nPT-012,-3\nPT-013,5\nPT-014,12\nPT-015,18\nPT-016,24\nPT-017,31\nPT-018,38\nPT-019,45\nPT-020,58",
    implemented: true,
  },
  {
    id: "bubble-chart",
    name: "Comparative Study Form",
    category: "screening",
    description:
      "Three-dimensional comparison of TB study variables across patient groups.",
    usageCount: 11200,
    tags: ["comparative", "study", "groups", "screening"],
    icon: "🫧",
    color: "bg-teal-600",
    exampleCsv:
      "x,y,size,group\n10,20,15,A\n25,35,30,B\n15,50,20,A\n40,10,45,B\n30,45,10,A",
    implemented: true,
  },
  {
    id: "pathway-map",
    name: "Pathway Analysis Survey",
    category: "advanced",
    description:
      "Visualize TB biological pathway enrichment and gene interaction networks.",
    usageCount: 19800,
    tags: ["pathway", "enrichment", "KEGG", "genomics"],
    icon: "🗺️",
    color: "bg-lime-600",
    exampleCsv:
      "source,target,weight\nNode1,Node2,1\nNode1,Node3,2\nNode2,Node4,1\nNode3,Node4,3\nNode4,Node5,1\nNode2,Node5,2",
    implemented: true,
  },
  {
    id: "roc-curve",
    name: "Diagnostic Accuracy Form",
    category: "clinical",
    description:
      "Evaluate TB diagnostic test performance with receiver operating characteristic analysis.",
    usageCount: 16400,
    tags: ["ROC", "AUC", "diagnostic", "accuracy"],
    icon: "📡",
    color: "bg-indigo-600",
    exampleCsv:
      "fpr,tpr,label\n0.00,0.00,Model A\n0.05,0.42,Model A\n0.10,0.63,Model A\n0.15,0.72,Model A\n0.20,0.80,Model A\n0.30,0.88,Model A\n0.50,0.94,Model A\n0.75,0.97,Model A\n1.00,1.00,Model A\n0.00,0.00,Model B\n0.05,0.28,Model B\n0.10,0.48,Model B\n0.20,0.65,Model B\n0.35,0.78,Model B\n0.50,0.86,Model B\n0.75,0.93,Model B\n1.00,1.00,Model B",
    implemented: true,
  },
  {
    id: "circos-plot",
    name: "Genomic Structure Survey",
    category: "advanced",
    description:
      "Circular genome visualization for TB genomic structural variants and rearrangements.",
    usageCount: 6900,
    tags: ["circos", "genome", "structural", "advanced"],
    icon: "🔄",
    color: "bg-purple-600",
    exampleCsv: "from,to,value\nA,B,10\nA,C,5\nB,C,8\nB,D,3\nC,D,7\nD,A,4",
    implemented: true,
  },
  {
    id: "dotplot",
    name: "Gene Expression Survey",
    category: "research",
    description:
      "Visualize TB gene expression across cell types with size and color encoding.",
    usageCount: 13500,
    tags: ["gene-expression", "scRNA", "cell-types", "research"],
    icon: "🔴",
    color: "bg-red-600",
    exampleCsv:
      "gene,condition,avg_exp,pct_exp\nGENE1,Control,0.5,20\nGENE1,Treatment,2.1,75\nGENE2,Control,1.2,45\nGENE2,Treatment,3.4,90\nGENE3,Control,0.1,5\nGENE3,Treatment,1.8,60",
    implemented: true,
  },
];

export const CATEGORIES = [
  { id: "all", label: "All", count: TOOLS.length },
  {
    id: "screening",
    label: "Screening",
    count: TOOLS.filter((t) => t.category === "screening").length,
  },
  {
    id: "assessment",
    label: "Assessment",
    count: TOOLS.filter((t) => t.category === "assessment").length,
  },
  {
    id: "clinical",
    label: "Clinical",
    count: TOOLS.filter((t) => t.category === "clinical").length,
  },
  {
    id: "research",
    label: "Research",
    count: TOOLS.filter((t) => t.category === "research").length,
  },
  {
    id: "advanced",
    label: "Advanced",
    count: TOOLS.filter((t) => t.category === "advanced").length,
  },
];

export const HOME_CATEGORIES = [
  {
    id: "screening",
    label: "Screening Tools",
    icon: "📊",
    count: TOOLS.filter((t) => t.category === "screening").length,
    description: "KAP, symptom, contact tracing",
  },
  {
    id: "assessment",
    label: "Assessment Tools",
    icon: "📐",
    count: TOOLS.filter((t) => t.category === "assessment").length,
    description: "Drug resistance, adherence, risk",
  },
  {
    id: "clinical",
    label: "Clinical Tools",
    icon: "🏥",
    count: TOOLS.filter((t) => t.category === "clinical").length,
    description: "Treatment, outcome, diagnostic",
  },
  {
    id: "research",
    label: "Research Tools",
    icon: "🧬",
    count: TOOLS.filter((t) => t.category === "research").length,
    description: "Community, genome, pathway",
  },
];
