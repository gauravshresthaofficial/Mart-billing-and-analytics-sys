import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true); // Add loading state
    const url = window.location.pathname;

    useEffect(() => {
      const verifyCookie = async () => {
        try {
          const { data } = await axios.post(
            "http://localhost:4000",
            {},
            { withCredentials: true }
          );
          const { status, user } = data;
          if (status) {
            setUsername(user);
          } else {
            removeCookie("token");
            removeCookie("username");
            navigate("/login");
          }
        } catch (error) {
          console.error("Error verifying cookie:", error);
          removeCookie("token");
          removeCookie("username");
          navigate("/login");
        } finally {
          setLoading(false); // Set loading to false after verification
        }
      };

      if (!cookies.token && url !== "/login" && url !== "/signup") {
        navigate("/login");
      } else if ((url === "/login" || url === "/signup") && cookies.token) {
        navigate("/");
      } else if (cookies.token) {
        verifyCookie();
      } else {
        setLoading(false); // Set loading to false if no verification is needed
      }
    }, [cookies.token, navigate, removeCookie, url]);

    const Logout = () => {
      removeCookie("token");
      removeCookie("username");
      navigate("/login");
    };

    if (loading) {
      return <div>Loading...</div>; // Display loading indicator while verifying
    }

    return (
      <>
        <WrappedComponent {...props} username={username} Logout={Logout} />
        <ToastContainer />
      </>
    );
  };

  return AuthComponent;
};

export default withAuth;
