import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { Ship, Mail } from "lucide-react";

const EmailVerify = () => {
    const inputRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { getUserData, isLoggedIn, userData, backendURL, setDropdown } = useContext(AppContext);

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

    const handleVerify = async () => {
        const otp = inputRef.current.map(input => input.value).join("");
        if (otp.length !== 6) {
            toast.error("Please enter all 6 digits of the OTP");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${backendURL}/verify-otp`, { otp });
            if (response.status === 200) {
                setDropdown(false);
                toast.success("Email verified successfully");
                getUserData();
                navigate("/");
            } else {
                toast.error("Invalid OTP");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data?.message || "Invalid OTP");
            } else {
                toast.error("Network error, try again");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        isLoggedIn && userData && userData.isAccountVerified && navigate("/");
    }, [isLoggedIn, userData]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
            <Link to="/" className="absolute top-6 left-6 flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
                <div className="bg-white p-2 rounded-lg">
                    <Ship className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xl font-bold">ShipTrack</span>
            </Link>

            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                        <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
                    <p className="text-gray-600 mt-2">
                        Enter the 6-digit code sent to your email address
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
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
            </div>
        </div>
    );
};

export default EmailVerify;