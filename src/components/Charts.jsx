import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const CHART_COLORS = {
  primary: "var(--color-primary)",
  orange: "var(--color-orange)",
  blue: "var(--color-blue)",
  purple: "var(--color-purple)",
  gold: "var(--color-gold)",
  success: "var(--color-success)",
  error: "var(--color-error)",
  neutral: "var(--color-surface-offset)",
};

const AXIS_STYLE = {
  fontSize: 11,
  fill: "var(--color-text-muted)",
  fontFamily: "var(--font-body)",
};

const GRID_STYLE = {
  stroke: "var(--color-divider)",
  strokeDasharray: "3 3",
};

const AXIS_LABEL_STYLE = {
  fill: "var(--color-text-muted)",
  fontSize: 12,
  fontFamily: "var(--font-body)",
  fontWeight: 500,
};

function formatName(label = "") {
  return String(label).replace(/_/g, " ");
}

function formatCompactNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return value;
  return value.toLocaleString();
}

function truncateLabel(value, max = 16) {
  const str = String(value ?? "");
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

function hasMeaningfulValues(values = []) {
  return values.some((value) => Number(value ?? 0) > 0);
}

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface-glass)",
        backdropFilter: "var(--glass-blur)",
        WebkitBackdropFilter: "var(--glass-blur)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-3) var(--space-4)",
        boxShadow: "var(--glass-shadow), var(--shadow-md)",
        fontFamily: "var(--font-body)",
        minWidth: 156,
      }}
    >
      {label && (
        <p
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "var(--space-2)",
            lineHeight: 1.4,
          }}
        >
          {label}
        </p>
      )}

      {payload.map((entry, i) => (
        <div
          key={`${entry.name}-${i}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "var(--text-sm)",
            marginBottom: i === payload.length - 1 ? 0 : "6px",
            lineHeight: 1.45,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "9999px",
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />

          <span style={{ color: "var(--color-text-muted)" }}>{entry.name}</span>

          <span
            style={{
              fontWeight: 600,
              color: "var(--color-text)",
              fontVariantNumeric: "tabular-nums lining-nums",
              marginLeft: "auto",
            }}
          >
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChartPanel({ title, subtitle, children, minHeight = 320 }) {
  return (
    <section className="panel" style={{ minWidth: 0 }}>
      <div className="panel-header">
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: "var(--text-base)",
              fontWeight: 600,
              color: "var(--color-text)",
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </p>

          {subtitle && (
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                marginTop: "4px",
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div
        className="panel-body"
        style={{
          minWidth: 0,
          width: "100%",
          paddingTop: "var(--space-4)",
        }}
      >
        <div
          style={{
            width: "100%",
            minWidth: 0,
            height: minHeight,
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function MiniChartPanel({ title, unit, accentColor, children }) {
  return (
    <div
      style={{
        minWidth: 0,
        border: "1px solid var(--color-border)",
        borderRadius: "calc(var(--radius-lg) - 2px)",
        backgroundColor: "var(--color-surface-offset)",
        padding: "var(--space-4)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-3)",
          marginBottom: "var(--space-4)",
        }}
      >
        <div
          style={{
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "9999px",
              backgroundColor: accentColor,
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-text)",
              lineHeight: 1.3,
            }}
          >
            {title}
          </p>
        </div>

        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            color: "var(--color-text-muted)",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-divider)",
            borderRadius: "9999px",
            padding: "4px 10px",
            whiteSpace: "nowrap",
          }}
        >
          {unit}
        </span>
      </div>

      <div style={{ width: "100%", height: 260 }}>{children}</div>
    </div>
  );
}

function ChartEmpty({ message = "No data available" }) {
  return (
    <div
      style={{
        height: "100%",
        minHeight: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text-faint)",
        fontSize: "var(--text-sm)",
        textAlign: "center",
        padding: "var(--space-6)",
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}

function PieSummary({
  titleValue,
  titleLabel,
  data,
  colors,
  valueFormatter = (v) => v,
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-4)",
      }}
    >
      <div style={{ width: 120, height: 120, flexShrink: 0, position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={56}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
            {titleValue}
          </span>
        </div>
      </div>

      <div style={{ minWidth: 140, flex: 1 }}>
        <p
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "var(--space-2)",
          }}
        >
          {titleLabel}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {data.map((entry, i) => (
            <div
              key={`${entry.name}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                lineHeight: 1.4,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "9999px",
                  backgroundColor: colors[i],
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                }}
              >
                {entry.name}
              </span>

              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  marginLeft: "auto",
                  fontVariantNumeric: "tabular-nums lining-nums",
                }}
              >
                {valueFormatter(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TokenBreakdownChart({ tokens = {} }) {
  const data = Object.entries(tokens)
    .map(([key, value]) => ({
      name: formatName(key),
      Tokens: Number(value ?? 0),
    }))
    .filter((item) => item.Tokens > 0);

  if (!data.length) {
    return (
      <ChartPanel
        title="LLM Token Breakdown"
        subtitle="Prompt and completion token distribution"
      >
        <ChartEmpty message="No token data available" />
      </ChartPanel>
    );
  }

  return (
    <ChartPanel
      title="LLM Token Breakdown"
      subtitle="Prompt and completion token distribution"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 16, left: 8, bottom: 42 }}
        >
          <defs>
            <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={1} />
              <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} {...GRID_STYLE} />
          <XAxis
            dataKey="name"
            tick={AXIS_STYLE}
            tickFormatter={(v) => truncateLabel(v, 18)}
            axisLine={false}
            tickLine={false}
            interval={0}
            label={{
              value: "Pipeline Stage",
              position: "insideBottom",
              offset: -10,
              style: AXIS_LABEL_STYLE,
            }}
          />
          <YAxis
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            width={68}
            tickFormatter={(v) => formatCompactNumber(v)}
            label={{
              value: "Token Count",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: AXIS_LABEL_STYLE,
            }}
          />
          <Tooltip
            content={<ChartTooltip formatter={(v) => formatCompactNumber(v)} />}
            cursor={{ fill: "var(--color-surface-offset)" }}
          />
          <Bar
            dataKey="Tokens"
            fill="url(#colorTokens)"
            radius={[4, 4, 0, 0]}
            maxBarSize={56}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

export function DurationBreakdownChart({ durations = {} }) {
  const data = Object.entries(durations)
    .filter(([, value]) => Number(value ?? 0) > 0)
    .map(([key, value]) => ({
      name: formatName(key.replace(/_seconds/g, "")),
      "Duration (s)": parseFloat(Number(value ?? 0).toFixed(2)),
    }));

  if (!data.length) {
    return (
      <ChartPanel
        title="Phase Duration Breakdown"
        subtitle="Time spent in each pipeline stage"
      >
        <ChartEmpty message="No duration data available" />
      </ChartPanel>
    );
  }

  return (
    <ChartPanel
      title="Phase Duration Breakdown"
      subtitle="Time spent in each pipeline stage"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 16, left: 20, bottom: 74 }}
        >
          <defs>
            <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.orange} stopOpacity={1} />
              <stop offset="100%" stopColor={CHART_COLORS.orange} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} {...GRID_STYLE} />
          <XAxis
            dataKey="name"
            tick={{ ...AXIS_STYLE, textAnchor: "end" }}
            tickFormatter={(v) => truncateLabel(v, 18)}
            angle={-35}
            height={78}
            axisLine={false}
            tickLine={false}
            interval={0}
            label={{
              value: "Pipeline Phase",
              position: "insideBottom",
              offset: -6,
              style: AXIS_LABEL_STYLE,
            }}
          />
          <YAxis
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            width={64}
            tickFormatter={(v) => formatCompactNumber(v)}
            label={{
              value: "Duration (s)",
              angle: -90,
              position: "inside",
              offset: 4,
              style: AXIS_LABEL_STYLE,
            }}
          />
          <Tooltip
            content={<ChartTooltip formatter={(v) => `${v}s`} />}
            cursor={{ fill: "var(--color-surface-offset)" }}
          />
          <Bar
            dataKey="Duration (s)"
            fill="url(#colorDuration)"
            radius={[4, 4, 0, 0]}
            maxBarSize={56}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

export function QualityScoresChart({ scores = {} }) {
  const data = Object.entries(scores)
    .filter(([key, value]) => key !== "overall_score" && Number(value ?? 0) > 0)
    .map(([key, value]) => ({
      name: formatName(key),
      score: parseFloat((Number(value ?? 0) * 100).toFixed(0)),
    }));

  if (!data.length) {
    return (
      <ChartPanel
        title="Quality Scores"
        subtitle="Per-dimension quality percentage"
      >
        <ChartEmpty message="No quality score data available" />
      </ChartPanel>
    );
  }

  return (
    <ChartPanel
      title="Quality Scores"
      subtitle="Per-dimension quality percentage"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{ top: 20, right: 32, left: 32, bottom: 20 }}
        >
          <PolarGrid stroke="var(--color-divider)" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ ...AXIS_STYLE, fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ ...AXIS_STYLE, fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
          <Radar
            name="Score %"
            dataKey="score"
            stroke={CHART_COLORS.success}
            fill={CHART_COLORS.success}
            fillOpacity={0.18}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

export function ResourceUsageChart({
  memoryAvg = 0,
  memoryPeak = 0,
  cpuAvg = 0,
  cpuPeak = 0,
}) {
  const safeMemoryAvg = Number(memoryAvg ?? 0);
  const safeMemoryPeak = Number(memoryPeak ?? 0);
  const safeCpuAvg = Number(cpuAvg ?? 0);
  const safeCpuPeak = Number(cpuPeak ?? 0);

  const hasData = hasMeaningfulValues([
    safeMemoryAvg,
    safeMemoryPeak,
    safeCpuAvg,
    safeCpuPeak,
  ]);

  const memoryData = [
    { name: "Average", value: safeMemoryAvg },
    { name: "Peak", value: safeMemoryPeak },
  ];

  const cpuData = [
    { name: "Average", value: safeCpuAvg },
    { name: "Peak", value: safeCpuPeak },
  ];

  if (!hasData) {
    return (
      <ChartPanel
        title="System Resources"
        subtitle="Memory and CPU usage split into separate charts for clear units"
        minHeight={300}
      >
        <ChartEmpty message="No system resource data available" />
      </ChartPanel>
    );
  }

  return (
    <ChartPanel
      title="System Resources"
      subtitle="Memory and CPU usage split into separate charts for clear units"
      minHeight={380}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "var(--space-4)",
          width: "100%",
          height: "100%",
          minWidth: 0,
        }}
        className="resource-usage-grid"
      >
        <MiniChartPanel
          title="Memory Usage"
          unit="MB"
          accentColor={CHART_COLORS.blue}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={memoryData}
              margin={{ top: 8, right: 12, left: 6, bottom: 42 }}
            >
              <defs>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={1} />
                  <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} {...GRID_STYLE} />
              <XAxis
                dataKey="name"
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Metric Type",
                  position: "insideBottom",
                  offset: -10,
                  style: AXIS_LABEL_STYLE,
                }}
              />
              <YAxis
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                width={58}
                tickFormatter={(v) => formatCompactNumber(v)}
                label={{
                  value: "Memory (MB)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                  style: AXIS_LABEL_STYLE,
                }}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(v) => `${formatCompactNumber(v)} MB`}
                  />
                }
                cursor={{ fill: "var(--color-surface)" }}
              />
              <Bar
                dataKey="value"
                name="Memory"
                fill="url(#colorMemory)"
                radius={[4, 4, 0, 0]}
                maxBarSize={52}
              />
            </BarChart>
          </ResponsiveContainer>
        </MiniChartPanel>

        <MiniChartPanel
          title="CPU Usage"
          unit="%"
          accentColor={CHART_COLORS.primary}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={cpuData}
              margin={{ top: 8, right: 12, left: 6, bottom: 42 }}
            >
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={1} />
                  <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} {...GRID_STYLE} />
              <XAxis
                dataKey="name"
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Metric Type",
                  position: "insideBottom",
                  offset: -10,
                  style: AXIS_LABEL_STYLE,
                }}
              />
              <YAxis
                tick={AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                width={58}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                label={{
                  value: "CPU (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                  style: AXIS_LABEL_STYLE,
                }}
              />
              <Tooltip
                content={<ChartTooltip formatter={(v) => `${v}%`} />}
                cursor={{ fill: "var(--color-surface)" }}
              />
              <Bar
                dataKey="value"
                name="CPU"
                fill="url(#colorCpu)"
                radius={[4, 4, 0, 0]}
                maxBarSize={52}
              />
            </BarChart>
          </ResponsiveContainer>
        </MiniChartPanel>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .resource-usage-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </ChartPanel>
  );
}

export function CoverageChart({ covered = 0, total = 1, label = "Coverage" }) {
  const safeCovered = Number(covered ?? 0);
  const safeTotal = Number(total ?? 1);
  const pct = safeTotal > 0 ? (safeCovered / safeTotal) * 100 : 0;

  const data = [
    { name: "Covered", value: safeCovered },
    { name: "Remaining", value: Math.max(safeTotal - safeCovered, 0) },
  ];

  const colors = [CHART_COLORS.primary, CHART_COLORS.neutral];

  return (
    <ChartPanel
      title={label}
      subtitle={`${safeCovered} of ${safeTotal} covered`}
      minHeight={260}
    >
      <PieSummary
        titleValue={`${pct.toFixed(1)}%`}
        titleLabel="Coverage rate"
        data={data}
        colors={colors}
        valueFormatter={(v) => formatCompactNumber(v)}
      />
    </ChartPanel>
  );
}

export function SectionScoresChart({ perSectionScores = {} }) {
  const data = Object.entries(perSectionScores)
    .map(([key, value]) => ({
      name: formatName(key),
      "Quality %": parseFloat((Number(value ?? 0) * 100).toFixed(0)),
    }))
    .filter((item) => item["Quality %"] > 0);

  if (!data.length) {
    return (
      <ChartPanel
        title="Per-Section Quality"
        subtitle="Quality score by section"
      >
        <ChartEmpty message="No section quality data available" />
      </ChartPanel>
    );
  }

  return (
    <ChartPanel title="Per-Section Quality" subtitle="Quality score by section">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 12, right: 24, left: 20, bottom: 24 }}
        >
          <defs>
            <linearGradient id="colorSectionQuality" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CHART_COLORS.success} stopOpacity={0.4} />
              <stop offset="100%" stopColor={CHART_COLORS.success} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal={false} {...GRID_STYLE} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            label={{
              value: "Quality Score (%)",
              position: "insideBottom",
              offset: -4,
              style: AXIS_LABEL_STYLE,
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={AXIS_STYLE}
            tickFormatter={(v) => truncateLabel(v, 18)}
            axisLine={false}
            tickLine={false}
            width={136}
            label={{
              value: "Section",
              angle: -90,
              position: "insideLeft",
              offset: -8,
              style: AXIS_LABEL_STYLE,
            }}
          />
          <Tooltip
            content={<ChartTooltip formatter={(v) => `${v}%`} />}
            cursor={{ fill: "var(--color-surface-offset)" }}
          />
          <Bar
            dataKey="Quality %"
            fill="url(#colorSectionQuality)"
            radius={[0, 4, 4, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

export function TokenDistributionChart({
  promptTokens = 0,
  completionTokens = 0,
}) {
  const safePrompt = Number(promptTokens ?? 0);
  const safeCompletion = Number(completionTokens ?? 0);

  const data = [
    { name: "Prompt", value: safePrompt },
    { name: "Completion", value: safeCompletion },
  ];

  const colors = [CHART_COLORS.blue, CHART_COLORS.gold];
  const total = safePrompt + safeCompletion;

  return (
    <ChartPanel
      title="Token Distribution"
      subtitle="Prompt vs completion split"
      minHeight={260}
    >
      <PieSummary
        titleValue={total.toLocaleString()}
        titleLabel="Total tokens"
        data={data}
        colors={colors}
        valueFormatter={(v) => v.toLocaleString()}
      />
    </ChartPanel>
  );
}

export function SectionCompletenessChart({ completenessScores = {} }) {
  const data = Object.entries(completenessScores)
    .map(([key, value]) => ({
      name: formatName(key),
      "Completeness %": parseFloat((Number(value ?? 0) * 100).toFixed(0)),
    }))
    .filter((item) => item["Completeness %"] > 0);

  if (!data.length) {
    return (
      <ChartPanel
        title="Section Completeness"
        subtitle="Completeness rate by section"
      >
        <ChartEmpty message="No completeness data available" />
      </ChartPanel>
    );
  }

  return (
    <ChartPanel title="Section Completeness" subtitle="Completeness rate by section">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 12, right: 24, left: 20, bottom: 24 }}
        >
          <defs>
            <linearGradient id="colorSectionCompleteness" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
              <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal={false} {...GRID_STYLE} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            label={{
              value: "Completeness (%)",
              position: "insideBottom",
              offset: -4,
              style: AXIS_LABEL_STYLE,
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={AXIS_STYLE}
            tickFormatter={(v) => truncateLabel(v, 18)}
            axisLine={false}
            tickLine={false}
            width={136}
            label={{
              value: "Section",
              angle: -90,
              position: "insideLeft",
              offset: -8,
              style: AXIS_LABEL_STYLE,
            }}
          />
          <Tooltip
            content={<ChartTooltip formatter={(v) => `${v}%`} />}
            cursor={{ fill: "var(--color-surface-offset)" }}
          />
          <Bar
            dataKey="Completeness %"
            fill="url(#colorSectionCompleteness)"
            radius={[0, 4, 4, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

export function RequirementQualityChart({ highCount = 0, mediumCount = 0, lowCount = 0 }) {
  const safeHigh = Number(highCount ?? 0);
  const safeMedium = Number(mediumCount ?? 0);
  const safeLow = Number(lowCount ?? 0);
  const total = safeHigh + safeMedium + safeLow;

  const allData = [
    { name: "High Quality", value: safeHigh, color: CHART_COLORS.success },
    { name: "Medium Quality", value: safeMedium, color: CHART_COLORS.gold },
    { name: "Low Quality", value: safeLow, color: CHART_COLORS.error },
  ];
  const data = allData.filter(d => d.value > 0);
  const colors = data.map(d => d.color);

  return (
    <ChartPanel
      title="Requirement Quality Profile"
      subtitle={`${total} requirements evaluated`}
      minHeight={260}
    >
      <PieSummary
        titleValue={total.toLocaleString()}
        titleLabel="Total evaluated"
        data={data}
        colors={colors}
        valueFormatter={(v) => v.toLocaleString()}
      />
    </ChartPanel>
  );
}

