
import Navbar from "@/components/dashboard-stats/Navbar";
import DashboardSkeleton from "@/components/skeleton-loader/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return user ? (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-amber-50 ">
    <Navbar />
    <div className="pt-24 ">
    <Outlet />
    </div>
    
      </div>

  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
