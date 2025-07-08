import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

import { useAppStore } from './store/store.jsx';

import ParticleBackground from './components/three/ParticleBackground';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import PowerGeneration from './components/PowerGeneration';
import Usage from './components/Usage';
import SystemAnalytics from './components/SystemAnalytics';
import Layout from './components/Layout.jsx';
import { DataProvider } from './contexts/DataContext.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const App = () => {

    const { isAuthenticated } = useAppStore();

    if (!isAuthenticated) {
        return (
            <Router>
                <ParticleBackground theme="dark" />
                <Login />
            </Router>
        );
    }

    return (
        <DataProvider>
            <Router>
                <Layout>
                    <Routes>

                        <Route path="/" element={<Dashboard />} />
                        <Route path="/generation" element={<PowerGeneration />} />
                        <Route path="/usage" element={<Usage />} />
                        <Route path="/analytics" element={<SystemAnalytics />} />
                        <Route path="/profile" element={<Profile />} />

                    </Routes>
                </Layout>
            </Router>
        </DataProvider>
    );

};

export default App;