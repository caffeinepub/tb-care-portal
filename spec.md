# Hiplot-Inspired Biomedical Data Visualization Platform

## Current State
The project currently has the TB Care Portal app. The user wants to replace it entirely with a Hiplot-style biomedical data visualization platform.

## Requested Changes (Diff)

### Add
- Home/landing page with hero section, featured visualization categories, and stats
- Plugin gallery page with search, category filter, and grid of visualization cards
- Individual plugin/tool page with: CSV data input area, parameters panel (chart config), and live chart output
- Visualization types: Bar Chart, Line Chart, Scatter Plot, Heatmap, Box Plot, Violin Plot, Volcano Plot, Pie/Donut Chart, Histogram
- Backend: store plugin usage stats, save user visualization sessions
- Navigation: top navbar with logo, categories, search, and dark mode toggle
- Footer with links

### Modify
- Replace all existing TB Care Portal frontend with the new visualization platform
- Replace backend with one that stores visualization sessions and plugin usage counts

### Remove
- All TB Care Portal pages and components

## Implementation Plan
1. Generate Motoko backend with: visualization sessions (id, pluginName, inputData, params, timestamp), plugin usage counters, getPluginStats
2. Build frontend:
   - App shell: navbar with logo (Hiplot), nav links (Home, Tools, Gallery, About), search bar, dark mode
   - HomePage: hero banner, featured tool categories (Basic, Advanced, Clinical, Omics), popular tools grid
   - GalleryPage: searchable, filterable grid of all visualization plugins
   - ToolPage (dynamic route): left panel = data input textarea + example data button; middle = params form; right = live recharts visualization
   - Support plugins: bar, line, scatter, heatmap, boxplot, volcano, pie, histogram
   - Each plugin has example CSV data, a recharts-based renderer, and configurable options
