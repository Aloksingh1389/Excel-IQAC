import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  FileText,
  Bell,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { getNavItemsForUser } from '../../config/navigation';
import { useAuth } from '../../context/AuthContext';

const ICON_MAP = {
  LayoutDashboard,
  Building2,
  BarChart3,
  FileText,
  Bell,
  Settings,
  Layers,
  ShieldCheck,
};

export const Sidebar = ({
  collapsed = false,
  onToggleCollapse = () => {},
  isMobile = false,
  onCloseMobile = () => {},
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const [openSubmenus, setOpenSubmenus] = useState({
    iqac: true,
    institution: true,
  });

  const navItems = getNavItemsForUser(user);

  const toggleSubmenu = (id) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col h-full shrink-0 select-none transition-all duration-200 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-indigo-600/30 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 leading-tight tracking-tight">
                IQAC Portal
              </h1>
              <p className="text-[10px] text-slate-500 font-medium leading-tight truncate">
                Institutional Quality Management
              </p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {isMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scroll" aria-label="Main Navigation">
        {navItems.map((item) => {
          const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
          const hasChildren = item.children && item.children.length > 0;
          const isParentActive =
            hasChildren &&
            item.children.some(
              (child) =>
                location.pathname === child.path ||
                (child.path !== '/director/institution' &&
                  child.path !== '/iqac/dashboard' &&
                  location.pathname.startsWith(child.path))
            );
          const isSubmenuOpen = openSubmenus[item.id] !== false;

          if (hasChildren && !collapsed) {
            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isParentActive
                      ? 'text-indigo-900 bg-indigo-50/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <IconComponent
                      className={`w-4 h-4 shrink-0 ${
                        isParentActive ? 'text-indigo-600' : 'text-slate-500'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                      isSubmenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isSubmenuOpen && (
                  <div className="pl-7 pr-1 py-0.5 space-y-0.5 animate-in fade-in duration-100">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        end={child.exact}
                        onClick={() => isMobile && onCloseMobile()}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                          }`
                        }
                      >
                        <span className="truncate">{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => isMobile && onCloseMobile()}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <IconComponent
                className={`w-4 h-4 shrink-0 transition-colors ${
                  collapsed ? 'w-5 h-5' : ''
                }`}
                aria-hidden="true"
              />

              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Desktop Collapse Toggle Footer */}
      {!isMobile && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-full flex items-center justify-center p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer text-xs font-medium gap-2"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse menu</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
};
