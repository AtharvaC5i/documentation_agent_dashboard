# 📊 Documentation Agent Metrics Dashboard

A professional, high-performance metrics dashboard for monitoring, auditing, and validating documentation generation pipelines across three dedicated AI agents: **Technical Document Agent**, **PPT Agent**, and **BRD Agent**.

---

## 🎯 Quick Start

To run the dashboard locally on your system:

```bash
# 1. Navigate to the project directory
cd "c:\Programming and Coding\documentation_agent_dashboard"

# 2. Install package dependencies
npm install

# 3. Start the Vite development server
npm run dev

# 4. Open http://localhost:5173 in your browser
```

---

## ✨ Core Features

- 🖥️ **Multi-Agent Coverage** - Full operational dashboards for Technical Docs, PPT, and BRD Agents.
- 📈 **Aggregate Overview** - A consolidated control center showcasing global metrics, cross-agent comparisons, run volumes, and active warnings.
- 🔍 **Dual-Mode Visualizations** - Switch seamlessly between **High-Level** (Quality Assessment, Coverage, Completeness) and **Detailed** (Execution Profiles, Ingest, Resources, Assembly, and LLM Economics) views.
- 🎨 **Sleek Light Theme** - Clean white background with high-contrast typography, tailored borders, and custom HSL color-accent boundaries.
- ⚙️ **Robust Data Parser** - Multi-layer normalization engine in the frontend to process incoming pipeline schemas and catch partial telemetry.
- 📊 **Recharts Visualizations** - Responsive bar charts, pie charts, radar plots, progress indicators, and stacked duration flows.

---

## 📊 Dashboard Overview & Agent Views

The dashboard is structured into four main operational views, navigable via the header tabs:

```
[Overview] ➔ [Technical Docs] ➔ [PPT Agent] ➔ [BRD Agent]
```

### 1. Cross-Agent Overview
Consolidates real-time statistics across all run folders:
*   **Global Health metrics**: Active agents, failed counts, review queues, total errors, and LLM retries.
*   **Comparison charts**: Side-by-side performance indicators (Success Rate, Average Duration, Average Cost, Quality Scores, Token usage, and Build Health).
*   **Status distributions**: Multi-color pie charts highlighting successful, failed, and pending runs.
*   **Recent Runs table**: Quick-search access to recent runs, showing agent ID, run status, completion timestamps, and quick links.

### 2. Technical Document Agent Dashboard
Monitors source code ingestion, chunk embedding, section-by-section generation, and Word assembly:
*   Ingestion rates, repository characteristics, and programming language distributions.
*   Granular class, function, and API documentation coverage tracking.
*   Validity checks on generated code examples.
*   CPU and Memory profiles during long-running builds.

### 3. PPT Agent Dashboard
Tracks presentation deck generation, XML schema validity, slide completeness, and design compliance:
*   Timing breakdowns across summarizing, slide drafting, and diagramming stages.
*   XML validation audits to check slide structure and relationship integrity.
*   Citation mapping to ensure generated slides align with source business requirements.
*   Overall design quality scores (Content, Diagrams, Architecture alignment, and Output validity).

### 4. BRD Agent Dashboard
Audits business requirements extraction, consistency checking, conflict resolution, and requirement stability:
*   SMART requirement score evaluation (Specific, Measurable, Achievable, Relevant, Time-bound attributes).
*   Completeness gaps with automated audit alerts flagging missing required clauses.
*   Conflict resolution tracking detailing detected vs. resolved items, categorized by severity (High, Medium, Low impact).
*   Document stability logs checking rework frequency and regeneration iterations.

---

## 📁 Project Structure

The project conforms to a modular React + Vite structure:

```
src/
├── components/
│   ├── common/
│   │   ├── Card.jsx                 # Generic layout card wrapper
│   │   └── PipelineFlow.jsx         # Pipeline step execution visualizer
│   ├── dashboard/
│   │   ├── DashboardPage.jsx        # Root dashboard layout and selector logic
│   │   └── RunDetailView.jsx        # Detailed run header controller
│   ├── layouts/
│   │   └── Header.jsx               # Navigation bar, logo, and active agent status
│   ├── BRDDashboard.jsx             # BRD Agent monitoring and audit view
│   ├── Charts.jsx                   # High-performance Recharts plotting wrappers
│   ├── Dashboard.jsx                # Main workspace orchestrator & tab controller
│   ├── MetricCard.jsx               # Stat cards, progress metrics, and view mode toggles
│   ├── OverviewDashboard.jsx        # Cross-agent aggregate metrics and charts
│   ├── PPTDashboard.jsx             # PPT Agent deck generation monitoring view
│   └── TechnicalDocDashboard.jsx    # Technical doc code analysis monitoring view
├── config/
│   └── dashboardTabs.js             # Route config mapping keys to labels and icons
├── data/
│   └── sampleRuns.js                # Built-in fallback database runs for offline testing
├── services/
│   └── dataService.js               # Normalization, aggregation, and API fetch engine
├── App.css                          # Global layouts and shell alignments
├── App.jsx                          # Main routing wrapper
├── index.css                        # Design token mappings, HSL vars, and Tailwind CSS imports
└── main.jsx                         # React 19 entry mounting point
```

---

## 📈 Health & Monitoring Status Details

Here is the complete catalog of all health and monitoring indicators displayed by the dashboard:

### 1. Unified Dashboard Overview Metrics
*   **Total Operations**: Running tally of all recorded agent runs.
*   **Pipeline Outcomes**: Counts of Success, Failure, and Pending reviews.
*   **Operational Success Rate**: Percentage of runs that compiled without terminal errors.
*   **Run Averages**: Mean calculation of run durations, LLM API costs, token volume, and section rework cycles.
*   **Global Anomalies**: Total count of execution errors and recovery retries across all monitored pipelines.
*   **Validation Health**: Average build health score across all assemblies (DOCX assembly, PPTX file validation, and BRD output checks).

---

### 2. Technical Document Agent Monitoring KPIs

The Technical Document dashboard provides detailed health status checks across six key categories:

| Category | Monitored Metric | Unit / Scale | Description |
| :--- | :--- | :--- | :--- |
| **Ingestion Pipeline** | Ingestion Status | `Pass / Fail` | Confirms if files were successfully located and parsed. |
| | Total Files Found | `Count` | Number of files scanned in the target repository. |
| | Files After Filter | `Count` | Number of source files matching ingestion criteria. |
| | Filter Rate | `Percentage` | Percentage of files retained for processing. |
| | Processing Time | `Seconds` | Duration of the discovery and ingestion phases. |
| **Input Profile** | Lines of Code (LOC) | `Count` | Total size of target codebase in LOC. |
| | Repository Size | `KB` | Storage weight of files matching the ingestion filter. |
| | Primary Language | `String` | Auto-detected dominant language in the workspace. |
| | Language Distribution | `Percentage` | Pie breakdown of languages used across files. |
| **Context & Retrieval** | Total Chunks | `Count` | Number of segments created for text embedding. |
| | Vector Store Size | `MB` | Size of the local vector database index. |
| | Embedding Time | `Seconds` | Duration to generate vector representations. |
| | Indexing Strategy | `String` | Model used for indexing (e.g., RAPTOR hierarchical index). |
| | Summary Nodes | `Count` | Count of summary nodes created. |
| | Context Selection | `String` | Selection method used (e.g., Semantic Cosine Similarity). |
| | Sections Selected | `Count` | Sections chosen for drafting out of total available. |
| **Model Generation** | Sections Succeeded | `Count` | Successfully compiled doc sections. |
| | Section Success Rate | `Percentage` | Percentage of attempted sections built successfully. |
| | LLM API Retries | `Count` | Recovery retries triggered by rate limits or failures. |
| | Rework/Review Cycles | `Count` | Iterations completed through automated checking. |
| | Quality Score per Section| `0.0 - 1.0` | Individual quality ratings from content grading loops. |
| **Documentation Coverage**| Codebase Coverage | `Percentage` | Ratio of documented codebase entities. |
| | Entity Breakdown | `Count` | Documented vs. Discovered APIs, Functions, and Classes. |
| | Example Validity | `Percentage` | Percentage of generated code examples passing syntax audits. |
| **Final Assembly** | Assembly Status | `Pass / Fail` | Overall doc build and validation flag. |
| | Output File Specifications| `Specs` | Sizing (KB), Estimated Pages, and Total Word Count. |
| | Build Time | `Seconds` | Assembly writing duration for `output.docx`. |
| **System Resources** | Memory Consumption | `MB` | Average and peak memory footprint of the runner. |
| | CPU Utilization | `Percentage` | Average and peak CPU usage of the pipeline host. |

---

### 3. PPT Agent Monitoring KPIs

The PPT Dashboard tracks slide styling, content alignment, and PowerPoint file generation integrity:

| Category | Monitored Metric | Unit / Scale | Description |
| :--- | :--- | :--- | :--- |
| **Phase Durations** | Total Deck Runtime | `Seconds` | Complete generation and writing time. |
| | Summarization Phase | `Seconds` | Duration to compress input doc text. |
| | Slide Generation Phase | `Seconds` | Core LLM time to generate slide bullet layouts. |
| | Diagram Layout Phase | `Seconds` | Time to map components and connections. |
| | PPTX Assembly Phase | `Seconds` | Writing and compiling slide XML layers. |
| **Slide Generation** | Slide Success Rate | `Percentage` | Ratio of slides compiled successfully. |
| | Slides Completed | `Count` | Successful vs. Attempted slides (e.g., 10 / 10). |
| | Slide Retry Counts | `Count` | Retries requested on layout compilation failures. |
| **Diagram Correctness**| Diagram Attempt Status | `Boolean` | Confirms if diagramming was triggered. |
| | Diagram Success Status | `Boolean` | Completion flag of graphic engines. |
| | Component Coverage | `Percentage` | Ratio of source architecture entities correctly represented. |
| | Connection Coverage | `Percentage` | Verification rate of relationships between elements. |
| | Correctness Score | `0.0 - 1.0` | Evaluated accuracy score for generated vector flowcharts. |
| **Deck Quality** | Overall Score | `0.0 - 1.0` | Mean score across all quality dimensions. |
| | Content Quality | `0.0 - 1.0` | Semantic check on slide text and readability. |
| | Diagram Quality | `0.0 - 1.0` | Grade of layout alignment and graphical layout. |
| | Architecture Alignment | `0.0 - 1.0` | Score comparing slides against base source guidelines. |
| | Output Validity | `0.0 - 1.0` | Layout checking score (e.g., text overlap, clipping). |
| **File Validation** | File Creation Flag | `Pass / Fail` | Confirms if the PPTX was written to disk. |
| | File Size | `MB` | Weight of the generated presentation file. |
| | XML Conformity | `Pass / Fail` | Schema verification of generated PPTX XML files. |
| | Open Without Repair | `Pass / Fail` | File opens natively in PowerPoint without recovery prompts. |
| | Asset Verification | `Pass / Fail` | Confirms all media, icons, and slides are present. |
| | PPTX Health Score | `0.0 - 1.0` | Aggregated file health score across all validator checks. |
| **Architecture Justify**| Decisions Identified | `Count` | Architecture choices detected in the source. |
| | Decisions Justified | `Count` | Decisions explaining *why* they were chosen. |
| | BRD Citations | `Count` | Number of citations linking decisions to requirements. |
| | Constraint References | `Count` | Citations referencing system boundaries. |
| | Justification Score | `0.0 - 1.0` | Evaluated strength of justifications (target is 1.0). |

---

### 4. BRD Agent Monitoring KPIs

The Business Requirements Document dashboard tracks requirements quality, conflict rates, and stability audits:

| Category | Monitored Metric | Unit / Scale | Description |
| :--- | :--- | :--- | :--- |
| **LLM Economics** | Stage Token Breakdown | `Count` | Token footprint for **Extraction**, **Conflict**, and **Generation** stages. |
| | Total API Token Volume| `Count` | Prompt tokens vs. Completion tokens used. |
| | Total Execution Cost | `USD` | Financial cost based on model API pricing. |
| | Active Cost Model | `String` | Base model used (e.g., `databricks-claude-sonnet-4-6`). |
| **Timing & Operations** | Pipeline Duration | `Seconds` | Run duration broken down by Extraction, Generation, and Assembly. |
| | Total LLM Calls | `Count` | Count of prompt cycles executed. |
| | Run Outcomes | `Pass / Fail` | Terminal execution outcome flag. |
| **SMART Requirements** | SMART Quality Score | `0.0 - 1.0` | Average score across SMART requirements criteria. |
| | SMART Metrics | `Percentages`| Ratio of requirements meeting Specific, Measurable, Achievable, Relevant, and Time-bound tests. |
| | Quality Grade Counts | `Count` | Count of requirements graded High, Medium, or Low Quality. |
| **Section Completeness**| Overall Completeness | `Percentage` | Percentage of mandatory sections and items populated. |
| | Section Audit Status | `Count` | Attempts vs. Successes on sections (e.g., 3 / 3). |
| | Item Level Completeness| `Ratio` | Required vs. Present items per section (e.g., 4 / 5 in Executive Summary). |
| | Gap Audit Alerts | `Alerts` | Real-time warnings detailing the count of missing items in each section. |
| **Conflict Analysis** | Detected Conflicts | `Count` | Discovered inconsistencies in source requirements. |
| | Resolved Conflicts | `Count` | Conflicts resolved by the agent's logic. |
| | Resolution Rate | `Percentage` | Percentage of conflicts resolved (`Resolved / Detected`). |
| | Severity Breakdown | `Count` | Discovered conflicts categorized into High, Medium, or Low Impact. |
| | Accuracy Feedback | `String` | Accuracy feedback logs from verification runs. |
| **Stability & Rework** | First-Pass Stability | `Boolean` | Confirms if document section layout required zero regenerations. |
| | Rework Logs | `Count` | Log of section-by-section regeneration iterations. |
| | Review Cycles | `Count` | Completed loops of feedback checks. |
| | Section Rework Frequency| `Count` | List of regenerations per section. |
| **Document Output** | Output File Creation | `Boolean` | Confirms output DOCX was written successfully. |
| | File Specifications | `Specs` | File size (bytes), Word count, and included sections. |

---

## 🔌 Data Integration & Directory Setup

By default, the dashboard is running on pre-loaded **sample runs** configured inside `src/data/sampleRuns.js` and normalized through `src/services/dataService.js`. 

To feed real production run telemetry from your pipeline execution engines, configure your backend server to target files under:

```
D://documentation_agent_metrics_json/
```

### Folder Architecture
Organize JSON metrics under the following folders:

```
D://documentation_agent_metrics_json/
├── technical-agent/
│   ├── run_03131a86.json
│   └── [latest runs].json
├── ppt-agent/
│   ├── run_a3c04bc7.json
│   └── [latest runs].json
└── brd-agent/
    ├── run_brd-001.json
    └── [latest runs].json
```

### Integration Workflow
1.  **Expose API routes**: Implement a simple Node.js/Express backend that reads the folders above.
2.  **Add endpoints**:
    *   `/api/runs?agent=[agentId]`: Returns file lists for the chosen agent folder sorted by timestamp.
    *   `/api/data?agent=[agentId]&file=[filename]`: Returns the JSON contents of a specific run file.
3.  **Update Data Client**:
    Update the fetch mechanism in [dataService.js](file:///c:/Programming%20and%20Coding/documentation_agent_dashboard/src/services/dataService.js) to query your backend API routes:
    ```javascript
    export async function loadMetrics(agentType, filename) {
      const res = await fetch(`/api/data?agent=${agentType}&file=${filename}`);
      return res.json();
    }
    ```

---

## 🛠️ Customizing the Dashboard

### Colors (CSS Design System)
The dashboard uses CSS Variables in [index.css](file:///c:/Programming%20and%20Coding/documentation_agent_dashboard/src/index.css) to set theme colors. To customize the primary accent hues, modify:

```css
:root {
  --color-primary: #3b82f6;        /* Tech Doc blue */
  --color-orange: #f97316;         /* PPT orange */
  --color-purple: #8b5cf6;         /* BRD purple */
  --color-success: #10b981;        /* Success green */
  --color-error: #ef4444;          /* Failure red */
}
```

### Grid Modifiers
To customize the column layout grid, adjust Tailwind classes in the dashboard components:
```jsx
/* Change layout from 4-column metric view to 3-column view */
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
```

### Adding New Metrics
1.  Add the new property to your JSON schema.
2.  Add a parser block in the respective `normalize[Agent]Metrics` helper in [dataService.js](file:///c:/Programming%20and%20Coding/documentation_agent_dashboard/src/services/dataService.js).
3.  Mount the metric in the JSX layout using the `<MetricCard />` or `<DetailRow />` components:
    ```jsx
    <MetricCard
      label="My Custom KPI"
      value={data.my_custom_kpi}
      icon={Sparkles}
      unit="%"
    />
    ```

---

## 🐛 Troubleshooting

| Common Issue | Cause | Recommended Solution |
| :--- | :--- | :--- |
| **Blank Screen / Charts Missing** | JavaScript console exceptions or empty JSON data array. | Verify console logs. Ensure that all sample JSON files contain valid, parsable numbers. |
| **Tab Disabled / No Data** | Sample data not loaded or mock client erroring. | Verify that [dataService.js](file:///c:/Programming%20and%20Coding/documentation_agent_dashboard/src/services/dataService.js) fallback methods are running properly. |
| **Tailwind HSL styles broken** | Vite build styling cache mismatch. | Clean build artifact: run `npm run build --clean` and restart the Vite dev server. |
| **Recharts layout scaling issues** | Flex container lacking definite width/height properties. | Wrap charts in a `<ResponsiveContainer width="100%" height={240}>` component. |

---

## 📞 Support & Information
*   **Quick Start Guide**: See [QUICKSTART.md](QUICKSTART.md)
*   **Design Tokens & Blueprints**: See [DESIGN_BLUEPRINT.md](DESIGN_BLUEPRINT.md)
*   **Complete File Inventory**: See [FILE_INVENTORY.md](FILE_INVENTORY.md)
*   **Implementation Guide**: See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

---

**Dashboard Version**: 1.1.0  
**Status**: Production Ready ✅  
**Documentation Last Updated**: July 6, 2026
