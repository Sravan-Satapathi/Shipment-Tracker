<<<<<<< HEAD
// import {ToastContainer} from "react-toastify";
// import {Route, Routes} from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import Login from "./pages/Login.jsx";
// import EmailVerify from "./pages/EmailVerify.jsx";
// import ResetPassword from "./pages/ResetPassword.jsx";
// import Expenses from "./pages/Expenses.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
//
// const App = () => {
//     return (
//         <div>
//             <ToastContainer/>
//             <Routes>
//                 <Route path="/" element={<Home/>}/>
//                 <Route path="/login" element={<Login/>}/>
//                 <Route path="/email-verify" element={<EmailVerify/>}/>
//                 <Route path="/reset-password" element={<ResetPassword/>}/>
//                 <Route path="/expenses" element={
//                     <ProtectedRoute>
//                         <Expenses/>
//                     </ProtectedRoute>
//                 }/>
//             </Routes>
//         </div>
//     )
// }
//
// export default App

=======
>>>>>>> 9ea815c (Final Push)
import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Expenses from "./pages/Expenses.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
    return (
        <div>
            <ToastContainer/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/email-verify" element={<EmailVerify/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route
                    path="/shipments"
                    element={
                        <ProtectedRoute>
                            <Expenses />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    )
}

export default App