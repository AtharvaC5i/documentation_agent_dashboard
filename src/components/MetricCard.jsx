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

export function StatusCard({ status, duration, cost, timestamp }) {
  const isSuccess = status === "success";

  return (
    <div className="panel" style={{ padding: "var(--space-6)" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        {/* Status header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
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
              backgroundColor: isSuccess
                ? "var(--color-success-highlight)"
                : "var(--color-error-highlight)",
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
          <div>
            <p className="section-label">Execution Status</p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                color: "var(--color-text)",
                letterSpacing: "-0.02em",
                textTransform: "capitalize",
                marginTop: "var(--space-1)",
              }}
            >
              {status}
            </p>
          </div>

          {/* Status badge */}
          <span
            className={isSuccess ? "badge badge-success" : "badge badge-error"}
            style={{ marginLeft: "auto" }}
          >
            <span
              className={
                isSuccess
                  ? "status-dot status-dot-success"
                  : "status-dot status-dot-error"
              }
            />
            {isSuccess ? "Healthy" : "Failed"}
          </span>
        </div>

        {/* Divider */}
        <div className="divider" />

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
