import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/auth/profile");
                setProfile(res.data.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/login");
                } else {
                    setError(err.response?.data?.message || "Failed to load profile");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-white">
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">My Profile</h1>
                    <p className="text-white/60 text-sm">
                        Manage your account details
                    </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-400">
                    {profile.role}
                </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/20 my-5" />

            {/* Profile Info */}
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-white/60">Name</p>
                    <p className="font-medium">{profile.name}</p>
                </div>

                <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="font-medium">{profile.email}</p>
                </div>

                <div>
                    <p className="text-sm text-white/60">Email Status</p>
                    {profile.is_email_verified ? (
                        <span className="text-green-400 font-medium">
                            ✔ Verified
                        </span>
                    ) : (
                        <span className="text-yellow-400 font-medium">
                            Not verified
                        </span>
                    )}
                </div>

                <div>
                    <p className="text-sm text-white/60">Joined</p>
                    <p className="font-medium">
                        {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
                <button
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 transition py-2 rounded-full text-sm font-medium"
                >
                    Edit Profile
                </button>

                <button
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 transition py-2 rounded-full text-sm font-medium text-red-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
