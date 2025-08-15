import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import { Ship, Mail, Lock, User } from "lucide-react";

const Login = () => {
    const [isCreateAccount, setIsCreateAccount] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);
        try {
            if (isCreateAccount) {
                const response = await axios.post(`${backendURL}/register`, { name, email, password });
                if (response.status === 201) {
                    navigate("/");
                    toast.success("Account created successfully");
                } else {
                    toast.error("Email already exists");
                }
            } else {
                const response = await axios.post(`${backendURL}/login`, { email, password });
                if (response.status === 200) {
                    setIsLoggedIn(true);
                    getUserData();
                    navigate("/");
                    toast.success("Login successful");
                } else {
                    toast.error("Email or Password is incorrect");
                }
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data?.message || "Authentication failed");
            } else {
                toast.error("Network error, try again");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
            {/* Logo */}
            <Link to="/" className="absolute top-6 left-6 flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
                <div className="bg-white p-2 rounded-lg">
                    <Ship className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xl font-bold">ShipTrack</span>
            </Link>

            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                        <Ship className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        {isCreateAccount ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {isCreateAccount ? "Join ShipTrack today" : "Sign in to your account"}
                    </p>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-6">
                    {isCreateAccount && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your full name"
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your password"
                                required
                                minLength={6}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                    </div>

                    {!isCreateAccount && (
                        <div className="text-right">
                            <Link to="/reset-password" className="text-blue-600 hover:text-blue-700 text-sm">
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : isCreateAccount ? "Create Account" : "Sign In"}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        {isCreateAccount ? (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => setIsCreateAccount(false)}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{" "}
                                <button
                                    onClick={() => setIsCreateAccount(true)}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Create Account
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;