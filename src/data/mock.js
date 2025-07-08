// Mock Data
export const mockData = {
    powerGeneration: {
        solar: [12, 18, 24, 30, 28, 22, 16, 14, 10, 8, 6, 4],
        wind: [8, 12, 15, 10, 18, 25, 30, 28, 22, 16, 12, 10],
        timestamps: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
    },
    powerConsumption: {
        residential: [15, 12, 10, 8, 10, 15, 20, 25, 30, 28, 22, 18],
        commercial: [20, 18, 15, 12, 15, 20, 25, 30, 35, 32, 28, 25],
        industrial: [35, 30, 25, 20, 25, 30, 35, 40, 45, 42, 38, 35],
        hourlyConsumption: [4, 3, 4, 3.5, 2, 2.6, 1, 2, 3, 3, 3.7, 4.2],
        dailyConsumption: [15, 12, 10, 8, 10, 15, 20, 25, 30, 28, 22, 18],
        monthlyConsumption: 1205,
        peakUsageHour: 18,
        minUsageHour: 3,
        peakLoad: 32,
        currentPowerConsumption: 0.2,
        totalPowerUsedToday: 25,
        averageDailyUsage: 43
    },
    weather: {
        temperature: [22, 20, 18, 19, 23, 27, 30, 32, 29, 26, 24, 22],
        humidity: [65, 68, 70, 72, 68, 60, 55, 50, 55, 62, 65, 68],
        windSpeed: [5, 8, 12, 7, 15, 20, 25, 22, 18, 12, 8, 6],
        solarIrradiance: [0, 0, 0, 200, 600, 800, 1000, 950, 700, 400, 100, 0]
    },
    battery: {
        soc: 85,
        soh: 92,
        voltage: 48.2,
        current: 15.5,
        temperature: 25,
        cycles: 1247
    },
    system: {
        status: 'operational',
        uptime: '127 days',
        lastMaintenance: '2025-05-15',
        nextMaintenance: '2025-08-15',
        firmwareVersion: '2.4.1',
        alerts: ['Low wind speed warning', 'Scheduled maintenance due']
    }
};