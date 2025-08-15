// import { Navigate } from "react-router-dom";
// import { AppContext } from "../context/AppContext.js";
// import { useContext } from "react";
//
// const ProtectedRoute = ({ children }) => {
//     const { userData } = useContext(AppContext);
//     if (!(userData && userData.isAccountVerified)) {
//         return <Navigate to="/" replace />;
//     }
//     return children;
// };
//
// export default ProtectedRoute;


// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AppContext } from "../context/AppContext";
//
// const ProtectedRoute = ({ children }) => {
//     const { userData } = useContext(AppContext);
//
//     if (!userData?.isAccountVerified) {
//         return <Navigate to="/email-verify" replace />;
//     }
//
//     return children;
// };
//
// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.js";

const ProtectedRoute = ({ children }) => {
    const { userData } = useContext(AppContext);

    if (!(userData && userData.isAccountVerified)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
