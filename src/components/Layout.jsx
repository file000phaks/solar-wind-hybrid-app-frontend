import React from 'react';
import classNames from 'classnames';
import { useAppStore } from '../store/store';

import ParticleBackground from './three/ParticleBackground';
import Navigation from './Navigation';
import { DataContext } from '../contexts/DataContext.js';

const Layout = ({ children }) => {

    const { theme } = useAppStore();

    const { fetchData, data, dataLoaded } = React.useContext(DataContext);

    React.useEffect(() => {

        if (fetchData) {

            fetchData();

            const interval = setInterval(fetchData, 3000);

            return () => clearInterval(interval);

        }

    }, [dataLoaded]);

    if (!data) return <div className="text-white">Loading...</div>

    return (

        <div
            className={classNames(
                "min-h-screen transition-colors duration-300",
                theme === 'dark' ? "bg-gray-900" : "bg-gray-50"
            )}
        >
            <ParticleBackground theme={theme} />

            <div className="flex">

                <Navigation />
                <main
                    className="flex-1 p-8 overflow-y-scroll overflow-x-hidden ml-64"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style>
                        {
                            `::webkit-scrollbar {
                                    display: none;
                            }`
                        }
                    </style>
                    {children}
                </main>

            </div>

        </div>

    );

};

export default Layout;