import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import {
    Bars3Icon,
    BellIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        navigate("/login");
    };

    return (
        <Disclosure
            as="nav"
            className="relative bg-gray-900 dark:bg-gray-900
      dark:after:pointer-events-none dark:after:absolute
      dark:after:inset-x-0 dark:after:bottom-0 dark:after:h-px
      dark:after:bg-white/10"
        >
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">

                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton
                            className="group inline-flex items-center justify-center
              rounded-md p-2 text-gray-400 hover:bg-white/5
              hover:text-white focus:outline-indigo-500"
                        >
                            <Bars3Icon className="block size-6 group-data-open:hidden" />
                            <XMarkIcon className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>

                    {/* Logo + Nav */}
                    <div className="flex flex-1 items-center justify-center sm:justify-start">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <span className="text-white font-semibold text-lg">
                                SecureAuth
                            </span>
                        </Link>

                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => {
                                    const isActive = location.pathname === item.href;

                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={classNames(
                                                isActive
                                                    ? "bg-gray-900 text-white dark:bg-gray-950/50"
                                                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                                                "rounded-md px-3 py-2 text-sm font-medium"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:ml-6 sm:pr-0">


                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <MenuButton className="flex rounded-full focus:outline-indigo-500">
                                <img
                                    src="https://i.pravatar.cc/100"
                                    alt="profile"
                                    className="size-8 rounded-full"
                                />
                            </MenuButton>

                            <MenuItems
                                className="absolute right-0 z-10 mt-2 w-48
                origin-top-right rounded-md bg-white py-1 shadow-lg
                outline outline-black/5 dark:bg-gray-800 dark:outline-white/10"
                            >
                                <MenuItem>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm
                    text-gray-700 hover:bg-gray-100
                    dark:text-gray-300 dark:hover:bg-white/5"
                                    >
                                        Profile
                                    </Link>
                                </MenuItem>

                                <MenuItem>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm
                    text-red-600 hover:bg-gray-100
                    dark:hover:bg-white/5"
                                    >
                                        Logout
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as={Link}
                            to={item.href}
                            className="block rounded-md px-3 py-2
              text-base font-medium text-gray-300
              hover:bg-white/5 hover:text-white"
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
