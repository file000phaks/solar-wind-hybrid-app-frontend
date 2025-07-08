import React from "react";
import { Bar, Line } from "react-chartjs-2";
import * as THREE from "three";
import classNames from "classnames";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip } from 'chart.js'

ChartJS.register(CategoryScale, BarElement, LinearScale, PointElement, LineElement, Legend, Tooltip);

const PowerChart = ({ data }) => {

    const labels = [new Date().toLocaleTimeString()];

    return (
        <Bar
            data={{
                labels,
                datasets: [
                    { label: 'Solar Power', data: [data.powerGeneration.solarPower], backgroundColor: '#facc15' },
                    { label: 'Wind Power', data: [data.powerGeneration.windPower], backgroundColor: '#60a5fa' },
                    { label: 'Total Power', data: [data.powerGeneration.totalPower], backgroundColor: '#34d399' },
                ]
            }}
        />
    )
}

const Dashboard = () => {

    const [data, setData] = React.useState(null);
    const [date, setDate] = React.useState(new Date().toLocaleTimeString());

    React.useEffect(() => {

        const fetchData = () => {

            fetch('http://localhost:5000/data')
                .then(res => res.json())
                .then(json => {
                    if (Array.isArray(json) && json.length > 0) setData(json[0]);
                })
                .catch(err => console.error('Fetch error:', err));

            setDate(new Date().toLocaleTimeString());

        };

        fetchData();

        const interval = setInterval(fetchData, 3000);

        return () => clearInterval(interval);

    }, []);

    if (!data) return <div className="text-white">Loading...</div>

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">

            <h1 className="text-2xl font-bold mb-4">Solar-Wind Hybrid Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weather */}
                <div className="bg-gray-800 p-4 rounded">
                    <h2 className="font-semibold text-lg mb-2">Weather</h2>
                    <p>Temperature: {data.weather.temperature}°C</p>
                    <p>Humidity: {data.weather.humidity}%</p>
                    <p>Pressure: {data.weather.pressure}hPa</p>
                    <p>Cloud Cover: {data.weather.cloudCover}%</p>
                    <p>UV Index: {data.weather.uvIndex}</p>
                    <p>Wind: {data.weather.windSpeed}m/s {data.weather.windDirection}</p>
                </div>

                {/* Power Generation */}
                <div className="bg-gray-800 p-4 rounded">
                    <h2 className="font-semibold text-lg mb-2">Power Generation</h2>
                    <p>Solar: {data.powerGeneration.solarPower}kW</p>
                    <p>Wind: {data.powerGeneration.windPower}kW</p>
                    <p>Total: {data.powerGeneration.totalPower}kW</p>
                </div>

                {/* Battery */}
                <div className="bg-gray-800 p-4 rounded">
                    <h2 className="font-semibold text-lg mb-2">System</h2>
                    <p>Battery Charging: {data.batteryStatus.charging ? 'Yes' : 'No'}</p>
                    <p>State of Charge: {data.batteryStatus.SOC}%</p>
                    <p>State of Health: {data.batteryStatus.SOH}%</p>
                    <p>System Version: {data.batteryStatus.systemMaintenance.version}</p>
                    <p>Last Update: {data.batteryStatus.systemMaintenance.lastUpdate}</p>
                </div>

                {/* Consumption*/}
                <div className="bg-gray-800 p-4 rounded">
                    <h2 className="font-semibold text-lg mb-2">Power Consumption</h2>
                    <p>Hourly: {data.powerConsumption.hourlyConsumption}kWh</p>
                    <p>Daily: {data.powerConsumption.dailyConsumption}kWh</p>
                    <p>Peak Hour: {data.powerConsumption.peakUsageHour}</p>
                    <p>Peak Load: {data.powerConsumption.peakLoad}kW</p>
                    <p>Min Hour: {data.powerConsumption.minUsageHour}</p>
                </div>

                <p className="mt-6 text-sm text-gray-400">Last Updated: {date}</p>

            </div>

            <div>

                {
                    data &&
                    <div className="w-full">
                        <PowerChart data={data} />
                    </div>
                }

            </div>

        </div>
    )

}

export default Dashboard