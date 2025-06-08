import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = getUserRole();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/404" />;
  }

  return children;
};

export default ProtectedRoute;