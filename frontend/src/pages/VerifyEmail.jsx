import React from "react";
import AuthLayout from "../components/AuthLayout";

const VerifyEmail = () => {
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
                    We’ve sent a verification link to your email address.
                    Please verify to continue.
                </p>

                {/* Info box */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-sm text-white/80 mb-6">
                    Didn’t receive the email?
                    Check your spam folder or resend it.
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        className="w-full bg-indigo-500 hover:bg-indigo-600 transition py-2.5 rounded-full font-medium shadow-lg hover:scale-[1.02] active:scale-95"
                    >
                        Resend Verification Email
                    </button>

                    <button
                        className="w-full bg-white/10 hover:bg-white/20 transition py-2.5 rounded-full text-sm"
                    >
                        Change Email
                    </button>
                </div>

                {/* Footer */}
                <p className="text-xs text-white/60 mt-6">
                    Need help? Contact support
                </p>
            </div>

            {/* // </div> */}
        </AuthLayout>
    );
};

export default VerifyEmail;
