import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
