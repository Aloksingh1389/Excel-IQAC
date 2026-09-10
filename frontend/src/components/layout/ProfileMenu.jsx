import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDesignationDisplay } from '../../config/roles';
import { Avatar } from '../common/Avatar';

export const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const designationLabel = getDesignationDisplay(user?.designation, user?.role);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      >
        <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
            {user?.name}
          </span>
          <span className="text-[10px] text-indigo-600 font-semibold leading-tight">
            {designationLabel}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* User Info Header */}
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
            <p className="font-bold text-slate-900 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {designationLabel}
            </span>
          </div>

          <div className="py-1">
            <Link
              to="/director/profile"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition font-medium"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/director/settings"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition font-medium"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </Link>
          </div>

          <div className="border-t border-slate-100 my-1" />

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
