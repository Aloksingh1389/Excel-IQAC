import React from 'react';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  className = '',
  status = null,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size] || sizeMap.md} rounded-full object-cover border border-slate-200 shadow-sm ${className}`}
        />
      ) : (
        <div
          className={`${sizeMap[size] || sizeMap.md} rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-semibold flex items-center justify-center shadow-sm border border-white ${className}`}
        >
          {getInitials(name)}
        </div>
      )}
      {status === 'ACTIVE' && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      )}
    </div>
  );
};

export const UserBadge = ({
  user,
  showRole = true,
  size = 'md',
  className = '',
}) => {
  if (!user) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar src={user.avatar} name={user.name} size={size} status={user.status} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-800 truncate">
          {user.name}
        </div>
        {showRole && (
          <div className="text-xs text-slate-500 truncate">
            {user.designation || user.subType || user.role}
          </div>
        )}
      </div>
    </div>
  );
};

export const Tooltip = ({ content, children, position = 'top' }) => {
  return (
    <div className="relative group inline-flex">
      {children}
      <div
        className={`absolute z-30 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-slate-900 text-white text-xs rounded-md px-2.5 py-1 pointer-events-none whitespace-nowrap shadow-lg ${
          position === 'top'
            ? 'bottom-full left-1/2 -translate-x-1/2 mb-1.5'
            : 'top-full left-1/2 -translate-x-1/2 mt-1.5'
        }`}
      >
        {content}
      </div>
    </div>
  );
};
