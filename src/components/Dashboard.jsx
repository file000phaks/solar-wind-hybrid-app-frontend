import React from 'react';
import classNames from 'classnames';
import { Line, Doughnut } from 'react-chartjs-2';

import Icons from '../icons/icons';
import { useAppStore } from '../store/store';

import Card from './Card';
import { DataContext } from '../contexts/DataContext.js';

/**
 * Calculates and returns the percentage difference between the old value and the new value
 * @param {number} previous 
 * @param {number} current
 * @returns {number | string} 
 */
const calcTrend = (previous, current) => {

    const trend = (((current - previous) / previous) * 100).toFixed(2);

    return (!trend || isNaN(trend)) ? 0 : trend;
}

const Dashboard = () => {

    const { theme } = useAppStore();

    const { data } = React.useContext(DataContext);

    if (!data.live && !data.history) return <div className="text-white">Loading...</div>

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

    const powerData = {
        labels: data.history.timestamps,
        datasets: [
            {
                label: 'Solar Power',
                data: data.history.powerGeneration.solar,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Wind Power',
                data: data.history.powerGeneration.wind,
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const batteryData = {
        labels: ['Used', 'Available'],
        datasets: [{
            data: [data.live?.batteryStatus.SOC, 100 - data.live?.batteryStatus.SOC],
            backgroundColor: ['#10b981', '#e5e7eb'],
            borderWidth: 0
        }]
    };

    return (

        <div className="space-y-6">

            <h2
                className={classNames(
                    "text-2xl font-bold",
                    theme === 'dark' ? "text-white" : "text-gray-900"
                )}
            >
                System Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                { 
                    console.log(data.temp.temperature)
                }

                <Card
                    title="Solar Generation"
                    value={data.live.powerGeneration.solarPower}
                    unit="kW"
                    icon={Icons.Sun}
                    color="yellow"
                    trend={calcTrend(data.previous?.powerGeneration.solarPower, data.live.powerGeneration.solarPower)}
                />

                <Card
                    title="Wind Generation"
                    value={data.live.powerGeneration.windPower}
                    unit="kW"
                    icon={Icons.Wind}
                    color="blue"
                    trend={calcTrend(data.previous?.powerGeneration.windPower, data.live.powerGeneration.windPower)}
                />

                <Card
                    title="Total Power"
                    value={data.live.powerGeneration.windPower + data.live.powerGeneration.solarPower}
                    unit="kW"
                    icon={Icons.TotalEnergy}
                    color="green"
                    trend={calcTrend(data.previous?.powerGeneration?.totalPower, data.live.powerGeneration.totalPower)}
                />

                <Card
                    title="Battery SOC"
                    value={data.live.batteryStatus.SOC}
                    unit="%"
                    icon={Icons.Battery}
                    color="green"
                    trend={1.8}
                />

                <Card
                    title="System Status"
                    value="Operational"
                    icon={Icons.Settings}
                    color="purple"
                />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card title="Power Generation - Last 24h" className="h-80">

                    <div className="h-64 mt-4">
                        <Line data={powerData} options={chartOptions} />
                    </div>

                </Card>

                <Card title="Battery Status" className="h-80">

                    <div className="h-64 mt-4 flex items-center justify-center">

                        <div className="w-48 h-48">

                            <Doughnut data={batteryData} options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    legend: { display: false }
                                }
                            }} />

                        </div>

                    </div>

                </Card>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card title="Weather Conditions">

                    <div className="mt-4 space-y-2">

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Temperature</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {data.live.weather.temperature}°C
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Wind Speed</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {data.live.weather.windSpeed} m/s
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Humidity</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {data.live.weather.humidity}%
                            </span>

                        </div>

                    </div>

                </Card>

                <Card title="System Health">

                    <div className="mt-4 space-y-2">

                        {/* <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Uptime</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {data.system.uptime}
                            </span>

                        </div> */}

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Battery SOH</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {data.live.batteryStatus.SOC}%
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Firmware</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                v{data.live.batteryStatus.systemMaintenance.version}
                            </span>

                        </div>

                    </div>

                </Card>

                <Card title="Recent Alerts">

                    <div className="mt-4 space-y-2">

                        {
                            data.history.system.alerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className={classNames(
                                        "p-2 rounded text-sm",
                                        theme === 'dark' ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800"
                                    )}
                                >
                                    {alert}
                                </div>
                            ))}

                    </div>

                </Card>

            </div>

        </div>

    );

};

export default Dashboard