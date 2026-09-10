import React from 'react';
import { Menu } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { AcademicYearSelector } from './AcademicYearSelector';
import { NotificationBell } from '../notifications/NotificationBell';
import { ProfileMenu } from './ProfileMenu';

export const TopNavbar = ({ onToggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Sidebar toggle and Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumb />
      </div>

      {/* Right: Academic Year, Notifications, Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        <AcademicYearSelector />
        <NotificationBell />
        <div className="h-6 w-px bg-slate-200 mx-0.5 hidden sm:block" aria-hidden="true" />
        <ProfileMenu />
      </div>
    </header>
  );
};
