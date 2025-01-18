'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {signOut, useSession} from 'next-auth/react';
import {Bell, FileText, Home, LogIn, LogOut, Monitor, Moon, Package, Settings, Sun, User, Users} from 'lucide-react';
import {useTheme} from 'next-themes';
import {LiaFileInvoiceDollarSolid} from "react-icons/lia";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const {data: session, status} = useSession();
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    React.useEffect(() => setMounted(true), []);

    const menuItems = [
        {name: 'Dashboard', icon: Home, path: '/dashboard'},
        {name: 'Invoices', icon: FileText, path: '/dashboard/invoices'},
        {name: 'Users', icon: Users, path: '/dashboard/users'},
        {name: 'Items', icon: Package, path: '/dashboard/items'},
        {name: 'Settings', icon: Settings, path: '/dashboard/settings'},
    ];
    // Filter menu items based on the user's role
    const filteredMenuItems =
        session?.user?.role === 'ACCOUNTANT'
            ? menuItems.filter((item) => !['Users', 'Items', 'Settings'].includes(item.name)) // Hide "Users" and "Items"
            // for accountants
            : menuItems;

    if (!mounted) return null;

    return (
        <div
            className="flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-16 sm:w-64 h-screen relative z-50">

            {/* Profile Section */}
            <div className="p-4 border-b dark:border-gray-700 relative">
                {/* Centered Logo Section */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                        {/* "Gest" Text */}
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Gest
                        </h1>

                        {/* Rotated Logo */}
                        <LiaFileInvoiceDollarSolid
                            className="h-10 w-10 text-gray-600 dark:text-gray-300 transform rotate-45"
                        />

                        {/* "Fac" Text */}
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Fac
                        </h1>
                    </div>
                </div>

                {/* Button Section */}
                <div className="flex items-center justify-center mt-4">
                    <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex items-center space-x-3 mb-3"
                    >
                        {/* User Info (visible on medium and up) */}
                        {status === 'authenticated' && (
                            <div className="hidden sm:block">
                                <div
                                    className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                    <User className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {session.user?.name || 'User'}
                                    </h2>
                                <p className=" text-gray-500  text-sm dark:text-gray-400 truncate absolute bottom-0 right-10">
                                    {session.user?.role}
                                </p>
                                </div>
                            </div>
                        )}
                    </button>
                </div>


                {/* User Dropdown - Now positioned absolutely */}
                {userDropdownOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-50"
                            onClick={() => setUserDropdownOpen(false)}
                        />
                        {/* Dropdown Content - Width based on content */}
                        <div
                            className="fixed sm:absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
                            {status === 'authenticated' && (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <div className="p-2">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                    <div className="p-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            Notifications
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                3
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Main content - Keep the margin to push sidebar content down, but smaller */}
            <div className={`flex-1 flex flex-col  ${userDropdownOpen ? 'mt-24' : ''} transition-all duration-200`}>
                {/* Dark Mode Toggle */}
                <div className="p-4 border-t dark:border-gray-700 relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center justify-center sm:justify-start space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white w-full p-2"
                    >
                        {theme === 'dark' ? (
                            <Moon className="h-5 w-5"/>
                        ) : theme === 'light' ? (
                            <Sun className="h-5 w-5"/>
                        ) : (
                            <Monitor className="h-5 w-5"/>
                        )}
                        <span className="hidden sm:inline">Mode: {theme}</span>
                    </button>

                    {dropdownOpen && (
                        <>
                            {/* Backdrop to close dropdown on outside click */}
                            <div
                                className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
                                onClick={() => setDropdownOpen(false)}
                            />
                            {/* Dropdown Content */}
                            <div
                                className="absolute left-0 mt-2 w-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700"
                            >
                                <ul className="space-y-1 p-2">
                                    {[
                                        {name: 'Light', icon: Sun, theme: 'light'},
                                        {name: 'Dark', icon: Moon, theme: 'dark'},
                                        {name: 'System', icon: Monitor, theme: 'system'}
                                    ].map(({name, icon: Icon, theme: themeOption}) => (
                                        <li
                                            key={name}
                                            onClick={() => {
                                                setTheme(themeOption);
                                                setDropdownOpen(false);
                                            }}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Icon className="h-5 w-5"/>
                                                <span>{name}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {filteredMenuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className={`flex items-center justify-center sm:justify-start space-x-3 p-2 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5"/>
                                        <span className="hidden sm:inline">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t dark:border-gray-700">
                    {status === 'authenticated' ? (
                        <button
                            onClick={() => signOut({redirectTo: '/auth'})}
                            className="flex items-center justify-center sm:justify-start space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white w-full p-2"
                        >
                            <LogOut className="h-5 w-5"/>
                            <span className="hidden sm:inline">Déconnexion</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push('/auth')}
                            className="flex items-center justify-center sm:justify-start space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white w-full p-2"
                        >
                            <LogIn className="h-5 w-5"/>
                            <span className="hidden sm:inline">Se connecter</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;