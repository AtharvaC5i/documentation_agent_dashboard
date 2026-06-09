# 🚀 Metrics Dashboard - Quick Start Guide

## Installation & Setup (30 seconds)

```bash
# Navigate to project folder
cd d:\documentation_agent_metrics_dashboard

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📊 What You'll See

### Dashboard Features

1. **Agent Tabs** (Top Navigation)
   - Technical Document Agent ← Current view
   - PPT Agent
   - BRD Agent (coming soon)

2. **Status Overview** (First row)
   - Run status with color-coded icon
   - Duration & estimated cost
   - Execution timestamp

3. **Key Metrics** (Second row - 4 cards)
   - Quick overview of most important metrics
   - Large bold numbers for easy scanning

4. **Charts & Graphs** (Middle sections)
   - Token distribution by section
   - Quality scores visualization
   - Resource usage trends
   - Coverage percentages

5. **Detailed Breakdowns** (Bottom sections)
   - Processing pipeline metrics
   - System resources
   - Code coverage details
   - Error tracking

---

## 🎨 Dashboard Design

### Color Scheme (Light Theme)

- **White background** - Clean, professional
- **Gray borders** - Subtle separation
- **Blue accents** - Primary information
- **Red accents** - Warnings/PPT agent
- **Green accents** - Success/BRD agent

### Visual Elements

- **Cards**: White boxes with gray borders and rounded corners
- **Progress bars**: Color-coded (green=good, yellow=warning, red=danger)
- **Charts**: Clean bars, lines, and pie charts from Recharts
- **Icons**: From Lucide React (file, zap, check, etc.)
- **Typography**: Clear hierarchy with font weights and sizes

---

## 🔄 Switching Between Agents

Click any agent tab at the top:

```
[Technical Document] [PPT Agent] [BRD Agent]
     ↓ active
   (metrics update)
```

Each agent shows its own metrics dashboard automatically.

---

## 📈 Understanding the Metrics

### Technical Document Agent Shows:

- LLM token usage ($cost)
- Section generation success rate
- Document quality scores
- System resource usage
- Code coverage percentage
- Processing pipeline timing

### PPT Agent Shows:

- Slide generation success (10/10)
- Diagram metrics (8 components)
- PPTX file validation
- Architecture justification
- Quality scores (all metrics)
- Token breakdown by phase

### BRD Agent Shows:

- "Coming Soon" placeholder
- Ready to display BRD metrics when available

---

## 📁 File Structure

```
src/
├── components/
│   ├── Dashboard.jsx              ← Main component
│   ├── Header.jsx                 ← Navigation
│   ├── MetricCard.jsx             ← Metric displays
│   ├── Charts.jsx                 ← Chart wrappers
│   ├── TechnicalDocDashboard.jsx  ← Tech doc view
│   ├── PPTDashboard.jsx           ← PPT view
│   └── BRDDashboard.jsx           ← BRD placeholder
├── services/
│   └── dataService.js             ← Data & config
├── App.jsx                        ← App root
├── index.css                      ← Tailwind
├── App.css                        ← (Tailwind only)
└── main.jsx                       ← Entry point
```

---

## 🛠️ Common Tasks

### View All Metrics

All metrics are automatically displayed. Scroll down to see more details.

### Switch Metrics View

Click any agent tab to see different metrics.

### Check System Resources

Scroll to the chart showing Memory (MB) and CPU (%) usage.

### See Quality Scores

Look for the radar chart showing quality dimensions.

### Find Error Details

If an error occurred, it appears in a red box at the bottom.

---

## 🎯 Key Metrics at a Glance

### Technical Document Agent

- **Status**: Success ✓
- **Duration**: 262.51 seconds
- **Cost**: $0.01735
- **Tokens**: 14,574
- **Success Rate**: 100% (2/2 sections)
- **Quality Score**: 0.95/1.0

### PPT Agent

- **Status**: Success ✓
- **Duration**: 75.05 seconds
- **Cost**: $0.0124
- **Tokens**: 8,108
- **Slides**: 10/10 successful
- **Diagram**: 8/8 components (100%)
- **Quality**: 1.0/1.0 (Perfect!)

---

## 🔌 Connecting to Real Data

Currently using sample data. To connect to real JSON files:

1. Set up a backend API
2. Update `dataService.js` to call `/api/metrics/:agentType`
3. Backend reads from `D://documentation_agent_metrics_json/`

See `IMPLEMENTATION_GUIDE.md` for detailed steps.

---

## 📞 Troubleshooting

| Issue              | Solution                                   |
| ------------------ | ------------------------------------------ |
| Blank page         | Check console (F12), run `npm install`     |
| No charts          | Wait for page to load, refresh browser     |
| Slow loading       | Normal first load, charts render after     |
| Agent tab disabled | BRD agent coming soon, try Tech Doc or PPT |
| Data outdated      | Refresh browser (F5) or restart dev server |

---

## ✨ Features

✅ Light theme only (no dark mode)
✅ No vibe-coded mechanics
✅ Tailwind CSS styling
✅ Responsive design (mobile-friendly)
✅ Multiple chart types
✅ Color-coded status indicators
✅ Easy-to-read typography
✅ All metrics visible at a glance
✅ Professional appearance
✅ Fast performance

---

## 🚀 Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

Output goes to `dist/` folder.

---

**Dashboard Status**: ✅ **READY TO USE**

All components working, sample data loaded, light theme applied, Tailwind styling complete.
