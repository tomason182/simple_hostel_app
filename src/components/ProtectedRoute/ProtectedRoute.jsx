import { Navigate } from "react-router";
import PropTypes from "prop-types";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = document.cookie.includes("isAuth=true");

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/accounts/auth" replace />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
