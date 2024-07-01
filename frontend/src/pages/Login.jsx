import { useState } from "react";
import axios from "axios";
import withAuth from "../hooks/withAuth";
import InputField from "../components/InputField";
import InputLabel from "../components/InputLabel";
import Button from "../components/Button";
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputV] = useState({
    username: "",
    password: ""
  });
  const [cookies, setCookie] = useCookies(['token']);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputV({ ...inputValue, [name]: value });
  };

  const handleError = (err) => {
    setErrorMessage(err);
    setIsLoading(false);  // Re-enable the button on error
  };

  const handleSuccess = (msg) => {
    setErrorMessage("");  // Clear error message on success
    setIsLoading(false);  // Re-enable the button on success
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("log in check");

    setIsLoading(true);  // Disable the button when submitting

    try {
      const { data } = await axios.post(
        "http://localhost:4000/login",
        { ...inputValue },
        {
          withCredentials: true,
        }
      );
      console.log(data);

      const { success, message, token } = data;
      if (success) {
        handleSuccess(message);
        setCookie('token', token, {
          path: '/',
          expires: new Date(Date.now() + 31536000), // 1 year
        });
        setCookie('username', inputValue.username)
        console.log(inputValue.username, "login")
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
      setInputV({
        ...inputValue,
        username: "",
        password: "",
      });
    } catch (error) {
      handleError("An error occurred while logging in. Please try again.");
      console.log(error);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:max-w-md xl:p-0 relative">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center font-bold leading-tight tracking-tight md:text-2xl w-full text-blue-700">
              Mart Billing and Analysis System
            </h1>
            {errorMessage && (
              <p className="text-center text-red-600">{errorMessage}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <InputLabel htmlFor="username" text="Username" className="block" />
                <InputField
                  type="text"
                  name="username"
                  value={inputValue.username}
                  placeholder="Enter your Username"
                  onChange={handleOnChange}
                  className="block w-full p-2.5"
                />
              </div>

              <div>
                <InputLabel htmlFor="password" text="Password" className="block" />
                <InputField
                  type="password"
                  name="password"
                  value={inputValue.password}
                  placeholder="Enter your password"
                  onChange={handleOnChange}
                  className="block w-full p-2.5"
                />
              </div>
              <Button
                type="submit"
                text="Login"
                className="w-full"
                disabled={isLoading}
              />
              <p className="text-sm font-light text-gray-500">
                Don&apos;t have an account? <Link to={"/signup"} className="font-medium text-slate-600 hover:underline">Signup</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default withAuth(Login);
