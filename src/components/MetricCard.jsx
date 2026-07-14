import { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

// Animates a number from 0 to target on mount
function useCountUp(target, duration = 800) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const isFloat = typeof target === "number" && target % 1 !== 0;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(
        isFloat ? parseFloat(current.toFixed(2)) : Math.round(current),
      );
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  unit = "",
  subtext = "",
  delta = null, // e.g. "+12.4%" or "-3.1%"
  deltaType = "flat", // "up" | "down" | "flat"
  className = "",
}) {
  const isNumeric = typeof value === "number";
  const animated = useCountUp(isNumeric ? value : 0);
  const displayed = isNumeric ? animated : value;

  const DeltaIcon =
    deltaType === "up"
      ? TrendingUp
      : deltaType === "down"
        ? TrendingDown
        : Minus;

  return (
    <div
      className={`kpi-card ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      {/* Top row: label + icon */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "var(--space-3)",
        }}
      >
        <p className="kpi-label">{label}</p>
        {Icon && (
          <span
            style={{
              color: "var(--color-text-faint)",
              flexShrink: 0,
              marginTop: "1px",
            }}
          >
            <Icon size={16} strokeWidth={1.8} />
          </span>
        )}
      </div>

      {/* Value row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "var(--space-2)",
        }}
      >
        <span className="kpi-value">
          {isNumeric
            ? typeof value === "number" && value % 1 !== 0
              ? displayed.toFixed(2)
              : displayed.toLocaleString()
            : value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              fontWeight: 500,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Bottom row: delta + subtext */}
      {(delta || subtext) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-2)",
          }}
        >
          {delta && (
            <span className={`kpi-delta kpi-delta-${deltaType}`}>
              <DeltaIcon size={11} strokeWidth={2.5} />
              {delta}
            </span>
          )}
          {subtext && (
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-faint)",
                marginLeft: "auto",
              }}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function StatusCard({ status, duration, cost, timestamp, runLabel, runId }) {
  const isSuccess = status === "success";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!runId) return;
    navigator.clipboard.writeText(runId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = isSuccess ? "var(--color-success)" : "var(--color-error)";
  const statusBg = isSuccess ? "var(--color-success-highlight)" : "var(--color-error-highlight)";
  const statusLabel = isSuccess ? "Healthy" : "Failed";

  return (
    <div
      className="panel"
      style={{
        padding: "var(--space-6)",
        position: "relative",
        overflow: "hidden",
        borderLeft: `4px solid ${statusColor}`
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
        }}
      >
        {/* Status header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "var(--radius-lg)",
              backgroundColor: statusBg,
              flexShrink: 0,
            }}
          >
            {isSuccess ? (
              <CheckCircle
                size={22}
                color="var(--color-success)"
                strokeWidth={2}
              />
            ) : (
              <AlertCircle
                size={22}
                color="var(--color-error)"
                strokeWidth={2}
              />
            )}
          </span>
          <div style={{ flex: 1, minWidth: 150 }}>
            <p className="section-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Execution Run Label
              {runLabel && (
                <span style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "10px",
                  fontWeight: 700,
                  backgroundColor: "var(--color-surface-offset-2)",
                  color: "var(--color-text)",
                  padding: "1px 6px",
                  borderRadius: "var(--radius-sm)",
                  letterSpacing: "0"
                }}>
                  {runLabel}
                </span>
              )}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                {runLabel || "Unknown Run"}
              </p>
              {runId && (
                <button
                  onClick={handleCopy}
                  type="button"
                  title="Click to copy full Run ID"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    backgroundColor: "var(--color-surface-offset)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "2px 8px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all var(--transition-interactive)",
                    outline: "none"
                  }}
                  className="copy-badge-btn"
                >
                  <span>{runId.length > 8 ? `${runId.slice(0, 8)}...` : runId}</span>
                  <span style={{ fontSize: "9px", color: copied ? "var(--color-success)" : "var(--color-text-faint)", fontWeight: 600 }}>
                    {copied ? "COPIED!" : "COPY"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Status badge */}
          <span
            className={isSuccess ? "badge badge-success" : "badge badge-error"}
            style={{
              marginLeft: "auto",
              padding: "5px 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span
              className={
                isSuccess
                  ? "status-dot status-dot-success"
                  : "status-dot status-dot-error"
              }
              style={{ width: 8, height: 8 }}
            />
            <span style={{ fontWeight: 700, textTransform: "capitalize" }}>{statusLabel}</span>
          </span>
        </div>

        {/* Divider */}
        <div className="divider" style={{ margin: "2px 0" }} />

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--space-4)",
          }}
        >
          <StatItem
            icon={<Clock size={14} strokeWidth={1.8} />}
            label="Duration"
            value={duration ? `${duration.toFixed(2)}s` : "—"}
          />
          <StatItem
            icon={<DollarSign size={14} strokeWidth={1.8} />}
            label="Est. Cost"
            value={cost ? `$${cost.toFixed(4)}` : "—"}
          />
          <StatItem
            icon={<Zap size={14} strokeWidth={1.8} />}
            label="Executed"
            value={
              timestamp
                ? new Date(timestamp).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "N/A"
            }
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-1)",
          color: "var(--color-text-muted)",
        }}
      >
        {icon}
        <span className="section-label" style={{ letterSpacing: "0.06em" }}>
          {label}
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-lg)",
          fontWeight: 700,
          color: "var(--color-text)",
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums lining-nums",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export function ProgressMetric({
  label,
  value,
  max = 100,
  showPercent = true,
  unit = "",
  useStatusColor = false,
}) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  const fillClass =
    useStatusColor
      ? percentage < 25
        ? "progress-fill progress-fill-error"
        : percentage < 50
          ? "progress-fill progress-fill-warning"
          : "progress-fill"
      : "progress-fill";

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-2)",
        }}
      >
        <p className="section-label">{label}</p>
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "var(--color-text)",
            backgroundColor: "var(--color-surface-offset)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            padding: "1px var(--space-2)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {showPercent
            ? `${percentage.toFixed(0)}%`
            : unit
              ? `${value.toLocaleString()} ${unit}`
              : `${value} / ${max}`}
        </span>
      </div>
      <div className="progress-track">
        <div className={fillClass} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export function ViewModeToggle({ viewMode, onViewModeChange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "var(--color-surface-offset)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "3px",
        gap: "4px",
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={() => onViewModeChange("high-level")}
        style={{
          border: "none",
          borderRadius: "var(--radius-md)",
          padding: "6px 14px",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          cursor: "pointer",
          backgroundColor: viewMode === "high-level" ? "var(--color-surface)" : "transparent",
          color: viewMode === "high-level" ? "var(--color-primary)" : "var(--color-text-muted)",
          boxShadow: viewMode === "high-level" ? "var(--shadow-sm)" : "none",
          transition: "all var(--transition-interactive)",
          outline: "none",
        }}
      >
        High-Level View
      </button>
      <button
        type="button"
        onClick={() => onViewModeChange("detailed")}
        style={{
          border: "none",
          borderRadius: "var(--radius-md)",
          padding: "6px 14px",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          cursor: "pointer",
          backgroundColor: viewMode === "detailed" ? "var(--color-surface)" : "transparent",
          color: viewMode === "detailed" ? "var(--color-primary)" : "var(--color-text-muted)",
          boxShadow: viewMode === "detailed" ? "var(--shadow-sm)" : "none",
          transition: "all var(--transition-interactive)",
          outline: "none",
        }}
      >
        Drill-down View
      </button>
    </div>
  );
}

