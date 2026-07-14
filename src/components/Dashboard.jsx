import { useEffect, useMemo, useState, useRef } from "react";
import { ChevronDown, RefreshCw, AlertTriangle, Database, Clock, Check } from "lucide-react";
import { Header, Footer } from "./Header";
import OverviewDashboard from "./OverviewDashboard";
import TechnicalDocDashboard from "./TechnicalDocDashboard";
import PPTDashboard from "./PPTDashboard";
import BRDDashboard from "./BRDDashboard";
import { ViewModeToggle } from "./MetricCard";
import { getAllAgents, loadAgentRunsDetailed } from "../services/dataService";

function RunSelectorSkeleton() {
  return (
    <div
      className="panel"
      style={{
        padding: "var(--space-5) var(--space-6)",
        marginBottom: "var(--space-6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-4)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          flex: 1,
        }}
      >
        <div className="skeleton skeleton-heading" style={{ width: "220px" }} />
        <div className="skeleton skeleton-text" style={{ width: "300px" }} />
      </div>
      <div
        className="skeleton"
        style={{
          width: "220px",
          height: "40px",
          borderRadius: "var(--radius-md)",
        }}
      />
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div className="metric-grid-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        <div className="skeleton skeleton-chart" />
        <div className="skeleton skeleton-chart" />
      </div>
    </div>
  );
}

function EmptyState({ title, message, icon: Icon = Database }) {
  return (
    <div className="panel empty-state">
      <span className="empty-state-icon">
        <Icon size={40} strokeWidth={1.4} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div
      className="panel"
      style={{
        padding: "var(--space-8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "var(--space-4)",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52,
          height: 52,
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--color-error-highlight)",
        }}
      >
        <AlertTriangle size={24} color="var(--color-error)" strokeWidth={1.8} />
      </span>

      <div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: "var(--space-2)",
          }}
        >
          No Data Found
        </p>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            maxWidth: "40ch",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

function getRunTimestamp(run) {
  if (!run) return "";
  const rawDate = run.timestamp_start || run.timestamp || run.recorded_at || run.timing?.run_started_at;
  if (!rawDate) return "N/A";

  const d = new Date(rawDate);
  if (isNaN(d.getTime())) return rawDate;

  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRunStatus(run) {
  if (!run) return "unknown";
  if (run.status) return run.status;
  if (typeof run.run_success === "boolean") {
    return run.run_success ? "success" : "failed";
  }
  return "unknown";
}

function getStatusDotColor(status) {
  if (status === "success") return "var(--color-success)";
  if (status === "failed") return "var(--color-error)";
  if (status === "pending") return "var(--color-warning)";
  return "var(--color-text-muted)";
}

function RunSelector({ runs, selectedRun, onRunChange, onRefresh, loading, viewMode, onViewModeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className="panel"
      style={{
        padding: "var(--space-4) var(--space-6)",
        marginBottom: "var(--space-6)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-4)",
        position: "relative",
        zIndex: 20,
      }}
    >
      <div>
        <p
          className="section-subheading"
          style={{ fontSize: "var(--text-base)", fontWeight: 600 }}
        >
          Execution Run
        </p>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            marginTop: "2px",
          }}
        >
          {runs.length} run{runs.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
      >
        <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />

        <span
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--color-text-muted)",
            whiteSpace: "nowrap",
            marginLeft: "var(--space-2)",
          }}
        >
          Select run
        </span>

        <div ref={dropdownRef} style={{ position: "relative", width: "320px" }}>
          <button
            type="button"
            className="select-field"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingInline: "var(--space-3)",
              cursor: "pointer",
              textAlign: "left",
              backgroundColor: "var(--color-surface)",
              border: isOpen ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              height: "2.625rem",
              width: "100%",
              outline: "none",
              boxShadow: isOpen ? "0 0 0 3px var(--color-primary-highlight)" : "var(--shadow-sm)",
              transition: "all var(--transition-interactive)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0 }}>
              <Clock size={14} style={{ flexShrink: 0, color: "var(--color-text-muted)" }} />
              <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontWeight: 600 }}>
                {selectedRun ? `${selectedRun.runLabel} (${getRunTimestamp(selectedRun)})` : "Select run..."}
              </span>
            </div>
            <ChevronDown
              size={15}
              style={{
                color: "var(--color-text-muted)",
                transition: "transform 200ms ease",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                flexShrink: 0,
              }}
            />
          </button>

          {isOpen && (
            <div
              className="dropdown-menu-popover"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: "var(--space-2)",
                backgroundColor: "var(--color-surface-glass)",
                backdropFilter: "var(--glass-blur)",
                WebkitBackdropFilter: "var(--glass-blur)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg), 0 10px 30px -10px rgba(0, 0, 0, 0.08)",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 100,
                padding: "var(--space-1)",
                animation: "dropdownFadeIn 180ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              role="listbox"
            >
              {runs.map((r, idx) => {
                const isSelected = r.run_id === selectedRun?.run_id;
                const status = getRunStatus(r);
                const dotColor = getStatusDotColor(status);
                return (
                  <button
                    key={r.run_id || r.runId || idx}
                    type="button"
                    onClick={() => {
                      onRunChange(r);
                      setIsOpen(false);
                    }}
                    role="option"
                    aria-selected={isSelected}
                    className="dropdown-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "var(--space-2) var(--space-3)",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: isSelected
                        ? "var(--color-primary-highlight)"
                        : "transparent",
                      color: isSelected ? "var(--color-primary)" : "var(--color-text)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "var(--text-sm)",
                      transition: "background-color 150ms ease, color 150ms ease",
                      gap: "var(--space-2)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0 }}>
                      <span style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: dotColor,
                        flexShrink: 0
                      }} />
                      <span style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        fontWeight: isSelected ? "600" : "500"
                      }}>
                        {r.runLabel} <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>— {getRunTimestamp(r)}</span>
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0 }}>
                      {idx === 0 && (
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "var(--radius-full)",
                            backgroundColor: isSelected
                              ? "var(--color-primary)"
                              : "var(--color-primary-highlight)",
                            color: isSelected
                              ? "var(--color-text-inverse)"
                              : "var(--color-primary)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          LATEST
                        </span>
                      )}
                      {isSelected && <Check size={14} style={{ color: "var(--color-primary)" }} />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          className="btn btn-secondary btn-icon"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh data"
          title="Refresh data"
          style={{ flexShrink: 0 }}
        >
          <RefreshCw size={15} />
        </button>
      </div>

      <style>{`
        .dropdown-item:hover {
          background-color: var(--color-surface-offset) !important;
          color: var(--color-text) !important;
        }
        
        .dropdown-item[aria-selected="true"]:hover {
          background-color: color-mix(in srgb, var(--color-primary) 12%, var(--color-surface)) !important;
          color: var(--color-primary) !important;
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function Dashboard() {
  const [activeAgent, setActiveAgent] = useState("overview");
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [loading, setLoading] = useState(false);
  const [runsLoading, setRunsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("high-level");

  const agents = useMemo(() => getAllAgents(), []);
  const isOverview = activeAgent === "overview";
  const requiresRunSelection = !isOverview;

  useEffect(() => {
    async function fetchRunsForAgent() {
      if (!requiresRunSelection) {
        setRuns([]);
        setSelectedRun(null);
        setError(null);
        setRunsLoading(false);
        setLoading(false);
        return;
      }

      setRunsLoading(true);
      setRuns([]);
      setSelectedRun(null);
      setError(null);

      try {
        const detailedRuns = await loadAgentRunsDetailed(activeAgent);
        setRuns(detailedRuns);

        if (detailedRuns.length > 0) {
          setSelectedRun(detailedRuns[0]);
        } else {
          setError(
            `No runs available for ${getAllAgents().find((a) => a.id === activeAgent)?.name ?? activeAgent}.`,
          );
        }
      } catch (err) {
        setError(`Failed to load available runs: ${err.message}`);
      } finally {
        setRunsLoading(false);
      }
    }

    fetchRunsForAgent();
  }, [activeAgent, requiresRunSelection]);

  const handleRefresh = async () => {
    if (!requiresRunSelection || !selectedRun) return;

    setLoading(true);
    setError(null);

    try {
      const detailedRuns = await loadAgentRunsDetailed(activeAgent);
      setRuns(detailedRuns);
      if (detailedRuns.length > 0) {
        const matched = detailedRuns.find((r) => r.filename === selectedRun.filename) || detailedRuns[0];
        setSelectedRun(matched);
      }
    } catch (err) {
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  function renderContent() {
    if (isOverview) {
      return <OverviewDashboard viewMode={viewMode} onViewModeChange={setViewMode} />;
    }

    if (runsLoading || loading) {
      return <ContentSkeleton />;
    }

    if (error) {
      return <ErrorState message={error} />;
    }

    if (!selectedRun) {
      return (
        <EmptyState
          title="No dashboard data yet"
          message="Select an execution run to view telemetry, quality, runtime, and output metrics."
        />
      );
    }

    if (activeAgent === "technical-document") {
      return <TechnicalDocDashboard data={selectedRun} key={selectedRun.run_id || selectedRun.runId} viewMode={viewMode} />;
    }

    if (activeAgent === "ppt") {
      return <PPTDashboard data={selectedRun} key={selectedRun.run_id || selectedRun.runId} viewMode={viewMode} />;
    }

    if (activeAgent === "brd") {
      return <BRDDashboard data={selectedRun} key={selectedRun.run_id || selectedRun.runId} viewMode={viewMode} />;
    }

    return null;
  }

  return (
    <div className="app-shell">
      <Header
        agents={agents}
        activeAgent={activeAgent}
        onAgentChange={setActiveAgent}
      />

      <main className="page-container" style={{ paddingTop: "var(--space-6)" }}>
        {requiresRunSelection &&
          (runsLoading ? (
            <RunSelectorSkeleton />
          ) : runs.length > 0 ? (
            <RunSelector
              runs={runs}
              selectedRun={selectedRun}
              onRunChange={setSelectedRun}
              onRefresh={handleRefresh}
              loading={loading}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          ) : null)}

        <div
          style={{
            animation: "fadeIn 220ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {renderContent()}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>

      <Footer />
    </div>
  );
}
