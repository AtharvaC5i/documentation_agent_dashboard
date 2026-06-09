// ============================================================
// Data Service — loads metrics JSON from backend API
// Adds overview normalization + aggregate helpers
// ============================================================

export const AGENT_CONFIGS = {
  overview: {
    name: "Overview",
    path: "",
    color: "var(--color-blue)",
    icon: "LayoutDashboard",
  },
  "technical-document": {
    name: "Technical Docs",
    path: "technical-agent/",
    color: "var(--color-primary)",
    icon: "Code2",
  },
  ppt: {
    name: "PPT Agent",
    path: "ppt-agent/",
    color: "var(--color-orange)",
    icon: "Presentation",
  },
  brd: {
    name: "BRD Agent",
    path: "brd-agent/",
    color: "var(--color-purple)",
    icon: "FileText",
  },
};

const MONITORED_AGENT_IDS = ["technical-document", "ppt", "brd"];

export const sampleTechnicalDocData = {
  run_id: "03131a86",
  project_id: "f7835598-0a83-4872-8f9d-1e8e4fee173e",
  agent: "technical-document",
  environment: "development",
  timestamp: "2026-05-28T06:46:26.382600+00:00",
  completed_at: "2026-05-28T06:50:48.893419+00:00",
  status: "success",
  errors: { total_errors: 0 },
  system: {
    platform: "windows",
    python_version: "3.14.3",
    peak_memory_mb: 992.5,
    avg_memory_mb: 846.5,
    cpu_percent_avg: 6.8,
    cpu_percent_peak: 436.5,
  },
  llm_usage: {
    total_prompt_tokens: 11798,
    total_completion_tokens: 2776,
    total_tokens: 14574,
    estimated_cost_usd: 0.01735,
    tokens_per_section: {
      "Executive Summary": 7121,
      "AI/ML Pipeline": 7453,
    },
  },
  ingestion: {
    total_files_found: 4,
    files_after_filter: 4,
    filter_rate_percent: 100.0,
    ingestion_duration_seconds: 0.09,
    ingestion_success: true,
    input_profile: {
      total_loc: 1011,
      primary_language: "JavaScript",
      repo_size_kb: 83.6,
    },
  },
  context_building: {
    total_chunks: 49,
    embedding_duration_seconds: 3.83,
    vector_store_size_mb: 1.36,
  },
  section_selection: {
    total_sections_available: 18,
    sections_selected: 2,
  },
  generation: {
    sections_attempted: 2,
    sections_succeeded: 2,
    sections_failed: 0,
    section_success_rate_percent: 100.0,
    avg_quality_score: 0.95,
    per_section_scores: {
      "Executive Summary": 0.9,
      "AI/ML Pipeline": 1.0,
    },
    total_generation_duration_seconds: 60.65,
    llm_retries: 0,
  },
  assembly: {
    output_file: "output.docx",
    output_size_kb: 53.0,
    word_count: 1397,
    page_estimate: 5,
    assembly_success: true,
    output_validation_success: true,
    assembly_duration_seconds: 0.47,
  },
  review: { review_cycles: 2 },
  quality_metrics: {
    codebase_coverage: {
      documented_total: 4,
      discovered_total: 115,
      overall_coverage_percent: 3.5,
    },
    code_examples: {
      total_examples: 5,
      valid_examples: 5,
      validity_score_percent: 100.0,
    },
    acceptance_flag: "not_reviewed",
  },
  end_to_end_duration_seconds: 262.51,
};

export const samplePPTData = {
  run_id: "a3c04bc7-add0-4f32-9b96-eb581de5d8c1",
  agent: "ppt",
  timestamp_start: "2026-05-31T14:46:06.194512",
  timestamp_end: "2026-05-31T14:47:21.241586",
  run_success: true,
  error_details: { occurred: false },
  duration: {
    total_seconds: 75.05,
    summarization_seconds: 0.0,
    core_generation_seconds: 63.89,
    diagram_generation_seconds: 0.0,
    pptx_generation_seconds: 10.98,
  },
  llm_tokens: {
    core_generation: {
      prompt_tokens: 1784,
      completion_tokens: 3714,
      total_tokens: 5498,
    },
    diagram_generation: {
      prompt_tokens: 2072,
      completion_tokens: 538,
      total_tokens: 2610,
    },
    total: {
      prompt_tokens: 3856,
      completion_tokens: 4252,
      total_tokens: 8108,
    },
  },
  estimated_cost_usd: 0.0124,
  slides: {
    attempted: 10,
    successful: 10,
    failed: 0,
    retry_count: 0,
    success_rate: 1.0,
  },
  diagram: {
    attempted: true,
    success: true,
    components_count: 8,
    connections_count: 10,
    component_coverage: 1.0,
    connection_coverage: 1.0,
    correctness_score: 1.0,
  },
  quality: {
    content_quality: 1.0,
    diagram_quality: 1.0,
    architecture_alignment: 1.0,
    output_validity: 1.0,
    overall_score: 1.0,
  },
  pptx_validation: {
    file_created: true,
    file_size_bytes: 7235415,
    valid_xml: true,
    opens_without_repair: true,
    health_score: 1.0,
  },
  architecture_justification: {
    decisions_identified: 6,
    decisions_justified: 6,
    brd_citations: 5,
    justification_score: 1.0,
  },
  review_cycle_count: 0,
  total_retry_count: 0,
  acceptance_status: "pending_review",
};

function safeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function safeString(value, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function safeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined) return fallback;
  return Boolean(value);
}

function safeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

function safeObject(value, fallback = {}) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : fallback;
}

function average(values = []) {
  const filtered = values.filter((value) => Number.isFinite(value));
  if (!filtered.length) return 0;
  return filtered.reduce((sum, value) => sum + value, 0) / filtered.length;
}

function sum(values = []) {
  return values.reduce((acc, value) => acc + safeNumber(value), 0);
}

function latestTimestamp(timestamps = []) {
  const valid = timestamps
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);

  if (!valid.length) return null;
  return new Date(Math.max(...valid)).toISOString();
}

function getAgentDisplayName(agentId) {
  return getAgentConfig(agentId)?.name ?? safeString(agentId, "Unknown Agent");
}

function getMonitoredAgentStatus(raw = {}) {
  if (typeof raw.run_success === "boolean") {
    return raw.run_success ? "success" : "failed";
  }

  if (typeof raw.status === "string") {
    const normalized = raw.status.toLowerCase();
    if (
      ["success", "failed", "error", "warning", "pending"].includes(normalized)
    ) {
      return normalized === "error" ? "failed" : normalized;
    }
  }

  if (
    raw.error_details?.occurred === true ||
    safeNumber(raw.errors?.total_errors) > 0
  ) {
    return "failed";
  }

  if (
    raw.assembly?.assembly_success === true ||
    raw.pptx_validation?.file_created === true
  ) {
    return "success";
  }

  return "unknown";
}

function normalizeTechnicalDocMetrics(data = {}) {
  const system = safeObject(data.system);
  const llmUsage = safeObject(data.llm_usage);
  const ingestion = safeObject(data.ingestion);
  const inputProfile = safeObject(ingestion.input_profile);
  const contextBuilding = safeObject(data.context_building);
  const sectionSelection = safeObject(data.section_selection);
  const generation = safeObject(data.generation);
  const assembly = safeObject(data.assembly);
  const review = safeObject(data.review);
  const qualityMetrics = safeObject(data.quality_metrics);
  const codebaseCoverage = safeObject(qualityMetrics.codebase_coverage);
  const codeExamples = safeObject(qualityMetrics.code_examples);
  const errors = safeObject(data.errors);

  return {
    ...data,
    run_id: safeString(data.run_id),
    project_id: safeString(data.project_id),
    agent: "technical-document",
    environment: safeString(data.environment),
    timestamp: safeString(data.timestamp),
    completed_at: safeString(data.completed_at),
    status: safeString(data.status, "unknown"),
    end_to_end_duration_seconds: safeNumber(data.end_to_end_duration_seconds),

    errors: {
      total_errors: safeNumber(errors.total_errors),
    },

    system: {
      platform: safeString(system.platform),
      python_version: safeString(system.python_version),
      peak_memory_mb: safeNumber(system.peak_memory_mb),
      avg_memory_mb: safeNumber(system.avg_memory_mb),
      cpu_percent_avg: safeNumber(system.cpu_percent_avg),
      cpu_percent_peak: safeNumber(system.cpu_percent_peak),
    },

    llm_usage: {
      total_prompt_tokens: safeNumber(llmUsage.total_prompt_tokens),
      total_completion_tokens: safeNumber(llmUsage.total_completion_tokens),
      total_tokens: safeNumber(llmUsage.total_tokens),
      estimated_cost_usd: safeNumber(llmUsage.estimated_cost_usd),
      tokens_per_section: safeObject(llmUsage.tokens_per_section),
    },

    ingestion: {
      total_files_found: safeNumber(ingestion.total_files_found),
      files_after_filter: safeNumber(ingestion.files_after_filter),
      filter_rate_percent: safeNumber(ingestion.filter_rate_percent),
      ingestion_duration_seconds: safeNumber(
        ingestion.ingestion_duration_seconds,
      ),
      ingestion_success: safeBoolean(ingestion.ingestion_success),
      input_profile: {
        total_loc: safeNumber(inputProfile.total_loc),
        primary_language: safeString(inputProfile.primary_language),
        repo_size_kb: safeNumber(inputProfile.repo_size_kb),
        language_breakdown: safeObject(inputProfile.language_breakdown),
      },
    },

    context_building: {
      total_chunks: safeNumber(contextBuilding.total_chunks),
      embedding_duration_seconds: safeNumber(
        contextBuilding.embedding_duration_seconds,
      ),
      vector_store_size_mb: safeNumber(contextBuilding.vector_store_size_mb),
    },

    section_selection: {
      total_sections_available: safeNumber(
        sectionSelection.total_sections_available,
      ),
      sections_selected: safeNumber(sectionSelection.sections_selected),
    },

    generation: {
      sections_attempted: safeNumber(generation.sections_attempted),
      sections_succeeded: safeNumber(generation.sections_succeeded),
      sections_failed: safeNumber(generation.sections_failed),
      section_success_rate_percent: safeNumber(
        generation.section_success_rate_percent,
      ),
      avg_quality_score: safeNumber(generation.avg_quality_score),
      per_section_scores: safeObject(generation.per_section_scores),
      total_generation_duration_seconds: safeNumber(
        generation.total_generation_duration_seconds,
      ),
      llm_retries: safeNumber(generation.llm_retries),
      per_section_word_counts: safeObject(generation.per_section_word_counts),
    },

    assembly: {
      output_file: safeString(assembly.output_file),
      output_size_kb: safeNumber(assembly.output_size_kb),
      word_count: safeNumber(assembly.word_count),
      page_estimate: safeNumber(assembly.page_estimate),
      assembly_success: safeBoolean(assembly.assembly_success),
      output_validation_success: safeBoolean(
        assembly.output_validation_success,
      ),
      assembly_duration_seconds: safeNumber(assembly.assembly_duration_seconds),
    },

    review: {
      review_cycles: safeNumber(review.review_cycles),
    },

    quality_metrics: {
      codebase_coverage: {
        ...codebaseCoverage,
        documented_total: safeNumber(codebaseCoverage.documented_total),
        discovered_total: safeNumber(codebaseCoverage.discovered_total),
        overall_coverage_percent: safeNumber(
          codebaseCoverage.overall_coverage_percent,
        ),
      },
      code_examples: {
        total_examples: safeNumber(codeExamples.total_examples),
        valid_examples: safeNumber(codeExamples.valid_examples),
        validity_score_percent: safeNumber(codeExamples.validity_score_percent),
      },
      tech_stack: safeObject(qualityMetrics.tech_stack),
      acceptance_flag: safeString(
        qualityMetrics.acceptance_flag,
        "not_reviewed",
      ),
    },
  };
}

function normalizePPTMetrics(data = {}) {
  const duration = safeObject(data.duration);
  const llmTokens = safeObject(data.llm_tokens);
  const coreGeneration = safeObject(llmTokens.core_generation);
  const diagramGeneration = safeObject(llmTokens.diagram_generation);
  const totalTokens = safeObject(llmTokens.total);
  const slides = safeObject(data.slides);
  const diagram = safeObject(data.diagram);
  const quality = safeObject(data.quality);
  const pptxValidation = safeObject(data.pptx_validation);
  const architectureJustification = safeObject(data.architecture_justification);
  const errorDetails = safeObject(data.error_details);
  const system = safeObject(data.system);

  return {
    ...data,
    run_id: safeString(data.run_id),
    agent: "ppt",
    timestamp_start: safeString(data.timestamp_start),
    timestamp_end: safeString(data.timestamp_end),
    run_success: safeBoolean(data.run_success),
    estimated_cost_usd: safeNumber(data.estimated_cost_usd),
    review_cycle_count: safeNumber(data.review_cycle_count),
    total_retry_count: safeNumber(data.total_retry_count),
    acceptance_status: safeString(data.acceptance_status, "pending_review"),

    error_details: {
      occurred: safeBoolean(errorDetails.occurred),
      message: safeString(errorDetails.message, ""),
    },

    duration: {
      total_seconds: safeNumber(duration.total_seconds),
      summarization_seconds: safeNumber(duration.summarization_seconds),
      core_generation_seconds: safeNumber(duration.core_generation_seconds),
      diagram_generation_seconds: safeNumber(
        duration.diagram_generation_seconds,
      ),
      pptx_generation_seconds: safeNumber(duration.pptx_generation_seconds),
    },

    llm_tokens: {
      core_generation: {
        prompt_tokens: safeNumber(coreGeneration.prompt_tokens),
        completion_tokens: safeNumber(coreGeneration.completion_tokens),
        total_tokens: safeNumber(coreGeneration.total_tokens),
      },
      diagram_generation: {
        prompt_tokens: safeNumber(diagramGeneration.prompt_tokens),
        completion_tokens: safeNumber(diagramGeneration.completion_tokens),
        total_tokens: safeNumber(diagramGeneration.total_tokens),
      },
      total: {
        prompt_tokens: safeNumber(totalTokens.prompt_tokens),
        completion_tokens: safeNumber(totalTokens.completion_tokens),
        total_tokens: safeNumber(totalTokens.total_tokens),
      },
    },

    slides: {
      attempted: safeNumber(slides.attempted),
      successful: safeNumber(slides.successful),
      failed: safeNumber(slides.failed),
      retry_count: safeNumber(slides.retry_count),
      success_rate: safeNumber(slides.success_rate),
    },

    diagram: {
      attempted: safeBoolean(diagram.attempted),
      success: safeBoolean(diagram.success),
      components_count: safeNumber(diagram.components_count),
      connections_count: safeNumber(diagram.connections_count),
      component_coverage: safeNumber(diagram.component_coverage),
      connection_coverage: safeNumber(diagram.connection_coverage),
      correctness_score: safeNumber(diagram.correctness_score),
    },

    quality: {
      content_quality: safeNumber(quality.content_quality),
      diagram_quality: safeNumber(quality.diagram_quality),
      architecture_alignment: safeNumber(quality.architecture_alignment),
      output_validity: safeNumber(quality.output_validity),
      overall_score: safeNumber(quality.overall_score),
    },

    pptx_validation: {
      file_created: safeBoolean(pptxValidation.file_created),
      file_size_bytes: safeNumber(pptxValidation.file_size_bytes),
      valid_xml: safeBoolean(pptxValidation.valid_xml),
      opens_without_repair: safeBoolean(pptxValidation.opens_without_repair),
      health_score: safeNumber(pptxValidation.health_score),
    },

    architecture_justification: {
      decisions_identified: safeNumber(
        architectureJustification.decisions_identified,
      ),
      decisions_justified: safeNumber(
        architectureJustification.decisions_justified,
      ),
      brd_citations: safeNumber(architectureJustification.brd_citations),
      constraint_references: safeNumber(architectureJustification.constraint_references),
      justification_score: safeNumber(
        architectureJustification.justification_score,
      ),
    },
    sections: {
      selected_count: safeNumber(data.sections?.selected_count),
      selected_list: safeArray(data.sections?.selected_list),
      custom_sections_count: safeNumber(data.sections?.custom_sections_count),
      custom_sections: safeArray(data.sections?.custom_sections),
      total_sections: safeNumber(data.sections?.total_sections),
    },

    system: {
      peak_memory_mb: safeNumber(system.peak_memory_mb),
      avg_memory_mb: safeNumber(system.avg_memory_mb),
      cpu_percent_avg: safeNumber(system.cpu_percent_avg),
      cpu_percent_peak: safeNumber(system.cpu_percent_peak),
    },
  };
}

function normalizeBRDMetrics(data = {}) {
  return {
    ...data,
    run_id: safeString(data.run_id),
    project_id: safeString(data.project_id, "unknown"),
    agent: "brd",
    timestamp: safeString(data.timestamp),
    completed_at: safeString(data.completed_at),
    status: safeString(data.status, "unknown"),
    run_success: safeBoolean(data.run_success, data.status === "success"),
    end_to_end_duration_seconds: safeNumber(data.end_to_end_duration_seconds),
    estimated_cost_usd: safeNumber(data.estimated_cost_usd),
    total_retry_count: safeNumber(data.total_retry_count),
    review_cycle_count: safeNumber(data.review_cycle_count),
    acceptance_status: safeString(data.acceptance_status, "not_reviewed"),
    llm_usage: {
      total_prompt_tokens: safeNumber(data.llm_usage?.prompt_tokens ?? data.llm_usage?.total_prompt_tokens),
      total_completion_tokens: safeNumber(
        data.llm_usage?.completion_tokens ?? data.llm_usage?.total_completion_tokens,
      ),
      total_tokens: safeNumber(data.llm_usage?.total_tokens),
      estimated_cost_usd: safeNumber(
        data.llm_usage?.estimated_cost_usd ?? data.estimated_cost_usd ?? data.cost?.total_cost_usd,
      ),
      by_stage: data.llm_usage?.by_stage,
    },
    quality: {
      overall_score: safeNumber(
        data.quality?.overall_score ?? data.requirement_quality_score,
      ),
      requirement_quality: data.quality?.requirement_quality,
      section_completeness: data.quality?.section_completeness,
    },
    conflicts: {
      detected_count: safeNumber(data.conflicts?.detected_count),
      resolved_count: safeNumber(data.conflicts?.resolved_count),
      unresolved_count: safeNumber(data.conflicts?.unresolved_count),
      high_impact_count: safeNumber(data.conflicts?.high_impact_count),
      medium_impact_count: safeNumber(data.conflicts?.medium_impact_count),
      low_impact_count: safeNumber(data.conflicts?.low_impact_count),
      resolution_rate_pct: safeNumber(data.conflicts?.resolution_rate_pct),
      accuracy_feedback: safeString(data.conflicts?.accuracy_feedback),
    },
    sections: {
      attempted: safeNumber(data.sections?.attempted),
      succeeded: safeNumber(data.sections?.succeeded),
      failed: safeNumber(data.sections?.failed),
      success_rate_pct: safeNumber(data.sections?.success_rate_pct),
      review_cycles: safeObject(data.sections?.review_cycles),
    },
    brd_output: {
      health: safeNumber(data.brd_output?.health),
    },
    errors: {
      total_errors: safeNumber(data.errors?.total_errors),
    },
    system: {
      peak_memory_mb: safeNumber(data.system?.peak_memory_mb),
      avg_memory_mb: safeNumber(data.system?.avg_memory_mb),
      cpu_percent_avg: safeNumber(data.system?.cpu_percent_avg),
      cpu_percent_peak: safeNumber(data.system?.cpu_percent_peak),
    },
  };
}

export function normalizeMetricsByAgent(agentType, data) {
  if (!data) return null;
  if (agentType === "technical-document")
    return normalizeTechnicalDocMetrics(data);
  if (agentType === "ppt") return normalizePPTMetrics(data);
  if (agentType === "brd") return normalizeBRDMetrics(data);
  return data;
}

export async function loadMetrics(agentType, filename) {
  if (!filename) return null;

  try {
    const res = await fetch(`/api/data?agent=${agentType}&file=${filename}`);
    if (!res.ok) throw new Error("Not OK");
    const data = await res.json();
    return normalizeMetricsByAgent(agentType, data);
  } catch {
    if (agentType === "technical-document") {
      return normalizeTechnicalDocMetrics(sampleTechnicalDocData);
    }
    if (agentType === "ppt") {
      return normalizePPTMetrics(samplePPTData);
    }
    return null;
  }
}

export async function loadRuns(agentType) {
  if (getAgentConfig(agentType)?.disabled) return [];

  try {
    const res = await fetch(`/api/runs?agent=${agentType}`);
    if (!res.ok) throw new Error("Not OK");
    const data = await res.json();
    return safeArray(data, []);
  } catch {
    if (agentType === "technical-document") return ["run_03131a86.json"];
    if (agentType === "ppt") return ["run_a3c04bc7.json"];
    return [];
  }
}

export function getAgentConfig(agentType) {
  return AGENT_CONFIGS[agentType] ?? null;
}

export function getAllAgents() {
  return [
    { id: "overview", ...AGENT_CONFIGS.overview },
    { id: "technical-document", ...AGENT_CONFIGS["technical-document"] },
    { id: "ppt", ...AGENT_CONFIGS.ppt },
    { id: "brd", ...AGENT_CONFIGS.brd },
  ];
}

export function getMonitoredAgentIds() {
  return [...MONITORED_AGENT_IDS];
}

export function getMonitoredAgents() {
  return MONITORED_AGENT_IDS.map((id) => ({
    id,
    ...AGENT_CONFIGS[id],
  }));
}

function normalizeOverviewRun(raw = {}) {
  const rawAgent = safeString(raw.agent, "unknown").toLowerCase();

  const agent =
    rawAgent === "ppt-architect"
      ? "ppt"
      : rawAgent === "brd-agent"
        ? "brd"
        : rawAgent;

  const status = getMonitoredAgentStatus(raw);
  const success = status === "success";

  const durationSeconds = safeNumber(
    raw.end_to_end_duration_seconds ?? raw.duration?.total_seconds,
  );

  const totalTokens = safeNumber(
    raw.llm_usage?.total_tokens ?? raw.llm_tokens?.total?.total_tokens,
  );

  const promptTokens = safeNumber(
    raw.llm_usage?.total_prompt_tokens ?? raw.llm_tokens?.total?.prompt_tokens,
  );

  const completionTokens = safeNumber(
    raw.llm_usage?.total_completion_tokens ??
      raw.llm_tokens?.total?.completion_tokens,
  );

  const estimatedCostUsd = safeNumber(
    raw.llm_usage?.estimated_cost_usd ?? raw.estimated_cost_usd,
  );

  const qualityScore = safeNumber(
    raw.generation?.avg_quality_score ??
      raw.quality?.overall_score ??
      raw.requirement_quality_score,
  );

  const validationHealth = safeNumber(
    raw.assembly?.output_validation_success === true
      ? 1
      : (raw.pptx_validation?.health_score ?? raw.brd_output?.health),
  );

  const retries = safeNumber(
    raw.generation?.llm_retries ??
      raw.total_retry_count ??
      raw.slides?.retry_count,
  );

  const errorCount = safeNumber(
    raw.errors?.total_errors ?? (raw.error_details?.occurred ? 1 : 0),
  );

  const reviewCycles = safeNumber(
    raw.review?.review_cycles ?? raw.review_cycle_count,
  );

  const acceptanceStatus = safeString(
    raw.quality_metrics?.acceptance_flag ?? raw.acceptance_status,
    "not_reviewed",
  );

  const startedAt = raw.timestamp_start || raw.timestamp || null;
  const completedAt = raw.completed_at || raw.timestamp_end || null;
  const lastSeenAt = completedAt || startedAt;

  return {
    runId: safeString(raw.run_id),
    runLabel: safeString(raw.run_id),
    projectId: safeString(raw.project_id, "unknown"),
    agent,
    agentName: getAgentDisplayName(agent),
    status,
    success,
    hasData: true,
    startedAt,
    completedAt,
    latestTimestamp: lastSeenAt,
    durationSeconds,
    totalTokens,
    promptTokens,
    completionTokens,
    estimatedCostUsd,
    qualityScore,
    validationHealth,
    retries,
    errorCount,
    reviewCycles,
    acceptanceStatus,
    system: {
      avgMemoryMb: safeNumber(raw.system?.avg_memory_mb),
      peakMemoryMb: safeNumber(raw.system?.peak_memory_mb),
      cpuAvg: safeNumber(raw.system?.cpu_percent_avg),
      cpuPeak: safeNumber(raw.system?.cpu_percent_peak),
    },
  };
}

function buildAgentSummary(agentId, runs = []) {
  const config = getAgentConfig(agentId);

  if (!runs.length) {
    return {
      agentId,
      agentName: config?.name ?? agentId,
      runCount: 0,
      successCount: 0,
      failedCount: 0,
      successRate: 0,
      avgDuration: 0,
      avgCost: 0,
      avgQuality: 0,
      avgValidationHealth: 0,
      avgTokens: 0,
      totalErrors: 0,
      totalRetries: 0,
      latestRunAt: null,
      latestStatus: "no_data",
      avgMemoryMb: 0,
      peakMemoryMb: 0,
      avgCpuPercent: 0,
    };
  }

  const successCount = runs.filter((run) => run.success).length;
  const failedCount = runs.filter((run) => run.status === "failed").length;
  const latestRun = [...runs].sort(
    (a, b) =>
      new Date(b.latestTimestamp || 0).getTime() -
      new Date(a.latestTimestamp || 0).getTime(),
  )[0];

  return {
    agentId,
    agentName: config?.name ?? agentId,
    runCount: runs.length,
    successCount,
    failedCount,
    successRate: (successCount / runs.length) * 100,
    avgDuration: average(runs.map((run) => run.durationSeconds)),
    avgCost: average(runs.map((run) => run.estimatedCostUsd)),
    avgQuality: average(
      runs.map((run) =>
        Number.isFinite(run.qualityScore) && run.qualityScore > 0
          ? run.qualityScore
          : null,
      ),
    ),
    avgValidationHealth: average(
      runs.map((run) =>
        Number.isFinite(run.validationHealth) && run.validationHealth > 0
          ? run.validationHealth
          : null,
      ),
    ),
    avgTokens: average(runs.map((run) => run.totalTokens)),
    totalErrors: sum(runs.map((run) => run.errorCount)),
    totalRetries: sum(runs.map((run) => run.retries)),
    latestRunAt: latestTimestamp(runs.map((run) => run.latestTimestamp)),
    latestStatus: latestRun?.status ?? "unknown",
    avgMemoryMb: average(
      runs.map((run) =>
        run.system?.avgMemoryMb > 0 ? run.system.avgMemoryMb : null,
      ),
    ),
    peakMemoryMb: average(
      runs.map((run) =>
        run.system?.peakMemoryMb > 0 ? run.system.peakMemoryMb : null,
      ),
    ),
    avgCpuPercent: average(
      runs.map((run) => (run.system?.cpuAvg > 0 ? run.system.cpuAvg : null)),
    ),
  };
}

async function loadNormalizedRunsForAgent(agentId) {
  const runFiles = await loadRuns(agentId);
  if (!runFiles.length) return [];

  const metricsList = await Promise.all(
    runFiles.map((filename) => loadMetrics(agentId, filename)),
  );

  return metricsList
    .filter(Boolean)
    .map((metrics) => normalizeOverviewRun(metrics))
    .filter((run) => run.agent === agentId);
}

export async function loadOverviewData() {
  const agentIds = getMonitoredAgentIds();

  const runsByAgentEntries = await Promise.all(
    agentIds.map(async (agentId) => [
      agentId,
      await loadNormalizedRunsForAgent(agentId),
    ]),
  );

  const runsByAgent = Object.fromEntries(runsByAgentEntries);
  const normalizedRuns = agentIds.flatMap(
    (agentId) => runsByAgent[agentId] ?? [],
  );
  const agentSummaries = agentIds.map((agentId) =>
    buildAgentSummary(agentId, runsByAgent[agentId] ?? []),
  );

  const totalRuns = normalizedRuns.length;
  const successfulRuns = normalizedRuns.filter((run) => run.success).length;
  const failedRuns = normalizedRuns.filter(
    (run) => run.status === "failed",
  ).length;
  const pendingRuns = normalizedRuns.filter(
    (run) => run.status === "pending",
  ).length;

  return {
    totals: {
      totalRuns,
      successfulRuns,
      failedRuns,
      pendingRuns,
      successRate: totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0,
      avgDuration: average(normalizedRuns.map((run) => run.durationSeconds)),
      avgCost: average(normalizedRuns.map((run) => run.estimatedCostUsd)),
      avgQuality: average(
        normalizedRuns.map((run) =>
          Number.isFinite(run.qualityScore) && run.qualityScore > 0
            ? run.qualityScore
            : null,
        ),
      ),
      avgValidationHealth: average(
        normalizedRuns.map((run) =>
          Number.isFinite(run.validationHealth) && run.validationHealth > 0
            ? run.validationHealth
            : null,
        ),
      ),
      totalTokens: sum(normalizedRuns.map((run) => run.totalTokens)),
      totalErrors: sum(normalizedRuns.map((run) => run.errorCount)),
      totalRetries: sum(normalizedRuns.map((run) => run.retries)),
      latestRunAt: latestTimestamp(
        normalizedRuns.map((run) => run.latestTimestamp),
      ),
    },

    agentSummaries,

    comparison: {
      successRate: agentSummaries.map((item) => ({
        agentId: item.agentId,
        agent: item.agentName,
        value: Number(item.successRate.toFixed(1)),
      })),
      avgDuration: agentSummaries.map((item) => ({
        agentId: item.agentId,
        agent: item.agentName,
        value: Number(item.avgDuration.toFixed(2)),
      })),
      avgCost: agentSummaries.map((item) => ({
        agentId: item.agentId,
        agent: item.agentName,
        value: Number(item.avgCost.toFixed(4)),
      })),
      avgQuality: agentSummaries.map((item) => ({
        agentId: item.agentId,
        agent: item.agentName,
        value: Number((item.avgQuality * 100).toFixed(1)),
      })),
      runVolume: agentSummaries.map((item) => ({
        agentId: item.agentId,
        agent: item.agentName,
        value: item.runCount,
        successCount: item.successCount,
        failedCount: item.failedCount,
      })),
      validationHealth: agentSummaries.map((item) => ({
        agentId: item.agentId,
        agent: item.agentName,
        value: Number((item.avgValidationHealth * 100).toFixed(1)),
      })),
    },

    statusDistribution: [
      { name: "Success", value: successfulRuns },
      { name: "Failed", value: failedRuns },
      { name: "Pending", value: pendingRuns },
    ].filter((item) => item.value > 0),

    health: {
      agentsWithFailures: agentSummaries.filter((item) => item.failedCount > 0)
        .length,
      agentsWithRetries: agentSummaries.filter((item) => item.totalRetries > 0)
        .length,
      agentsPendingReview: agentSummaries.filter((item) =>
        (runsByAgent[item.agentId] ?? []).some(
          (run) =>
            run.acceptanceStatus === "pending_review" ||
            run.acceptanceStatus === "not_reviewed",
        ),
      ).length,
      totalErrors: sum(agentSummaries.map((item) => item.totalErrors)),
      totalRetries: sum(agentSummaries.map((item) => item.totalRetries)),
    },

    recentRuns: [...normalizedRuns]
      .sort(
        (a, b) =>
          new Date(b.latestTimestamp || 0).getTime() -
          new Date(a.latestTimestamp || 0).getTime(),
      )
      .slice(0, 8),
  };
}
