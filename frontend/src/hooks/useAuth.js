import { useState } from "react";
import { authService } from "../services/auth.service";

export function useAuth() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authService.login(data);

            localStorage.setItem("accesstoken", res.data.accesstoken);

            return res.data;

        } catch (error) {

            setError(error.response?.data?.message || "Login failed");
            throw error;

        } finally {
            setLoading(false);
        }
    }


    const register = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authService.register(data);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, register, loading, error };
}