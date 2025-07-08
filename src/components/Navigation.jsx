import { useAppStore } from '../store/store';
import classNames from 'classnames';
import Icons from '../icons/icons';
import { NavLink } from 'react-router-dom';

const Navigation = () => {

    const { theme, toggleTheme, logout } = useAppStore();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Icons.Dashboard },
        { path: '/generation', label: 'Power Generation', icon: Icons.Sun },
        { path: '/usage', label: 'Usage', icon: Icons.Wind },
        { path: '/analytics', label: 'System Analytics', icon: Icons.Battery },
        { path: '/profile', label: 'Profile', icon: Icons.User },
    ];

    return (
        <div
            className={classNames(
                "w-64 h-screen p-4 transition-colors duration-300 overflow-hidden fixed left-0 top-0 z-50",
                theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
                "border-r"
            )}
        >

            <div className="flex items-center justify-between mb-8">

                <h1
                    className={classNames(
                        "text-xl font-bold",
                        theme === 'dark' ? "text-white" : "text-gray-900"
                    )}
                >
                    Solar Wind Hub
                </h1>

                <button
                    onClick={toggleTheme}
                    className={classNames(
                        "p-2 rounded-lg transition-colors duration-200",
                        theme === 'dark'
                            ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                >
                    {theme === 'dark' ? Icons.Sun() : Icons.Moon()}
                </button>

            </div>

            <nav className="space-y-2">
                {
                    navItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                classNames(
                                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                                    theme === 'dark'
                                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                    isActive
                                        ? (theme === 'dark'
                                            ? "bg-blue-600 text-white"
                                            : "bg-blue-400 text-white"
                                        )
                                        : ""
                                )
                            }
                        >

                            <item.icon />
                            <span>{item.label}</span>

                        </NavLink>

                    ))
                }
            </nav>

            <div className="mt-auto pt-8">

                <button
                    onClick={logout}
                    className={classNames(
                        "w-full p-3 rounded-lg transition-colors duration-200",
                        theme === 'dark'
                            ? "bg-red-900 text-red-200 hover:bg-red-800"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                    )}
                >
                    Logout
                </button>

            </div>

        </div>

    );

};

export default Navigation;