import techDocSample from "../assets/samples/tech-doc-agent-sample.json";

export const normalizeRun = (raw) => {
  // Detect agent type based on available fields
  let agent = raw.agent;
  if (!agent) {
    if (raw.slides) agent = "ppt-architect";
    else if (raw.llm_usage && raw.generation) agent = "technical-document";
    else if (raw.brd_output) agent = "brd-agent";
  }

  const start_time = raw.timestamp_start || raw.timestamp;
  const end_time = raw.timestamp_end || raw.completed_at || raw.timestamp;

  let end_to_end_duration_seconds = raw.end_to_end_duration_seconds;
  if (!end_to_end_duration_seconds && start_time && end_time) {
    const start = new Date(start_time);
    const end = new Date(end_time);
    end_to_end_duration_seconds = (end - start) / 1000;
  }

  return {
    run_id: raw.run_id,
    project_id: raw.project_id || "unknown",
    agent,
    environment: raw.environment || "production",
    status: raw.status || (raw.run_success ? "success" : "failure"),
    start_time,
    end_time,
    end_to_end_duration_seconds,
    errors: raw.errors || { total_errors: 0, error_categories: {}, errors: [] },
    error_details: raw.error_details,
    llm_usage: raw.llm_usage || {
      total_prompt_tokens: 0,
      total_completion_tokens: 0,
      total_tokens: 0,
      estimated_cost_usd: 0,
    },
    llm_tokens: raw.llm_tokens,
    assembly: raw.assembly || {
      assembly_success: false,
      output_validation_success: false,
    },
    review: raw.review || { review_cycles: 0 },
    quality_metrics: raw.quality_metrics || {},
    duration: raw.duration,

    // PPT Agent specific
    ...(agent === "ppt-architect" && {
      slides: raw.slides,
      diagram: raw.diagram,
      quality: raw.quality,
      pptx_validation: raw.pptx_validation,
      architecture_justification: raw.architecture_justification,
      review_cycle_count: raw.review_cycle_count,
      acceptance_status: raw.acceptance_status,
      total_retry_count: raw.total_retry_count,
    }),

    // Technical Document Agent specific
    ...(agent === "technical-document" && {
      ingestion: raw.ingestion,
      context_building: raw.context_building,
      section_selection: raw.section_selection,
      generation: raw.generation,
      code_example_validity:
        raw.quality_metrics?.code_examples?.validity_score_percent,
      generation_quality: raw.generation?.avg_quality_score,
      codebase_coverage: raw.quality_metrics?.codebase_coverage,
      tech_stack: raw.quality_metrics?.tech_stack,
      assembly_success: raw.assembly?.assembly_success,
    }),

    // BRD Agent specific
    ...(agent === "brd-agent" && {
      requirement_quality_score: raw.requirement_quality_score || null,
      completeness_by_section: raw.completeness_by_section || {},
      conflict_detection_accuracy: raw.conflict_detection_accuracy || null,
      re_prompt_rate: raw.user_re_prompt_rate || null,
      section_success_rate: raw.section_success_rate || null,
      brd_output_health: raw.brd_output?.health || null,
    }),
  };
};

export const techDocRuns = [normalizeRun(techDocSample)];

// Real PPT Agent data
export const pptRuns = [
  normalizeRun({
    run_id: "a3c04bc7-add0-4f32-9b96-eb581de5d8c1",
    timestamp_start: "2026-05-31T14:46:06.194512",
    timestamp_end: "2026-05-31T14:47:21.241586",
    run_success: true,
    error_details: {
      occurred: false,
      stage: "unknown",
      category: "unknown_error",
      message: "",
      recovery_attempted: false,
      recovery_successful: false,
    },
    duration: {
      total_seconds: 75.05,
      summarization_seconds: 0.0,
      core_generation_seconds: 63.89,
      diagram_generation_seconds: 0.0,
      diagram_rendering_seconds: 0.0,
      pptx_generation_seconds: 10.98,
      pptx_assembly_seconds: 0.0,
      validation_seconds: 0.0,
    },
    llm_tokens: {
      summarization: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
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
      expected_components: 8,
      expected_connections: 10,
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
      valid_relationships: true,
      opens_without_repair: true,
      all_slides_present: true,
      all_media_present: true,
      health_score: 1.0,
    },
    architecture_justification: {
      decisions_identified: 6,
      decisions_justified: 6,
      brd_citations: 5,
      constraint_references: 5,
      justification_score: 1.0,
    },
    review_cycle_count: 0,
    acceptance_status: "pending_review",
    total_retry_count: 0,
    agent: "ppt-architect",
  }),
];

// Real Technical Document Agent data
export const techDocRunsReal = [
  normalizeRun({
    run_id: "03131a86",
    project_id: "f7835598-0a83-4872-8f9d-1e8e4fee173e",
    agent: "technical-document",
    environment: "development",
    app_version: "1.0.0",
    triggered_by: "api",
    timestamp: "2026-05-28T06:46:26.382600+00:00",
    completed_at: "2026-05-28T06:50:48.893419+00:00",
    status: "success",
    error_stage: null,
    errors: {
      total_errors: 0,
      error_categories: {},
      errors: [],
    },
    system: {
      platform: "windows",
      python_version: "3.14.3",
      peak_memory_mb: 992.5,
      avg_memory_mb: 846.5,
      cpu_percent_avg: 6.8,
      cpu_percent_peak: 436.5,
      sampling_interval_seconds: 0.5,
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
      source_type: "zip",
      total_files_found: 4,
      files_after_filter: 4,
      filter_rate_percent: 100.0,
      ingestion_duration_seconds: 0.09,
      ingestion_success: true,
      input_profile: {
        total_loc: 1011,
        primary_language: "JavaScript",
        language_breakdown: {
          JavaScript: 1,
          Python: 1,
        },
        repo_size_kb: 83.6,
      },
    },
    context_building: {
      strategy: "flat",
      total_chunks: 49,
      embedding_duration_seconds: 3.83,
      context_building_duration_seconds: 3.83,
      vector_store_size_mb: 1.36,
      raptor_summary_nodes: 0,
    },
    section_selection: {
      total_sections_available: 18,
      sections_selected: 2,
      selection_method: "ai_suggested",
    },
    generation: {
      sections_attempted: 2,
      sections_succeeded: 2,
      sections_failed: 0,
      section_success_rate_percent: 100.0,
      avg_quality_score: 0.95,
      min_quality_score: 0.9,
      max_quality_score: 1.0,
      per_section_scores: {
        "Executive Summary": 0.9,
        "AI/ML Pipeline": 1.0,
      },
      total_generation_duration_seconds: 60.65,
      llm_retries: 0,
      per_section_word_counts: {
        "Executive Summary": 396,
        "AI/ML Pipeline": 1001,
      },
      empty_sections: [],
      quality_scoring_method: "heuristic_length_structure_keyword",
      quality_score_scale: "0_to_1",
    },
    assembly: {
      output_file: "output.docx",
      output_size_bytes: 54268,
      output_size_kb: 53.0,
      word_count: 1397,
      page_estimate: 5,
      section_count: 2,
      assembly_duration_seconds: 0.47,
      assembly_success: true,
      output_validation_success: true,
      output_validation_error: null,
    },
    review: {
      review_cycles: 2,
      review_cycle_source: "manual",
      review_duration_seconds: 0.0,
    },
    quality_metrics: {
      codebase_coverage: {
        discovered_apis: 3,
        documented_apis: 2,
        discovered_classes: 0,
        documented_classes: 1,
        discovered_functions: 112,
        documented_functions: 1,
        discovered_total: 115,
        documented_total: 4,
        covered_total: 4,
        overall_coverage_percent: 3.5,
      },
      tech_stack: {
        detected: {
          has_dockerfile: false,
          has_cicd: false,
          has_kubernetes: false,
          has_terraform: false,
          has_ansible: false,
          detected_language_hints: [".css", ".html", ".js", ".py"],
          detected_framework_hints: [],
          detected_database_hints: [],
          detected_test_hints: [],
        },
        actual: {},
        correct_matches: [],
        missed_items: [],
        false_positives: ["detected_language_hints"],
        accuracy_score: 0.0,
      },
      code_examples: {
        total_examples: 5,
        valid_examples: 5,
        invalid_examples: 0,
        validation_method: "fenced_block_presence",
        errors: [],
        validity_score_percent: 100.0,
      },
      acceptance_flag: "not_reviewed",
    },
    end_to_end_duration_seconds: 262.51,
  }),
];

export const brdRuns = [
  normalizeRun({
    run_id: "brd-001",
    project_id: "proj-001",
    agent: "brd-agent",
    environment: "production",
    timestamp: "2026-05-27T10:00:00Z",
    completed_at: "2026-05-27T10:15:30Z",
    status: "success",
    errors: { total_errors: 0, error_categories: {}, errors: [] },
    llm_usage: { total_tokens: 18500, estimated_cost_usd: 0.022 },
    assembly: { assembly_success: true, output_validation_success: true },
    review: { review_cycles: 1 },
    quality_metrics: {},
    requirement_quality_score: 0.87,
    section_success_rate: 95.5,
    completeness_by_section: {
      introduction: 100,
      requirements: 92,
      acceptance: 95,
    },
    conflict_detection_accuracy: 0.88,
    user_re_prompt_rate: 0.12,
    brd_output: { health: 0.91 },
  }),
];

export const getAllRuns = () => [
  ...techDocRuns,
  ...techDocRunsReal,
  ...brdRuns,
  ...pptRuns,
];

export const getRunsByAgent = (agentId) => {
  const all = getAllRuns();
  return all.filter((r) => r.agent === agentId);
};
