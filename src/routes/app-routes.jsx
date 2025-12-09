import LoadingBar from "@/components/loader/loading-bar";

import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Maintenance from "@/components/common/maintenance";
import SignUp from "@/app/auth/sign-up";
import ReceiptList from "@/app/receipt/receipt-list";


const Login = lazy(() => import("@/app/auth/login"));


const NotFound = lazy(() => import("@/app/errors/not-found"));
const Dashboard = lazy(() => import("@/app/dashboard/dashboard"));

const ForgotPassword = lazy(() =>
  import("@/components/forgot-password/forgot-password")
);
const AuthRoute = lazy(() => import("./auth-route"));
const ProtectedRoute = lazy(() => import("./protected-route"));

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<LoadingBar />}>
              <ForgotPassword />
            </Suspense>
          }
        />
        <Route path="/maintenance" element={<Maintenance />} />
      </Route>

      <Route path="/" element={<ProtectedRoute />}>
        {/* dashboard  */}
        <Route
          path="/home"
          element={
            <Suspense fallback={<LoadingBar />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/receipt"
          element={
            <Suspense fallback={<LoadingBar />}>
              <ReceiptList />
            </Suspense>
          }
        />
       
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
