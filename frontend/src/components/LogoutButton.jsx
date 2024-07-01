import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const LogoutButton = ({ className }) => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);


  const handleLogout = () => {
    console.log("logout");
    removeCookie('token');
    removeCookie('username')
    navigate('/login');
    console.log(cookies, "cookies")
  };

  // Use twmerge to combine Tailwind classes
  const buttonClasses = twMerge(
    "px-6 py-2 bg-blue-700 rounded-lg text-white font-semibold hover:bg-blue-800 shadow-lg",
    className // Include any additional classNames passed as props
  );

  return (
    <button onClick={handleLogout} className={buttonClasses}>
      Log Out
    </button>
  );
};

export default LogoutButton;
