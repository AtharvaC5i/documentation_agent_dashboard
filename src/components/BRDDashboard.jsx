import { useMemo } from "react";
import { MetricCard, StatusCard, ProgressMetric } from "./MetricCard";
import PipelineFlow from "./common/PipelineFlow";
import {
  TokenBreakdownChart,
  QualityScoresChart,
  DurationBreakdownChart,
  SectionCompletenessChart,
  RequirementQualityChart,
} from "./Charts";
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock,
  Coins,
  Cpu,
  Database,
  FileCheck,
  FileOutput,
  FileText,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
  Timer,
  BookOpen,
  Star,
  UserCheck,
} from "lucide-react";

function toNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function SectionGrid({ columns = 2, children, className = "" }) {
  const gridClass =
    columns === 3
      ? "techdoc-grid techdoc-grid-3"
      : "techdoc-grid techdoc-grid-2";

  return <div className={`${gridClass} ${className}`.trim()}>{children}</div>;
}

function SectionBlock({ eyebrow, title, description, children }) {
  return (
    <section className="techdoc-section-block">
      {(eyebrow || title || description) && (
        <div className="techdoc-section-heading">
          {eyebrow ? <p className="techdoc-eyebrow">{eyebrow}</p> : null}
          {title ? <h3 className="techdoc-section-title">{title}</h3> : null}
          {description ? (
            <p className="techdoc-section-description">{description}</p>
          ) : null}
        </div>
      )}
      {children}
    </section>
  );
}

function DetailRow({ label, value, mono = false, noBorder = false }) {
  return (
    <div
      className={`techdoc-detail-row ${noBorder ? "techdoc-detail-row-last" : ""}`}
    >
      <span className="techdoc-detail-label">{label}</span>
      <span
        className={`techdoc-detail-value ${mono ? "techdoc-detail-value-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function DetailPanel({
  title,
  icon: Icon,
  subtitle,
  children,
  tone = "default",
}) {
  return (
    <section className={`panel techdoc-panel techdoc-panel-${tone}`}>
      <div className="panel-header techdoc-panel-header">
        <div className="techdoc-panel-title-wrap">
          {Icon ? (
            <span className="techdoc-panel-icon">
              <Icon size={15} strokeWidth={1.9} />
            </span>
          ) : null}

          <div className="techdoc-panel-title-copy">
            <p className="techdoc-panel-title">{title}</p>
            {subtitle ? (
              <p className="techdoc-panel-subtitle">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="panel-body techdoc-panel-body">{children}</div>
    </section>
  );
}

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  const kb = value / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function BRDRunMetricsDashboard({ data: dynamicData }) {
  const fallbackData = {
    run_id: "23195ef4-c481-4126-88f6-a1a606a38f9a",
    project_id: "b102e32d-4047-4ac0-9ee7-906c0cecd347",
    project_name: "ShopEasy",
    recorded_at: "2026-06-09T14:40:11.588389",
    run_outcome: {
      success: true,
      error_stage: null,
      error_category: null,
      error_message: null,
    },
    timing: {
      run_started_at: "2026-06-09T14:30:55.958729",
      run_ended_at: "2026-06-09T14:40:11.588389",
      total_duration_seconds: 555.63,
      extraction_duration_seconds: 141.3,
      generation_duration_seconds: 73.52,
      document_duration_seconds: 0.5,
    },
    llm_usage: {
      total_calls: 7,
      prompt_tokens: 15040,
      completion_tokens: 16230,
      total_tokens: 31270,
      by_stage: {
        extraction: {
          calls: 3,
          prompt_tokens: 4942,
          completion_tokens: 11536,
          total_tokens: 16478,
        },
        conflicts: {
          calls: 1,
          prompt_tokens: 1890,
          completion_tokens: 1433,
          total_tokens: 3323,
        },
        generation: {
          calls: 3,
          prompt_tokens: 8208,
          completion_tokens: 3261,
          total_tokens: 11469,
        },
      },
    },
    cost: {
      model_name: "databricks-claude-sonnet-4-6",
      prompt_cost_usd: 0.013536,
      completion_cost_usd: 0.043821,
      total_cost_usd: 0.057357,
      currency: "USD",
    },
    sections: {
      attempted: 3,
      succeeded: 3,
      failed: 0,
      success_rate_pct: 100.0,
      review_cycles: {
        total_regenerations: 0,
        sections_with_rework: [],
        per_section: {
          "af683879-4372-4ee4-b243-5b6c20bd3fd7": {
            name: "Executive Summary",
            cycles: 0,
          },
          "b2bc9ce3-96fb-43ed-9132-c742642f497e": {
            name: "Business Rules",
            cycles: 0,
          },
          "ef5217d8-01f4-4149-ac04-82b4b84ca5de": {
            name: "Glossary",
            cycles: 0,
          },
        },
      },
    },
    quality: {
      requirement_quality: {
        total_evaluated: 75,
        smart_scores: {
          avg_score: 0.675,
          specific_pct: 89.3,
          measurable_pct: 9.3,
          achievable_pct: 100.0,
          relevant_pct: 100.0,
          time_bound_pct: 33.3,
        },
        high_quality_count: 26,
        medium_quality_count: 41,
        low_quality_count: 8,
      },
      section_completeness: {
        overall_pct: 93.3,
        by_section: {
          "Executive Summary": {
            required_items: 5,
            present_items: 4,
            completeness_pct: 80.0,
          },
          "Business Rules": {
            required_items: 2,
            present_items: 2,
            completeness_pct: 100.0,
          },
          Glossary: {
            required_items: 2,
            present_items: 2,
            completeness_pct: 100.0,
          },
        },
      },
    },
    conflicts: {
      detected_count: 9,
      resolved_count: 9,
      unresolved_count: 0,
      high_impact_count: 6,
      medium_impact_count: 2,
      low_impact_count: 1,
      resolution_rate_pct: 100.0,
      accuracy_feedback: null,
    },
    output: {
      file_generated: true,
      filename: "BRD_ShopEasy_v1.docx",
      file_size_bytes: 37391,
      output_path:
        "D:\\Abhishek\\Projects\\documentation-agent\\brd-agent\\backend\\pipelines\\../../outputs\\BRD_ShopEasy_v1.docx",
      sections_included: 3,
      word_count_estimate: 1860,
    },
    acceptance: {
      status: "pending",
      reviewer: null,
      reviewed_at: null,
      notes: null,
    },
  };

  const data = dynamicData || fallbackData;
  const status = data.run_outcome?.success ? "success" : "failed";
  const totalDuration = toNum(data.timing?.total_duration_seconds, 0);
  const cost = toNum(data.cost?.total_cost_usd, 0);
  const timestamp = data.recorded_at || data.timing?.run_started_at || null;

  const llmUsage = data.llm_usage ?? {};
  const costModel = data.cost ?? {};
  const timing = data.timing ?? {};
  const sections = data.sections ?? {};
  const quality = data.quality ?? {};
  const conflicts = data.conflicts ?? {};
  const output = data.output ?? {};
  const acceptance = data.acceptance ?? {};
  
  const smart = quality.requirement_quality?.smart_scores ?? {};
  const completeness = quality.section_completeness ?? {};
  const byStage = llmUsage.by_stage ?? {};
  const reviewCycles = sections.review_cycles ?? {};
  const perSectionRework = reviewCycles.per_section ?? {};
  const totalRegens = toNum(reviewCycles.total_regenerations, 0);
  const sectionsReworked = toNum(reviewCycles.sections_with_rework?.length, 0);
  const reviewCyclesCount = toNum(data.review_cycle_count, 0);

  const stageTokens = useMemo(() => {
    if (!byStage) return {};
    const obj = {};
    Object.entries(byStage).forEach(([stageName, stageData]) => {
      obj[stageName] = stageData.total_tokens ?? 0;
    });
    return obj;
  }, [byStage]);

  const qualityScores = useMemo(() => {
    if (!smart) return {};
    return {
      specific: (smart.specific_pct ?? 0) / 100,
      measurable: (smart.measurable_pct ?? 0) / 100,
      achievable: (smart.achievable_pct ?? 0) / 100,
      relevant: (smart.relevant_pct ?? 0) / 100,
      time_bound: (smart.time_bound_pct ?? 0) / 100,
    };
  }, [smart]);

  const stageDurations = useMemo(() => {
    if (!timing) return {};
    return {
      extraction: timing.extraction_duration_seconds ?? 0,
      generation: timing.generation_duration_seconds ?? 0,
      document_assembly: timing.document_duration_seconds ?? 0,
    };
  }, [timing]);

  const sectionCompletenessScores = useMemo(() => {
    if (!completeness.by_section) return {};
    const obj = {};
    Object.entries(completeness.by_section).forEach(([secName, secData]) => {
      obj[secName] = (secData.completeness_pct ?? 0) / 100;
    });
    return obj;
  }, [completeness.by_section]);

  const completenessAlerts = useMemo(() => {
    if (!completeness.by_section) return [];
    const alerts = [];
    Object.entries(completeness.by_section).forEach(([name, sec]) => {
      const required = toNum(sec.required_items, 0);
      const present = toNum(sec.present_items, 0);
      if (present < required) {
        alerts.push({
          section: name,
          missing: required - present,
          present,
          required,
        });
      }
    });
    return alerts;
  }, [completeness.by_section]);

  return (
    <div className="techdoc-dashboard">
      <StatusCard
        status={status}
        duration={totalDuration}
        cost={cost}
        timestamp={timestamp}
      />

      <PipelineFlow agentType="brd" data={data} />

      <SectionBlock
        eyebrow="Execution overview"
        title="Business Requirements Document (BRD) pipeline"
        description="Core metrics, requirement completeness, conflict resolution, and end-to-end output details for the active BRD agent run."
      >
        <div className="metric-grid-4">
          <MetricCard
            label="Total Tokens"
            value={toNum(llmUsage.total_tokens, 0)}
            icon={BookOpen}
            unit="tokens"
            subtext={`${toNum(llmUsage.prompt_tokens, 0).toLocaleString()} prompt · ${toNum(llmUsage.completion_tokens, 0).toLocaleString()} completion`}
          />

          <MetricCard
            label="Run Duration"
            value={totalDuration}
            icon={Timer}
            unit="s"
            subtext={`${toNum(llmUsage.total_calls, 0)} LLM calls`}
          />

          <MetricCard
            label="SMART Quality"
            value={toNum(smart.avg_score, 0)}
            icon={Star}
            unit="/ 1.0"
            deltaType={toNum(smart.avg_score, 0) >= 0.65 ? "up" : "down"}
            delta={`${(toNum(smart.avg_score, 0) * 100).toFixed(1)}% score`}
          />

          <MetricCard
            label="Total Cost"
            value={cost}
            icon={Coins}
            unit="USD"
            subtext={`${costModel.model_name ?? "—"} (${toNum(costModel.prompt_cost_usd, 0).toFixed(4)} P · ${toNum(costModel.completion_cost_usd, 0).toFixed(4)} C)`}
          />
        </div>
      </SectionBlock>

      <SectionBlock
        eyebrow="Analytics"
        title="Token and duration breakdown"
        description="These views highlight stage-wise token usage and runtime metrics."
      >
        <SectionGrid columns={2}>
          <TokenBreakdownChart tokens={stageTokens} />
          <DurationBreakdownChart durations={stageDurations} />
        </SectionGrid>
      </SectionBlock>

      <SectionBlock
        eyebrow="Pipeline stages"
        title="Operational and timing details"
        description="A breakdown of run timestamps, stage durations, and detailed extraction vs generation metrics."
      >
        <SectionGrid columns={2}>
          <DetailPanel
            title="Execution Timeline"
            subtitle="Identifiers and phase timestamps"
            icon={Clock}
          >
            <DetailRow label="Run ID" value={data.run_id} mono />
            <DetailRow label="Project ID" value={data.project_id} mono />
            <DetailRow label="Project Name" value={data.project_name} />
            <DetailRow label="Recorded At" value={formatDateTime(timestamp)} />
            <DetailRow label="Started At" value={formatDateTime(timing.run_started_at)} />
            <DetailRow label="Ended At" value={formatDateTime(timing.run_ended_at)} noBorder />
          </DetailPanel>

          <DetailPanel
            title="Runtime Breakdown"
            subtitle="Stage duration profile contributions"
            icon={Timer}
            tone="accent"
          >
            <div className="techdoc-progress-stack-lg">
              <ProgressMetric
                label="Extraction"
                value={toNum(timing.extraction_duration_seconds, 0)}
                max={totalDuration}
                showPercent={false}
              />
              <ProgressMetric
                label="Generation"
                value={toNum(timing.generation_duration_seconds, 0)}
                max={totalDuration}
                showPercent={false}
              />
              <ProgressMetric
                label="Document Output"
                value={toNum(timing.document_duration_seconds, 0)}
                max={totalDuration}
                showPercent={false}
              />
            </div>
          </DetailPanel>
        </SectionGrid>
      </SectionBlock>

      <SectionBlock
        eyebrow="LLM Economics"
        title="Stage-wise token breakdown"
        description="LLM calls, prompt counts, and completion tokens utilized during extraction, conflict analysis, and document drafting."
      >
        <SectionGrid columns={3}>
          <DetailPanel
            title="Extraction Stage"
            subtitle="Retrieval and base extraction calls"
            icon={Cpu}
          >
            <DetailRow label="Calls" value={toNum(byStage.extraction?.calls, 0)} mono />
            <DetailRow label="Prompt Tokens" value={toNum(byStage.extraction?.prompt_tokens, 0).toLocaleString()} mono />
            <DetailRow label="Completion Tokens" value={toNum(byStage.extraction?.completion_tokens, 0).toLocaleString()} mono />
            <DetailRow label="Total Tokens" value={toNum(byStage.extraction?.total_tokens, 0).toLocaleString()} mono noBorder />
          </DetailPanel>

          <DetailPanel
            title="Conflict Resolution"
            subtitle="Consistency checking and parsing"
            icon={Scale}
          >
            <DetailRow label="Calls" value={toNum(byStage.conflicts?.calls, 0)} mono />
            <DetailRow label="Prompt Tokens" value={toNum(byStage.conflicts?.prompt_tokens, 0).toLocaleString()} mono />
            <DetailRow label="Completion Tokens" value={toNum(byStage.conflicts?.completion_tokens, 0).toLocaleString()} mono />
            <DetailRow label="Total Tokens" value={toNum(byStage.conflicts?.total_tokens, 0).toLocaleString()} mono noBorder />
          </DetailPanel>

          <DetailPanel
            title="Draft Generation"
            subtitle="Section layout and content writing"
            icon={FileText}
          >
            <DetailRow label="Calls" value={toNum(byStage.generation?.calls, 0)} mono />
            <DetailRow label="Prompt Tokens" value={toNum(byStage.generation?.prompt_tokens, 0).toLocaleString()} mono />
            <DetailRow label="Completion Tokens" value={toNum(byStage.generation?.completion_tokens, 0).toLocaleString()} mono />
            <DetailRow label="Total Tokens" value={toNum(byStage.generation?.total_tokens, 0).toLocaleString()} mono noBorder />
          </DetailPanel>
        </SectionGrid>
      </SectionBlock>

      <SectionBlock
        eyebrow="Quality signals"
        title="SMART dimensions & completeness"
        description="SMART rating breakdown for extracted requirements and section completeness checks."
      >
        <SectionGrid columns={3}>
          <QualityScoresChart scores={qualityScores} />
          <SectionCompletenessChart completenessScores={sectionCompletenessScores} />
          <RequirementQualityChart
            highCount={quality.requirement_quality?.high_quality_count ?? 0}
            mediumCount={quality.requirement_quality?.medium_quality_count ?? 0}
            lowCount={quality.requirement_quality?.low_quality_count ?? 0}
          />
        </SectionGrid>
      </SectionBlock>

      <SectionBlock
        eyebrow="Stability"
        title="Document Stability & Rework"
        description="Monitoring document refinement cycles, LLM regenerations, and section-level rework iterations."
      >
        {totalRegens === 0 && sectionsReworked === 0 ? (
          <div className="panel" style={{ 
            padding: "var(--space-6)", 
            display: "flex", 
            alignItems: "center", 
            gap: "var(--space-6)",
            background: "color-mix(in srgb, var(--color-success-highlight) 15%, var(--color-surface))",
            border: "1px solid color-mix(in srgb, var(--color-success) 20%, var(--color-border))"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "var(--color-success-highlight)",
              color: "var(--color-success)",
              flexShrink: 0
            }}>
              <ShieldCheck size={28} strokeWidth={2} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "4px" }}>
                <h4 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--color-text)" }}>
                  First-Pass Stability Achieved
                </h4>
                <span className="badge badge-success" style={{ fontSize: "10px", padding: "2px 8px" }}>100% Stable</span>
              </div>
              <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.5, maxWidth: "600px" }}>
                All document sections (including {Object.values(perSectionRework).map(s => s.name).join(", ") || "Executive Summary, Stakeholder Register, Risks"}) were compiled successfully in a single draft. No LLM correction cycles or manual regeneration runs were triggered.
              </p>
              <div style={{ display: "flex", gap: "var(--space-6)", marginTop: "var(--space-4)" }}>
                <div>
                  <span style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Regenerations</span>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: "700", color: "var(--color-text)" }}>0 cycles</p>
                </div>
                <div style={{ width: "1px", background: "var(--color-divider)" }} />
                <div>
                  <span style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Review Cycles</span>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: "700", color: "var(--color-text)" }}>{reviewCyclesCount} completed</p>
                </div>
                <div style={{ width: "1px", background: "var(--color-divider)" }} />
                <div>
                  <span style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Refinement Loop</span>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: "700", color: "var(--color-success)" }}>Optimal</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SectionGrid columns={2}>
            <DetailPanel
              title="Refinement & Iteration Logs"
              subtitle="Regeneration counts and section modifications"
              icon={Activity}
            >
              <DetailRow label="Total Section Regenerations" value={toNum(reviewCycles.total_regenerations, 0)} mono />
              <DetailRow label="Sections Requiring Rework" value={toNum(reviewCycles.sections_with_rework?.length, 0)} mono />
              <DetailRow label="Review Cycles Completed" value={toNum(data.review_cycle_count, 0)} mono noBorder />
            </DetailPanel>

            <DetailPanel
              title="Section Rework Frequency"
              subtitle="Regenerations per section"
              icon={Layers}
            >
              <div className="techdoc-progress-stack" style={{ marginTop: "var(--space-2)" }}>
                {Object.keys(perSectionRework).length > 0 ? (
                  Object.entries(perSectionRework).map(([id, sec]) => (
                    <ProgressMetric
                      key={id}
                      label={sec.name ?? id}
                      value={toNum(sec.cycles, 0)}
                      max={Math.max(toNum(reviewCycles.total_regenerations, 0), 1)}
                      showPercent={false}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-text-faint)", fontSize: "var(--text-xs)" }}>
                    All sections stable. No rework iterations detected.
                  </div>
                )}
              </div>
            </DetailPanel>
          </SectionGrid>
        )}
      </SectionBlock>

      <SectionBlock
        eyebrow="Compliance"
        title="Completeness Gap Audit"
        description="Verification audit of mandatory requirements and clauses present in the generated document sections."
      >
        {completenessAlerts.length > 0 ? (
          <div className="panel" style={{ 
            padding: "var(--space-5) var(--space-6)", 
            background: "color-mix(in srgb, var(--color-warning-highlight) 15%, var(--color-surface))",
            border: "1px solid color-mix(in srgb, var(--color-warning) 20%, var(--color-border))",
            borderRadius: "var(--radius-lg)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "var(--color-warning-highlight)",
                color: "var(--color-warning)"
              }}>
                <AlertTriangle size={15} strokeWidth={2.2} />
              </span>
              <div>
                <h4 style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-text)" }}>
                  Completeness Gaps Discovered ({completenessAlerts.length} issues)
                </h4>
                <p style={{ margin: 0, fontSize: "10px", color: "var(--color-text-muted)" }}>
                  Mandatory components are missing from the sections below. Add these elements to achieve compliance.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {completenessAlerts.map((alert, idx) => (
                <div key={idx} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  padding: "10px 14px", 
                  borderRadius: "var(--radius-md)", 
                  border: "1px solid var(--color-divider)", 
                  background: "var(--color-surface)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <span style={{ color: "var(--color-error)" }}>⚠️</span>
                    <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text)" }}>
                      {alert.section} Section
                    </span>
                  </div>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-error)" }}>
                    Missing {alert.missing} required item{alert.missing !== 1 ? "s" : ""} ({alert.present}/{alert.required} present)
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="panel" style={{ 
            padding: "var(--space-5) var(--space-6)", 
            display: "flex", 
            alignItems: "center", 
            gap: "var(--space-4)",
            background: "color-mix(in srgb, var(--color-success-highlight) 15%, var(--color-surface))",
            border: "1px solid color-mix(in srgb, var(--color-success) 20%, var(--color-border))",
            borderRadius: "var(--radius-lg)"
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "var(--color-success-highlight)",
              color: "var(--color-success)"
            }}>
              <CheckCircle2 size={16} strokeWidth={2.2} />
            </span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <h4 style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-text)" }}>
                  All Sections Fully Compliant
                </h4>
                <span className="badge badge-success" style={{ fontSize: "9px", padding: "1px 6px" }}>100% Audit Passed</span>
              </div>
              <p style={{ margin: 0, fontSize: "10px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                Mandatory criteria evaluation completed. All evaluated sections contain the required clauses, glossary metrics, and business rules.
              </p>
            </div>
          </div>
        )}
      </SectionBlock>

      <SectionBlock
        eyebrow="Conflicts & Output"
        title="Verification outcomes and delivery"
        description="Identified consistency issues and output document specifications."
      >
        <SectionGrid columns={3} className="techdoc-details-large">
          <DetailPanel
            title="Conflict Resolution"
            subtitle="Requirements verification audit"
            icon={ShieldCheck}
          >
            <DetailRow label="Detected Conflicts" value={toNum(conflicts.detected_count, 0)} mono />
            <DetailRow label="Resolved Conflicts" value={toNum(conflicts.resolved_count, 0)} mono />
            <DetailRow label="Resolution Rate" value={`${toNum(conflicts.resolution_rate_pct, 0)}%`} mono />
            <DetailRow label="Unresolved Count" value={toNum(conflicts.unresolved_count, 0)} mono />
            <DetailRow label="Accuracy Feedback" value={conflicts.accuracy_feedback ?? "None"} noBorder />
          </DetailPanel>

          <DetailPanel
            title="Conflict Severity Matrix"
            subtitle="Impact level of detected conflicts"
            icon={Scale}
          >
            <div className="techdoc-progress-stack" style={{ marginTop: "var(--space-2)" }}>
              <ProgressMetric
                label="High Impact"
                value={toNum(conflicts.high_impact_count, 0)}
                max={Math.max(toNum(conflicts.detected_count, 0), 1)}
                showPercent={false}
              />
              <ProgressMetric
                label="Medium Impact"
                value={toNum(conflicts.medium_impact_count, 0)}
                max={Math.max(toNum(conflicts.detected_count, 0), 1)}
                showPercent={false}
              />
              <ProgressMetric
                label="Low Impact"
                value={toNum(conflicts.low_impact_count, 0)}
                max={Math.max(toNum(conflicts.detected_count, 0), 1)}
                showPercent={false}
              />
            </div>
            <div style={{ display: "flex", height: "8px", borderRadius: "var(--radius-sm)", overflow: "hidden", marginTop: "var(--space-4)", background: "var(--color-surface-offset)" }}>
              {toNum(conflicts.detected_count, 0) > 0 ? (
                <>
                  <div style={{ width: `${(toNum(conflicts.high_impact_count, 0) / toNum(conflicts.detected_count, 1)) * 100}%`, background: "var(--color-error)" }} title="High Impact" />
                  <div style={{ width: `${(toNum(conflicts.medium_impact_count, 0) / toNum(conflicts.detected_count, 1)) * 100}%`, background: "var(--color-warning)" }} title="Medium Impact" />
                  <div style={{ width: `${(toNum(conflicts.low_impact_count, 0) / toNum(conflicts.detected_count, 1)) * 100}%`, background: "var(--color-success)" }} title="Low Impact" />
                </>
              ) : (
                <div style={{ width: "100%", background: "var(--color-divider)" }} />
              )}
            </div>
          </DetailPanel>

          <DetailPanel
            title="Output Document"
            subtitle="Generated DOCX file specs"
            icon={FileOutput}
            tone="accent"
          >
            <div className="techdoc-output-file-card">
              <p className="techdoc-output-file-label">Output Document</p>
              <p className="techdoc-output-file-name" title={output.filename}>
                {output.filename ?? "N/A"}
              </p>
            </div>
            <DetailRow label="File Size" value={formatBytes(output.file_size_bytes)} mono />
            <DetailRow label="Word Count (est)" value={toNum(output.word_count_estimate, 0).toLocaleString()} mono />
            <DetailRow label="Sections Included" value={toNum(output.sections_included, 0)} mono noBorder />
          </DetailPanel>
        </SectionGrid>
      </SectionBlock>

      {!data.run_outcome?.success && data.run_outcome?.error_message && (
        <section className="techdoc-error-banner">
          <div className="techdoc-error-accent" aria-hidden="true" />
          <div className="techdoc-error-icon-wrap">
            <AlertTriangle size={18} strokeWidth={1.9} />
          </div>
          <div className="techdoc-error-copy">
            <p className="techdoc-error-title">
              {data.run_outcome?.error_category || "Execution error"}
            </p>
            <p className="techdoc-error-text">
              {data.run_outcome?.error_message}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
