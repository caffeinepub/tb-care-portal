# TB Questionnaire Portal — Hiplot-style Graph Plotting

## Current State
- ToolPage has a 3-panel layout (input / parameters / output) similar to Hiplot
- 14 of 22 chart renderers are implemented using Recharts
- 8 chart types return `ComingSoonRenderer`: venn-diagram, manhattan-plot, upset-plot, bubble-chart, pathway-map, circos-plot, dotplot
- Parameters panel only has: title, x-label, y-label, color scheme
- Download only supports SVG (no PNG)
- Chart quality is functional but not publication-ready

## Requested Changes (Diff)

### Add
- `BubbleChartRenderer` — scatter with a 3rd column encoding bubble size
- `ManhattanPlotRenderer` — genomic association plot: chromosome on X, -log10(pvalue) on Y, color-coded by chromosome, significance threshold line
- `DotPlotRenderer` — gene expression dot plot: genes on Y, conditions on X, dot size = pct expressed, dot color = avg expression
- `VennDiagramRenderer` — SVG-based 2–3 set Venn diagram from set size columns
- `UpsetPlotRenderer` — intersection bar chart showing set membership combinations
- `PathwayMapRenderer` — node-link force-directed network using SVG
- `CircosPlotRenderer` — simplified chord/arc diagram using SVG
- PNG download button alongside SVG (uses html2canvas or canvas toBlob on chart container)
- Chart-specific parameter controls: each chart type shows relevant extra params (point size, alpha/opacity, log scale toggle, significance threshold, show legend toggle)

### Modify
- `getRenderer()` in chartRenderers.tsx — map all 7 new renderers instead of ComingSoonRenderer
- `tools.ts` — mark all 22 tools as `implemented: true`
- `ToolPage.tsx` — add PNG download, add chart-specific parameter sub-sections per toolId, improve chart container with white background
- Improve existing renderers for better visual quality: add proper grid lines, better tooltips, larger font, publication-style color palettes

### Remove
- Nothing removed

## Implementation Plan
1. Add all 7 new chart renderers to `chartRenderers.tsx`
2. Update `getRenderer()` map to include all new renderers
3. Update `tools.ts` to set `implemented: true` for all 22 tools and add proper `exampleCsv` for new chart types
4. Add PNG download to `ToolPage.tsx` using canvas API
5. Add per-chart extra parameter sections in ToolPage parameters panel
6. Validate with build
