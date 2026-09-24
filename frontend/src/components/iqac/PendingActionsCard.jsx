import React from 'react';
import { Card } from '../common/Card';
import { AlertCircle, Clock, CheckCircle2, ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../config/roles';

export const PendingActionsCard = ({ user, submissions = [], pendingReviews = [] }) => {
  const navigate = useNavigate();
  const role = user?.role || ROLES.STAFF;

  const isStaff = role === ROLES.STAFF;
  const isReviewer = role === ROLES.IQAC_COORDINATOR || role === ROLES.HOD || role === ROLES.DEAN || role === ROLES.IQAC_HEAD || role === ROLES.TECHNICAL_DIRECTOR || role === ROLES.EXECUTIVE_DIRECTOR_PRINCIPAL;

  const returnedSubmissions = submissions.filter((s) => s.status === 'RETURNED');
  const draftSubmissions = submissions.filter((s) => s.status === 'DRAFT');
  const highPriorityReviews = pendingReviews.filter((s) => s.priority === 'HIGH' || s.priority === 'URGENT');

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Action Required Queue
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Items requiring your action, review, or resubmission
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
          {isStaff ? returnedSubmissions.length + draftSubmissions.length : pendingReviews.length} Action Items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {isStaff ? (
          <>
            <div
              onClick={() => navigate('/iqac/submissions?status=RETURNED')}
              className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition cursor-pointer space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  Returned Submissions
                </span>
                <span className="text-base font-black text-amber-900">{returnedSubmissions.length}</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-tight">
                Submissions returned for missing evidence or correction.
              </p>
            </div>

            <div
              onClick={() => navigate('/iqac/submissions?status=DRAFT')}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition cursor-pointer space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Saved Drafts
                </span>
                <span className="text-base font-black text-slate-900">{draftSubmissions.length}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Draft portfolios requiring final submit into review queue.
              </p>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => navigate('/iqac/review')}
              className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 transition cursor-pointer space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  Pending My Review
                </span>
                <span className="text-base font-black text-indigo-950">{pendingReviews.length}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Submissions awaiting your review, approval, or verification.
              </p>
            </div>

            <div
              onClick={() => navigate('/iqac/review?priority=HIGH')}
              className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 transition cursor-pointer space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  High Priority Reviews
                </span>
                <span className="text-base font-black text-rose-950">{highPriorityReviews.length}</span>
              </div>
              <p className="text-[11px] text-rose-800 leading-tight">
                Urgent accreditation or report deadlines needing fast action.
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
