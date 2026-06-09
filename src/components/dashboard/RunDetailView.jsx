import { Card } from "../common/Card";
import { Badge, getStatusVariant } from "../common/Badge";
import { PPTAgentMetrics } from "../metrics/PPTAgentMetrics";
import { TechnicalDocumentMetrics } from "../metrics/TechnicalDocumentMetrics";

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RunDetailView({ run, agent }) {
  if (!run) {
    return (
      <Card title="Selected Run" subtitle="Run-level metrics and analytics">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-sm font-medium text-gray-700">No run selected</p>
          <p className="mt-1 text-sm text-gray-500">
            Choose a run from the selector to view detailed execution analytics.
          </p>
        </div>
      </Card>
    );
  }

  const renderAgentMetrics = () => {
    if (agent === "ppt-architect") {
      return <PPTAgentMetrics run={run} />;
    }
    if (agent === "technical-document") {
      return <TechnicalDocumentMetrics run={run} />;
    }
    // For other agents, show a placeholder
    return (
      <Card title="Metrics">
        <p className="text-sm text-gray-600">
          No specialized metrics available for this agent type.
        </p>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Run Details
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {agent === "ppt-architect" && "PowerPoint Architect Metrics"}
              {agent === "technical-document" &&
                "Technical Documentation Metrics"}
              {agent === "brd-agent" && "BRD Agent Metrics"}
              {!["ppt-architect", "technical-document", "brd-agent"].includes(
                agent,
              ) && "Run Metrics"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Complete execution analytics and quality measurements for this
              run.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">{run.run_id}</Badge>
            <Badge variant="neutral">{run.project_id || "No project"}</Badge>
            <Badge variant={getStatusVariant(run.status)} showDot>
              {run.status || "Unknown"}
            </Badge>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Agent
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">{agent}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Environment
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {run.environment || "N/A"}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Start Time
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {formatDateTime(run.start_time)}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Duration
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {run.end_to_end_duration_seconds
                ? `${run.end_to_end_duration_seconds.toFixed(1)}s`
                : "N/A"}
            </p>
          </div>
        </div>
      </section>

      <section>{renderAgentMetrics()}</section>
    </div>
  );
}
