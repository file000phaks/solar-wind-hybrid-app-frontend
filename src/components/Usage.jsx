import classNames from 'classnames';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

import Icons from '../icons/icons';
import { mockData } from '../data/mock.js';
import { useAppStore } from '../store/store';

import Card from './Card';

const HourlyPowerUsageChart = ({ data, options }) => {

    const labels = data.powerGeneration.timestamps;

    const chartData = {

        labels,
        datasets: [
            {
                label: 'Power Usage (kWh)',
                data: data.powerConsumption.hourlyConsumption,
                // fill: false,
                backgroundColor: 'rgb(34, 197, 94)',
                borderColor: '#22c55e',
                borderWidth: 2
            },
        ]

    };

    return (
        <div className="h-64 mt-4 pb-3">
            <Line data={chartData} options={options} />
        </div>
    )

}

const DailyPowerUsageChart = ({ data, options }) => {

    const chartData = {
        labels: data.powerGeneration.timestamps,
        datasets: [{
            label: 'Power Usage (kWh)',
            data: data.powerConsumption.dailyConsumption,
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            borderWidth: 2
        }]
    };

    return (
        <div className="h-64 mt-4">
            <Bar data={chartData} options={options} />
        </div>
    )

}

const Usage = () => {

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

    return (

        <div className="space-y-6">

            <h2
                className={classNames(
                    "text-2xl font-bold",
                    theme === 'dark' ? "text-white" : "text-gray-900"
                )}
            >
                Power Usage Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <Card
                    title="Total Consumption"
                    value={150}
                    unit="kWh"
                    icon={Icons.Battery}
                    color="purple"
                    trend={3.7}
                />

                <Card
                    title="Residential"
                    value={mockData.powerConsumption.residential.reduce((a, b) => a + b, 0).toFixed(1)}
                    unit="kWh"
                    icon={Icons.Dashboard}
                    color="green"
                    trend={-1.2}
                />

                <Card
                    title="Commercial"
                    value={mockData.powerConsumption.commercial.reduce((a, b) => a + b, 0).toFixed(1)}
                    unit="kWh"
                    icon={Icons.Settings}
                    color="blue"
                    trend={2.8}
                />

                <Card
                    title="Industrial"
                    value={mockData.powerConsumption.industrial.reduce((a, b) => a + b, 0).toFixed(1)}
                    unit="kWh"
                    icon={Icons.Settings}
                    color="red"
                    trend={5.1}
                />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card title="Hourly Consumption" className="h-80">
                    <HourlyPowerUsageChart data={mockData} options={chartOptions} />
                </Card>

                <Card title="Daily Consumption" className="h-80">
                    <DailyPowerUsageChart data={mockData} options={chartOptions} />
                </Card>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Card title="Peak Usage Hours">

                    <div className="mt-4 space-y-3">

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Morning Peak</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>08:00 - 10:00</span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Evening Peak</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>18:00 - 22:00</span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Off-Peak</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>23:00 - 06:00</span>

                        </div>

                    </div>

                </Card>

                <Card title="Efficiency Metrics">

                    <div className="mt-4 space-y-3">

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Grid Efficiency</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>94.2%</span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Power Factor</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>0.95</span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Load Factor</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>68.7%</span>

                        </div>

                    </div>

                </Card>

            </div>

        </div>

    );

};

export default Usage;