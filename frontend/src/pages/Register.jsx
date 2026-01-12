import { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // console.log(form);
        try {
            const res = await api.post("/auth/register", form);

            // console.log(res)

            if (res.data.success) {
                alert("register successfully")
                setTimeout(() => {
                    navigate('/verify-email', {
                        state: { email: form.email }
                    })
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* // <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-indigo-800"> */}

            <form
                onSubmit={handleSubmit}
                className="
          bg-white/20 backdrop-blur-xl
          border border-white/30
          text-white
          max-w-[380px] w-full
          mx-4 p-6
          rounded-2xl
          shadow-2xl
        "
            >
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Create Account
                </h2>


                <div className="mt-6">
                    <label className="font-medium">Name</label>
                    <input
                        className="
            w-full my-3
            bg-white/20
            text-white
            placeholder-white/70
            border border-white/30
            outline-none
            rounded-md
            py-2.5 px-4
            focus:ring-2 focus:ring-indigo-400
          "
                        type="text"
                        placeholder="Enter your name"
                        required
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                </div>

                <div className="mt-4">
                    <label className="font-medium">Email</label>
                    <input
                        placeholder="Please enter your email"
                        className="w-full my-3
            bg-white/20
            text-white
            placeholder-white/70
            border border-white/30
            outline-none
            rounded-md
            py-2.5 px-4
            focus:ring-2 focus:ring-indigo-400"
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                </div>

                <div className="mt-4">
                    <label className="font-medium">Password</label>
                    <input
                        placeholder="Please enter your password"
                        className="w-full my-3
            bg-white/20
            text-white
            placeholder-white/70
            border border-white/30
            outline-none
            rounded-md
            py-2.5 px-4
            focus:ring-2 focus:ring-indigo-400"
                        required
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    className="
            w-full mt-4
            bg-indigo-500/90
            hover:bg-indigo-600
            transition
            py-2.5
            rounded-full
            text-white
            font-medium
            shadow-lg
            hover:scale-[1.02]
            active:scale-95
          "
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>

                <p className="text-center mt-4 text-white/80">
                    Already have an account?{" "}
                    <a href="/login" className="text-indigo-300 underline hover:text-indigo-400">
                        Login
                    </a>
                </p>
            </form>
            {/* </div> */}
        </AuthLayout >
    );
};

export default Register;
