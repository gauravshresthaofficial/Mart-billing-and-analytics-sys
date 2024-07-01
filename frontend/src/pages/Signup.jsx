import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import withAuth from "../hooks/withAuth";
import InputLabel from "../components/InputLabel"
import InputField from "../components/InputField"
import Button from "../components/Button";
// import useAuthCheck from "../hooks/useAuthCheck";

const Signup = () => {
    const navigate = useNavigate();
    // useAuthCheck()
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
        username: "",
        role:"admin"
    })
    const { email, password, username, role } = inputValue;
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        })
    }

    const handleError = (err) => {
        toast.error(err, {
            position: "bottom-left",
        })
    }

    const handleSuccess = (msg) => {
        toast.success(msg, {
            position: "bottom-right"
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(inputValue)
        try {
            const { data } = await axios.post("http://localhost:4000/signup", {
                ...inputValue,
            })

            const { sucess, message } = data;

            if (sucess) {
                handleSuccess(message)
                setTimeout(() => {
                    navigate("/login")
                }, 1000)
            } else {
                handleError(message)
            }
        } catch (error) {
            console.log("error: " + error)
        }
        setInputValue({
            ...inputValue,
            email: "",
            password: "",
            username: "",
            role:"admin"
        })
    }

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Create an account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <InputLabel htmlFor="email" className="block" text="Email" />
                                <InputField type="email" name="email" id="email" className="block w-full p-2.5" placeholder="Enter your Email" required onChange={handleOnChange} value={email}/>
                            </div>
                            <div>
                                <InputLabel htmlFor="username" className="block" text="Username" />
                                <InputField type="text" name="username" id="username" className="block w-full p-2.5" placeholder="Enter your Username" required onChange={handleOnChange} value={username}/>
                            </div>
                            <div>
                                <InputLabel htmlFor="password" className="block" text="Password" />
                                <InputField type="password" name="password" id="password" className="block w-full p-2.5" placeholder="********" required onChange={handleOnChange} value={password}/>
                            </div>
                            {/* <div>
                                <InputLabel htmlFor="password" className="block" text="Role" />
                                <InputField type="text" name="role" id="role" className="block w-full p-2.5" placeholder="admin" required onChange={handleOnChange} value={role}/>
                            </div> */}

                            <Button type="button" onClick={handleSubmit} text="Create an account" className="w-full" />
                            <p className="text-sm font-light text-gray-500">
                                Already have an account? <Link to={"/login"} className="font-medium text-slate-600 hover:underline">Login</Link>
                            </p>
                        </form>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default withAuth(Signup)
