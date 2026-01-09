import React from 'react'

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-gray-900 text-gray-400">
            <div className=" mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p className="text-sm">
                    © {new Date().getFullYear()} SecureAuth Platform
                </p>

                <p className="text-sm">
                    Built with ❤️ using React & Tailwind
                </p>
            </div>
        </footer>
    );
}

export default Footer