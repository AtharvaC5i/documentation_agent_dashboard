import { MetricCard, StatusCard, ProgressMetric } from "./MetricCard";
import PipelineFlow from "./common/PipelineFlow";
import {
  TokenBreakdownChart,
  DurationBreakdownChart,
  QualityScoresChart,
  CoverageChart,
  TokenDistributionChart,
} from "./Charts";
import {
  BookOpen,
  Layers,
  Star,
  AlertTriangle,
  FileCheck,
  Timer,
  CheckCircle2,
  Presentation,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Workflow,
  FileText,
  LayoutTemplate,
  Clock3,
} from "lucide-react";

function SectionGrid({ columns = 2, children, className = "" }) {
  const gridClass =
    columns === 3
      ? "ppt-grid ppt-grid-3"
      : columns === 1
        ? "ppt-grid ppt-grid-1"
        : "ppt-grid ppt-grid-2";

  return <div className={`${gridClass} ${className}`.trim()}>{children}</div>;
}

function DetailRow({ label, value, mono = false, noBorder = false }) {
  return (
    <div className={`detail-row ${noBorder ? "detail-row-no-border" : ""}`}>
      <span className="detail-label">{label}</span>
      <span className={`detail-value ${mono ? "detail-value-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function DetailPanel({
  title,
  icon: Icon,
  children,
  subtitle,
  tone = "default",
}) {
  return (
    <section className={`panel panel-detail panel-tone-${tone}`}>
      <div className="panel-header detail-panel-header">
        <div className="detail-panel-title-wrap">
          {Icon && (
            <span className="detail-panel-icon">
              <Icon size={15} strokeWidth={1.9} />
            </span>
          )}

          <div className="detail-panel-copy">
            <p className="detail-panel-title">{title}</p>
            {subtitle && <p className="detail-panel-subtitle">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="panel-body detail-panel-body">{children}</div>
    </section>
  );
}

function PhaseCard({ label, seconds, totalSeconds, skipped = false }) {
  const pct =
    totalSeconds > 0 ? Number(((seconds / totalSeconds) * 100).toFixed(1)) : 0;

  return (
    <section
      className={`panel phase-card ${skipped ? "phase-card-skipped" : ""}`}
    >
      <div className="phase-card-head">
        <div className="phase-card-label-wrap">
          <span className="phase-card-icon">
            <Clock3 size={13} strokeWidth={2.1} />
          </span>
          <p className="phase-card-label">{label}</p>
        </div>

        {skipped && <span className="badge badge-neutral">Skipped</span>}
      </div>

      <div className="phase-card-metric-row">
        <div className="phase-card-metric-block">
          <p className="phase-card-value">{Number(seconds ?? 0).toFixed(2)}</p>
          <span className="phase-card-unit">s</span>
        </div>

        {!skipped && (
          <div className="phase-card-percent-pill">{pct.toFixed(1)}%</div>
        )}
      </div>

      {!skipped ? (
        <>
          <div className="phase-progress-shell" aria-hidden="true">
            <div className="phase-progress-track">
              <div
                className="phase-progress-fill"
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>

          <div className="phase-card-meta">
            <span className="phase-card-footnote">of total runtime</span>
            <span className="phase-card-footnote-mono">
              {Number(seconds ?? 0).toFixed(2)}s&thinsp;/&thinsp;
              {Number(totalSeconds ?? 0).toFixed(2)}s
            </span>
          </div>
        </>
      ) : (
        <div className="phase-card-empty">
          <p className="phase-card-footnote">
            This phase was not executed in this run.
          </p>
        </div>
      )}
    </section>
  );
}

function ValidationRow({ label, pass, noBorder = false }) {
  return (
    <div className={`detail-row ${noBorder ? "detail-row-no-border" : ""}`}>
      <span className="detail-label">{label}</span>

      <span className={`badge ${pass ? "badge-success" : "badge-error"}`}>
        <span
          className={`status-dot ${
            pass ? "status-dot-success" : "status-dot-error"
          }`}
        />
        {pass ? "Pass" : "Fail"}
      </span>
    </div>
  );
}

function StatChip({ label, value, subtle = false }) {
  return (
    <div className={`stat-chip ${subtle ? "stat-chip-subtle" : ""}`}>
      <p className="stat-chip-label">{label}</p>
      <p className="stat-chip-value">{value}</p>
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <section className="error-banner">
      <div className="error-banner-accent" aria-hidden="true" />

      <div className="error-banner-icon-wrap">
        <AlertTriangle size={17} strokeWidth={1.9} />
      </div>

      <div className="error-banner-copy">
        <p className="error-banner-title">Error During Execution</p>
        <p className="error-banner-message">{message}</p>
      </div>
    </section>
  );
}

function SectionBlock({ eyebrow, title, subtitle, icon: Icon, children }) {
  return (
    <section className="dashboard-section-block">
      <div className="dashboard-section-head">
        <div className="dashboard-section-head-left">
          {Icon && (
            <span className="dashboard-section-icon">
              <Icon size={15} strokeWidth={1.9} />
            </span>
          )}

          <div>
            {eyebrow && <p className="section-label">{eyebrow}</p>}
            {title && <h3 className="dashboard-section-title">{title}</h3>}
            {subtitle && (
              <p className="dashboard-section-subtitle">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}

function toBool(value) {
  if (value === true) return true;
  if (value === false) return false;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "pass", "passed", "yes", "1"].includes(normalized))
      return true;
    if (["false", "fail", "failed", "no", "0"].includes(normalized))
      return false;
  }

  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  return false;
}

function pickFirstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function formatBytesToMB(bytes) {
  return `${(toNumber(bytes, 0) / 1024 / 1024).toFixed(2)} MB`;
}

function normalizePptxValidation(pptxValidation = {}) {
  const file_created = !!(
    pptxValidation?.file_created ?? pptxValidation?.fileCreated
  );
  const valid_xml = !!(pptxValidation?.valid_xml ?? pptxValidation?.validXml);
  const valid_relationships = !!(
    pptxValidation?.valid_relationships ?? pptxValidation?.validRelationships
  );
  const opens_without_repair = !!(
    pptxValidation?.opens_without_repair ?? pptxValidation?.opensWithoutRepair
  );
  const all_slides_present = !!(
    pptxValidation?.all_slides_present ?? pptxValidation?.allSlidesPresent
  );
  const all_media_present = !!(
    pptxValidation?.all_media_present ?? pptxValidation?.allMediaPresent
  );

  const checks = [
    file_created,
    valid_xml,
    valid_relationships,
    opens_without_repair,
    all_slides_present,
    all_media_present,
  ];

  const derived_health_score =
    checks.length > 0 ? checks.filter(Boolean).length / checks.length : 0;

  const rawHealthScore = pickFirstDefined(
    pptxValidation?.health_score,
    pptxValidation?.healthScore,
  );

  const normalizedHealthScore = (() => {
    const n = Number(rawHealthScore);
    if (!Number.isFinite(n)) return derived_health_score;
    if (n > 1 && n <= 100) return n / 100;
    if (n >= 0 && n <= 1) return n;
    return derived_health_score;
  })();

  return {
    file_created,
    valid_xml,
    valid_relationships,
    opens_without_repair,
    all_slides_present,
    all_media_present,
    file_size_bytes: toNumber(
      pickFirstDefined(
        pptxValidation?.file_size_bytes,
        pptxValidation?.fileSizeBytes,
      ),
      0,
    ),
    raw_health_score: normalizedHealthScore,
    derived_health_score,
    display_health_score: normalizedHealthScore,
  };
}

export default function PPTDashboard({ data }) {
  if (!data) return null;

  const {
    run_id,
    run_success,
    duration,
    timestamp_start,
    timestamp_end,
    llm_tokens,
    estimated_cost_usd,
    sections,
    slides,
    diagram,
    quality,
    pptx_validation,
    architecture_justification,
    error_details,
    review_cycle_count,
    acceptance_status,
    total_retry_count,
  } = data;

  const totalDuration = toNumber(duration?.total_seconds, 0);

  const tokenBreakdown = {
    "Core Generation": toNumber(llm_tokens?.core_generation?.total_tokens, 0),
    "Diagram Generation": toNumber(
      llm_tokens?.diagram_generation?.total_tokens,
      0,
    ),
  };

  const durationBreakdown = {
    core_generation_seconds: toNumber(duration?.core_generation_seconds, 0),
    diagram_generation_seconds: toNumber(
      duration?.diagram_generation_seconds,
      0,
    ),
    pptx_generation_seconds: toNumber(duration?.pptx_generation_seconds, 0),
  };

  const qualityScores = {
    "Content Quality": toNumber(quality?.content_quality, 0),
    "Diagram Quality": toNumber(quality?.diagram_quality, 0),
    "Architecture Alignment": toNumber(quality?.architecture_alignment, 0),
    "Output Validity": toNumber(quality?.output_validity, 0),
  };

  const slideCoveragePercent =
    toNumber(slides?.attempted, 0) > 0
      ? (toNumber(slides?.successful, 0) / toNumber(slides?.attempted, 0)) * 100
      : 0;

  const architectureCoveragePercent =
    toNumber(architecture_justification?.decisions_identified, 0) > 0
      ? (
          (toNumber(architecture_justification?.decisions_justified, 0) /
            toNumber(architecture_justification?.decisions_identified, 1)) *
          100
        ).toFixed(1)
      : null;

  const selectedSections = sections?.selected_list ?? [];
  const diagramWasAttempted = Boolean(diagram?.attempted);
  const diagramSucceeded = Boolean(diagram?.success);

  const normalizedPptxValidation = normalizePptxValidation(pptx_validation);

  const pptxHealthPercent = Math.round(
    normalizedPptxValidation.display_health_score * 100,
  );

  return (
    <div className="ppt-dashboard dashboard-stack">
      <StatusCard
        status={run_success ? "success" : "failed"}
        duration={totalDuration}
        cost={estimated_cost_usd ?? 0}
        timestamp={timestamp_start}
      />

      <PipelineFlow agentType="ppt" data={data} />

      <div className="metric-grid-4">
        <MetricCard
          label="Total Tokens"
          value={toNumber(llm_tokens?.total?.total_tokens, 0)}
          icon={BookOpen}
          unit="tokens"
          subtext={`$${toNumber(estimated_cost_usd, 0).toFixed(4)} estimated cost`}
        />

        <MetricCard
          label="Slides Generated"
          value={toNumber(slides?.successful, 0)}
          icon={Presentation}
          unit={`/ ${toNumber(slides?.attempted, 0)}`}
          deltaType={
            toNumber(slides?.success_rate, 0) === 1
              ? "up"
              : toNumber(slides?.success_rate, 0) >= 0.8
                ? "flat"
                : "down"
          }
          delta={`${(toNumber(slides?.success_rate, 0) * 100).toFixed(0)}% success`}
        />

        <MetricCard
          label="Overall Quality"
          value={toNumber(quality?.overall_score, 0)}
          icon={Star}
          unit="/ 1.0"
          deltaType={
            toNumber(quality?.overall_score, 0) >= 0.9
              ? "up"
              : toNumber(quality?.overall_score, 0) >= 0.7
                ? "flat"
                : "down"
          }
          delta={
            toNumber(quality?.overall_score, 0) >= 0.9
              ? "Excellent"
              : toNumber(quality?.overall_score, 0) >= 0.7
                ? "Good"
                : "Needs review"
          }
        />

        <MetricCard
          label="Sections Included"
          value={toNumber(sections?.selected_count, 0)}
          icon={LayoutTemplate}
          unit={`/ ${toNumber(sections?.total_sections, 0)}`}
          subtext={
            selectedSections.length > 0
              ? selectedSections.slice(0, 3).join(" · ")
              : "No section metadata"
          }
        />
      </div>

      <SectionBlock
        eyebrow="Pipeline Analytics"
        title="Token and runtime profile"
        subtitle="Execution cost, generation timing, and token distribution across the pipeline"
        icon={Workflow}
      >
        <SectionGrid columns={2}>
          <TokenBreakdownChart tokens={tokenBreakdown} />
          <DurationBreakdownChart durations={durationBreakdown} />
        </SectionGrid>
      </SectionBlock>

      <SectionBlock
        eyebrow="Quality Signals"
        title="Output quality and token composition"
        subtitle="Scoring, generation balance, and quality posture for the final presentation"
        icon={Sparkles}
      >
        <SectionGrid columns={2}>
          <QualityScoresChart scores={qualityScores} />
          <TokenDistributionChart
            promptTokens={
              toNumber(llm_tokens?.core_generation?.prompt_tokens, 0) +
              toNumber(llm_tokens?.diagram_generation?.prompt_tokens, 0)
            }
            completionTokens={
              toNumber(llm_tokens?.core_generation?.completion_tokens, 0) +
              toNumber(llm_tokens?.diagram_generation?.completion_tokens, 0)
            }
          />
        </SectionGrid>
      </SectionBlock>

      <SectionBlock
        eyebrow="Runtime Phases"
        title="Phase duration breakdown"
        subtitle="Relative time spent in core generation and PPTX creation"
        icon={Timer}
      >
        <SectionGrid columns={2} className="phase-grid">
          <PhaseCard
            label="Core Generation"
            seconds={toNumber(duration?.core_generation_seconds, 0)}
            totalSeconds={totalDuration}
          />

          <PhaseCard
            label="PPTX Generation"
            seconds={toNumber(duration?.pptx_generation_seconds, 0)}
            totalSeconds={totalDuration}
          />
        </SectionGrid>
      </SectionBlock>

      <SectionGrid columns={3}>
        <DetailPanel
          title="Execution Summary"
          icon={Timer}
          subtitle="Run timing and delivery overview"
          tone="strong"
        >
          <DetailRow label="Run ID" value={run_id ?? "—"} mono />
          <DetailRow label="Started At" value={timestamp_start ?? "—"} />
          <DetailRow label="Completed At" value={timestamp_end ?? "—"} />
          <DetailRow
            label="Total Runtime"
            value={`${totalDuration.toFixed(2)}s`}
            mono
          />
          <DetailRow
            label="Retries"
            value={toNumber(total_retry_count, 0)}
            mono
          />
          <DetailRow
            label="Review Cycles"
            value={toNumber(review_cycle_count, 0)}
            mono
            noBorder={!error_details?.recovery_attempted}
          />
          {error_details?.recovery_attempted && (
            <>
              <DetailRow
                label="Self-Healing Recovery"
                value={
                  <span className={`badge ${error_details.recovery_successful ? "badge-success" : "badge-error"}`}>
                    {error_details.recovery_successful ? "Success" : "Failed"}
                  </span>
                }
              />
              <DetailRow
                label="Bypassed Error"
                value={error_details.category ?? "Unknown"}
                noBorder
              />
            </>
          )}
        </DetailPanel>

        <DetailPanel
          title="Generated Slide Outline"
          icon={LayoutTemplate}
          subtitle="Indexed slide deck topics in order"
        >
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginBottom: "var(--space-3)", 
            padding: "8px 12px", 
            borderRadius: "var(--radius-sm)", 
            background: "var(--color-surface-offset)",
            border: "1px solid var(--color-divider)"
          }}>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: "500", color: "var(--color-text-muted)" }}>
              Custom Sections: <strong style={{ color: "var(--color-text)" }}>{toNumber(sections?.custom_sections_count, 0)}</strong>
            </span>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: "500", color: "var(--color-text-muted)" }}>
              Total: <strong style={{ color: "var(--color-text)" }}>{toNumber(sections?.total_sections, 0)}</strong>
            </span>
          </div>

          {selectedSections.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
              {selectedSections.map((sectionName, index) => (
                <div 
                  key={index} 
                  className="slide-outline-item"
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "var(--space-3)", 
                    padding: "8px 12px", 
                    borderRadius: "var(--radius-md)", 
                    border: "1px solid var(--color-divider)", 
                    background: "var(--color-surface)",
                    boxShadow: "var(--shadow-sm)",
                    transition: "all var(--transition-interactive)"
                  }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "var(--color-orange-highlight)",
                    color: "var(--color-orange)",
                    fontSize: "10px",
                    fontWeight: "800",
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <span style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--color-text)",
                  }}>
                    {sectionName}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-text-faint)" }}>
              No slide outline available
            </div>
          )}
        </DetailPanel>

        <DetailPanel
          title="Output Summary"
          icon={CheckCircle2}
          subtitle="Final deliverable quality and throughput"
          tone="soft"
        >
          <div className="stat-chip-grid">
            <StatChip
              label="Slides"
              value={`${toNumber(slides?.successful, 0)}/${toNumber(slides?.attempted, 0)}`}
            />
            <StatChip
              label="Success Rate"
              value={`${slideCoveragePercent.toFixed(0)}%`}
            />
            <StatChip label="Health" value={`${pptxHealthPercent}%`} />
            <StatChip
              label="Quality"
              value={toNumber(quality?.overall_score, 0).toFixed(2)}
            />
          </div>
        </DetailPanel>
      </SectionGrid>

      <SectionGrid columns={3}>
        <DetailPanel
          title="Slide Pipeline"
          icon={Layers}
          subtitle="Generation throughput and acceptance state"
        >
          <ProgressMetric
            label="Slides Successfully Generated"
            value={toNumber(slides?.successful, 0)}
            max={Math.max(toNumber(slides?.attempted, 0), 1)}
            showPercent={false}
            useStatusColor
          />

          <div className="detail-group-gap">
            <DetailRow
              label="Success Rate"
              value={`${(toNumber(slides?.success_rate, 0) * 100).toFixed(0)}%`}
              mono
            />
            <DetailRow
              label="Failed Slides"
              value={toNumber(slides?.failed, 0)}
              mono
            />
            <DetailRow
              label="Retries"
              value={toNumber(slides?.retry_count, 0)}
              mono
            />
            <DetailRow
              label="Acceptance"
              noBorder
              value={
                <span
                  className={`badge ${
                    acceptance_status === "accepted"
                      ? "badge-success"
                      : acceptance_status === "rejected"
                        ? "badge-error"
                        : "badge-neutral"
                  }`}
                >
                  {acceptance_status ?? "—"}
                </span>
              }
            />
          </div>
        </DetailPanel>

        <DetailPanel
          title="Diagram Quality"
          icon={GitBranch}
          subtitle="Diagram execution, completeness, and correctness"
        >
          <DetailRow
            label="Attempted"
            value={
              <span
                className={`badge ${
                  diagramWasAttempted ? "badge-success" : "badge-neutral"
                }`}
              >
                {diagramWasAttempted ? "Yes" : "No"}
              </span>
            }
          />
          <DetailRow
            label="Status"
            value={
              <span
                className={`badge ${
                  diagramSucceeded ? "badge-success" : "badge-neutral"
                }`}
              >
                {diagramSucceeded ? "Successful" : "Not generated"}
              </span>
            }
          />
          <DetailRow
            label="Components Discovered"
            value={toNumber(diagram?.components_count, 0)}
            mono
          />
          <DetailRow
            label="Expected Components"
            value={toNumber(diagram?.expected_components, 0)}
            mono
          />
          <DetailRow
            label="Connections Discovered"
            value={toNumber(diagram?.connections_count, 0)}
            mono
          />
          <DetailRow
            label="Expected Connections"
            value={toNumber(diagram?.expected_connections, 0)}
            mono
          />
          <DetailRow
            label="Correctness Score"
            value={toNumber(diagram?.correctness_score, 0).toFixed(2)}
            mono
            noBorder
          />
        </DetailPanel>

        <DetailPanel
          title="Token Economics"
          icon={BookOpen}
          subtitle="Prompt and completion usage by stage"
        >
          <DetailRow
            label="Core Prompt Tokens"
            value={toNumber(
              llm_tokens?.core_generation?.prompt_tokens,
              0,
            ).toLocaleString()}
            mono
          />
          <DetailRow
            label="Core Completion"
            value={toNumber(
              llm_tokens?.core_generation?.completion_tokens,
              0,
            ).toLocaleString()}
            mono
          />
          <DetailRow
            label="Diagram Prompt"
            value={toNumber(
              llm_tokens?.diagram_generation?.prompt_tokens,
              0,
            ).toLocaleString()}
            mono
          />
          <DetailRow
            label="Diagram Completion"
            value={toNumber(
              llm_tokens?.diagram_generation?.completion_tokens,
              0,
            ).toLocaleString()}
            mono
          />
          <DetailRow
            label="Estimated Cost"
            value={`$${toNumber(estimated_cost_usd, 0).toFixed(4)}`}
            mono
            noBorder
          />
        </DetailPanel>
      </SectionGrid>

      <SectionGrid columns={2}>
        <DetailPanel
          title="PPTX Validation"
          icon={FileCheck}
          subtitle="Output package integrity and openability"
          tone="strong"
        >
          <SectionGrid columns={2}>
            <div>
              <ValidationRow
                label="File Created"
                pass={normalizedPptxValidation.file_created}
              />
              <ValidationRow
                label="Valid XML"
                pass={normalizedPptxValidation.valid_xml}
              />
              <ValidationRow
                label="Valid Relationships"
                pass={normalizedPptxValidation.valid_relationships}
                noBorder
              />
            </div>

            <div>
              <ValidationRow
                label="Opens Without Repair"
                pass={normalizedPptxValidation.opens_without_repair}
              />
              <ValidationRow
                label="All Slides Present"
                pass={normalizedPptxValidation.all_slides_present}
              />
              <ValidationRow
                label="All Media Present"
                pass={normalizedPptxValidation.all_media_present}
                noBorder
              />
            </div>
          </SectionGrid>

          <div className="detail-group-gap">
            <ProgressMetric
              label="Health Score"
              value={pptxHealthPercent}
              max={100}
              showPercent
            />
          </div>

          <div className="detail-group-gap">
            <StatChip
              label="File Size"
              value={formatBytesToMB(normalizedPptxValidation.file_size_bytes)}
              subtle
            />
          </div>
        </DetailPanel>

        <DetailPanel
          title="Architecture Justification"
          icon={ShieldCheck}
          subtitle="Decision traceability and evidence coverage"
        >
          <SectionGrid columns={2}>
            <div>
              <DetailRow
                label="Decisions Identified"
                value={toNumber(
                  architecture_justification?.decisions_identified,
                  0,
                )}
                mono
              />
              <DetailRow
                label="Decisions Justified"
                value={toNumber(
                  architecture_justification?.decisions_justified,
                  0,
                )}
                mono
              />
              <DetailRow
                label="BRD Citations"
                value={toNumber(architecture_justification?.brd_citations, 0)}
                mono
                noBorder
              />
            </div>

            <div>
              <DetailRow
                label="Constraint References"
                value={toNumber(
                  architecture_justification?.constraint_references,
                  0,
                )}
                mono
              />
              <DetailRow
                label="Justification Score"
                value={toNumber(
                  architecture_justification?.justification_score,
                  0,
                ).toFixed(2)}
                mono
                noBorder
              />
            </div>
          </SectionGrid>

          {toNumber(architecture_justification?.decisions_identified, 0) >
            0 && (
            <div className="detail-group-gap">
              <ProgressMetric
                label="Justification Coverage"
                value={toNumber(
                  architecture_justification?.decisions_justified,
                  0,
                )}
                max={Math.max(
                  toNumber(architecture_justification?.decisions_identified, 0),
                  1,
                )}
                showPercent={false}
              />
            </div>
          )}

          {architectureCoveragePercent !== null && (
            <div className="detail-group-gap">
              <StatChip
                label="Coverage Rate"
                value={`${architectureCoveragePercent}%`}
                subtle
              />
            </div>
          )}
        </DetailPanel>
      </SectionGrid>

      <SectionBlock
        eyebrow="Coverage"
        title="Completion and justification coverage"
        subtitle="Presentation completion and architecture justification performance"
        icon={CheckCircle2}
      >
        <SectionGrid columns={2}>
          <CoverageChart
            covered={toNumber(slides?.successful, 0)}
            total={Math.max(toNumber(slides?.attempted, 0), 1)}
            label="Slide Completion"
          />
          <CoverageChart
            covered={toNumber(
              architecture_justification?.decisions_justified,
              0,
            )}
            total={Math.max(
              toNumber(architecture_justification?.decisions_identified, 0),
              1,
            )}
            label="Justification Coverage"
          />
        </SectionGrid>
      </SectionBlock>

      <ErrorBanner
        message={
          error_details?.occurred
            ? error_details?.message ||
              "An error occurred during execution. Review logs for additional detail."
            : null
        }
      />

      <style>{`
        .ppt-dashboard {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          min-width: 0;
        }

        .dashboard-stack {
          min-width: 0;
        }

        .dashboard-section-block {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .dashboard-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-4);
        }

        .dashboard-section-head-left {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          min-width: 0;
        }

        .dashboard-section-icon {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--color-primary) 9%, var(--color-surface));
          color: var(--color-primary);
          border: 1px solid color-mix(in srgb, var(--color-primary) 14%, var(--color-border));
          flex-shrink: 0;
          margin-top: 3px;
        }

        .dashboard-section-title {
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--color-text);
          line-height: 1.25;
          letter-spacing: -0.018em;
          margin: 0;
        }

        .dashboard-section-subtitle {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          line-height: 1.55;
          margin-top: 5px;
          max-width: 80ch;
        }

        .ppt-grid {
          display: grid;
          gap: var(--space-4);
          min-width: 0;
        }

        .ppt-grid-1 {
          grid-template-columns: 1fr;
        }

        .ppt-grid-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .ppt-grid-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .phase-grid {
          align-items: stretch;
        }

        .panel-detail {
          padding: 0;
          overflow: hidden;
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          background: var(--color-surface-glass);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          box-shadow: var(--glass-shadow), var(--shadow-sm);
          transition: 
            border-color var(--transition-interactive),
            box-shadow var(--transition-interactive),
            transform var(--transition-interactive);
        }

        .panel-detail:hover {
          border-color: color-mix(in srgb, var(--color-primary) 18%, var(--color-border));
          box-shadow: var(--glass-shadow), var(--shadow-md);
        }

        .panel-tone-strong {
          border-color: color-mix(in srgb, var(--color-primary) 16%, var(--glass-border));
          box-shadow: var(--glass-shadow), var(--shadow-sm);
        }

        .panel-tone-soft {
          background: color-mix(in srgb, var(--color-primary-highlight) 22%, var(--color-surface-glass));
        }

        .detail-panel-header {
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--color-divider);
          background: color-mix(in srgb, var(--color-surface-offset) 40%, transparent);
        }

        .detail-panel-title-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          min-width: 0;
        }

        .detail-panel-icon {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          background: var(--color-surface);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border);
          flex-shrink: 0;
        }

        .detail-panel-copy {
          min-width: 0;
        }

        .detail-panel-title {
          font-size: var(--text-sm);
          font-weight: 650;
          color: var(--color-text);
          letter-spacing: -0.01em;
          line-height: 1.3;
          margin: 0;
        }

        .detail-panel-subtitle {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          margin-top: 3px;
          line-height: 1.5;
        }

        .detail-panel-body {
          padding: var(--space-1) var(--space-5) var(--space-4);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
          padding: 10px 0;
          border-bottom: 1px solid color-mix(in srgb, var(--color-divider) 70%, transparent);
        }

        .detail-row-no-border {
          border-bottom: none;
        }

        .detail-label {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          line-height: 1.45;
          flex-shrink: 0;
          letter-spacing: 0.005em;
        }

        .detail-value {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-text);
          text-align: right;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .detail-value-mono {
          font-variant-numeric: tabular-nums lining-nums;
        }

        .detail-group-gap {
          margin-top: var(--space-4);
        }

        .phase-card {
          position: relative;
          padding: var(--space-5);
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          background: var(--color-surface-glass);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          box-shadow: var(--glass-shadow), var(--shadow-sm);
          min-height: 192px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          transition: 
            border-color var(--transition-interactive),
            box-shadow var(--transition-interactive),
            transform var(--transition-interactive);
        }

        .phase-card:hover {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--color-primary) 18%, var(--color-border));
          box-shadow: var(--glass-shadow), var(--shadow-md);
        }

        .phase-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            var(--color-primary) 0%,
            color-mix(in srgb, var(--color-primary) 40%, transparent) 100%
          );
          opacity: 0.55;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }

        .phase-card-skipped {
          background: color-mix(in srgb, var(--color-surface-offset) 40%, var(--color-surface-glass));
        }

        .phase-card-skipped::before {
          opacity: 0;
        }

        .phase-card-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .phase-card-label-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .phase-card-icon {
          width: 26px;
          height: 26px;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: color-mix(in srgb, var(--color-primary) 9%, var(--color-surface));
          border: 1px solid color-mix(in srgb, var(--color-primary) 13%, var(--color-border));
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .phase-card-skipped .phase-card-icon {
          background: var(--color-surface-offset);
          border-color: var(--color-divider);
          color: var(--color-text-faint);
        }

        .phase-card-label {
          margin: 0;
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          line-height: 1.3;
        }

        .phase-card-metric-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-3);
        }

        .phase-card-metric-block {
          display: flex;
          align-items: baseline;
          gap: 6px;
          min-width: 0;
        }

        .phase-card-value {
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 2.6vw, 2.4rem);
          font-weight: 700;
          color: var(--color-text);
          line-height: 0.97;
          letter-spacing: -0.045em;
          font-variant-numeric: tabular-nums lining-nums;
          margin: 0;
        }

        .phase-card-unit {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text-muted);
          line-height: 1.1;
          padding-bottom: 3px;
        }

        .phase-card-percent-pill {
          flex-shrink: 0;
          padding: 5px 9px;
          border-radius: var(--radius-full);
          background: color-mix(in srgb, var(--color-primary) 9%, var(--color-surface));
          border: 1px solid color-mix(in srgb, var(--color-primary) 13%, var(--color-border));
          color: var(--color-primary);
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          font-variant-numeric: tabular-nums lining-nums;
          letter-spacing: 0.01em;
        }

        .phase-progress-shell {
          margin-bottom: var(--space-3);
        }

        .phase-progress-track {
          position: relative;
          height: 6px;
          border-radius: var(--radius-full);
          background: color-mix(in srgb, var(--color-surface-offset) 80%, var(--color-surface));
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--color-divider) 60%, transparent);
        }

        .phase-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            var(--color-primary) 0%,
            color-mix(in srgb, var(--color-primary) 75%, white) 100%
          );
          min-width: 4px;
        }

        .phase-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .phase-card-footnote {
          font-size: var(--text-xs);
          color: var(--color-text-faint);
          line-height: 1.45;
          margin: 0;
        }

        .phase-card-footnote-mono {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          line-height: 1.45;
          margin: 0;
          font-variant-numeric: tabular-nums lining-nums;
        }

        .phase-card-empty {
          padding-top: var(--space-2);
        }

        .stat-chip-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--space-2);
        }

        .stat-chip {
          background: color-mix(in srgb, var(--color-surface-offset) 60%, var(--color-surface));
          border: 1px solid var(--color-divider);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          min-width: 0;
          box-shadow: var(--shadow-sm);
        }

        .stat-chip-subtle {
          background: color-mix(in srgb, var(--color-surface-offset) 40%, var(--color-surface-glass));
        }

        .stat-chip-label {
          margin: 0 0 5px;
          font-size: 10px;
          font-weight: 600;
          color: var(--color-text-muted);
          line-height: 1.35;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .stat-chip-value {
          margin: 0;
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--color-text);
          line-height: 1.15;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums lining-nums;
          overflow-wrap: anywhere;
        }

        .section-pill-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-1);
        }

        .section-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 9px;
          border-radius: var(--radius-full);
          background: color-mix(in srgb, var(--color-primary) 7%, var(--color-surface));
          border: 1px solid color-mix(in srgb, var(--color-primary) 11%, var(--color-border));
          color: var(--color-primary);
          font-size: 11px;
          font-weight: 600;
          line-height: 1;
          white-space: nowrap;
          letter-spacing: 0.005em;
        }

        .error-banner {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
          padding: var(--space-4) var(--space-5);
          border-radius: var(--radius-lg);
          border: 1px solid color-mix(in srgb, var(--color-error) 14%, var(--color-border));
          background: color-mix(in srgb, var(--color-error-highlight) 38%, var(--color-surface));
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(180, 35, 24, 0.03);
        }

        .error-banner-accent {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
          background: var(--color-error);
          border-radius: var(--radius-lg) 0 0 var(--radius-lg);
        }

        .error-banner-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: color-mix(in srgb, var(--color-error) 10%, white);
          color: var(--color-error);
          flex-shrink: 0;
          margin-top: 1px;
          border: 1px solid color-mix(in srgb, var(--color-error) 14%, var(--color-border));
        }

        .error-banner-copy {
          min-width: 0;
        }

        .error-banner-title {
          margin: 0;
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--color-error);
          line-height: 1.4;
          letter-spacing: -0.005em;
        }

        .error-banner-message {
          margin: var(--space-1) 0 0;
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        @media (max-width: 1200px) {
          .ppt-grid-3 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 860px) {
          .ppt-grid-3 {
            grid-template-columns: 1fr;
          }

          .ppt-grid-2 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .ppt-dashboard {
            gap: var(--space-5);
          }

          .ppt-grid,
          .stat-chip-grid {
            gap: var(--space-3);
          }

          .detail-panel-header {
            padding: var(--space-4);
          }

          .detail-panel-body {
            padding-left: var(--space-4);
            padding-right: var(--space-4);
          }

          .phase-card,
          .error-banner {
            padding: var(--space-4);
          }

          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 9px 0;
          }

          .detail-value {
            text-align: left;
          }

          .stat-chip-grid {
            grid-template-columns: 1fr;
          }

          .phase-card {
            min-height: auto;
          }

          .phase-card-metric-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .phase-card-percent-pill {
            align-self: flex-start;
          }

          .phase-card-meta {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
