import { assets } from "../assets/assets.js";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { userData, isLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();

    const handleExpensesClick = () => {
        if (isLoggedIn && userData?.isAccountVerified) {
            navigate("/shipments");
        }
    };

    return (
        <div className="text-center d-flex flex-column align-items-center justify-content-center px-3 py-5" style={{ minHeight: "80vh" }}>

            <img src={assets.header} alt="header" className="mb-4 img-fluid" style={{ maxWidth: "300px" }} />

            <h5 className="fw-semibold">
                Hey {userData ? userData.name : 'User'} <span role="img" aria-label="wave">🌟</span>
            </h5>

            <h1 className="fw-bold display-5 mb-3">Track & Manage Your Shipments</h1>
            <p className="text-muted fs-5 mb-4" style={{ maxWidth: "500px" }}>
                Stay on top of your shipments with instant insights and smart tracking
            </p>

            {isLoggedIn && userData?.isAccountVerified && (
                <button onClick={handleExpensesClick} className="btn btn-outline-custom rounded-pill px-4 py-2">
                    Go to Shipments
                </button>
            )}

            <footer className="text-center text-muted py-3">
                &copy; 2025 Shipping. Made with ❤️ by Sravan
            </footer>
        </div>
    )
}

export default Header;