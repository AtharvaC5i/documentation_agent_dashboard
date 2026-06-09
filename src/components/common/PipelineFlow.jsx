import { useMemo } from "react";
import {
  FolderInput,
  Cpu,
  ListTodo,
  Sparkles,
  Layers,
  ShieldCheck,
  FileCheck,
  Brain,
  Scale,
  BadgeCheck,
  Zap,
} from "lucide-react";

export default function PipelineFlow({ agentType, data }) {
  const steps = useMemo(() => {
    if (!data) return [];

    if (agentType === "technical-document") {
      const ingestion = data.ingestion ?? {};
      const context = data.context_building ?? {};
      const selection = data.section_selection ?? {};
      const generation = data.generation ?? {};
      const assembly = data.assembly ?? {};
      const quality = data.quality_metrics ?? {};

      return [
        {
          id: "ingestion",
          name: "Ingestion",
          icon: FolderInput,
          status: ingestion.ingestion_success ? "success" : "failed",
          duration: ingestion.ingestion_duration_seconds,
          meta: `${ingestion.files_after_filter ?? 0}/${ingestion.total_files_found ?? 0} files`,
        },
        {
          id: "selection",
          name: "Selection",
          icon: ListTodo,
          status: "success",
          duration: null,
          meta: `${selection.sections_selected ?? 0} sections`,
        },
        {
          id: "context",
          name: "Context Build",
          icon: Cpu,
          status: "success",
          duration: context.embedding_duration_seconds,
          meta: `${context.total_chunks ?? 0} chunks`,
        },
        {
          id: "generation",
          name: "LLM Gen",
          icon: Brain,
          status: (generation.sections_failed ?? 0) === 0 ? "success" : "failed",
          duration: generation.total_generation_duration_seconds,
          meta: `${generation.sections_succeeded ?? 0}/${generation.sections_attempted ?? 0} sections`,
        },
        {
          id: "assembly",
          name: "DOCX Assembly",
          icon: Layers,
          status: assembly.assembly_success ? "success" : "failed",
          duration: assembly.assembly_duration_seconds,
          meta: `${assembly.word_count ?? 0} words`,
        },
        {
          id: "quality",
          name: "Quality Check",
          icon: ShieldCheck,
          status: (generation.avg_quality_score ?? 0) >= 0.85 ? "success" : "warning",
          duration: null,
          meta: `Score: ${(generation.avg_quality_score ?? 0).toFixed(2)}`,
        },
      ];
    }

    if (agentType === "ppt") {
      const duration = data.duration ?? {};
      const slides = data.slides ?? {};
      const diagram = data.diagram ?? {};
      const quality = data.quality ?? {};
      const pptxVal = data.pptx_validation ?? {};

      const hasDiagram = !!diagram.attempted;
      const diagramSuccess = !!diagram.success;

      return [
        {
          id: "intake",
          name: "Summarize",
          icon: FolderInput,
          status: "success",
          duration: duration.summarization_seconds || null,
          meta: "Source loaded",
        },
        {
          id: "generation",
          name: "Core Deck Gen",
          icon: Brain,
          status: slides.failed === 0 ? "success" : "failed",
          duration: duration.core_generation_seconds,
          meta: `${slides.successful ?? 0}/${slides.attempted ?? 0} slides`,
        },
        {
          id: "diagrams",
          name: "Diagrams",
          icon: Sparkles,
          status: !hasDiagram ? "warning" : diagramSuccess ? "success" : "failed",
          duration: duration.diagram_generation_seconds || null,
          meta: hasDiagram ? `${diagram.components_count ?? 0} shapes` : "Skipped",
        },
        {
          id: "pptx_build",
          name: "pptx Build",
          icon: Layers,
          status: pptxVal.file_created ? "success" : "failed",
          duration: duration.pptx_generation_seconds,
          meta: pptxVal.file_created ? "File generated" : "Failed",
        },
        {
          id: "validation",
          name: "Validation",
          icon: FileCheck,
          status: pptxVal.opens_without_repair && pptxVal.valid_xml ? "success" : "warning",
          duration: null,
          meta: `Health: ${Math.round((pptxVal.health_score ?? 0) * 100)}%`,
        }
      ];
    }

    if (agentType === "brd") {
      const timing = data.timing ?? {};
      const sections = data.sections ?? {};
      const conflicts = data.conflicts ?? {};
      const output = data.output ?? {};
      const quality = data.quality ?? {};
      const smart = quality.requirement_quality?.smart_scores ?? {};

      return [
        {
          id: "intake",
          name: "Doc Intake",
          icon: FolderInput,
          status: "success",
          duration: timing.extraction_duration_seconds ? timing.extraction_duration_seconds * 0.1 : null,
          meta: data.project_name ?? "ShopEasy",
        },
        {
          id: "extraction",
          name: "Extraction",
          icon: Brain,
          status: (sections.failed ?? 0) === 0 ? "success" : "failed",
          duration: timing.extraction_duration_seconds ? timing.extraction_duration_seconds * 0.9 : null,
          meta: `${sections.succeeded ?? 0}/${sections.attempted ?? 0} sections`,
        },
        {
          id: "conflicts",
          name: "Conflicts Check",
          icon: Scale,
          status: (conflicts.unresolved_count ?? 0) === 0 ? "success" : "warning",
          duration: timing.generation_duration_seconds ? timing.generation_duration_seconds * 0.15 : null,
          meta: `${conflicts.resolved_count ?? 0}/${conflicts.detected_count ?? 0} resolved`,
        },
        {
          id: "generation",
          name: "Draft Generation",
          icon: Sparkles,
          status: "success",
          duration: timing.generation_duration_seconds ? timing.generation_duration_seconds * 0.85 : null,
          meta: "Sections drafted",
        },
        {
          id: "assembly",
          name: "Assembly",
          icon: Layers,
          status: output.file_generated ? "success" : "failed",
          duration: timing.document_duration_seconds,
          meta: output.filename ?? "BRD generated",
        },
        {
          id: "smart",
          name: "SMART Quality",
          icon: ShieldCheck,
          status: (smart.avg_score ?? 0) >= 0.65 ? "success" : "warning",
          duration: null,
          meta: `SMART: ${(smart.avg_score ?? 0).toFixed(3)}`,
        },
      ];
    }

    return [];
  }, [agentType, data]);

  if (!data || steps.length === 0) return null;

  return (
    <div className="panel pipeline-container" style={{ padding: "var(--space-5) var(--space-6)", width: "100%", minWidth: 0 }}>
      <div className="pipeline-header">
        <h4 className="section-subheading" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Zap size={16} color="var(--color-primary)" />
          Execution Stage Timeline
        </h4>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
          Visual telemetry breakdown
        </span>
      </div>

      <div className="pipeline-track">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          return (
            <div key={step.id} className={`pipeline-step ${step.status}`}>
              <div className="pipeline-step-node" title={`${step.name}: ${step.status}`}>
                <StepIcon size={16} />
              </div>
              <span className="pipeline-step-label">{step.name}</span>
              <span className="pipeline-step-meta">{step.meta}</span>
              {step.duration !== null && step.duration !== undefined && (
                <span style={{ fontSize: "9px", color: "var(--color-text-muted)", marginTop: "1px", fontVariantNumeric: "tabular-nums" }}>
                  {step.duration.toFixed(1)}s
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
