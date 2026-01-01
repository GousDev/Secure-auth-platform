export default function Login() {
    return (
        <>
            <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

            <form className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded"
                />

                <button className="w-full bg-black text-white py-2 rounded">
                    Login
                </button>
            </form>
        </>
    );
}
