import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, MapPin, Clock, Zap, Trophy, TrendingUp, Activity, Target, Calendar, Award, User } from 'lucide-react';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({ temp: 22, condition: 'Clear', humidity: 65 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStats = {
    distance: '8.2',
    time: '42:15',
    pace: '5:09',
    calories: '485'
  };

  const weeklyGoal = {
    current: 23.4,
    target: 35.0
  };

  const recentRuns = [
    { 
      id: 1,
      date: 'Today', 
      distance: '8.2 km', 
      time: '42:15', 
      pace: '5:09',
      route: 'Central Park Loop',
      elevation: '+124m'
    },
    { 
      id: 2,
      date: 'Yesterday', 
      distance: '5.8 km', 
      time: '31:22', 
      pace: '5:24',
      route: 'Riverside Trail',
      elevation: '+89m'
    },
    { 
      id: 3,
      date: '2 days ago', 
      distance: '12.1 km', 
      time: '1:04:30', 
      pace: '5:20',
      route: 'Long Weekend Run',
      elevation: '+203m'
    },
  ];

  const achievements = [
    { icon: Trophy, title: 'Personal Best', desc: 'New 10K record!', color: 'text-yellow-400' },
    { icon: Target, title: 'Goal Crusher', desc: 'Weekly target hit', color: 'text-green-400' },
    { icon: Award, title: 'Consistency', desc: '14 day streak', color: 'text-blue-400' }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {getGreeting()}, Runner
              </h1>
              <p className="text-gray-400">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-white">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-gray-400">
                {weatherData.temp}°C • {weatherData.condition}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                to="/running"
                className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 hover-lift"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Start Running</h3>
                      <p className="text-gray-400">Begin GPS tracking</p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-white rounded-full pulse-ring"></div>
                      <div className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    GPS Ready • Weather: {weatherData.condition}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 hover-lift">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Quick Stats</h3>
                    <p className="text-gray-400">Today's performance</p>
                  </div>
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-white">{todayStats.distance}</div>
                    <div className="text-xs text-gray-400">DISTANCE (KM)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{todayStats.time}</div>
                    <div className="text-xs text-gray-400">TIME</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Performance Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: MapPin, label: 'Distance', value: todayStats.distance, unit: 'km' },
                  { icon: Clock, label: 'Duration', value: todayStats.time, unit: '' },
                  { icon: Zap, label: 'Avg Pace', value: todayStats.pace, unit: '/km' },
                  { icon: Trophy, label: 'Calories', value: todayStats.calories, unit: 'cal' }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="bg-white/5 border border-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/10 transition-colors">
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label} {stat.unit}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Runs</h3>
                <Link to="/history" className="text-sm text-gray-400 hover:text-white transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{run.route}</div>
                        <div className="text-sm text-gray-400">{run.date} • {run.elevation}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{run.distance}</div>
                      <div className="text-sm text-gray-400">{run.time} • {run.pace}/km</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weekly Progress */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Weekly Goal</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-semibold text-white">
                    {weeklyGoal.current}/{weeklyGoal.target} km
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min((weeklyGoal.current / weeklyGoal.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    {(weeklyGoal.target - weeklyGoal.current).toFixed(1)} km remaining
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ${achievement.color}`}>
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{achievement.title}</div>
                      <div className="text-xs text-gray-400">{achievement.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Running Conditions</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">{weatherData.temp}°C</div>
                  <div className="text-gray-300">{weatherData.condition}</div>
                  <div className="text-sm text-gray-400">Humidity: {weatherData.humidity}%</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">Excellent</div>
                  <div className="text-sm text-gray-400">for running</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/clubs" className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <User className="h-5 w-5 text-white" />
                  <span className="text-white">Find Running Groups</span>
                </Link>
                <Link to="/history" className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <TrendingUp className="h-5 w-5 text-white" />
                  <span className="text-white">View Analytics</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <Calendar className="h-5 w-5 text-white" />
                  <span className="text-white">Training Schedule</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;