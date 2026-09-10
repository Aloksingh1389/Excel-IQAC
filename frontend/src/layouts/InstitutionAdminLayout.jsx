import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopNavbar } from '../components/layout/TopNavbar';

export const InstitutionAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    // If mobile, toggle drawer; if desktop, toggle collapse
    if (window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full z-50 shadow-2xl">
            <Sidebar
              isMobile
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopNavbar onToggleSidebar={handleToggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-slate-50/60 p-4 sm:p-6 lg:p-8 custom-scroll">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
