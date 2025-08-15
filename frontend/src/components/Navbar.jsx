import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { Ship, User, LogOut, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [otpSending, setOtpSending] = useState(false);
    const { userData, backendURL, setUserData, setIsLoggedIn, dropdown, setDropdown } = useContext(AppContext);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendURL}/logout`);
            if (response.status === 200) {
                setIsLoggedIn(false);
                setUserData(false);
                navigate("/");
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Logout failed";
            toast.error(msg);
        }
    }

    const sendVerificationOtp = async () => {
        if (otpSending) return;
        setOtpSending(true);
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendURL}/send-otp`);
            if (response.status === 200) {
                navigate("/email-verify");
                toast.success("Verification OTP has been sent successfully");
            } else {
                toast.error("Failed to send verification OTP");
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to send verification OTP";
            toast.error(msg);
        } finally {
            setOtpSending(false);
        }
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Ship className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">ShipTrack</span>
                </div>

                {userData ? (
                    <div className="relative" ref={dropdownRef}>
                        <div
                            className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                            onClick={() => setDropdown(prev => !prev)}
                        >
                            <User className="w-5 h-5" />
                        </div>

                        {dropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                                    <p className="text-xs text-gray-500">{userData.email}</p>
                                </div>

                                {!userData.isAccountVerified && (
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
                                        onClick={sendVerificationOtp}
                                        disabled={otpSending}
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span>{otpSending ? "Sending..." : "Verify Email"}</span>
                                    </button>
                                )}

                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;