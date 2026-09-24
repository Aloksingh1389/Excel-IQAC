// Dean Portal layout (Stage 8). Multi-department shell for Deans.
// Sidebar visibility is permission-driven via getDeanModulesForUser().

import React, { useState } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, BarChart3, ClipboardCheck, FolderCheck,
  Sparkles, CalendarDays, CheckSquare, Star, ShieldCheck, Award,
  TrendingUp, FileText, Bell, Menu, X, LogOut, ChevronRight,
  Landmark,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDeanModulesForUser } from '../config/deanPortalConfig';

const ICON_MAP = {
  LayoutDashboard, Building2, BarChart3, ClipboardCheck, FolderCheck,
  Sparkles, CalendarDays, CheckSquare, Star, ShieldCheck, Award,
  TrendingUp, FileText, Bell,
};

export const DeanLayout = () => {
  const { user, logout, academicYear, setAcademicYear } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const modules = getDeanModulesForUser(user);
  const assignedCount = Array.isArray(user?.assignedDepartments) ? user.assignedDepartments.length : 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path, exact) => {
    if (exact || path === '/dean') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full bg-teal-950 text-white w-64">
      <div className="p-4 border-b border-teal-900 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wider text-white truncate">Excel IQAC</p>
            <p className="text-[10px] font-bold text-teal-400">Dean Portal</p>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close menu" className="p-1 rounded-lg hover:bg-teal-900 text-teal-400">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 border-b border-teal-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center font-black text-sm shrink-0">
            {user?.name?.charAt(0) || 'D'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Dean'}</p>
            <p className="text-[10px] text-teal-400 font-medium truncate">Dean &bull; {assignedCount} Departments</p>
          </div>
        </div>
        <p className="text-[10px] text-teal-400 font-medium mt-2 truncate">
          {(user?.assignedDepartments || []).join(' • ')}
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scroll" aria-label="Dean navigation">
        {modules.map((item) => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          const active = isActive(item.path, item.exact);
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.exact}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                active ? 'bg-teal-700 text-white shadow-sm' : 'text-teal-300 hover:bg-teal-900/60 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-teal-400'}`} />
              <span>{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto text-teal-300" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-teal-900">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-900/30 hover:text-rose-300 transition"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <div className="hidden md:flex shrink-0 h-full shadow-xl">
        <SidebarContent />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 shadow-2xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="min-h-14 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 px-4 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">Dean Portal &bull; Multi-Department Overview</p>
              <p className="text-[10px] text-slate-500 font-medium">Assigned Departments: {assignedCount} &bull; Academic Year: {academicYear}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="dean-ay" className="text-[10px] font-bold text-slate-500 uppercase">AY</label>
            <select
              id="dean-ay"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 text-slate-700"
              aria-label="Select academic year"
            >
              {['2026-27', '2025-26', '2024-25'].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <Link to="/dean/notifications" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition relative" aria-label="Dean notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </Link>
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-sm" title={user?.name || 'Dean'}>
              {user?.name?.charAt(0) || 'D'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/60 p-4 sm:p-6 custom-scroll">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
