import DashboardLayout from "../layout/dashboardLayout";

export default function Dashboard() {
    return (
        <>
            <h1 className="text-3xl font-semibold mb-6">
                Dashboard
            </h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                    <h3 className="text-lg font-medium mb-2">Account Status</h3>
                    <p className="text-sm text-gray-400">
                        Your email is verified and account is active.
                    </p>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                    <h3 className="text-lg font-medium mb-2">Security</h3>
                    <p className="text-sm text-gray-400">
                        OTP-based authentication enabled.
                    </p>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                    <h3 className="text-lg font-medium mb-2">Last Login</h3>
                    <p className="text-sm text-gray-400">
                        Today at 10:42 AM
                    </p>
                </div>
            </div>
        </>
    );
}
