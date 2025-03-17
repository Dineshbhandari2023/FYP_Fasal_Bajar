import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.accessToken);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  // 1) Wait until we've actually checked for a user in localStorage
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  // 2) If checked and there's still no user, redirect
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // 3) Otherwise, we're good
  return children;
};

export default ProtectedRoute;
