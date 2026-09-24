// Mock Quality Indicators Dataset for Stage 5F

import { QUALITY_INDICATOR_DEFINITIONS, INDICATOR_STATUS } from '../config/qualityIndicatorConfig';

export const MOCK_QUALITY_INDICATORS = QUALITY_INDICATOR_DEFINITIONS.map((def) => {
  let currentValue = 84;
  let previousValue = 78;
  if (def.id === 'FACULTY_QUALIFICATION_RATE') {
    currentValue = 82;
    previousValue = 76;
  } else if (def.id === 'FDP_PARTICIPATION_RATE') {
    currentValue = 88;
    previousValue = 82;
  } else if (def.id === 'SCOPUS_PUBLICATION_RATE') {
    currentValue = 1.4;
    previousValue = 1.2;
  } else if (def.id === 'EVIDENCE_VERIFICATION_RATE') {
    currentValue = 91;
    previousValue = 85;
  } else if (def.id === 'ACTION_ITEM_CLOSURE_RATE') {
    currentValue = 86;
    previousValue = 80;
  } else if (def.id === 'STUDENT_FEEDBACK_RATE') {
    currentValue = 85;
    previousValue = 83;
  }

  return {
    ...def,
    currentValue,
    previousValue,
    trend: currentValue > previousValue ? 'UP' : 'STABLE',
    status: currentValue >= def.target ? INDICATOR_STATUS.EXCELLENT : INDICATOR_STATUS.GOOD,
    departmentValues: {
      CSE: Math.min(100, currentValue + 6),
      ECE: currentValue - 4,
      EEE: currentValue + 2,
      MECH: currentValue - 12,
      CIVIL: currentValue - 8,
      IT: currentValue + 4,
      'AI-DS': currentValue + 5,
      BIOTECH: currentValue - 2,
      BME: currentValue - 3,
      AGRI: currentValue - 5,
    },
  };
});
