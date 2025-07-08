import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/store';
import classNames from 'classnames';

const Login = () => {

    const { login, theme } = useAppStore();
    const [formData, setFormData] = React.useState({ email: '', password: '' });
    const [isSignup, setIsSignup] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {

        e.preventDefault();

        if (formData.password === '1234') {

            login({ email: formData.email, name: 'Admin', role: 'admin' });

        } else {

            login({ email: formData.email, name: 'User', role: 'user' });

        }

        navigate('/');

    };

    return (

        <div
            className={classNames(
                "min-h-screen flex items-center justify-center transition-colors duration-300",
                theme === 'dark' ? "bg-gray-900" : "bg-gray-50"
            )}
        >
            <div
                className={classNames(
                    "max-w-md w-full p-8 rounded-xl shadow-xl border transition-all duration-300",
                    theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                )}
            >
                <h2
                    className={classNames(
                        "text-2xl font-bold mb-6 text-center",
                        theme === 'dark' ? "text-white" : "text-gray-900"
                    )}
                >
                    {isSignup ? 'Sign Up' : 'Login'}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={classNames(
                            "w-full p-3 rounded-lg border transition-colors duration-200",
                            theme === 'dark'
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        )}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password (use 1234 for admin)"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={classNames(
                            "w-full p-3 rounded-lg border transition-colors duration-200",
                            theme === 'dark'
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        )}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        {isSignup ? 'Sign Up' : 'Login'}
                    </button>

                </form>

                <p
                    className={classNames(
                        "text-center mt-4 text-sm",
                        theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    )}
                >
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}

                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="ml-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                        {isSignup ? 'Login' : 'Sign Up'}
                    </button>

                </p>

            </div>

        </div>

    );

};

export default Login;
