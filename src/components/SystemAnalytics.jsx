import classNames from 'classnames';
import { Bar, Line } from 'react-chartjs-2';

import Icons from '../icons/icons';
import { mockData } from '../data/mock.js';
import { useAppStore } from '../store/store';

import Card from './Card';

const SystemAnalytics = () => {

    const { theme } = useAppStore();

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                }
            }
        },
        scales: {
            x: {
                ticks: { color: theme === 'dark' ? '#ffffff' : '#000000' },
                grid: { color: theme === 'dark' ? '#374151' : '#e5e7eb' }
            },
            y: {
                ticks: { color: theme === 'dark' ? '#ffffff' : '#000000' },
                grid: { color: theme === 'dark' ? '#374151' : '#e5e7eb' }
            }
        }
    };

    const batteryHealthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Battery SOH (%)',
            data: [98, 96, 95, 94, 93, 92],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const systemPerformanceData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Uptime (%)',
                data: [99.8, 99.9, 99.5, 99.7],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: '#22c55e',
                borderWidth: 2
            },
            {
                label: 'Efficiency (%)',
                data: [94.2, 94.8, 93.9, 94.5],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: '#3b82f6',
                borderWidth: 2
            }
        ]
    };

    return (

        <div className="space-y-6">

            <h2
                className={classNames(
                    "text-2xl font-bold",
                    theme === 'dark' ? "text-white" : "text-gray-900"
                )}
            >
                System Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <Card
                    title="Battery SOC"
                    value={mockData.battery.soc}
                    unit="%"
                    icon={Icons.Battery}
                    color="green"
                    trend={0.8}
                />

                <Card
                    title="Battery SOH"
                    value={mockData.battery.soh}
                    unit="%"
                    icon={Icons.Battery}
                    color="blue"
                    trend={-0.2}
                />

                <Card
                    title="Battery Cycles"
                    value={mockData.battery.cycles}
                    icon={Icons.Settings}
                    color="purple"
                    trend={1.2}
                />

                <Card
                    title="System Uptime"
                    value="99.7"
                    unit="%"
                    icon={Icons.Dashboard}
                    color="green"
                    trend={0.1}
                />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card title="Battery Health Trend" className="h-80">
                    <div className="h-64 mt-4">
                        <Line data={batteryHealthData} options={chartOptions} />
                    </div>

                </Card>

                <Card title="System Performance" className="h-80">
                    <div className="h-64 mt-4">
                        <Bar data={systemPerformanceData} options={chartOptions} />
                    </div>
                </Card>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card title="Battery Details">

                    <div className="mt-4 space-y-3">

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Voltage</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {mockData.battery.voltage}V
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Current</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {mockData.battery.current}A
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Temperature</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {mockData.battery.temperature}°C

                            </span>

                        </div>

                    </div>

                </Card>

                <Card title="Maintenance Schedule">

                    <div className="mt-4 space-y-3">

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Last Service</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {mockData.system.lastMaintenance}
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Next Service</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {mockData.system.nextMaintenance}
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Service Interval</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>3 months</span>

                        </div>

                    </div>

                </Card>

                <Card title="Firmware Status">

                    <div className="mt-4 space-y-3">

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Current Version</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                v{mockData.system.firmwareVersion}
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Latest Version</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>v2.4.2</span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Update Status</span>
                            <span className="text-yellow-500">Available</span>

                        </div>

                    </div>

                </Card>

            </div>

        </div>

    );

};

export default SystemAnalytics