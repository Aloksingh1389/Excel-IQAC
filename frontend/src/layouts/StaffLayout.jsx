import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, FileText, Upload, CheckSquare,
  Sparkles, CalendarDays, Star, ShieldCheck, Bell, Menu, X,
  LogOut, ChevronRight
} from 'lucide-react';

const STAFF_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/staff', icon: LayoutDashboard },
  { id: 'profile', label: 'My Profile', path: '/staff/profile', icon: User },
  { id: 'submissions', label: 'My Submissions', path: '/staff/submissions', icon: FileText },
  { id: 'evidence', label: 'My Evidence', path: '/staff/evidence', icon: Upload },
  { id: 'tasks', label: 'My Tasks', path: '/staff/tasks', icon: CheckSquare },
  { id: 'activities', label: 'My Activities', path: '/staff/activities', icon: Sparkles },
  { id: 'meetings', label: 'My Meetings', path: '/staff/meetings', icon: CalendarDays },
  { id: 'quality', label: 'My Quality', path: '/staff/quality', icon: Star },
  { id: 'compliance', label: 'My Compliance', path: '/staff/compliance', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', path: '/staff/notifications', icon: Bell },
];

export const StaffLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/staff') return location.pathname === '/staff';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full bg-indigo-950 text-white w-64">
      {/* Logo */}
      <div className="p-4 border-b border-indigo-900 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-indigo-300">Excel IQAC</p>
          <p className="text-[10px] font-bold text-indigo-400">Faculty & Staff Portal</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-indigo-900 text-indigo-400">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="p-4 border-b border-indigo-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-sm shrink-0">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Staff Member'}</p>
            <p className="text-[10px] text-indigo-400 font-medium">{user?.designation || 'Faculty'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scroll">
        {STAFF_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                active
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'text-indigo-300 hover:bg-indigo-900/60 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-indigo-400'}`} />
              <span>{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto text-indigo-300" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-indigo-900">
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
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0 h-full shadow-xl">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 shadow-2xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-2xs">
          <button
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Excel IQAC</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-bold">Faculty & Staff Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/staff/notifications" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </Link>
            <Link to="/staff/profile" className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
              {user?.name?.charAt(0) || 'S'}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/60 p-4 sm:p-6 custom-scroll">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
