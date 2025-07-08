import classNames from 'classnames';
import { Line, Bar } from 'react-chartjs-2';

import { useAppStore } from '../store/store';
import { mockData } from '../data/mock.js';

import Card from './Card';
import Icons from '../icons/icons';

const PowerGeneration = () => {

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

    const solarData = {
        labels: mockData.powerGeneration.timestamps,
        datasets: [{
            label: 'Solar Generation (kW)',
            data: mockData.powerGeneration.solar,
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: '#f59e0b',
            borderWidth: 2
        }]
    };

    const windData = {
        labels: mockData.powerGeneration.timestamps,
        datasets: [{
            label: 'Wind Generation (kW)',
            data: mockData.powerGeneration.wind,
            backgroundColor: 'rgba(6, 182, 212, 0.8)',
            borderColor: '#06b6d4',
            borderWidth: 2
        }]
    };

    const weatherCorrelation = {
        labels: mockData.powerGeneration.timestamps,
        datasets: [
            {
                label: 'Solar Irradiance (W/m²)',
                data: mockData.weather.solarIrradiance,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                yAxisID: 'y',
                type: 'line'
            },
            {
                label: 'Wind Speed (m/s)',
                data: mockData.weather.windSpeed,
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                yAxisID: 'y1',
                type: 'line'
            }
        ]
    };

    const correlationOptions = {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                ticks: { color: theme === 'dark' ? '#ffffff' : '#000000' },
                grid: { drawOnChartArea: false }
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
                Power Generation Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card
                    title="Total Solar Today"
                    value={mockData.powerGeneration.solar.reduce((a, b) => a + b, 0).toFixed(1)}
                    unit="kWh"
                    icon={Icons.Sun}
                    color="yellow"
                    trend={8.3}
                />

                <Card
                    title="Total Wind Today"
                    value={mockData.powerGeneration.wind.reduce((a, b) => a + b, 0).toFixed(1)}
                    unit="kWh"
                    icon={Icons.Wind}
                    color="blue"
                    trend={-3.2}
                />

                <Card
                    title="Peak Generation"
                    value={Math.max(...mockData.powerGeneration.solar, ...mockData.powerGeneration.wind)}
                    unit="kW"
                    icon={Icons.Battery}
                    color="green"
                    trend={12.1}
                />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card title="Solar Generation - 24h" className="h-80">
                    <div className="h-64 mt-4">
                        <Bar data={solarData} options={chartOptions} />
                    </div>
                </Card>

                <Card title="Wind Generation - 24h" className="h-80">
                    <div className="h-64 mt-4">
                        <Bar data={windData} options={chartOptions} />
                    </div>
                </Card>

            </div>

            {/* <Card title="Weather Correlation" className="h-96">
                <div className="h-80 mt-4">
                    <Line data={weatherCorrelation} options={correlationOptions} />
                </div>
            </Card> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Card title="Solar Performance Metrics">

                    <div className="mt-4 space-y-3">

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Peak Irradiance</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {Math.max(...mockData.weather.solarIrradiance)} W/m²
                            </span>
                        
                        </div>

                        <div className="flex justify-between">
                        
                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Efficiency</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>18.5%</span>
                        
                        </div>

                        <div className="flex justify-between">
                        
                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Capacity Factor</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>28.3%</span>
                        
                        </div>

                    </div>

                </Card>

                <Card title="Wind Performance Metrics">

                    <div className="mt-4 space-y-3">

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Average Wind Speed</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                                {(mockData.weather.windSpeed.reduce((a, b) => a + b, 0) / mockData.weather.windSpeed.length).toFixed(1)} m/s
                            </span>
                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Turbine Efficiency</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>42.1%</span>

                        </div>

                        <div className="flex justify-between">

                            <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Capacity Factor</span>
                            <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>35.7%</span>

                        </div>

                    </div>

                </Card>

            </div>

        </div>

    );

};

export default PowerGeneration