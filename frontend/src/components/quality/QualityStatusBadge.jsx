import React from 'react';
import { getQualityScoreRating } from '../../config/qualityScoreConfig';

export const QualityStatusBadge = ({ score, rating = null }) => {
  const config = rating
    ? getQualityScoreRating(score || 80)
    : getQualityScoreRating(score || 0);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide whitespace-nowrap ${config.classes}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{config.label}</span>
    </span>
  );
};
