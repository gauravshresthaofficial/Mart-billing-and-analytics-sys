import { Route, Navigate } from "react-router-dom";
import useVerifyCookie from "../../hooks/withAuth";

const ProtectedRoute = ({ children }) => {

  const  username  = useVerifyCookie();
  console.log(username)
  return (
    username ? (
      children
    ) : (
      <Navigate to={"/login"} replace />
    )

  );
};

export default ProtectedRoute;
