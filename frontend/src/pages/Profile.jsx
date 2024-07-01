import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Profile = () => {
    const [cookies] = useCookies(['username', 'token']);
    const username = cookies.username || '';
    const [userDetails, setUserDetails] = useState({ email: '', username: '', password: '', confirmPassword: '', role: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateMessage, setUpdateMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false)


    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!username) {
                setError('No username cookie found.');
                setLoading(false);
                return;
            }

            try {

                const response = await axios.get(`http://localhost:4000/user/${username}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                });

                // setUserDetails(response.data.user);
                const result = response.data.user
                setUserDetails({ email: result.email, username: result.username, password: '', confirmPassword: '', role: result.role });
            } catch (error) {
                setError('Failed to fetch user details.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [username, cookies.token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setDisabledButton(true);

        // Define password criteria
        const minLength = 8;
        // const hasUpperCase = /[A-Z]/.test(userDetails.password);
        // const hasLowerCase = /[a-z]/.test(userDetails.password);
        // const hasNumber = /\d/.test(userDetails.password);
        // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(userDetails.password);

        // Check if passwords match
        if (userDetails.password !== userDetails.confirmPassword) {
            setUpdateMessage('Passwords do not match.');
            setDisabledButton(false);
            return;
        }

        // Check password length
        if (userDetails.password.length < minLength) {
            setUpdateMessage(`Password must be at least ${minLength} characters long.`);
            setDisabledButton(false);
            return;
        }

        // Check for uppercase, lowercase, number, and special character
        // if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        //     setUpdateMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        //     setDisabledButton(false);
        //     return;
        // }

        try {
            const response = await axios.patch(`http://localhost:4000/user/${username}`, userDetails, {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            });

            const result = response.data.user
            setUserDetails({ email: result.email, username: result.username, password: '', confirmPassword: '', role: result.role });
            setDisabledButton(false);
            setUpdateMessage('User details updated successfully.');
            setTimeout(() => {
                setUpdateMessage('');
            }, 3000);
        } catch (error) {
            setUpdateMessage('Failed to update user details.');
            setDisabledButton(false);
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="flex  flex-col w-full h-full bg-gray-50 p-4 gap-4">
            <div className='flex justify-between items-center pl-2'>
                <h1 className="font-bold text-lg text-gray-900">Profile</h1>
            </div>
            <div className="flex-grow flex flex-col gap-4 rounded-lg border p-4 shadow-md bg-white">
                <div className="w-full md:max-w-md xl:p-0 relative">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                        {updateMessage && (
                            <p className={`text-center ${updateMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                                {updateMessage}
                            </p>
                        )}
                        <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="username"
                                    name="username"
                                    onChange={handleInputChange}
                                    value={userDetails.username}
                                    placeholder="Enter your username"
                                    disabled
                                    className="block bg-gray-100 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userDetails.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    disabled
                                    className="block bg-gray-100 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>


                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={userDetails.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 top-4 px-2 text-gray-500"
                                >
                                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </button>
                            </div>

                            <div className='relative'>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={userDetails.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                    className="block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <button
                                    type="button"
                                    disabled={disabledButton}
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 top-4 px-2 text-gray-500"
                                >
                                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-700 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 shadow-lg"
                            >
                                Update Details
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
