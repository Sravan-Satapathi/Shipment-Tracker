import { Navigate } from "react-router-dom";
import {AppContext} from "../context/AppContext.jsx";
import {useContext} from "react";

const ProtectedRoute = ({ children }) => {
    const { userData } = useContext(AppContext);

    if (!(userData && userData.isAccountVerified)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
