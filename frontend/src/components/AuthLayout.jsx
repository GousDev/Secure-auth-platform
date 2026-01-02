const AuthLayout = ({ children }) => {
    return (
        // <div
        //     className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        //     style={{
        //         backgroundImage:
        //             "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')",
        //     }}
        // >
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-indigo-800">
            {/* Dark + blur overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80 backdrop-blur-sm"></div>

            {/* Content */}
            <div className="relative z-10 w-full flex justify-center">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
