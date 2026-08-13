import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCircle, 
  GraduationCap, 
  BookOpen, 
  FlaskConical, 
  Award, 
  Trophy, 
  Users, 
  CheckSquare, 
  BarChart3, 
  PieChart, 
  Building2, 
  ShieldCheck, 
  FileCheck2, 
  Sparkles, 
  ClipboardList, 
  Target, 
  TrendingUp, 
  ShieldAlert, 
  FolderOpen, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NAVIGATION_SECTIONS } from '../../config/navigation';
import { Avatar } from '../common/Avatar';
import { StatusBadge } from '../common/StatusBadge';

// Map icon string name to Lucide component
const ICON_MAP = {
  LayoutDashboard,
  UserCircle,
  GraduationCap,
  BookOpen,
  FlaskConical,
  Award,
  Trophy,
  Users,
  CheckSquare,
  BarChart3,
  PieChart,
  Building2,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  ClipboardList,
  Target,
  TrendingUp,
  ShieldAlert,
  FolderOpen,
  FileText,
  Bell,
  Settings,
};

export const Sidebar = ({ isMobile = false, onClose = () => {} }) => {
  const { user, hasPermission, logout, role, subType } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Filter sections and items based on user permissions
  const visibleSections = NAVIGATION_SECTIONS.map((section) => {
    const visibleItems = section.items.filter((item) => {
      if (!item.requiredPermission) return true;
      return hasPermission(item.requiredPermission);
    });

    return {
      ...section,
      items: visibleItems,
    };
  }).filter((section) => section.items.length > 0);

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shrink-0 select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md tracking-wider">
            IQ
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              IQAC Portal
            </h2>
            <p className="text-[10px] text-blue-400 font-medium uppercase tracking-wider">
              Institutional Quality ERP
            </p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Banner */}
      <div className="px-4 py-2.5 bg-slate-800/60 border-b border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Active Role
        </span>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {subType || role}
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 custom-scroll">
        {visibleSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => isMobile && onClose()}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge === 'pending_approvals' && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                        4
                      </span>
                    )}
                    {item.badge === 'iqac_approvals' && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-400 text-slate-950">
                        6
                      </span>
                    )}
                    {item.badge === 'unread_notifications' && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 transition">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {user?.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-md transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
