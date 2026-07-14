import { MetricCard, StatusCard, ProgressMetric } from "./MetricCard";
import PipelineFlow from "./common/PipelineFlow";
import {
  TokenBreakdownChart,
  QualityScoresChart,
  ResourceUsageChart,
  CoverageChart,
  SectionScoresChart,
  TokenDistributionChart,
} from "./Charts";
import {
  FileText,
  Timer,
  CheckCircle2,
  Star,
  Layers,
  Code2,
  FileOutput,
  AlertTriangle,
  Database,
  Cpu,
} from "lucide-react";

function SectionGrid({ columns = 2, children, className = "" }) {
  const gridClass =
    columns === 4
      ? "techdoc-grid techdoc-grid-4"
      : columns === 3
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

function StatChip({ label, value }) {
  return (
    <div className="techdoc-stat-chip">
      <p className="techdoc-stat-chip-label">{label}</p>
      <p className="techdoc-stat-chip-value">{value}</p>
    </div>
  );
}

function OutputFileCard({ fileName }) {
  return (
    <div className="techdoc-output-file-card">
      <p className="techdoc-output-file-label">Output File</p>
      <p className="techdoc-output-file-name" title={fileName ?? "N/A"}>
        {fileName ?? "N/A"}
      </p>
    </div>
  );
}

function InlineBadge({ children }) {
  return <span className="techdoc-inline-badge">{children}</span>;
}

function ErrorBanner({ errors }) {
  if (!errors || (errors.total_errors ?? 0) <= 0) return null;

  return (
    <section className="techdoc-error-banner">
      <div className="techdoc-error-accent" aria-hidden="true" />
      <div className="techdoc-error-icon-wrap">
        <AlertTriangle size={18} strokeWidth={1.9} />
      </div>

      <div className="techdoc-error-copy">
        <p className="techdoc-error-title">
          {errors.total_errors} error{errors.total_errors !== 1 ? "s" : ""}{" "}
          detected during execution
        </p>
        <p className="techdoc-error-text">
          Review the execution logs for detailed traces, failing stages, and
          retry paths before accepting the generated output.
        </p>
      </div>
    </section>
  );
}

export default function TechnicalDocDashboard({ data, viewMode = "high-level" }) {
  if (!data) return null;

  const {
    status,
    end_to_end_duration_seconds: totalDuration,
    timestamp,
    llm_usage,
    generation,
    ingestion,
    assembly,
    system,
    quality_metrics,
    context_building,
    section_selection,
    errors,
    review,
  } = data;

  const tokenSections = llm_usage?.tokens_per_section || {};
  const qualityScores = generation?.per_section_scores || {};
  const coverage = quality_metrics?.codebase_coverage || {};
  const codeExamples = quality_metrics?.code_examples || {};
  const techStack = quality_metrics?.tech_stack || {};
  const detectedStack = techStack?.detected || {};
  const languageBreakdown = ingestion?.input_profile?.language_breakdown || {};
  const wordCounts = generation?.per_section_word_counts || {};
  const maxWordCount = Math.max(...Object.values(wordCounts).map(Number), 1);

  return (
    <div className="techdoc-dashboard">
      <StatusCard
        status={status}
        duration={totalDuration}
        cost={llm_usage?.estimated_cost_usd ?? 0}
        timestamp={timestamp}
        runLabel={data.runLabel}
        runId={data.run_id || data.runId}
      />

      <PipelineFlow agentType="technical-document" data={data} />

      {viewMode === "high-level" ? (
        <SectionBlock
          eyebrow="Quality assessment"
          title="Key Quality Performance"
          description="High-level assessment of the agent's content quality, completeness, relevance, and output validity."
        >
          <div className="metric-grid-4" style={{ marginBottom: "var(--space-6)" }}>
            <MetricCard
              label="Avg Quality Score"
              value={generation?.avg_quality_score ?? 0}
              icon={Star}
              unit="/ 1.0"
              deltaType={(generation?.avg_quality_score ?? 0) >= 0.9 ? "up" : "flat"}
              delta={(generation?.avg_quality_score ?? 0) >= 0.9 ? "Excellent" : "Needs review"}
            />
            <MetricCard
              label="Codebase Coverage"
              value={coverage?.overall_coverage_percent ?? 0}
              icon={Code2}
              unit="%"
              subtext={`${coverage?.documented_total ?? 0} / ${coverage?.discovered_total ?? 0} entities`}
            />
            <MetricCard
              label="Code Example Validity"
              value={codeExamples?.validity_score_percent ?? 0}
              icon={CheckCircle2}
              unit="%"
              subtext={`${codeExamples?.valid_examples ?? 0} / ${codeExamples?.total_examples ?? 0} valid`}
            />
            <MetricCard
              label="Section Success Rate"
              value={generation?.section_success_rate_percent ?? 0}
              icon={Layers}
              unit="%"
              subtext={`${generation?.sections_succeeded ?? 0} / ${generation?.sections_attempted ?? 0} sections`}
            />
          </div>

          <SectionGrid columns={2}>
            <CoverageChart
              covered={coverage?.documented_total ?? 0}
              total={coverage?.discovered_total ?? 1}
              label="Codebase Coverage (Completeness)"
            />
            <CoverageChart
              covered={codeExamples?.valid_examples ?? 0}
              total={codeExamples?.total_examples ?? 1}
              label="Code Example Validity (Accuracy/Coverage)"
            />
          </SectionGrid>
        </SectionBlock>
      ) : (
        <>
          <SectionBlock
            eyebrow="Execution overview"
        title="Technical documentation pipeline"
        description="Key generation metrics, completion quality, and end-to-end output health for the latest documentation run."
      >
        <div className="metric-grid-4">
          <MetricCard
            label="Total Tokens"
            value={llm_usage?.total_tokens ?? 0}
            icon={FileText}
            unit="tokens"
            subtext={`${llm_usage?.total_prompt_tokens ?? 0} prompt · ${llm_usage?.total_completion_tokens ?? 0} completion`}
          />

          <MetricCard
            label="Generation Time"
            value={generation?.total_generation_duration_seconds ?? 0}
            icon={Timer}
            unit="s"
            subtext={`${generation?.sections_succeeded ?? 0} sections generated`}
          />

          <MetricCard
            label="Section Success Rate"
            value={generation?.section_success_rate_percent ?? 0}
            icon={CheckCircle2}
            unit="%"
            deltaType={
              (generation?.section_success_rate_percent ?? 0) === 100
                ? "up"
                : "down"
            }
            delta={
              (generation?.section_success_rate_percent ?? 0) === 100
                ? "All passed"
                : `${generation?.sections_failed ?? 0} failed`
            }
          />

          <MetricCard
            label="Avg Quality Score"
            value={generation?.avg_quality_score ?? 0}
            icon={Star}
            unit="/ 1.0"
            deltaType={
              (generation?.avg_quality_score ?? 0) >= 0.9
                ? "up"
                : (generation?.avg_quality_score ?? 0) >= 0.7
                  ? "flat"
                  : "down"
            }
            delta={
              (generation?.avg_quality_score ?? 0) >= 0.9
                ? "Excellent"
                : (generation?.avg_quality_score ?? 0) >= 0.7
                  ? "Good"
                  : "Needs review"
            }
          />
        </div>
      </SectionBlock>

      <SectionBlock
        eyebrow="Analytics"
        title="Token and quality distribution"
        description="These views highlight where model effort was spent and how quality varied across generated sections."
      >
        <SectionGrid columns={2}>
          {Object.keys(tokenSections).length > 0 ? (
            <TokenBreakdownChart tokens={tokenSections} />
          ) : (
            <TokenDistributionChart
              promptTokens={llm_usage?.total_prompt_tokens ?? 0}
              completionTokens={llm_usage?.total_completion_tokens ?? 0}
            />
          )}

          {Object.keys(qualityScores).length > 0 ? (
            <SectionScoresChart perSectionScores={qualityScores} />
          ) : (
            <QualityScoresChart scores={qualityScores} />
          )}
        </SectionGrid>
      </SectionBlock>

      <SectionBlock
        eyebrow="Pipeline stages"
        title="Operational flow"
        description="A breakdown of ingestion, generation, and assembly shows where work happened and where review attention is needed."
      >
        <SectionGrid columns={2}>
          <DetailPanel
            title="Ingestion Pipeline"
            subtitle="Input discovery, filtering, and intake quality"
            icon={Layers}
          >
            <ProgressMetric
              label="Files Processed"
              value={ingestion?.files_after_filter ?? 0}
              max={ingestion?.total_files_found ?? 1}
              showPercent={false}
            />

            <div className="techdoc-panel-stack">
              <DetailRow
                label="Processing Time"
                value={`${ingestion?.ingestion_duration_seconds ?? 0}s`}
                mono
              />
              <DetailRow
                label="Filter Rate"
                value={`${ingestion?.filter_rate_percent ?? 0}%`}
                mono
              />
              <DetailRow
                label="Status"
                noBorder
                value={
                  <span
                    className={`badge ${
                      ingestion?.ingestion_success
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {ingestion?.ingestion_success ? "Success" : "Failed"}
                  </span>
                }
              />
            </div>
          </DetailPanel>

          <DetailPanel
            title="Model Generation"
            subtitle="Section-level completion, retries, and review loop"
            icon={Code2}
          >
            <ProgressMetric
              label="Sections Completed"
              value={generation?.sections_succeeded ?? 0}
              max={generation?.sections_attempted ?? 1}
              showPercent={false}
            />

            <div className="techdoc-panel-stack">
              <DetailRow
                label="Sections Attempted"
                value={generation?.sections_attempted ?? 0}
                mono
              />
              <DetailRow
                label="Sections Failed"
                value={generation?.sections_failed ?? 0}
                mono
              />
              <DetailRow
                label="LLM Retries"
                value={
                  <InlineBadge>{generation?.llm_retries ?? 0}</InlineBadge>
                }
              />
              <DetailRow
                label="Review Cycles"
                noBorder
                value={review?.review_cycles ?? 0}
                mono
              />
            </div>
          </DetailPanel>

          <DetailPanel
            title="Final Assembly"
            subtitle="Output packaging, sizing, and document build status"
            icon={FileOutput}
            tone="accent"
          >
            <OutputFileCard fileName={assembly?.output_file} />

            <div className="techdoc-chip-grid">
              <StatChip
                label="File Size"
                value={`${assembly?.output_size_kb ?? 0} KB`}
              />
              <StatChip
                label="Word Count"
                value={(assembly?.word_count ?? 0).toLocaleString()}
              />
              <StatChip
                label="Pages (est)"
                value={assembly?.page_estimate ?? 0}
              />
              <StatChip
                label="Build Time"
                value={`${assembly?.assembly_duration_seconds ?? 0}s`}
              />
            </div>
          </DetailPanel>

          <DetailPanel
            title="Section Scale Profile"
            subtitle="Word count comparison across sections"
            icon={FileText}
          >
            <div className="techdoc-progress-stack" style={{ marginTop: "var(--space-2)" }}>
              {Object.keys(wordCounts).length > 0 ? (
                Object.entries(wordCounts).map(([section, count]) => (
                  <ProgressMetric
                    key={section}
                    label={section}
                    value={Number(count)}
                    max={maxWordCount}
                    showPercent={false}
                    unit="words"
                  />
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-text-faint)" }}>
                  No section scale data
                </div>
              )}
            </div>
          </DetailPanel>
        </SectionGrid>
      </SectionBlock>

      <SectionBlock
        eyebrow="Stack Profile"
        title="Repository & Stack Profile"
        description="Stack components, deployment architecture, and language breakdowns detected automatically by the agent."
      >
        <SectionGrid columns={2}>
          <DetailPanel
            title="Detected Tech Stack"
            subtitle="Infrastructure, container, and configuration files discovered"
            icon={Layers}
          >
            <div className="techdoc-panel-stack">
              <DetailRow
                label="Dockerfile"
                value={
                  <span className={`badge ${detectedStack?.has_dockerfile ? "badge-success" : "badge-neutral"}`}>
                    {detectedStack?.has_dockerfile ? "Yes" : "No"}
                  </span>
                }
              />
              <DetailRow
                label="CI/CD Workflow"
                value={
                  <span className={`badge ${detectedStack?.has_cicd ? "badge-success" : "badge-neutral"}`}>
                    {detectedStack?.has_cicd ? "Yes" : "No"}
                  </span>
                }
              />
              <DetailRow
                label="Kubernetes Manifests"
                value={
                  <span className={`badge ${detectedStack?.has_kubernetes ? "badge-success" : "badge-neutral"}`}>
                    {detectedStack?.has_kubernetes ? "Yes" : "No"}
                  </span>
                }
              />
              <DetailRow
                label="Terraform Configs"
                value={
                  <span className={`badge ${detectedStack?.has_terraform ? "badge-success" : "badge-neutral"}`}>
                    {detectedStack?.has_terraform ? "Yes" : "No"}
                  </span>
                }
              />
              <DetailRow
                label="Ansible Playbooks"
                value={
                  <span className={`badge ${detectedStack?.has_ansible ? "badge-success" : "badge-neutral"}`}>
                    {detectedStack?.has_ansible ? "Yes" : "No"}
                  </span>
                }
                noBorder={!detectedStack?.detected_language_hints?.length}
              />
              {detectedStack?.detected_language_hints?.length > 0 && (
                <DetailRow
                  label="Language Hints"
                  value={
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "flex-end" }}>
                      {detectedStack.detected_language_hints.map((hint, idx) => (
                        <span key={idx} className="techdoc-inline-badge" style={{ padding: "2px 6px", minHeight: "auto" }}>
                          {hint}
                        </span>
                      ))}
                    </div>
                  }
                  noBorder
                />
              )}
            </div>
          </DetailPanel>

          <DetailPanel
            title="Language Distribution"
            subtitle="Proportion of source files by programming language"
            icon={Code2}
          >
            <div className="techdoc-progress-stack" style={{ marginTop: "var(--space-2)" }}>
              {Object.keys(languageBreakdown).length > 0 ? (
                Object.entries(languageBreakdown).map(([lang, count]) => {
                  const total = Object.values(languageBreakdown).reduce((a, b) => a + b, 0);
                  return (
                    <ProgressMetric
                      key={lang}
                      label={lang}
                      value={count}
                      max={total}
                      showPercent={true}
                    />
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-text-faint)" }}>
                  No language breakdown available
                </div>
              )}
            </div>
          </DetailPanel>
        </SectionGrid>
      </SectionBlock>

      <SectionBlock
        eyebrow="Infrastructure"
        title="System utilisation"
        description="Resource consumption is shown separately from content quality so performance analysis remains easy to scan."
      >
        <div className="techdoc-chart-shell">
          <ResourceUsageChart
            memoryAvg={system?.avg_memory_mb ?? 0}
            memoryPeak={system?.peak_memory_mb ?? 0}
            cpuAvg={system?.cpu_percent_avg ?? 0}
            cpuPeak={system?.cpu_percent_peak ?? 0}
          />
        </div>
      </SectionBlock>

      <SectionBlock
        eyebrow="Coverage"
        title="Documentation completeness"
        description="Coverage indicators reveal how much of the codebase was documented and how many generated examples remain valid."
      >
        <SectionGrid columns={3}>
          <CoverageChart
            covered={coverage?.documented_total ?? 0}
            total={coverage?.discovered_total ?? 1}
            label="Codebase Coverage"
          />

          <CoverageChart
            covered={codeExamples?.valid_examples ?? 0}
            total={codeExamples?.total_examples ?? 1}
            label="Code Example Validity"
          />

          <DetailPanel
            title="Granular Coverage"
            subtitle="Discovered vs documented codebase components"
            icon={Code2}
          >
            <div className="techdoc-progress-stack" style={{ marginTop: "var(--space-2)" }}>
              <ProgressMetric
                label="API Coverage"
                value={coverage?.documented_apis ?? 0}
                max={coverage?.discovered_apis ?? 1}
                showPercent={false}
                useStatusColor
              />
              <ProgressMetric
                label="Function Coverage"
                value={coverage?.documented_functions ?? 0}
                max={coverage?.discovered_functions ?? 1}
                showPercent={false}
                useStatusColor
              />
              <ProgressMetric
                label="Class Coverage"
                value={coverage?.documented_classes ?? 0}
                max={coverage?.discovered_classes ?? 1}
                showPercent={false}
                useStatusColor
              />
            </div>
          </DetailPanel>
        </SectionGrid>
      </SectionBlock>

      <SectionBlock
        eyebrow="Input and context"
        title="Source profile and retrieval context"
        description="These panels describe the scale of the input repository and the context construction layer used to generate technical output."
      >
        <SectionGrid columns={2}>
          <DetailPanel
            title="Input Profile"
            subtitle="Repository scale and language characteristics"
            icon={Database}
          >
            <DetailRow
              label="Lines of Code"
              value={(
                ingestion?.input_profile?.total_loc ?? 0
              ).toLocaleString()}
              mono
            />
            <DetailRow
              label="Primary Language"
              value={ingestion?.input_profile?.primary_language ?? "N/A"}
            />
            <DetailRow
              label="Repository Size"
              value={`${ingestion?.input_profile?.repo_size_kb ?? 0} KB`}
              mono
            />
            <DetailRow
              label="Files Found"
              value={ingestion?.total_files_found ?? 0}
              mono
            />
            <DetailRow
              label="Files After Filter"
              value={ingestion?.files_after_filter ?? 0}
              mono
              noBorder
            />
          </DetailPanel>

          <DetailPanel
            title="Context Building"
            subtitle="Embedding and section selection readiness"
            icon={Cpu}
          >
            <DetailRow
              label="Total Chunks"
              value={context_building?.total_chunks ?? 0}
              mono
            />
            <DetailRow
              label="Embedding Duration"
              value={`${context_building?.embedding_duration_seconds ?? 0}s`}
              mono
            />
            <DetailRow
              label="Vector Store Size"
              value={`${context_building?.vector_store_size_mb ?? 0} MB`}
              mono
            />
            <DetailRow
              label="Indexing Strategy"
              value={context_building?.strategy ?? "—"}
            />
            <DetailRow
              label="Raptor Summary Nodes"
              value={context_building?.raptor_summary_nodes ?? 0}
              mono
            />
            <DetailRow
              label="Selection Method"
              value={section_selection?.selection_method ?? "—"}
            />
            <DetailRow
              label="Context Build Time"
              value={`${context_building?.context_building_duration_seconds ?? 0}s`}
              mono
            />
            <DetailRow
              label="Sections Available"
              value={section_selection?.total_sections_available ?? 0}
              mono
            />
            <DetailRow
              label="Sections Selected"
              value={section_selection?.sections_selected ?? 0}
              mono
              noBorder
            />
          </DetailPanel>
        </SectionGrid>
      </SectionBlock>
        </>
      )}

      <ErrorBanner errors={errors} />
    </div>
  );
}
