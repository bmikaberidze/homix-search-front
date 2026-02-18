import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
