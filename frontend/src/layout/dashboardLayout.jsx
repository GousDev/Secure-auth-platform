import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-950 text-white">
            <Header />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
