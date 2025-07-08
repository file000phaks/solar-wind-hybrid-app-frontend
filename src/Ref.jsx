import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import * as THREE from 'three';
import classNames from 'classnames';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

// Mock Data
const mockData = {
  powerGeneration: {
    solar: [12, 18, 24, 30, 28, 22, 16, 14, 10, 8, 6, 4],
    wind: [8, 12, 15, 10, 18, 25, 30, 28, 22, 16, 12, 10],
    timestamps: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
  },
  powerConsumption: {
    residential: [15, 12, 10, 8, 10, 15, 20, 25, 30, 28, 22, 18],
    commercial: [20, 18, 15, 12, 15, 20, 25, 30, 35, 32, 28, 25],
    industrial: [35, 30, 25, 20, 25, 30, 35, 40, 45, 42, 38, 35]
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
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-08-15',
    firmwareVersion: '2.4.1',
    alerts: ['Low wind speed warning', 'Scheduled maintenance due']
  }
};

// Zustand Store
const useStore = (set, get) => ({
  user: null,
  theme: 'light',
  isAuthenticated: false,
  
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  updateProfile: (profileData) => set((state) => ({ user: { ...state.user, ...profileData } }))
});

// Simple Zustand implementation
const createStore = (storeFunction) => {
  let state = {};
  const listeners = new Set();
  
  const setState = (partial) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    state = { ...state, ...nextState };
    listeners.forEach(listener => listener());
  };
  
  const getState = () => state;
  
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  
  const api = { setState, getState, subscribe };
  state = storeFunction(setState, getState, api);
  
  return api;
};

const store = createStore(useStore);

const useAppStore = () => {
  const [state, setState] = useState(store.getState());
  
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return unsubscribe;
  }, []);
  
  return {
    ...state,
    login: store.getState().login,
    logout: store.getState().logout,
    toggleTheme: store.getState().toggleTheme,
    updateProfile: store.getState().updateProfile
  };
};

// Three.js Background Component
const ParticleBackground = ({ theme }) => {
  const mountRef = React.useRef();
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: theme === 'dark' ? 0x4f46e5 : 0x8b5cf6,
      transparent: true,
      opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 20;
    
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme]);
  
  return <div ref={mountRef} className="fixed inset-0 -z-10 pointer-events-none" />;
};

// Icons Component
const Icons = {
  Sun: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Wind: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Battery: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
    </svg>
  ),
  Dashboard: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    </svg>
  ),
  User: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
};

// Card Component
const Card = ({ title, value, unit, icon: Icon, color = "blue", trend, className = "", children }) => {
  const { theme } = useAppStore();
  
  return (
    <div className={classNames(
      "p-6 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-105",
      theme === 'dark' 
        ? "bg-gray-800 border-gray-700" 
        : "bg-white border-gray-200",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={classNames(
            "text-sm font-medium mb-2",
            theme === 'dark' ? "text-gray-300" : "text-gray-600"
          )}>{title}</h3>
          {value && (
            <div className="flex items-baseline gap-2">
              <span className={classNames(
                "text-2xl font-bold",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}>{value}</span>
              {unit && <span className="text-sm text-gray-500">{unit}</span>}
            </div>
          )}
          {trend && (
            <div className={classNames(
              "text-xs mt-1",
              trend > 0 ? "text-green-500" : "text-red-500"
            )}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </div>
          )}
        </div>
        {Icon && (
          <div className={classNames(
            "p-3 rounded-lg",
            `bg-${color}-100 text-${color}-600`,
            theme === 'dark' && `bg-${color}-900 text-${color}-400`
          )}>
            <Icon />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

// Login Component
const Login = () => {
  const { login, theme } = useAppStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);
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
    <div className={classNames(
      "min-h-screen flex items-center justify-center transition-colors duration-300",
      theme === 'dark' ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className={classNames(
        "max-w-md w-full p-8 rounded-xl shadow-xl border transition-all duration-300",
        theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <h2 className={classNames(
          "text-2xl font-bold mb-6 text-center",
          theme === 'dark' ? "text-white" : "text-gray-900"
        )}>
          {isSignup ? 'Sign Up' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
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
            onChange={(e) => setFormData({...formData, password: e.target.value})}
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
        <p className={classNames(
          "text-center mt-4 text-sm",
          theme === 'dark' ? "text-gray-400" : "text-gray-600"
        )}>
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

// Navigation Component
const Navigation = () => {
  const { theme, toggleTheme, logout } = useAppStore();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Icons.Dashboard },
    { path: '/generation', label: 'Power Generation', icon: Icons.Sun },
    { path: '/usage', label: 'Usage', icon: Icons.Wind },
    { path: '/analytics', label: 'System Analytics', icon: Icons.Battery },
    { path: '/profile', label: 'Profile', icon: Icons.User },
  ];
  
  return (
    <div className={classNames(
      "w-64 min-h-screen p-4 transition-colors duration-300",
      theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
      "border-r"
    )}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className={classNames(
          "text-xl font-bold",
          theme === 'dark' ? "text-white" : "text-gray-900"
        )}>
          Solar Wind Hub
        </h1>
        <button
          onClick={toggleTheme}
          className={classNames(
            "p-2 rounded-lg transition-colors duration-200",
            theme === 'dark' 
              ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {theme === 'dark' ? Icons.Sun() : Icons.Moon()}
        </button>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={classNames(
              "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              theme === 'dark' 
                ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-8">
        <button
          onClick={logout}
          className={classNames(
            "w-full p-3 rounded-lg transition-colors duration-200",
            theme === 'dark' 
              ? "bg-red-900 text-red-200 hover:bg-red-800" 
              : "bg-red-100 text-red-600 hover:bg-red-200"
          )}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
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
  
  const powerData = {
    labels: mockData.powerGeneration.timestamps,
    datasets: [
      {
        label: 'Solar Power',
        data: mockData.powerGeneration.solar,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Wind Power',
        data: mockData.powerGeneration.wind,
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
      data: [mockData.battery.soc, 100 - mockData.battery.soc],
      backgroundColor: ['#10b981', '#e5e7eb'],
      borderWidth: 0
    }]
  };
  
  return (
    <div className="space-y-6">
      <h2 className={classNames(
        "text-2xl font-bold",
        theme === 'dark' ? "text-white" : "text-gray-900"
      )}>
        System Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Solar Generation"
          value={mockData.powerGeneration.solar.slice(-1)[0]}
          unit="kW"
          icon={Icons.Sun}
          color="yellow"
          trend={5.2}
        />
        <Card
          title="Wind Generation"
          value={mockData.powerGeneration.wind.slice(-1)[0]}
          unit="kW"
          icon={Icons.Wind}
          color="blue"
          trend={-2.1}
        />
        <Card
          title="Battery SOC"
          value={mockData.battery.soc}
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
                {mockData.weather.temperature.slice(-1)[0]}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Wind Speed</span>
              <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                {mockData.weather.windSpeed.slice(-1)[0]} m/s
              </span>
            </div>
            <div className="flex justify-between">
              <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Humidity</span>
              <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                {mockData.weather.humidity.slice(-1)[0]}%
              </span>
            </div>
          </div>
        </Card>
        
        <Card title="System Health">
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Uptime</span>
              <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                {mockData.system.uptime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Battery SOH</span>
              <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                {mockData.battery.soh}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Firmware</span>
              <span className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                v{mockData.system.firmwareVersion}
              </span>
            </div>
          </div>
        </Card>
        
        <Card title="Recent Alerts">
          <div className="mt-4 space-y-2">
            {mockData.system.alerts.map((alert, index) => (
              <div key={index} className={classNames(
                "p-2 rounded text-sm",
                theme === 'dark' ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800"
              )}>
                {alert}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Profile Component
const Profile = () => {
  const { user, updateProfile, theme } = useAppStore();
  const [formData, setFormData] = useState({
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
      <h2 className={classNames(
        "text-2xl font-bold mb-6",
        theme === 'dark' ? "text-white" : "text-gray-900"
      )}>
        User Profile
      </h2>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={classNames(
              "block text-sm font-medium mb-2",
              theme === 'dark' ? "text-gray-300" : "text-gray-700"
            )}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={classNames(
                "w-full p-3 rounded-lg border transition-colors duration-200",
                theme === 'dark' 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-white border-gray-300 text-gray-900"
              )}
            />
          </div>
          
          <div>
            <label className={classNames(
              "block text-sm font-medium mb-2",
              theme === 'dark' ? "text-gray-300" : "text-gray-700"
            )}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
              onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="notifications" className={classNames(
              "text-sm",
              theme === 'dark' ? "text-gray-300" : "text-gray-700"
            )}>
              Enable notifications
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoReports"
              checked={formData.autoReports}
              onChange={(e) => setFormData({...formData, autoReports: e.target.checked})}
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

// Power Generation Component
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
      <h2 className={classNames(
        "text-2xl font-bold",
        theme === 'dark' ? "text-white" : "text-gray-900"
      )}>
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
      
      <Card title="Weather Correlation" className="h-96">
        <div className="h-80 mt-4">
          <Line data={weatherCorrelation} options={correlationOptions} />
        </div>
      </Card>
      
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

// Usage Component
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
  
  const usageData = {
    labels: mockData.powerGeneration.timestamps,
    datasets: [
      {
        label: 'Residential',
        data: mockData.powerConsumption.residential,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: '#22c55e',
        borderWidth: 2
      },
      {
        label: 'Commercial',
        data: mockData.powerConsumption.commercial,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 2
      },
      {
        label: 'Industrial',
        data: mockData.powerConsumption.industrial,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#ef4444',
        borderWidth: 2
      }
    ]
  };
  
  const totalConsumption = mockData.powerConsumption.residential.reduce((a, b) => a + b, 0) +
                           mockData.powerConsumption.commercial.reduce((a, b) => a + b, 0) +
                           mockData.powerConsumption.industrial.reduce((a, b) => a + b, 0);
  
  const distributionData = {
    labels: ['Residential', 'Commercial', 'Industrial'],
    datasets: [{
      data: [
        mockData.powerConsumption.residential.reduce((a, b) => a + b, 0),
        mockData.powerConsumption.commercial.reduce((a, b) => a + b, 0),
        mockData.powerConsumption.industrial.reduce((a, b) => a + b, 0)
      ],
      backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'],
      borderWidth: 0
    }]
  };
  
  return (
    <div className="space-y-6">
      <h2 className={classNames(
        "text-2xl font-bold",
        theme === 'dark' ? "text-white" : "text-gray-900"
      )}>
        Power Usage Analysis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Total Consumption"
          value={totalConsumption.toFixed(1)}
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
        <Card title="Usage by Sector - 24h" className="h-80">
          <div className="h-64 mt-4">
            <Bar data={usageData} options={chartOptions} />
          </div>
        </Card>
        
        <Card title="Consumption Distribution" className="h-80">
          <div className="h-64 mt-4 flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut data={distributionData} options={{
                ...chartOptions,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: theme === 'dark' ? '#ffffff' : '#000000'
                    }
                  }
                }
              }} />
            </div>
          </div>
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

// System Analytics Component
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
      <h2 className={classNames(
        "text-2xl font-bold",
        theme === 'dark' ? "text-white" : "text-gray-900"
      )}>
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

// Layout Component
const Layout = ({ children }) => {
  const { theme } = useAppStore();
  
  return (
    <div className={classNames(
      "min-h-screen transition-colors duration-300",
      theme === 'dark' ? "bg-gray-900" : "bg-gray-50"
    )}>
      <ParticleBackground theme={theme} />
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { isAuthenticated } = useAppStore();
  
  if (!isAuthenticated) {
    return (
      <Router>
        <ParticleBackground theme="light" />
        <Login />
      </Router>
    );
  }
  
  return (
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
  );
};

export default App;