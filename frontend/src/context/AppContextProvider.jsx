// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { AppContext } from "./AppContext.jsx";
// import { AppConstants } from "../util/constants.js";
//
// export const AppContextProvider = ({ children }) => {
//     axios.defaults.withCredentials = true; // send cookies by default if backend uses them
//
//     const backendURL = AppConstants.BACKEND_URL;
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userData, setUserData] = useState(null);
//
//     const getUserData = async () => {
//         try {
//             const res = await axios.get(`${backendURL}/profile`);
//             if (res.status === 200) {
//                 setUserData(res.data);
//             } else {
//                 toast.error("Unable to retrieve profile");
//             }
//         } catch (err) {
//             toast.error(err?.message || "Failed to retrieve profile");
//         }
//     };
//
//     const getAuthState = async () => {
//         try {
//             const res = await axios.get(`${backendURL}/is-authenticated`);
//             if (res.status === 200 && res.data === true) {
//                 setIsLoggedIn(true);
//                 await getUserData();
//             } else {
//                 setIsLoggedIn(false);
//             }
//         } catch {
//             setIsLoggedIn(false);
//         }
//     };
//
//     useEffect(() => {
//         getAuthState();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);
//
//     const value = {
//         backendURL,
//         isLoggedIn,
//         setIsLoggedIn,
//         userData,
//         setUserData,
//         getUserData,
//     };
//
//     return (
//         <AppContext.Provider value={value}>
//             {children}
//         </AppContext.Provider>
//     );
// };
