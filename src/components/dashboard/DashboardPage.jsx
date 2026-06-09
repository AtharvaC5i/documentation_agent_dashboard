import { useMemo, useState } from "react";
import { AGENT_LABELS, DEFAULT_AGENT } from "../../data/agents";
import { AgentSelector } from "./AgentSelector";
import { RunSelector } from "./RunSelector";
import { RunDetailView } from "./RunDetailView";
import { GlobalAgentView } from "./GlobalAgentView";
import { CrossAgentOverview } from "./CrossAgentOverview";
import { Card } from "../common/Card";
import { Spinner } from "../common/Spinner";
import { Badge } from "../common/Badge";
import { useRuns, useRunsByAgent } from "../../hooks/useRuns";
import { useAgentMetrics } from "../../hooks/useAgentMetrics";
import { useCrossAgentMetrics } from "../../hooks/useCrossAgentMetrics";
import { LayoutDashboard, Globe2, BarChart3 } from "lucide-react";

const VIEW_MODES = {
  RUN: "run",
  GLOBAL: "global",
  CROSS_AGENT: "cross-agent",
};

export function DashboardPage() {
  const [selectedAgent, setSelectedAgent] = useState(DEFAULT_AGENT);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [viewMode, setViewMode] = useState(VIEW_MODES.GLOBAL);

  const { data: allRuns = [], isLoading: allRunsLoading } = useRuns();
  const { data: agentRuns = [], isLoading: agentRunsLoading } =
    useRunsByAgent(selectedAgent);

  const agentMetrics = useAgentMetrics(agentRuns);
  const crossAgentMetrics = useCrossAgentMetrics(allRuns);

  const selectedRun = useMemo(() => {
    if (!agentRuns.length) return null;
    if (selectedRunId) {
      return agentRuns.find((run) => run.run_id === selectedRunId) || null;
    }
    return agentRuns[0] || null;
  }, [agentRuns, selectedRunId]);

  const crossQuality = useMemo(() => {
    const valid = crossAgentMetrics.filter((item) => item.avgQuality != null);
    if (!valid.length) return "—";
    const avg =
      valid.reduce((sum, item) => sum + item.avgQuality, 0) / valid.length;
    return `${(avg * 100).toFixed(1)}%`;
  }, [crossAgentMetrics]);

  const handleAgentChange = (agent) => {
    setSelectedAgent(agent);
    setSelectedRunId("");
    setViewMode(VIEW_MODES.GLOBAL);
  };

  const handleRunChange = (runId) => {
    setSelectedRunId(runId);
    setViewMode(runId ? VIEW_MODES.RUN : VIEW_MODES.GLOBAL);
  };

  if (allRunsLoading || agentRunsLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="space-y-3 text-center">
          <Spinner size="lg" />
          <p className="text-sm text-slate-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Monitoring Platform
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Documentation Agent Metrics
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              Real-time analytics for Technical Documentation, PowerPoint
              Architect, and BRD agents. Select an agent and run to view
              detailed metrics and quality analysis.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                All Runs
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900">
                {allRuns.length}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Agent Runs
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900">
                {agentRuns.length}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Success Rate
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-700">
                {agentMetrics?.successRate != null
                  ? `${agentMetrics.successRate.toFixed(1)}%`
                  : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Cross Quality
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-blue-700">
                {crossQuality}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Card className="rounded-lg">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1.2fr_1fr]">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              Agent
            </label>
            <AgentSelector
              selectedAgent={selectedAgent}
              onChange={handleAgentChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              Run
            </label>
            <RunSelector
              runs={agentRuns}
              selectedRunId={selectedRunId}
              onChange={handleRunChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              View Mode
            </label>
            <div className="grid grid-cols-3 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setViewMode(VIEW_MODES.RUN)}
                className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  viewMode === VIEW_MODES.RUN
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Run
              </button>

              <button
                type="button"
                onClick={() => setViewMode(VIEW_MODES.GLOBAL)}
                className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  viewMode === VIEW_MODES.GLOBAL
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Agent
              </button>

              <button
                type="button"
                onClick={() => setViewMode(VIEW_MODES.CROSS_AGENT)}
                className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  viewMode === VIEW_MODES.CROSS_AGENT
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Globe2 className="h-4 w-4" />
                Cross
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4">
          <Badge variant="primary">{AGENT_LABELS[selectedAgent]}</Badge>
          {viewMode === VIEW_MODES.RUN ? (
            <Badge variant="info">
              Run: {selectedRun?.run_id || "No run selected"}
            </Badge>
          ) : null}
          {viewMode === VIEW_MODES.GLOBAL ? (
            <Badge variant="success">{agentRuns.length} runs</Badge>
          ) : null}
          {viewMode === VIEW_MODES.CROSS_AGENT ? (
            <Badge variant="warning">Cross-Agent View</Badge>
          ) : null}
        </div>
      </Card>

      {viewMode === VIEW_MODES.RUN ? (
        <RunDetailView run={selectedRun} agent={selectedAgent} />
      ) : null}

      {viewMode === VIEW_MODES.GLOBAL ? (
        <GlobalAgentView runs={agentRuns} />
      ) : null}

      {viewMode === VIEW_MODES.CROSS_AGENT ? (
        <CrossAgentOverview allRuns={allRuns} />
      ) : null}
    </div>
  );
}
