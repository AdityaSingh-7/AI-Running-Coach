import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Calendar, MapPin, Clock, Zap, Trophy, TrendingUp, Filter, Download, Share } from 'lucide-react';

const HistoryPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('distance');

  const weeklyData = [
    { day: 'Mon', distance: 5.2, time: 28, pace: 5.38, calories: 312 },
    { day: 'Tue', distance: 3.8, time: 22, pace: 5.79, calories: 228 },
    { day: 'Wed', distance: 7.1, time: 41, pace: 5.77, calories: 426 },
    { day: 'Thu', distance: 4.5, time: 26, pace: 5.78, calories: 270 },
    { day: 'Fri', distance: 6.2, time: 35, pace: 5.65, calories: 372 },
    { day: 'Sat', distance: 8.5, time: 48, pace: 5.65, calories: 510 },
    { day: 'Sun', distance: 5.9, time: 33, pace: 5.59, calories: 354 },
  ];

  const monthlyProgress = [
    { month: 'Jan', distance: 85.2, runs: 18, avgPace: 5.45 },
    { month: 'Feb', distance: 92.1, runs: 20, avgPace: 5.38 },
    { month: 'Mar', distance: 108.5, runs: 24, avgPace: 5.32 },
    { month: 'Apr', distance: 125.3, runs: 28, avgPace: 5.28 },
    { month: 'May', distance: 142.8, runs: 32, avgPace: 5.25 },
    { month: 'Jun', distance: 156.2, runs: 35, avgPace: 5.22 },
  ];

  const recentRuns = [
    {
      id: 1,
      date: '2025-01-15',
      distance: 8.5,
      time: '48:32',
      pace: '5:42',
      calories: 520,
      route: 'Central Park Loop',
      elevation: 124,
      weather: 'Sunny, 18°C'
    },
    {
      id: 2,
      date: '2025-01-14',
      distance: 5.2,
      time: '28:45',
      pace: '5:32',
      calories: 312,
      route: 'Morning Riverside',
      elevation: 45,
      weather: 'Cloudy, 15°C'
    },
    {
      id: 3,
      date: '2025-01-13',
      distance: 6.8,
      time: '39:15',
      pace: '5:46',
      calories: 425,
      route: 'Hill Training',
      elevation: 203,
      weather: 'Clear, 12°C'
    },
    {
      id: 4,
      date: '2025-01-12',
      distance: 4.2,
      time: '24:18',
      pace: '5:47',
      calories: 268,
      route: 'Quick Morning Run',
      elevation: 32,
      weather: 'Foggy, 14°C'
    },
    {
      id: 5,
      date: '2025-01-11',
      distance: 10.1,
      time: '58:22',
      pace: '5:47',
      calories: 642,
      route: 'Long Weekend Run',
      elevation: 156,
      weather: 'Sunny, 20°C'
    },
  ];

  const totalStats = {
    totalDistance: 1247.8,
    totalRuns: 156,
    totalTime: '142h 35m',
    avgPace: '5:44',
    bestPace: '4:52',
    longestRun: 21.1,
    totalCalories: 74850,
    totalElevation: 12450
  };

  const personalRecords = [
    { distance: '1K', time: '3:42', date: '2024-11-20', improvement: '+5s' },
    { distance: '5K', time: '22:15', date: '2024-10-15', improvement: '+12s' },
    { distance: '10K', time: '46:32', date: '2024-09-28', improvement: '+45s' },
    { distance: 'Half Marathon', time: '1:42:18', date: '2024-08-12', improvement: '+2:15' },
    { distance: 'Marathon', time: '3:28:45', date: '2024-11-15', improvement: 'New PB!' }
  ];

  const getChartData = () => {
    return timeRange === 'week' ? weeklyData : monthlyProgress;
  };

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Track your progress and analyze performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {[
            { label: 'Total Distance', value: `${totalStats.totalDistance}km`, icon: MapPin },
            { label: 'Total Runs', value: totalStats.totalRuns, icon: Calendar },
            { label: 'Total Time', value: totalStats.totalTime, icon: Clock },
            { label: 'Avg Pace', value: totalStats.avgPace, icon: Zap },
            { label: 'Best Pace', value: totalStats.bestPace, icon: Trophy },
            { label: 'Longest Run', value: `${totalStats.longestRun}km`, icon: TrendingUp },
            { label: 'Calories', value: `${(totalStats.totalCalories / 1000).toFixed(0)}k`, icon: Trophy },
            { label: 'Elevation', value: `${(totalStats.totalElevation / 1000).toFixed(1)}km`, icon: TrendingUp }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-900/50 border border-white/10 rounded-xl p-4 text-center hover-lift">
              <stat.icon className="h-5 w-5 text-white mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Time Range Selector */}
            <div className="flex space-x-1 bg-gray-900/50 border border-white/10 rounded-xl p-1">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors capitalize ${
                    timeRange === range
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Main Chart */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Performance Trends</h3>
                <div className="flex space-x-1 bg-black/30 rounded-lg p-1">
                  {['distance', 'pace', 'calories'].map((metric) => (
                    <button
                      key={metric}
                      onClick={() => setSelectedMetric(metric)}
                      className={`px-3 py-1 rounded-md text-sm transition-colors capitalize ${
                        selectedMetric === metric
                          ? 'bg-white text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey={timeRange === 'week' ? 'day' : 'month'} 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke="#ffffff" 
                    strokeWidth={2}
                    fill="url(#colorGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Runs */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activities</h3>
              <div className="space-y-4 custom-scrollbar max-h-96 overflow-y-auto">
                {recentRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{run.route}</div>
                        <div className="text-sm text-gray-400">{run.date} • {run.weather}</div>
                        <div className="text-xs text-gray-500">+{run.elevation}m elevation</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="font-semibold text-white">{run.distance}</div>
                        <div className="text-xs text-gray-400">km</div>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{run.time}</div>
                        <div className="text-xs text-gray-400">time</div>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{run.pace}</div>
                        <div className="text-xs text-gray-400">pace</div>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{run.calories}</div>
                        <div className="text-xs text-gray-400">cal</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Personal Records */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Personal Records</h3>
              <div className="space-y-4">
                {personalRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <div>
                        <div className="font-semibold text-white text-sm">{record.distance}</div>
                        <div className="text-xs text-gray-400">{record.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{record.time}</div>
                      <div className="text-xs text-green-400">{record.improvement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* This Month Summary */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">January Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Distance</span>
                  <span className="font-semibold text-white">156.2 km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Runs</span>
                  <span className="font-semibold text-white">35</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Time</span>
                  <span className="font-semibold text-white">15h 22m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg Pace</span>
                  <span className="font-semibold text-white">5:54/km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Calories</span>
                  <span className="font-semibold text-white">9,845</span>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">vs Last Month</span>
                    <span className="font-semibold text-green-400">+12.3%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Goals Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Monthly Distance</span>
                    <span className="text-white">156/200 km</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Sub-5 Pace Runs</span>
                    <span className="text-white">8/15</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '53%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Running Streak</span>
                    <span className="text-white">14 days</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;