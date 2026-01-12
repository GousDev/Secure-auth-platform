import React, { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const VerifyEmail = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleVerify = async () => {
        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/auth/verify-email-otp", {
                email,
                otp,
            });

            if (res.data.success) {
                alert("email verified successfully")
                navigate("/login");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-black px-4"> */}

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white max-w-[420px] w-full p-8 rounded-2xl shadow-2xl text-center">

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-400">
                        📧
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold mb-2">
                    Verify your email
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-white/70 mb-6">
                    Enter the 6-digit OTP sent to <br />
                    <span className="text-indigo-300 font-medium">{email}</span>
                </p>

                {/* Error */}
                {error && (
                    <p className="text-red-400 text-sm mb-4">{error}</p>
                )}

                {/* OTP Input */}
                <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter OTP"
                    className="w-full text-center tracking-[0.4em] text-lg bg-white/20 text-white placeholder-white/50 border border-white/30 outline-none rounded-md py-3 px-4 focus:ring-2 focus:ring-indigo-400 mb-6"
                />

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 transition py-2.5 rounded-full font-medium shadow-lg hover:scale-[1.02] active:scale-95"
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>


                {/* Footer */}
                <p className="text-xs text-white/60 mt-6">
                    Didn’t receive the OTP? Check spam folder
                </p>
            </div>

            {/* // </div> */}
        </AuthLayout>
    );
};

export default VerifyEmail;
