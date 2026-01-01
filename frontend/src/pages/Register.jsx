export default function Register() {
    return (
        <>
            <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

            <form className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border p-2 rounded"
                />

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
                    Create Account
                </button>
            </form>
        </>
    );
}
