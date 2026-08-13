import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`p-4 md:p-6 max-w-7xl mx-auto space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="hover:text-blue-600 transition flex items-center gap-1 font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="hover:text-blue-600 transition font-medium">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export const PageHeader = ({
  title,
  subtitle,
  breadcrumb = [],
  actions = null,
  badge = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-1 border-b border-slate-200/80 ${className}`}>
      <div>
        {breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};

export const Card = ({ children, className = '', hover = false, onClick = null }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden ${
        hover ? 'hover:shadow-md hover:border-slate-300 transition-all cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const SectionCard = ({
  title,
  subtitle,
  actions,
  children,
  className = '',
  bodyClassName = 'p-5',
}) => {
  return (
    <Card className={className}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/40">
          <div>
            {title && <h3 className="text-sm font-bold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </Card>
  );
};

export const Divider = ({ label = null, className = '' }) => {
  if (label) {
    return (
      <div className={`relative flex items-center justify-center my-4 ${className}`}>
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          {label}
        </span>
        <div className="border-t border-slate-200 w-full" />
      </div>
    );
  }
  return <hr className={`border-slate-200 my-4 ${className}`} />;
};
