import React from 'react';
import classNames from 'classnames';

import { useAppStore } from '../store/store';

import Card from './Card';

const Profile = () => {
    const { user, updateProfile, theme } = useAppStore();
    const [formData, setFormData] = React.useState({
        name: user?.name || '',
        email: user?.email || '',
        notifications: true,
        autoReports: false
    });

    const handleSubmit = (e) => {

        e.preventDefault();
        updateProfile(formData);

    };

    return (

        <div className="max-w-2xl">

            <h2
                className={classNames(
                    "text-2xl font-bold mb-6",
                    theme === 'dark' ? "text-white" : "text-gray-900"
                )}
            >
                User Profile
            </h2>

            <Card>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>

                        <label
                            className={classNames(
                                "block text-sm font-medium mb-2",
                                theme === 'dark' ? "text-gray-300" : "text-gray-700"
                            )}
                        >
                            Name
                        </label>

                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={classNames(
                                "w-full p-3 rounded-lg border transition-colors duration-200",
                                theme === 'dark'
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                            )}
                        />

                    </div>

                    <div>

                        <label
                            className={classNames(
                                "block text-sm font-medium mb-2",
                                theme === 'dark' ? "text-gray-300" : "text-gray-700"
                            )}
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={classNames(
                                "w-full p-3 rounded-lg border transition-colors duration-200",
                                theme === 'dark'
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                            )}
                        />

                    </div>

                    <div className="flex items-center gap-3">

                        <input
                            type="checkbox"
                            id="notifications"
                            checked={formData.notifications}
                            onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />

                        <label
                            htmlFor="notifications"
                            className={classNames(
                                "text-sm",
                                theme === 'dark' ? "text-gray-300" : "text-gray-700"
                            )}
                        >
                            Enable notifications
                        </label>

                    </div>

                    <div className="flex items-center gap-3">

                        <input
                            type="checkbox"
                            id="autoReports"
                            checked={formData.autoReports}
                            onChange={(e) => setFormData({ ...formData, autoReports: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />

                        <label htmlFor="autoReports" className={classNames(
                            "text-sm",
                            theme === 'dark' ? "text-gray-300" : "text-gray-700"
                        )}>
                            Auto-generate reports
                        </label>

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Update Profile
                    </button>

                </form>

            </Card>

        </div>

    );

};

export default Profile