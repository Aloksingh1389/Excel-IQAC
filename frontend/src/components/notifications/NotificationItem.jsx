import React from 'react';
import { FileText, UploadCloud, Sparkles, CheckCircle2, Clock, Trash2, Check } from 'lucide-react';

const NOTIFICATION_ICONS = {
  REPORT: FileText,
  SUBMISSION: UploadCloud,
  VERIFICATION: Clock,
  SYSTEM: Sparkles,
  AUDIT: CheckCircle2,
};

export const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete,
  compact = false,
}) => {
  const IconComponent = NOTIFICATION_ICONS[notification.type] || FileText;

  return (
    <div
      className={`group relative flex items-start gap-3 p-3 transition-colors ${
        !notification.read ? 'bg-indigo-50/40' : 'bg-white hover:bg-slate-50'
      } ${compact ? 'text-xs' : 'text-sm rounded-xl border border-slate-200'}`}
    >
      <div
        className={`p-2 rounded-lg shrink-0 ${
          !notification.read
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-slate-100 text-slate-500'
        }`}
      >
        <IconComponent className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={`truncate leading-snug ${
              !notification.read
                ? 'font-bold text-slate-900'
                : 'font-medium text-slate-700'
            } ${compact ? 'text-xs' : 'text-sm'}`}
          >
            {notification.title}
          </h4>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
          )}
        </div>

        <p
          className={`text-slate-500 leading-relaxed ${
            compact ? 'text-[11px] line-clamp-2' : 'text-xs'
          }`}
        >
          {notification.description}
        </p>

        <span className="text-[10px] text-slate-400 font-medium block pt-1">
          {notification.timestamp}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!notification.read && onMarkRead && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead(notification.id);
            }}
            title="Mark as read"
            aria-label="Mark as read"
            className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            title="Delete notification"
            aria-label="Delete notification"
            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
