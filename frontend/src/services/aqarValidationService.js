// AQAR Report Validation Engine (Stage 5H)

export const aqarValidationService = {
  validateAQARReport: (report) => {
    const blockers = [];
    const warnings = [];

    if (!report.academicYear) {
      blockers.push('Academic year selection is required.');
    }

    if (!report.executiveSummary || !report.executiveSummary.trim()) {
      warnings.push('Executive summary is empty or incomplete.');
    }

    if (!report.partB || !report.partB.criteria || report.partB.criteria.length === 0) {
      blockers.push('Part B Criteria 1–7 metrics data is missing.');
    }

    if (report.evidenceSummary && report.evidenceSummary.totalMissing > 5) {
      warnings.push(`${report.evidenceSummary.totalMissing} evidence documents are currently missing.`);
    }

    let status = 'VALID';
    if (blockers.length > 0) {
      status = 'BLOCKED';
    } else if (warnings.length > 0) {
      status = 'WARNING';
    }

    return {
      status,
      blockers,
      warnings,
      isValid: blockers.length === 0,
      isBlocked: blockers.length > 0,
    };
  },
};
