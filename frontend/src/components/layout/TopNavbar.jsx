import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  Calendar, 
  UserCircle, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Check, 
  Sparkles, 
  ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ACADEMIC_YEARS } from '../../config/academicYears';
import { ROLES, DEAN_TYPES, DIRECTOR_TYPES } from '../../config/roles';
import { Avatar } from '../common/Avatar';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

export const TopNavbar = ({ onOpenMobileMenu, onOpenSearch }) => {
  const { user, role, subType, academicYear, setAcademicYear, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const roleRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setIsRoleMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = async (roleKey, subTypeValue = null) => {
    await switchRole(roleKey, subTypeValue);
    setIsRoleMenuOpen(false);
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Menu & Search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-medium border border-slate-200 transition sm:w-64 justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search records, faculty, docs...</span>
            <span className="sm:hidden">Search...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-300 rounded shadow-2xs">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Academic Year Selector, Role Switcher, Notifications, Profile Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Academic Year Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="hidden lg:inline text-slate-400 font-medium">AY:</span>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="bg-transparent border-0 font-bold text-slate-800 text-xs focus:ring-0 focus:outline-none cursor-pointer"
          >
            {ACADEMIC_YEARS.map((ay) => (
              <option key={ay.id} value={ay.label}>
                {ay.label} {ay.isCurrent ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Demo Role Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Switch Role:</span>
            <span className="truncate max-w-[120px]">{subType || role}</span>
            <ChevronDown className="w-3 h-3 text-blue-500" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch Demo Account
              </div>

              <button
                onClick={() => handleRoleChange(ROLES.STAFF)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                  role === ROLES.STAFF ? 'bg-blue-50/50 text-blue-700 font-bold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">Staff (Dr. Rajesh Kumar)</div>
                  <div className="text-[10px] text-slate-400">Data Entry & Submissions</div>
                </div>
                {role === ROLES.STAFF && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleChange(ROLES.HOD)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                  role === ROLES.HOD ? 'bg-blue-50/50 text-blue-700 font-bold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">HOD (Dr. Ramesh Sharma)</div>
                  <div className="text-[10px] text-slate-400">Department Approvals & Faculty</div>
                </div>
                {role === ROLES.HOD && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleChange(ROLES.DEAN, DEAN_TYPES.ACADEMIC)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                  role === ROLES.DEAN && subType === DEAN_TYPES.ACADEMIC ? 'bg-blue-50/50 text-blue-700 font-bold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">Dean Academics (Dr. Anita Desai)</div>
                  <div className="text-[10px] text-slate-400">Curriculum & Results</div>
                </div>
                {role === ROLES.DEAN && subType === DEAN_TYPES.ACADEMIC && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleChange(ROLES.DEAN, DEAN_TYPES.RESEARCH)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                  role === ROLES.DEAN && subType === DEAN_TYPES.RESEARCH ? 'bg-blue-50/50 text-blue-700 font-bold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">Dean Research (Dr. S. Mukherjee)</div>
                  <div className="text-[10px] text-slate-400">Grants & Publications</div>
                </div>
                {role === ROLES.DEAN && subType === DEAN_TYPES.RESEARCH && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleChange(ROLES.IQAC_MEMBER)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                  role === ROLES.IQAC_MEMBER ? 'bg-blue-50/50 text-blue-700 font-bold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">IQAC Member (Prof. Priya Nair)</div>
                  <div className="text-[10px] text-slate-400">Audits & Verification</div>
                </div>
                {role === ROLES.IQAC_MEMBER && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleChange(ROLES.IQAC_HEAD)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                  role === ROLES.IQAC_HEAD ? 'bg-blue-50/50 text-blue-700 font-bold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">IQAC Head (Dr. M. S. Swaminathan)</div>
                  <div className="text-[10px] text-slate-400">Institutional Quality & NAAC</div>
                </div>
                {role === ROLES.IQAC_HEAD && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleChange(ROLES.DIRECTOR, DIRECTOR_TYPES.TECHNICAL)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                  role === ROLES.DIRECTOR && subType === DIRECTOR_TYPES.TECHNICAL ? 'bg-blue-50/50 text-blue-700 font-bold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">Director (Dr. Vikram Seth)</div>
                  <div className="text-[10px] text-slate-400">Institutional Governance</div>
                </div>
                {role === ROLES.DIRECTOR && subType === DIRECTOR_TYPES.TECHNICAL && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleChange(ROLES.DIRECTOR, DIRECTOR_TYPES.ACADEMIC)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 border-t border-slate-100 ${
                  role === ROLES.DIRECTOR && subType === DIRECTOR_TYPES.ACADEMIC ? 'bg-indigo-50/50 text-indigo-700 font-bold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-indigo-900 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                    Admin Director (Dr. H.J. Bhabha)
                  </div>
                  <div className="text-[10px] text-indigo-500 font-medium">Has MANAGE_IQAC_HEAD Power</div>
                </div>
                {role === ROLES.DIRECTOR && subType === DIRECTOR_TYPES.ACADEMIC && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          {isNotifOpen && <NotificationDropdown onClose={() => setIsNotifOpen(false)} />}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <span className="hidden md:block text-xs font-semibold text-slate-800 truncate max-w-[120px]">
              {user?.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900 truncate">{user?.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                <div className="text-[10px] text-blue-600 font-semibold mt-0.5">{subType || role}</div>
              </div>

              <Link
                to="/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
              >
                <UserCircle className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </Link>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
