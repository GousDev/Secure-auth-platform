import { useState } from "react";
import AuthLayout from "../components/AuthLayout";

export default function Login() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // await login(form);
    };


    return (
        <AuthLayout>
            {/* <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-indigo-800"> */}
            <form className=" bg-white/20 backdrop-blur-xl border border-white/30 text-white max-w-[380px] w-full mx-4 p-6 rounded-2xl shadow-2xl"
                onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Login
                </h2>

                <p className="mt-4 text-base text-center text-gray-100">
                    Please enter email and password to access.
                </p>

                <div className="mt-6">
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

                <div className=" py-3">
                    <a
                        href="#"
                        className="text-sm text-indigo-300 hover:text-indigo-400 underline"
                    >
                        Forgot Password?
                    </a>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="
            w-full mt-2
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
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center mt-4 text-white/80">
                    Don’t have an account?{" "}
                    <a
                        href="/register"
                        className="text-indigo-300 underline hover:text-indigo-400"
                    >
                        Create one
                    </a>
                </p>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            </form>
            {/* </div> */}
        </AuthLayout >
    );
}
