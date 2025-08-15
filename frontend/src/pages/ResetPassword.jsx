import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Ship, Mail, Lock } from "lucide-react";

const ResetPassword = () => {
    const inputRef = useRef([]);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
    const { backendURL } = useContext(AppContext);

    axios.defaults.withCredentials = true;

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, "");
        e.target.value = value;
        if (value && index < 5) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeydown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").slice(0, 6).split("");
        paste.forEach((digit, i) => {
            if (inputRef.current[i]) {
                inputRef.current[i].value = digit;
            }
        });
        const next = paste.length < 6 ? paste.length : 5;
        inputRef.current[next].focus();
    }

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(backendURL + "/send-reset-otp?email=" + email);
            if (response.status === 200) {
                toast.success("Reset OTP sent successfully");
                setIsEmailSent(true);
            } else {
                toast.error("Something went wrong, please try again later");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data?.message || "Failed to send OTP");
            } else {
                toast.error("Network error, try again");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleVerify = () => {
        const otp = inputRef.current.map(input => input.value).join("");
        if (otp.length !== 6) {
            toast.error("Please enter all 6 digits of the OTP");
            return;
        }
        setOtp(otp);
        setIsOtpSubmitted(true);
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${backendURL}/reset-password`, { email, otp, newPassword });
            if (response.status === 200) {
                toast.success("Password reset successfully");
                navigate("/login");
            } else {
                toast.error("Something went wrong, please try again later");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data?.message || "Password reset failed");
            } else {
                toast.error("Network error, try again");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
            <Link to="/" className="absolute top-6 left-6 flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
                <div className="bg-white p-2 rounded-lg">
                    <Ship className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xl font-bold">ShipTrack</span>
            </Link>

            {/* Reset Password Card */}
            {!isEmailSent && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                        <p className="text-gray-600 mt-2">
                            Enter your registered email address
                        </p>
                    </div>

                    <form onSubmit={onSubmitEmail} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your email address"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </form>
                </div>
            )}

            {/* OTP Card */}
            {!isOtpSubmitted && isEmailSent && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Enter Verification Code</h2>
                        <p className="text-gray-600 mt-2">
                            Enter the 6-digit code sent to your email
                        </p>
                    </div>

                    <div className="flex justify-center space-x-3 mb-8">
                        {[...Array(6)].map((_, i) => (
                            <input
                                key={i}
                                type="text"
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                                maxLength={1}
                                ref={(el) => inputRef.current[i] = el}
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={(e) => handleKeydown(e, i)}
                                onPaste={handlePaste}
                            />
                        ))}
                    </div>

                    <button
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={loading}
                        onClick={handleVerify}
                    >
                        {loading ? "Verifying..." : "Verify Code"}
                    </button>
                </div>
            )}

            {/* New Password Form */}
            {isOtpSubmitted && isEmailSent && (
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">New Password</h2>
                        <p className="text-gray-600 mt-2">
                            Enter your new password
                        </p>
                    </div>

                    <form onSubmit={onSubmitNewPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter new password"
                                    minLength={6}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;