import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../config/roles';
import { StaffDashboard } from './StaffDashboard';
import { HodDashboard } from './HodDashboard';
import { DeanDashboard } from './DeanDashboard';
import { IqacDashboard } from './IqacDashboard';
import { DirectorDashboard } from './DirectorDashboard';
import { Loader } from '../../components/common/Loader';

export const DashboardRouter = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Loading dashboard..." />;
  }

  switch (role) {
    case ROLES.STAFF:
      return <StaffDashboard />;
    case ROLES.HOD:
      return <HodDashboard />;
    case ROLES.DEAN:
      return <DeanDashboard />;
    case ROLES.IQAC_MEMBER:
    case ROLES.IQAC_HEAD:
      return <IqacDashboard />;
    case ROLES.DIRECTOR:
      return <DirectorDashboard />;
    default:
      return <StaffDashboard />;
  }
};
