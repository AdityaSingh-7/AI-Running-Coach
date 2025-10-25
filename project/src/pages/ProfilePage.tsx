import React, { useState } from 'react';
import { User, Settings, Trophy, MapPin, Calendar, Edit, Camera, Share, Award, Target, TrendingUp } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const userProfile = {
    name: 'Alex Johnson',
    username: '@alexruns',
    location: 'New York, NY',
    joinDate: 'January 2023',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Marathon runner and fitness enthusiast. Love exploring new running routes around NYC and pushing my limits every day.',
    stats: {
      totalDistance: 1247.8,
      totalRuns: 156,
      avgPace: '5:44',
      longestRun: 21.1,
      totalTime: '142h 35m',
      calories: 74850
    }
  };

  const achievements = [
    {
      id: 1,
      title: 'Marathon Finisher',
      description: 'Completed your first marathon',
      icon: '🏃‍♂️',
      date: '2024-11-15',
      rarity: 'Epic',
      progress: 100
    },
    {
      id: 2,
      title: '100 Club',
      description: 'Completed 100 runs',
      icon: '💯',
      date: '2024-10-22',
      rarity: 'Rare',
      progress: 100
    },
    {
      id: 3,
      title: 'Speed Demon',
      description: 'Sub-5 minute kilometer pace',
      icon: '⚡',
      date: '2024-09-18',
      rarity: 'Legendary',
      progress: 100
    },
    {
      id: 4,
      title: 'Early Bird',
      description: '50 runs before 7 AM',
      icon: '🌅',
      date: '2024-08-30',
      rarity: 'Common',
      progress: 100
    },
    {
      id: 5,
      title: 'Distance Master',
      description: '1000km total distance',
      icon: '🎯',
      date: '2024-12-10',
      rarity: 'Epic',
      progress: 100
    },
    {
      id: 6,
      title: 'Consistency King',
      description: '30-day running streak',
      icon: '🔥',
      date: '2024-07-15',
      rarity: 'Rare',
      progress: 100
    }
  ];

  const personalRecords = [
    { distance: '1K', time: '3:42', date: '2024-11-20', improvement: '+5s from last PB' },
    { distance: '5K', time: '22:15', date: '2024-10-15', improvement: '+12s from last PB' },
    { distance: '10K', time: '46:32', date: '2024-09-28', improvement: '+45s from last PB' },
    { distance: 'Half Marathon', time: '1:42:18', date: '2024-08-12', improvement: '+2:15 from last PB' },
    { distance: 'Marathon', time: '3:28:45', date: '2024-11-15', improvement: 'First marathon!' }
  ];

  const recentActivity = [
    {
      type: 'run',
      description: 'Completed 8.5km run in Central Park',
      date: '2 hours ago',
      stats: '8.5km • 48:32 • 5:42/km',
      icon: MapPin
    },
    {
      type: 'achievement',
      description: 'Earned "Speed Demon" achievement',
      date: '1 day ago',
      stats: 'Sub-5 minute pace achieved',
      icon: Trophy
    },
    {
      type: 'club',
      description: 'Joined Morning Runners NYC',
      date: '3 days ago',
      stats: '1,247 members',
      icon: User
    },
    {
      type: 'run',
      description: 'Morning 5K along the Hudson River',
      date: '3 days ago',
      stats: '5.2km • 28:45 • 5:32/km',
      icon: MapPin
    }
  ];

  const monthlyStats = {
    distance: 156.2,
    runs: 35,
    time: '15h 22m',
    calories: 9845,
    avgPace: '5:54',
    improvement: '+12.3%'
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-900/50 text-gray-300 border-gray-600';
      case 'Rare': return 'bg-blue-900/50 text-blue-300 border-blue-600';
      case 'Epic': return 'bg-purple-900/50 text-purple-300 border-purple-600';
      case 'Legendary': return 'bg-yellow-900/50 text-yellow-300 border-yellow-600';
      default: return 'bg-gray-900/50 text-gray-300 border-gray-600';
    }
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save profile changes
      console.log('Saving profile changes...');
    }
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${userProfile.name}'s Running Profile`,
        text: `Check out my running stats on BOLT!`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/10"
              />
              <button className="absolute bottom-2 right-2 bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{userProfile.name}</h1>
                  <p className="text-gray-400 mb-2">{userProfile.username}</p>
                  <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {userProfile.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {userProfile.joinDate}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 mt-4 lg:mt-0">
                  <button 
                    onClick={handleEditProfile}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>{isEditing ? 'Save' : 'Edit Profile'}</span>
                  </button>
                  <button 
                    onClick={handleShareProfile}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-2xl">{userProfile.bio}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                  { label: 'Total Distance', value: `${userProfile.stats.totalDistance}km` },
                  { label: 'Total Runs', value: userProfile.stats.totalRuns },
                  { label: 'Total Time', value: userProfile.stats.totalTime },
                  { label: 'Avg Pace', value: userProfile.stats.avgPace },
                  { label: 'Longest Run', value: `${userProfile.stats.longestRun}km` },
                  { label: 'Calories', value: `${(userProfile.stats.calories / 1000).toFixed(0)}k` }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-900/50 border border-white/10 rounded-xl p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'achievements', label: 'Achievements' },
            { id: 'records', label: 'Personal Records' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4 custom-scrollbar max-h-96 overflow-y-auto">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                      <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <activity.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{activity.description}</div>
                        <div className="text-sm text-gray-400">{activity.stats}</div>
                        <div className="text-xs text-gray-500 mt-1">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">January Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Distance</span>
                    <span className="font-semibold text-white">{monthlyStats.distance} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Runs</span>
                    <span className="font-semibold text-white">{monthlyStats.runs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Time</span>
                    <span className="font-semibold text-white">{monthlyStats.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Avg Pace</span>
                    <span className="font-semibold text-white">{monthlyStats.avgPace}/km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Calories</span>
                    <span className="font-semibold text-white">{monthlyStats.calories.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">vs Last Month</span>
                      <span className="font-semibold text-green-400">{monthlyStats.improvement}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Latest Achievements</h3>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-sm">{achievement.title}</div>
                        <div className="text-xs text-gray-400">{achievement.description}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 hover-lift text-center">
                <div className="text-6xl mb-4">{achievement.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                <p className="text-gray-400 mb-4">{achievement.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </span>
                  <span className="text-sm text-gray-500">{achievement.date}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Personal Records</h3>
            <div className="space-y-4">
              {personalRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-900/50 border border-yellow-600 text-yellow-300 w-12 h-12 rounded-xl flex items-center justify-center">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{record.distance} Personal Best</div>
                      <div className="text-sm text-gray-400">{record.date}</div>
                      <div className="text-xs text-green-400">{record.improvement}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{record.time}</div>
                    <div className="text-sm text-gray-400">Official Time</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;