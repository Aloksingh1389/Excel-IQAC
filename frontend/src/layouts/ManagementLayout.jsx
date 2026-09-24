// Management Portal layout (Stage 9). Shared executive shell for the
// Technical Director and Executive Director / Principal. Sidebar is
// permission-driven via getManagementModulesForUser(), with an expandable
// Analytics group. No role branches in the layout body.

import React, { useState } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Layers, BarChart3, TrendingUp, LineChart,
  Star, ShieldCheck, Award, ClipboardCheck, FolderCheck, Sparkles,
  CalendarDays, CheckSquare, Target, FileText, BookOpen, ScrollText,
  Bell, Settings, Menu, X, LogOut, ChevronRight, ChevronDown, Command,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getManagementModulesForUser, getManagementRoleLabel } from '../config/managementPortalConfig';

const ICON_MAP = {
  LayoutDashboard, Building2, Layers, BarChart3, TrendingUp, LineChart,
  Star, ShieldCheck, Award, ClipboardCheck, FolderCheck, Sparkles,
  CalendarDays, CheckSquare, Target, FileText, BookOpen, ScrollText,
  Bell, Settings,
};

export const ManagementLayout = () => {
  const { user, logout, academicYear, setAcademicYear } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({ analytics: true });

  const modules = getManagementModulesForUser(user);
  const roleLabel = getManagementRoleLabel(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path, exact) => {
    if (exact || path === '/management') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const toggleGroup = (id) => setOpenGroups((p) => ({ ...p, [id]: !p[id] }));

  const linkClass = (active) => `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
    active ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
  }`;

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full bg-slate-950 text-white w-64">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
            <Command className="w-4 h-4 text-slate-950" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wider text-white truncate">Excel IQAC</p>
            <p className="text-[10px] font-bold text-amber-400">Management Portal</p>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close menu" className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
            {user?.name?.charAt(0) || 'M'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Management'}</p>
            <p className="text-[10px] text-amber-400 font-medium truncate">{roleLabel}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scroll" aria-label="Management navigation">
        {modules.map((item) => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          if (item.children) {
            const open = openGroups[item.id] !== false;
            const childActive = item.children.some((c) => isActive(c.path));
            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(item.id)}
                  className={`w-full ${linkClass(childActive)}`}
                  aria-expanded={open}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="pl-7 pr-1 py-0.5 space-y-0.5">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        onClick={onClose}
                        className={({ isActive: a }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          a ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          const active = isActive(item.path, item.exact);
          return (
            <NavLink key={item.id} to={item.path} end={item.exact} onClick={onClose} className={linkClass(active)}>
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
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
              <p className="text-xs font-black text-slate-900 truncate">Management Portal &bull; Institution Command Center</p>
              <p className="text-[10px] text-slate-500 font-medium">Role: {roleLabel} &bull; Academic Year: {academicYear}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="mgmt-ay" className="text-[10px] font-bold text-slate-500 uppercase">AY</label>
            <select
              id="mgmt-ay"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 text-slate-700"
              aria-label="Select academic year"
            >
              {['2026-27', '2025-26', '2024-25'].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <Link to="/management/notifications" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition relative" aria-label="Management notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </Link>
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 font-black flex items-center justify-center text-sm" title={user?.name || 'Management'}>
              {user?.name?.charAt(0) || 'M'}
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
