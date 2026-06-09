import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bot,
  Clock3,
  Cpu,
  DollarSign,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TimerReset,
  Search,
  X,
  ExternalLink,
  PanelTopOpen,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  loadOverviewData,
  getMonitoredAgents,
  getAgentConfig,
} from "../services/dataService";

const CHART_COLORS = {
  primary: "#0f766e",
  orange: "#c2410c",
  blue: "#1d4ed8",
  purple: "#7c3aed",
  gold: "#b08900",
  success: "#4d7c0f",
  error: "#b42318",
  neutral: "#d6d3d1",
  softNeutral: "#ece7df",
};

const AXIS_STYLE = {
  fontSize: 11,
  fill: "#6b7280",
  fontFamily: "var(--font-body)",
};

const GRID_STYLE = {
  stroke: "#e7e2da",
  strokeDasharray: "3 3",
};

function formatNumber(value, digits = 0) {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "—";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatPercent(value, digits = 1) {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "—";
  return `${num.toFixed(digits)}%`;
}

function formatCurrency(value, digits = 4) {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "—";
  return `$${num.toFixed(digits)}`;
}

function formatDuration(seconds) {
  const sec = Number(seconds ?? 0);
  if (!Number.isFinite(sec) || sec <= 0) return "—";
  if (sec < 60) return `${sec.toFixed(1)}s`;
  const minutes = Math.floor(sec / 60);
  const remaining = Math.round(sec % 60);
  return `${minutes}m ${remaining}s`;
}

function formatRelativeDate(value) {
  if (!value) return "No runs yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
}

function getStatusTone(status) {
  if (status === "success") {
    return {
      color: "var(--color-success)",
      bg: "var(--color-success-highlight)",
      label: "Healthy",
    };
  }

  if (status === "failed") {
    return {
      color: "var(--color-error)",
      bg: "var(--color-error-highlight)",
      label: "Failed",
    };
  }

  if (status === "pending" || status === "no_data") {
    return {
      color: "var(--color-warning)",
      bg: "var(--color-warning-highlight)",
      label: status === "no_data" ? "No data" : "Pending",
    };
  }

  return {
    color: "var(--color-text-muted)",
    bg: "var(--color-surface-offset)",
    label: "Unknown",
  };
}

function buildRunSearchText(run) {
  return [
    run.agentName,
    run.agent,
    run.runId,
    run.status,
    formatRelativeDate(run.latestTimestamp),
    formatDuration(run.durationSeconds),
    formatCurrency(run.estimatedCostUsd, 4),
    run.qualityScore > 0 ? formatPercent(run.qualityScore * 100) : "—",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function ChartTooltip({ active, payload, label, valueFormatter = (v) => v }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid color-mix(in oklab, var(--color-border) 85%, white)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 14px 36px rgba(15, 23, 42, 0.10)",
        padding: "12px 14px",
        minWidth: 170,
      }}
    >
      {label ? (
        <p
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "var(--space-2)",
          }}
        >
          {label}
        </p>
      ) : null}

      {payload.map((entry, index) => (
        <div
          key={`${entry.name}-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            marginBottom: index === payload.length - 1 ? 0 : "6px",
            fontSize: "var(--text-sm)",
          }}
        >
          <span
            style={{
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
              marginLeft: "auto",
              fontWeight: 700,
              color: "var(--color-text)",
              fontVariantNumeric: "tabular-nums lining-nums",
            }}
          >
            {valueFormatter(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, subtitle, action, children, minHeight }) {
  return (
    <section className="panel overview-panel" style={{ minWidth: 0 }}>
      <div className="panel-header overview-panel-header">
        <div style={{ minWidth: 0 }}>
          <p className="overview-panel-title">{title}</p>
          {subtitle ? (
            <p className="overview-panel-subtitle">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>

      <div
        className="panel-body"
        style={{
          paddingTop: "var(--space-4)",
          minHeight: minHeight ?? "auto",
        }}
      >
        {children}
      </div>
    </section>
  );
}

function EmptyPanel({ message, compact = false }) {
  return (
    <div
      className="overview-empty-panel"
      style={{ minHeight: compact ? 180 : 220 }}
    >
      {message}
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, tone = "default" }) {
  const toneStyles =
    tone === "danger"
      ? {
          bg: "var(--color-error-highlight)",
          icon: "var(--color-error)",
        }
      : tone === "success"
        ? {
            bg: "var(--color-success-highlight)",
            icon: "var(--color-success)",
          }
        : tone === "warning"
          ? {
              bg: "var(--color-warning-highlight)",
              icon: "var(--color-warning)",
            }
          : {
              bg: "var(--color-primary-highlight)",
              icon: "var(--color-primary)",
            };

  return (
    <div className="panel metric-card-shell" style={{ minWidth: 0 }}>
      <div className="metric-card-top">
        <div style={{ minWidth: 0 }}>
          <p className="metric-label">{title}</p>
          <p className="metric-display-value">{value}</p>
          {subtitle ? (
            <p className="metric-supporting-text">{subtitle}</p>
          ) : null}
        </div>

        <span
          className="metric-icon-shell"
          style={{
            backgroundColor: toneStyles.bg,
          }}
        >
          <Icon size={18} color={toneStyles.icon} strokeWidth={1.9} />
        </span>
      </div>
    </div>
  );
}

function AgentSummaryCard({ item }) {
  const config = getAgentConfig(item.agentId);
  const tone = getStatusTone(item.latestStatus);

  return (
    <div className="panel agent-summary-card" style={{ minWidth: 0 }}>
      <div className="agent-summary-top">
        <div>
          <p className="agent-summary-title">{item.agentName}</p>
          <p className="agent-summary-meta">
            {item.runCount} run{item.runCount !== 1 ? "s" : ""} recorded
          </p>
        </div>

        <span
          className="status-pill"
          style={{
            color: tone.color,
            backgroundColor: tone.bg,
          }}
        >
          {tone.label}
        </span>
      </div>

      <div className="agent-summary-grid">
        <div className="agent-summary-stat">
          <p className="metric-label">Success</p>
          <p className="metric-value">{formatPercent(item.successRate)}</p>
        </div>
        <div className="agent-summary-stat">
          <p className="metric-label">Avg duration</p>
          <p className="metric-value">{formatDuration(item.avgDuration)}</p>
        </div>
        <div className="agent-summary-stat">
          <p className="metric-label">Avg cost</p>
          <p className="metric-value">{formatCurrency(item.avgCost, 4)}</p>
        </div>
        <div className="agent-summary-stat">
          <p className="metric-label">Avg quality</p>
          <p className="metric-value">
            {item.avgQuality > 0 ? formatPercent(item.avgQuality * 100) : "—"}
          </p>
        </div>
      </div>

      <div className="agent-summary-footer">
        <span className="agent-summary-footer-text">
          Last run: {formatRelativeDate(item.latestRunAt)}
        </span>

        <span
          className="agent-summary-footer-strong"
          style={{
            color: config?.color ?? "var(--color-text-muted)",
          }}
        >
          {formatNumber(item.totalErrors)} errors ·{" "}
          {formatNumber(item.totalRetries)} retries
        </span>
      </div>
    </div>
  );
}

function ComparisonBarChart({ title, subtitle, data, color, formatter }) {
  if (!data?.length) {
    return (
      <Panel title={title} subtitle={subtitle} minHeight={320}>
        <EmptyPanel message="No comparison data available." />
      </Panel>
    );
  }

  return (
    <Panel title={title} subtitle={subtitle} minHeight={320}>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 16, left: 6, bottom: 28 }}
          >
            <CartesianGrid vertical={false} {...GRID_STYLE} />
            <XAxis
              dataKey="agent"
              tick={AXIS_STYLE}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              width={64}
              tickFormatter={formatter}
            />
            <Tooltip content={<ChartTooltip valueFormatter={formatter} />} />
            <Bar
              dataKey="value"
              fill={color}
              radius={[8, 8, 0, 0]}
              maxBarSize={52}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function StatusDistributionChart({ data }) {
  const hasData = Array.isArray(data) && data.length > 0;
  const colors = [CHART_COLORS.success, CHART_COLORS.error, CHART_COLORS.gold];
  const total = hasData
    ? data.reduce((sum, item) => sum + Number(item.value || 0), 0)
    : 0;

  return (
    <Panel
      title="Run Status Distribution"
      subtitle="Current mix of successful, failed, and pending runs"
      minHeight={320}
    >
      {!hasData ? (
        <EmptyPanel message="No run distribution available." />
      ) : (
        <div className="status-distribution-layout">
          <div style={{ width: 170, height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={
                    <ChartTooltip valueFormatter={(v) => formatNumber(v)} />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ minWidth: 180 }}>
            <p className="status-distribution-total">{formatNumber(total)}</p>
            <p className="status-distribution-caption">Total monitored runs</p>

            <div className="status-distribution-legend">
              {data.map((item, index) => (
                <div key={item.name} className="status-distribution-legend-row">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "9999px",
                      backgroundColor: colors[index % colors.length],
                    }}
                  />
                  <span style={{ color: "var(--color-text-muted)" }}>
                    {item.name}
                  </span>
                  <span className="status-distribution-legend-value">
                    {formatNumber(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

function HealthStrip({ health }) {
  return (
    <div className="overview-health-grid">
      <MetricCard
        title="Agents with Failures"
        value={formatNumber(health?.agentsWithFailures)}
        subtitle="Agents requiring immediate attention"
        icon={ShieldAlert}
        tone={(health?.agentsWithFailures ?? 0) > 0 ? "danger" : "success"}
      />
      <MetricCard
        title="Agents with Retries"
        value={formatNumber(health?.agentsWithRetries)}
        subtitle="Observed retry activity across agents"
        icon={TimerReset}
        tone={(health?.agentsWithRetries ?? 0) > 0 ? "warning" : "success"}
      />
      <MetricCard
        title="Pending Reviews"
        value={formatNumber(health?.agentsPendingReview)}
        subtitle="Runs still awaiting review state"
        icon={AlertTriangle}
        tone={(health?.agentsPendingReview ?? 0) > 0 ? "warning" : "success"}
      />
      <MetricCard
        title="Total Errors"
        value={formatNumber(health?.totalErrors)}
        subtitle="Aggregate errors across monitored runs"
        icon={Cpu}
        tone={(health?.totalErrors ?? 0) > 0 ? "danger" : "success"}
      />
      <MetricCard
        title="Total Retries"
        value={formatNumber(health?.totalRetries)}
        subtitle="Total retry attempts across runs"
        icon={RefreshCw}
        tone={(health?.totalRetries ?? 0) > 0 ? "warning" : "success"}
      />
    </div>
  );
}

function RecentRunsTable({ runs, limit }) {
  const visibleRuns = typeof limit === "number" ? runs.slice(0, limit) : runs;

  if (!visibleRuns?.length) {
    return (
      <div style={{ minHeight: 220 }}>
        <EmptyPanel message="No recent runs available." compact />
      </div>
    );
  }

  return (
    <div className="overview-table-scroll">
      <table className="overview-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Run ID</th>
            <th>Status</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Cost</th>
            <th>Quality</th>
          </tr>
        </thead>
        <tbody>
          {visibleRuns.map((run) => {
            const tone = getStatusTone(run.status);

            return (
              <tr key={`${run.agent}-${run.runId}`}>
                <td>{run.agentName}</td>
                <td className="monospace-cell">{run.runId}</td>
                <td>
                  <span
                    className="status-pill"
                    style={{
                      backgroundColor: tone.bg,
                      color: tone.color,
                    }}
                  >
                    {tone.label}
                  </span>
                </td>
                <td>{formatRelativeDate(run.latestTimestamp)}</td>
                <td>{formatDuration(run.durationSeconds)}</td>
                <td>{formatCurrency(run.estimatedCostUsd, 4)}</td>
                <td>
                  {run.qualityScore > 0
                    ? formatPercent(run.qualityScore * 100)
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RecentActivityModal({
  open,
  onClose,
  runs,
  searchQuery,
  onSearchChange,
}) {
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const focusSearch = () => {
      searchInputRef.current?.focus();
      const value = searchInputRef.current?.value ?? "";
      const length = value.length;
      searchInputRef.current?.setSelectionRange(length, length);
    };

    const timer = setTimeout(focusSearch, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleFocusIn = (event) => {
      if (!modalRef.current) return;
      if (!modalRef.current.contains(event.target)) {
        focusSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    searchInputRef.current?.focus();
  }, [open, searchQuery]);

  if (!open) return null;

  const filteredRuns = runs.filter((run) =>
    buildRunSearchText(run).includes(searchQuery.trim().toLowerCase()),
  );

  return (
    <div
      className="activity-modal-overlay"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        className="activity-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recent-activity-title"
        aria-describedby="recent-activity-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="activity-modal-header">
          <div className="activity-modal-title-wrap">
            <div className="activity-modal-badge">
              <PanelTopOpen size={16} strokeWidth={1.9} />
            </div>

            <div style={{ minWidth: 0 }}>
              <h2 id="recent-activity-title" className="activity-modal-title">
                Recent activity explorer
              </h2>
              <p
                id="recent-activity-description"
                className="activity-modal-subtitle"
              >
                Search across every visible data column without leaving the
                overview dashboard.
              </p>
            </div>
          </div>

          <button
            className="modal-icon-button"
            onClick={onClose}
            aria-label="Close recent activity modal"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="activity-modal-toolbar">
          <div className="activity-search-panel">
            <div className="activity-search-label">Global search</div>
            <div className="activity-search">
              <Search size={15} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by agent, run id, status, timestamp, duration, cost, or quality"
                aria-label="Search recent activity"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

          <div className="activity-modal-stats">
            <div className="activity-modal-stat">
              <span className="activity-modal-stat-label">Showing</span>
              <span className="activity-modal-stat-value">
                {formatNumber(filteredRuns.length)}
              </span>
            </div>
            <div className="activity-modal-stat">
              <span className="activity-modal-stat-label">Total</span>
              <span className="activity-modal-stat-value">
                {formatNumber(runs.length)}
              </span>
            </div>
          </div>
        </div>

        <div className="activity-modal-body">
          <div className="activity-modal-table-wrap">
            {filteredRuns.length ? (
              <RecentRunsTable runs={filteredRuns} />
            ) : (
              <div className="activity-modal-empty">
                <EmptyPanel message="No runs matched your search." compact />
              </div>
            )}
          </div>
        </div>

        <div className="activity-modal-footer">
          <p className="activity-modal-footer-text">
            Press Esc to close the explorer. Search focus stays active while the
            modal is open.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OverviewDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activitySearch, setActivitySearch] = useState("");
  const activityTriggerRef = useRef(null);

  async function fetchOverview(showRefreshState = false) {
    try {
      setError(null);
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await loadOverviewData();
      setOverview(data);
    } catch (err) {
      setError(err?.message || "Failed to load overview data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchOverview(false);
  }, []);

  const monitoredAgents = useMemo(() => getMonitoredAgents(), []);
  const totals = overview?.totals;
  const agentSummaries = overview?.agentSummaries ?? [];
  const comparison = overview?.comparison ?? {};
  const statusDistribution = overview?.statusDistribution ?? [];
  const health = overview?.health ?? {};
  const recentRuns = overview?.recentRuns ?? [];

  const anomalies = useMemo(() => {
    if (!recentRuns.length) return [];
    
    const list = [];
    
    // 1. Check for failed runs in the most recent execution
    const latestRunsByAgent = {};
    recentRuns.forEach(run => {
      if (!latestRunsByAgent[run.agent]) {
        latestRunsByAgent[run.agent] = run;
      }
    });
    
    Object.values(latestRunsByAgent).forEach(run => {
      if (run.status === "failed") {
        list.push({
          id: `fail-${run.agent}-${run.runId}`,
          type: "critical",
          message: `The latest run for ${run.agentName} (ID: ${run.runId}) failed.`,
          action: "Inspect logs and retry the pipeline."
        });
      }
    });

    // 2. Check for high retry rates (retries > 2)
    recentRuns.slice(0, 10).forEach(run => {
      if (run.retries > 2) {
        list.push({
          id: `retry-${run.runId}`,
          type: "warning",
          message: `High retry counts detected: ${run.agentName} run ${run.runId} completed with ${run.retries} retries.`,
          action: "Indicates potential model instability or rate limiting."
        });
      }
    });

    // 3. Check for latency outliers (duration > average * 1.5 and > 180s)
    const avgDuration = totals?.avgDuration ?? 120;
    recentRuns.slice(0, 5).forEach(run => {
      if (run.durationSeconds > avgDuration * 1.5 && run.durationSeconds > 180) {
        list.push({
          id: `latency-${run.runId}`,
          type: "info",
          message: `Pipeline Latency Anomaly: Run ${run.runId} took ${formatDuration(run.durationSeconds)} (1.5x higher than average of ${formatDuration(avgDuration)}).`,
          action: "Optimize vector search index size or check network latency."
        });
      }
    });

    // 4. Check for cost outliers (cost > average * 1.5 and > $0.03)
    const avgCost = totals?.avgCost ?? 0.02;
    recentRuns.slice(0, 5).forEach(run => {
      if (run.estimatedCostUsd > avgCost * 1.5 && run.estimatedCostUsd > 0.03) {
        list.push({
          id: `cost-${run.runId}`,
          type: "info",
          message: `Billing Peak: Run ${run.runId} incurred $${run.estimatedCostUsd.toFixed(4)} in token costs.`,
          action: "Review section prompt count or limit input files."
        });
      }
    });

    // 5. Check for rejected output
    recentRuns.slice(0, 10).forEach(run => {
      if (run.acceptanceStatus === "rejected") {
        list.push({
          id: `reject-${run.runId}`,
          type: "warning",
          message: `Deliverable Rejected: Run ${run.runId} of ${run.agentName} was marked as rejected.`,
          action: "Re-generate requirements and review user feedback."
        });
      }
    });

    return list;
  }, [recentRuns, totals]);

  function openActivityModal() {
    setIsActivityModalOpen(true);
  }

  function closeActivityModal() {
    setIsActivityModalOpen(false);
    activityTriggerRef.current?.focus();
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        <div className="metric-grid-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "var(--space-4)",
          }}
        >
          <div className="skeleton skeleton-chart" />
          <div className="skeleton skeleton-chart" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="panel empty-state">
        <span className="empty-state-icon">
          <AlertTriangle size={40} strokeWidth={1.5} />
        </span>
        <h3>Unable to load overview</h3>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        <section className="panel overview-hero-panel">
          <div className="overview-hero-top">
            <div style={{ maxWidth: 720 }}>
              <p className="eyebrow">Multi-agent overview</p>
              <h1 className="overview-hero-title">
                Consolidated metrics across all monitored agents
              </h1>
              <p className="overview-hero-subtitle">
                Track reliability, cost, quality, validation health, and recent
                execution activity for Technical Docs, PPT, and BRD from one
                surface.
              </p>
            </div>

            <button
              className="btn btn-secondary btn-icon polished-refresh-btn"
              onClick={() => fetchOverview(true)}
              disabled={refreshing}
              aria-label="Refresh overview"
              title="Refresh overview"
            >
              <RefreshCw
                size={15}
                style={{
                  animation: refreshing ? "spin 1s linear infinite" : "none",
                }}
              />
            </button>
          </div>
        </section>

        {/* Anomaly & Run Health Insights Banner */}
        <section className={`panel ${anomalies.length > 0 ? "anomaly-banner-active" : "anomaly-banner-nominal"}`} style={{
          padding: "var(--space-5) var(--space-6)",
          borderRadius: "var(--radius-lg)",
          border: anomalies.length > 0 ? "1px solid color-mix(in srgb, var(--color-warning) 30%, var(--color-border))" : "1px solid var(--color-divider)",
          background: anomalies.length > 0 ? "color-mix(in srgb, var(--color-warning-highlight) 30%, var(--color-surface))" : "color-mix(in srgb, var(--color-success-highlight) 20%, var(--color-surface))",
          boxShadow: "var(--glass-shadow), var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: anomalies.length > 0 ? "var(--color-warning-highlight)" : "var(--color-success-highlight)",
              color: anomalies.length > 0 ? "var(--color-warning)" : "var(--color-success)",
            }}>
              {anomalies.length > 0 ? <AlertTriangle size={15} strokeWidth={2.2} /> : <BadgeCheck size={15} strokeWidth={2.2} />}
            </span>
            <div>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-text)" }}>
                {anomalies.length > 0 ? `Operational Anomaly Checker (${anomalies.length} alerts)` : "All Systems Nominal"}
              </p>
              <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                {anomalies.length > 0 ? "Review the flagged pipeline exceptions and performance outliers below." : "All recent pipeline executions met latency, cost, and reliability thresholds."}
              </p>
            </div>
          </div>

          {anomalies.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
              {anomalies.map((alert) => (
                <div key={alert.id} style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "var(--space-3)",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-divider)",
                  background: "var(--color-surface)",
                  alignItems: "start",
                }}>
                  <span style={{
                    marginTop: "2px",
                    color: alert.type === "critical" ? "var(--color-error)" : alert.type === "warning" ? "var(--color-warning)" : "var(--color-blue)",
                  }}>
                    {alert.type === "critical" ? <ShieldAlert size={14} /> : <AlertTriangle size={14} />}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text)" }}>
                      {alert.message}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "10px", color: "var(--color-text-muted)" }}>
                      <strong>Suggested Action:</strong> {alert.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="metric-grid-5">
          <MetricCard
            title="Total Runs"
            value={formatNumber(totals?.totalRuns)}
            subtitle={`${formatNumber(monitoredAgents.length)} monitored agents`}
            icon={Bot}
          />
          <MetricCard
            title="Success Rate"
            value={formatPercent(totals?.successRate)}
            subtitle={`${formatNumber(totals?.successfulRuns)} successful runs`}
            icon={BadgeCheck}
            tone={(totals?.successRate ?? 0) >= 90 ? "success" : "warning"}
          />
          <MetricCard
            title="Avg Runtime"
            value={formatDuration(totals?.avgDuration)}
            subtitle="Average end-to-end execution time"
            icon={Clock3}
          />
          <MetricCard
            title="Avg Cost / Run"
            value={formatCurrency(totals?.avgCost, 4)}
            subtitle={`${formatNumber(totals?.totalTokens)} total tokens`}
            icon={DollarSign}
          />
          <MetricCard
            title="Avg Quality"
            value={
              (totals?.avgQuality ?? 0) > 0
                ? formatPercent((totals?.avgQuality ?? 0) * 100)
                : "—"
            }
            subtitle={
              (totals?.avgValidationHealth ?? 0) > 0
                ? `Validation health ${formatPercent((totals?.avgValidationHealth ?? 0) * 100)}`
                : "Validation data varies by agent"
            }
            icon={Sparkles}
            tone={(totals?.avgQuality ?? 0) >= 0.9 ? "success" : "warning"}
          />
        </div>

        <Panel
          title="Agent Summaries"
          subtitle="Per-agent rollup of reliability, runtime, cost, and quality"
        >
          <div className="overview-agent-grid">
            {agentSummaries.map((item) => (
              <AgentSummaryCard key={item.agentId} item={item} />
            ))}
          </div>
        </Panel>

        <div className="overview-chart-split">
          <ComparisonBarChart
            title="Success Rate by Agent"
            subtitle="Average execution reliability across monitored runs"
            data={comparison.successRate}
            color={CHART_COLORS.primary}
            formatter={(value) => `${value}%`}
          />

          <StatusDistributionChart data={statusDistribution} />
        </div>

        <div className="overview-chart-grid">
          <ComparisonBarChart
            title="Average Runtime"
            subtitle="Mean end-to-end duration by agent"
            data={comparison.avgDuration}
            color={CHART_COLORS.orange}
            formatter={(value) => `${Number(value).toFixed(1)}s`}
          />
          <ComparisonBarChart
            title="Average Cost"
            subtitle="Mean estimated run cost by agent"
            data={comparison.avgCost}
            color={CHART_COLORS.blue}
            formatter={(value) => `$${Number(value).toFixed(4)}`}
          />
          <ComparisonBarChart
            title="Average Quality"
            subtitle="Quality score normalized as percentage"
            data={comparison.avgQuality}
            color={CHART_COLORS.success}
            formatter={(value) => `${value}%`}
          />
        </div>

        <Panel
          title="Operational Health"
          subtitle="Failure, retry, and review signals that need attention"
        >
          <HealthStrip health={health} />
        </Panel>

        <Panel
          title="Recent Activity"
          subtitle="Latest runs across all monitored agents"
          action={
            <button
              ref={activityTriggerRef}
              className="btn btn-secondary recent-activity-open-btn"
              onClick={openActivityModal}
              aria-label="Open recent activity modal"
              title="View all recent activity"
            >
              <ExternalLink size={15} />
              <span>Open activity explorer</span>
            </button>
          }
        >
          <RecentRunsTable runs={recentRuns} limit={5} />
        </Panel>

        <style>{`
          .eyebrow {
            font-size: var(--text-xs);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--color-primary);
            margin-bottom: 2px;
          }

          .overview-hero-panel {
            padding: clamp(1.25rem, 2vw, 1.75rem);
            background: var(--color-surface-glass);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow), var(--shadow-sm);
          }

          .overview-hero-top {
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: space-between;
            gap: var(--space-4);
          }

          .overview-hero-title {
            font-family: var(--font-display);
            font-size: clamp(1.55rem, 2.1vw, 2rem);
            font-weight: 700;
            color: var(--color-text);
            letter-spacing: -0.04em;
            line-height: 1.08;
            margin: 0;
          }

          .overview-hero-subtitle {
            margin-top: var(--space-3);
            font-size: var(--text-sm);
            color: var(--color-text-muted);
            line-height: 1.7;
            max-width: 72ch;
          }

          .overview-panel {
            background: var(--color-surface-glass);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow), var(--shadow-sm);
            transition: 
              border-color var(--transition-interactive),
              box-shadow var(--transition-interactive);
          }

          .overview-panel:hover {
            border-color: color-mix(in srgb, var(--color-primary) 18%, var(--color-border));
            box-shadow: var(--glass-shadow), var(--shadow-md);
          }

          .overview-panel-header {
            padding-bottom: var(--space-1);
          }

          .overview-panel-title {
            font-size: 1rem;
            font-weight: 700;
            color: var(--color-text);
            line-height: 1.3;
          }

          .overview-panel-subtitle {
            font-size: var(--text-xs);
            color: var(--color-text-muted);
            margin-top: 5px;
            line-height: 1.55;
          }

          .metric-grid-5 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
            gap: var(--space-4);
            align-items: stretch;
          }

          .metric-card-shell {
            padding: var(--space-5);
            background: var(--color-surface-glass);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            box-shadow: var(--glass-shadow), var(--shadow-sm);
            transition:
              transform var(--transition-interactive),
              box-shadow var(--transition-interactive),
              border-color var(--transition-interactive);
          }

          .metric-card-shell:hover {
            transform: translateY(-2px);
            box-shadow: var(--glass-shadow), var(--shadow-md);
            border-color: color-mix(in srgb, var(--color-primary) 22%, var(--color-border));
          }

          .metric-card-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: var(--space-3);
          }

          .metric-label {
            font-size: var(--text-xs);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--color-text-muted);
            margin-bottom: 8px;
          }

          .metric-display-value {
            font-family: var(--font-display);
            font-size: clamp(1.6rem, 2vw, 2.1rem);
            font-weight: 700;
            letter-spacing: -0.05em;
            color: var(--color-text);
            line-height: 1;
            font-variant-numeric: tabular-nums lining-nums;
            margin: 0;
          }

          .metric-supporting-text {
            margin-top: var(--space-2);
            font-size: var(--text-xs);
            color: var(--color-text-muted);
            line-height: 1.55;
          }

          .metric-icon-shell {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35);
          }

          .metric-value {
            font-weight: 700;
            color: var(--color-text);
            font-variant-numeric: tabular-nums lining-nums;
            line-height: 1.1;
            font-size: 1rem;
            margin: 0;
          }

          .agent-summary-card {
            padding: var(--space-5);
            background: var(--color-surface-glass);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            box-shadow: var(--glass-shadow), var(--shadow-sm);
            transition:
              transform var(--transition-interactive),
              box-shadow var(--transition-interactive),
              border-color var(--transition-interactive);
          }

          .agent-summary-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--glass-shadow), var(--shadow-md);
            border-color: color-mix(in srgb, var(--color-primary) 22%, var(--color-border));
          }

          .agent-summary-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: var(--space-3);
            margin-bottom: var(--space-4);
          }

          .agent-summary-title {
            font-size: var(--text-base);
            font-weight: 700;
            color: var(--color-text);
            line-height: 1.3;
            margin: 0;
          }

          .agent-summary-meta {
            font-size: var(--text-xs);
            color: var(--color-text-muted);
            margin-top: 4px;
          }

          .agent-summary-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: var(--space-3);
          }

          .agent-summary-stat {
            padding: 12px 14px 10px;
            border-radius: var(--radius-md);
            background: color-mix(in srgb, var(--color-surface-offset) 60%, var(--color-surface));
            border: 1px solid var(--color-divider);
            box-shadow: var(--shadow-sm);
          }

          .agent-summary-footer {
            margin-top: var(--space-4);
            padding-top: var(--space-4);
            border-top: 1px solid var(--color-divider);
            display: flex;
            justify-content: space-between;
            gap: var(--space-3);
            flex-wrap: wrap;
          }

          .agent-summary-footer-text {
            font-size: var(--text-xs);
            color: var(--color-text-muted);
          }

          .agent-summary-footer-strong {
            font-size: var(--text-xs);
            font-weight: 700;
          }

          .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 10px;
            border-radius: 9999px;
            white-space: nowrap;
            font-size: var(--text-xs);
            font-weight: 700;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.28);
          }

          .overview-empty-panel {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-text-faint);
            font-size: var(--text-sm);
            text-align: center;
            padding: var(--space-6);
          }

          .overview-agent-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: var(--space-4);
          }

          .overview-chart-split {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: var(--space-4);
          }

          .overview-chart-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: var(--space-4);
          }

          .overview-health-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: var(--space-4);
          }

          .status-distribution-layout {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-8);
            flex-wrap: wrap;
            min-height: 260px;
          }

          .status-distribution-total {
            font-family: var(--font-display);
            font-size: 1.95rem;
            font-weight: 700;
            color: var(--color-text);
            letter-spacing: -0.05em;
            line-height: 1;
            margin: 0;
          }

          .status-distribution-caption {
            margin-top: 6px;
            font-size: var(--text-xs);
            color: var(--color-text-muted);
          }

          .status-distribution-legend {
            display: flex;
            flex-direction: column;
            gap: var(--space-2);
            margin-top: var(--space-4);
          }

          .status-distribution-legend-row {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            font-size: var(--text-sm);
          }

          .status-distribution-legend-value {
            margin-left: auto;
            font-weight: 700;
            color: var(--color-text);
          }

          .overview-table-scroll {
            overflow-x: auto;
          }

          .overview-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
          }

          .overview-table th,
          .overview-table td {
            text-align: left;
            padding: 13px 14px;
            border-bottom: 1px solid var(--color-divider);
            font-size: var(--text-sm);
            vertical-align: middle;
            white-space: nowrap;
            background: var(--color-surface);
          }

          .overview-table th {
            font-size: var(--text-xs);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--color-text-muted);
            font-weight: 700;
            background:
              linear-gradient(
                180deg,
                color-mix(in oklab, var(--color-surface-offset) 82%, white) 0%,
                var(--color-surface-offset) 100%
              );
            position: sticky;
            top: 0;
            z-index: 2;
          }

          .overview-table tbody tr {
            transition: background var(--transition-interactive);
          }

          .overview-table tbody tr:hover td {
            background: color-mix(in srgb, var(--color-primary-highlight) 32%, var(--color-surface)) !important;
          }

          .monospace-cell {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 12px;
          }

          .recent-activity-open-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .polished-refresh-btn {
            border: 1px solid var(--glass-border);
            box-shadow: var(--shadow-sm);
            background: var(--color-surface-glass);
            backdrop-filter: var(--glass-blur);
          }

          .activity-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(17, 24, 39, 0.4);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            z-index: 2000;
          }

          .activity-modal-shell {
            width: min(1160px, calc(100vw - 48px));
            height: min(760px, calc(100vh - 48px));
            min-width: min(1160px, calc(100vw - 48px));
            min-height: min(760px, calc(100vh - 48px));
            max-width: min(1160px, calc(100vw - 48px));
            max-height: min(760px, calc(100vh - 48px));
            box-sizing: border-box;
            background: var(--color-surface-glass);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            box-shadow:
              0 28px 90px rgba(15, 23, 42, 0.15),
              0 10px 24px rgba(15, 23, 42, 0.06);
            display: grid;
            grid-template-rows: auto auto 1fr auto;
            overflow: hidden;
          }

          .activity-modal-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: var(--space-4);
            padding: 22px 24px 18px;
            border-bottom: 1px solid var(--color-divider);
            background:
              linear-gradient(
                180deg,
                color-mix(in oklab, var(--color-surface-offset) 88%, white) 0%,
                var(--color-surface) 100%
              );
          }

          .activity-modal-title-wrap {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            min-width: 0;
          }

          .activity-modal-badge {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-primary-highlight);
            color: var(--color-primary);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35);
            flex-shrink: 0;
          }

          .activity-modal-title {
            margin: 0;
            font-family: var(--font-display);
            font-size: clamp(1.35rem, 1.8vw, 1.7rem);
            font-weight: 700;
            color: var(--color-text);
            letter-spacing: -0.04em;
            line-height: 1.05;
          }

          .activity-modal-subtitle {
            margin: 6px 0 0;
            font-size: var(--text-sm);
            color: var(--color-text-muted);
            line-height: 1.55;
            max-width: 70ch;
          }

          .modal-icon-button {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            border: 1px solid color-mix(in oklab, var(--color-border) 82%, white);
            background: var(--color-surface);
            color: var(--color-text-muted);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
            transition:
              background var(--transition-interactive),
              color var(--transition-interactive),
              border-color var(--transition-interactive),
              transform var(--transition-interactive);
          }

          .modal-icon-button:hover {
            background: var(--color-surface-offset);
            color: var(--color-text);
            transform: translateY(-1px);
          }

          .activity-modal-toolbar {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            gap: 16px;
            padding: 16px 24px;
            border-bottom: 1px solid var(--color-divider);
            background: var(--color-surface-offset);
            flex-wrap: wrap;
          }

          .activity-search-panel {
            flex: 1 1 520px;
            min-width: 320px;
          }

          .activity-search-label {
            font-size: var(--text-xs);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 700;
            color: var(--color-text-muted);
            margin-bottom: 8px;
          }

          .activity-search {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
            min-height: 48px;
            border-radius: 14px;
            padding: 0 14px;
            background: color-mix(in oklab, var(--color-surface) 92%, white);
            border: 1px solid color-mix(in oklab, var(--color-border) 82%, white);
            box-shadow:
              0 1px 2px rgba(15, 23, 42, 0.04),
              inset 0 1px 0 rgba(255,255,255,0.35);
          }

          .activity-search:focus-within {
            border-color: var(--color-primary);
            box-shadow:
              0 0 0 3px color-mix(in oklab, var(--color-primary-highlight) 60%, transparent),
              0 1px 2px rgba(15, 23, 42, 0.04);
          }

          .activity-search svg {
            color: var(--color-text-muted);
            flex-shrink: 0;
          }

          .activity-search input {
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
            outline: none;
            color: var(--color-text);
            font-size: var(--text-sm);
          }

          .activity-search input::placeholder {
            color: var(--color-text-faint);
          }

          .activity-modal-stats {
            display: flex;
            align-items: stretch;
            gap: 12px;
            flex-wrap: wrap;
          }

          .activity-modal-stat {
            min-width: 108px;
            padding: 10px 12px;
            border-radius: 14px;
            background: color-mix(in oklab, var(--color-surface) 92%, white);
            border: 1px solid color-mix(in oklab, var(--color-border) 82%, white);
            box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
          }

          .activity-modal-stat-label {
            display: block;
            font-size: var(--text-xs);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 700;
            color: var(--color-text-muted);
            margin-bottom: 4px;
          }

          .activity-modal-stat-value {
            display: block;
            font-size: var(--text-base);
            font-weight: 700;
            color: var(--color-text);
            font-variant-numeric: tabular-nums lining-nums;
          }

          .activity-modal-body {
            min-height: 0;
            overflow: hidden;
            background: var(--color-surface);
          }

          .activity-modal-table-wrap {
            height: 100%;
            min-height: 100%;
            max-height: 100%;
            overflow: auto;
            padding: 0 24px 0;
          }

          .activity-modal-empty {
            height: 100%;
            min-height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .activity-modal-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 14px 24px;
            border-top: 1px solid var(--color-divider);
            background:
              linear-gradient(
                180deg,
                var(--color-surface) 0%,
                var(--color-surface-offset) 100%
              );
          }

          .activity-modal-footer-text {
            margin: 0;
            font-size: var(--text-xs);
            color: var(--color-text-muted);
            line-height: 1.5;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @media (max-width: 1200px) {
            .overview-chart-grid {
              grid-template-columns: 1fr !important;
            }

            .overview-agent-grid {
              grid-template-columns: 1fr !important;
            }

            .overview-chart-split {
              grid-template-columns: 1fr !important;
            }

            .overview-health-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 900px) {
            .metric-grid-5 {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .activity-modal-shell {
              width: calc(100vw - 32px);
              height: calc(100vh - 32px);
              min-width: calc(100vw - 32px);
              min-height: calc(100vh - 32px);
              max-width: calc(100vw - 32px);
              max-height: calc(100vh - 32px);
            }

            .activity-modal-footer {
              flex-direction: column;
              align-items: stretch;
            }

            .activity-modal-footer button {
              width: 100%;
            }
          }

          @media (max-width: 640px) {
            .metric-grid-5,
            .overview-health-grid {
              grid-template-columns: 1fr !important;
            }

            .activity-modal-overlay {
              padding: 12px;
            }

            .activity-modal-shell {
              width: calc(100vw - 24px);
              height: calc(100vh - 24px);
              min-width: calc(100vw - 24px);
              min-height: calc(100vh - 24px);
              max-width: calc(100vw - 24px);
              max-height: calc(100vh - 24px);
              border-radius: 18px;
            }

            .activity-modal-header,
            .activity-modal-toolbar,
            .activity-modal-footer {
              padding-left: 16px;
              padding-right: 16px;
            }

            .activity-modal-table-wrap {
              padding-left: 16px;
              padding-right: 16px;
            }

            .activity-search-panel {
              min-width: 0;
            }
          }
        `}</style>
      </div>

      <RecentActivityModal
        open={isActivityModalOpen}
        onClose={closeActivityModal}
        runs={recentRuns}
        searchQuery={activitySearch}
        onSearchChange={setActivitySearch}
      />
    </>
  );
}
