import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopNavbar } from '../components/layout/TopNavbar';
import { GlobalSearchModal } from '../pages/common/GlobalSearchModal';

export const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full z-50">
            <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Layout Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 p-0 custom-scroll">
          <Outlet />
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};
