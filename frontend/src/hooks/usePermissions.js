import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user, permissions, hasPermission, hasRole, role, subType } = useAuth();

  const can = (permissionKey) => hasPermission(permissionKey);
  const is = (roleKey) => hasRole(roleKey);

  const canManageIqacHead = () => hasPermission('MANAGE_IQAC_HEAD');

  return {
    permissions,
    role,
    subType,
    user,
    can,
    is,
    canManageIqacHead,
  };
};
