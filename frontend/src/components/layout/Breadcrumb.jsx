import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  director: 'Director Portal',
  dashboard: 'Dashboard',
  institution: 'Institution',
  departments: 'Departments',
  overview: 'Overview',
  analytics: 'Analytics',
  academic: 'Academic Analytics',
  students: 'Student Analytics',
  faculty: 'Faculty Analytics',
  research: 'Research & Innovation',
  publications: 'Publications',
  placement: 'Placement Analytics',
  reports: 'Reports',
  generate: 'Generate Report',
  history: 'Report History',
  notifications: 'Notifications',
  profile: 'Profile',
  settings: 'Settings',
};

const DEPARTMENT_NAMES = {
  IT: 'Information Technology',
  CSE: 'Computer Science & Engineering',
  ECE: 'Electronics & Communication',
  MECH: 'Mechanical Engineering',
  CIVIL: 'Civil Engineering',
  EEE: 'Electrical & Electronics',
  AIDS: 'AI & Data Science',
  AIML: 'CSE (AI & ML)',
  CSBS: 'CS & Business Systems',
  BME: 'Biomedical Engineering',
  BT: 'Biotechnology',
  CHEM: 'Chemical Engineering',
};

export const Breadcrumb = ({ className = '' }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If on dashboard, show simplified breadcrumb
  if (pathnames.length <= 1 || (pathnames.length === 2 && pathnames[1] === 'dashboard')) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-slate-500 font-medium ${className}`}>
        <span className="text-slate-800 font-bold">Dashboard</span>
      </div>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs ${className}`}>
      <Link
        to="/director/dashboard"
        className="text-slate-500 hover:text-indigo-600 transition flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const upperVal = value.toUpperCase();
        const label =
          DEPARTMENT_NAMES[upperVal] ||
          ROUTE_LABELS[value.toLowerCase()] ||
          (value.startsWith('RPT-') ? `Dossier ${value}` : value.charAt(0).toUpperCase() + value.slice(1));

        if (value === 'director' && !isLast) {
          return null;
        }

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            {isLast ? (
              <span className="font-bold text-slate-900 truncate max-w-[200px]" aria-current="page">
                {label}
              </span>
            ) : (
              <Link to={to} className="text-slate-500 hover:text-indigo-600 transition font-medium truncate max-w-[150px]">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
