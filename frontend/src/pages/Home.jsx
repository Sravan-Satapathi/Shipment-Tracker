import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import Navbar from "../components/Navbar";
import { Ship, Truck, Plane, BarChart3, Shield, Clock } from "lucide-react";

const Home = () => {
    const { userData, isLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();

    const shouldShowGetStarted = isLoggedIn && userData && !userData.isAccountVerified;

    const handleGetStarted = () => {
        if (shouldShowGetStarted) {
            navigate("/email-verify");
        } else if (isLoggedIn && userData?.isAccountVerified) {
            navigate("/shipments");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-600 p-4 rounded-2xl">
                            <Ship className="w-16 h-16 text-white" />
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        Welcome to ShipTrack
                        {userData && (
                            <span className="block text-3xl text-blue-600 mt-2">
                                Hello, {userData.name}! 👋
                            </span>
                        )}
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Streamline your logistics operations with our comprehensive shipment management system.
                        Track, manage, and optimize your shipping processes with ease.
                    </p>

                    <button
                        onClick={handleGetStarted}
                        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        {shouldShowGetStarted
                            ? "Verify Email to Get Started"
                            : isLoggedIn && userData?.isAccountVerified
                                ? "Go to Dashboard"
                                : "Get Started"
                        }
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                            <Plane className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Multi-Modal Shipping</h3>
                        <p className="text-gray-600">
                            Support for Air, Sea, and Road transportation with specialized tracking for each mode.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                            <BarChart3 className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Advanced Analytics</h3>
                        <p className="text-gray-600">
                            Get insights into your shipping costs, delivery times, and performance metrics.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                            <Clock className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Real-time Tracking</h3>
                        <p className="text-gray-600">
                            Monitor your shipments in real-time with instant status updates and notifications.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                            <div className="text-gray-600">Shipments Tracked</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                            <div className="text-gray-600">Uptime</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                            <div className="text-gray-600">Countries</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                            <div className="text-gray-600">Support</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2025 ShipTrack. Built with ❤️ for logistics professionals.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;