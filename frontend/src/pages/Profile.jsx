export default function Profile() {
    return (
        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-semibold mb-2">My Profile</h1>
            <p className="text-white/70">Manage your account details</p>

            <div className="mt-6 space-y-3">
                <div>
                    <p className="text-sm text-white/60">Name</p>
                    <p className="font-medium">Gous</p>
                </div>

                <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="font-medium">gous@example.com</p>
                </div>
            </div>
        </div>
    );
}
