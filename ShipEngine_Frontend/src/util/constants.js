export const AppConstants={
    BACKEND_URL:"http://localhost:8080/api",
    // BACKEND_URL:"http://3.7.122.39:8080/api",
    //BACKEND_URL:"http://expensly.publicvm.com:8080/api",
}



// // import { useState } from "react";
// // import { AppContext } from "./AppContext";
// //
// // export const AppContextProvider = ({ children }) => {
// //     const [userData, setUserData] = useState(null);
// //
// //     return (
// //         <AppContext.Provider value={{ userData, setUserData }}>
// //             {children}
// //         </AppContext.Provider>
// //     );
// // };
//
//
// // src/context/AppContextProvider.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { AppContext } from "./AppContext";
// import { AppConstants } from "../util/constants.js";
//
// export const AppContextProvider = ({ children }) => {
//     axios.defaults.withCredentials = true;
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
//         } catch (error) {
//             // silent fail is ok on cold start
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
//     return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };
//





// import { createContext, useEffect, useState } from 'react';
// import { AppConstants } from '../util/constants.js';
// export const AppContext = createContext(null);
// import axios from 'axios';
// import { toast } from 'react-toastify';
//
// // export const AppContext = createContext();
//
// export const AppContextProvider = (props) => {
//     axios.defaults.withCredentials = true;
//
//     const backendURL = AppConstants.BACKEND_URL;
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userData, setUserData] = useState(false);
//     const [dropdown, setDropdown] = useState(false);
//
//     const getUserData = async () => {
//         try {
//             const response = await axios.get(`${backendURL}/profile`);
//             if (response.status === 200) {
//                 setUserData(response.data);
//             } else {
//                 toast.error("Unable to retrieve profile");
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     }
//
//     const getAuthState = async () => {
//         try {
//             const response = await axios.get(`${backendURL}/is-authenticated`);
//             if (response.status === 200 && response.data === true) {
//                 setIsLoggedIn(true);
//                 await getUserData();
//             } else {
//                 setIsLoggedIn(false);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }
//
//     useEffect(() => {
//         getAuthState();
//     }, []);
//
//     const contextValue = {
//         backendURL,
//         isLoggedIn, setIsLoggedIn,
//         userData, setUserData,
//         getUserData,
//         dropdown, setDropdown,
//     }
//
//     return (
//         <AppContext.Provider value={contextValue}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }



// src/context/AppContext.jsx
// import { createContext } from "react";
//
// /**
//  * React context only. No provider here.
//  * This avoids the Fast Refresh warning.
//  */
// export const AppContext = createContext(null);



// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
//
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
//)

// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import "./index.css";
// import App from "./App.jsx";
// import { AppContextProvider } from "./context/AppContext.jsx";
//
// createRoot(document.getElementById("root")).render(
//     <BrowserRouter>
//         <AppContextProvider>
//             <App />
//         </AppContextProvider>
//     </BrowserRouter>
// );


// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import './index.css';
//
// createRoot(document.getElementById('root')).render(
//     <StrictMode>
//         <App />
//     </StrictMode>
// );


// src/main.jsx
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { AppContext } from "./context/AppContext";
// import App from "./App";
// import "./index.css";
//
// createRoot(document.getElementById("root")).render(
//     <StrictMode>
//         <AppContext>
//             <App />
//         </AppContext>
//     </StrictMode>
// );


// main.jsx
