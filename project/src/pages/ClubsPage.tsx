import React, { useState } from 'react';
import { Users, MapPin, Calendar, Trophy, Plus, Search, Filter, Star, MessageCircle, UserPlus } from 'lucide-react';

const ClubsPage = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');

  const myClubs = [
    {
      id: 1,
      name: 'Morning Runners NYC',
      members: 1247,
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Early morning running group for all fitness levels',
      nextRun: '2025-01-16 06:00',
      isJoined: true,
      rating: 4.8,
      weeklyRuns: 5
    },
    {
      id: 2,
      name: 'Central Park Pacers',
      members: 892,
      location: 'Central Park, NY',
      image: 'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Weekly runs around Central Park with pace groups',
      nextRun: '2025-01-17 07:30',
      isJoined: true,
      rating: 4.6,
      weeklyRuns: 3
    }
  ];

  const discoverClubs = [
    {
      id: 3,
      name: 'Brooklyn Bridge Runners',
      members: 654,
      location: 'Brooklyn, NY',
      image: 'https://images.pexels.com/photos/1571940/pexels-photo-1571940.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Scenic runs across Brooklyn Bridge and waterfront',
      nextRun: '2025-01-18 08:00',
      isJoined: false,
      rating: 4.7,
      weeklyRuns: 4
    },
    {
      id: 4,
      name: 'Marathon Training Squad',
      members: 423,
      location: 'Manhattan, NY',
      image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Serious training group for marathon preparation',
      nextRun: '2025-01-19 06:30',
      isJoined: false,
      rating: 4.9,
      weeklyRuns: 6
    },
    {
      id: 5,
      name: 'Weekend Warriors',
      members: 789,
      location: 'Queens, NY',
      image: 'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Casual weekend runs for busy professionals',
      nextRun: '2025-01-20 09:00',
      isJoined: false,
      rating: 4.4,
      weeklyRuns: 2
    },
    {
      id: 6,
      name: 'Trail Blazers NYC',
      members: 345,
      location: 'Bronx, NY',
      image: 'https://images.pexels.com/photos/1571940/pexels-photo-1571940.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      description: 'Off-road trail running adventures',
      nextRun: '2025-01-21 07:00',
      isJoined: false,
      rating: 4.5,
      weeklyRuns: 3
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      club: 'Morning Runners NYC',
      event: 'Weekly 5K Run',
      date: '2025-01-16',
      time: '06:00',
      location: 'Central Park South',
      attendees: 24,
      difficulty: 'Beginner'
    },
    {
      id: 2,
      club: 'Central Park Pacers',
      event: 'Tempo Run Training',
      date: '2025-01-17',
      time: '07:30',
      location: 'Central Park Loop',
      attendees: 18,
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      club: 'Morning Runners NYC',
      event: 'Long Run Saturday',
      date: '2025-01-18',
      time: '07:00',
      location: 'Hudson River Park',
      attendees: 32,
      difficulty: 'Advanced'
    }
  ];

  const clubStats = [
    { label: 'Clubs Joined', value: '2', change: '+1' },
    { label: 'Group Runs', value: '24', change: '+3' },
    { label: 'Running Friends', value: '156', change: '+12' },
    { label: 'Events Attended', value: '18', change: '+2' }
  ];

  const joinClub = (clubId: number) => {
    console.log('Joining club:', clubId);
    // Here you would typically make an API call
  };

  const leaveClub = (clubId: number) => {
    if (window.confirm('Are you sure you want to leave this club?')) {
      console.log('Leaving club:', clubId);
      // Here you would typically make an API call
    }
  };

  const joinEvent = (eventId: number) => {
    console.log('Joining event:', eventId);
    // Here you would typically make an API call
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Running Community</h1>
            <p className="text-gray-400">Connect with fellow runners and join group activities</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Create Club</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {clubStats.map((stat, index) => (
            <div key={index} className="bg-gray-900/50 border border-white/10 rounded-xl p-4 text-center hover-lift">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xs text-green-400 mt-1">{stat.change} this week</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-900/50 border border-white/10 rounded-xl p-1 mb-8">
          {[
            { id: 'discover', label: 'Discover Clubs' },
            { id: 'my-clubs', label: 'My Clubs' },
            { id: 'events', label: 'Upcoming Events' }
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
        {activeTab === 'discover' && (
          <div>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search clubs by name, location, or activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-white/20 focus:border-transparent transition-colors"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Clubs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoverClubs.map((club) => (
                <div key={club.id} className="bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden hover-lift">
                  <div className="relative">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-white text-xs">{club.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{club.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{club.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        {club.members.toLocaleString()} members
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        {club.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        {club.weeklyRuns} runs/week
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => joinClub(club.id)}
                      className="w-full bg-white text-black py-2 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      Join Club
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-clubs' && (
          <div className="space-y-6">
            {myClubs.map((club) => (
              <div key={club.id} className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 hover-lift">
                <div className="flex flex-col lg:flex-row gap-6">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full lg:w-48 h-32 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{club.name}</h3>
                          <span className="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                            Member
                          </span>
                        </div>
                        <p className="text-gray-400">{club.description}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">{club.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        {club.members.toLocaleString()} members
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        {club.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        Next: {new Date(club.nextRun).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="bg-white text-black px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                        View Details
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>Chat</span>
                      </button>
                      <button 
                        onClick={() => leaveClub(club.id)}
                        className="px-4 py-2 bg-red-900/50 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-900/70 transition-colors"
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Upcoming Group Runs</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{event.event}</div>
                        <div className="text-sm text-gray-400">{event.club}</div>
                        <div className="text-sm text-gray-500">{event.location}</div>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-400 flex items-center">
                            <UserPlus className="h-3 w-3 mr-1" />
                            {event.attendees} going
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            event.difficulty === 'Beginner' ? 'bg-green-900/50 text-green-400' :
                            event.difficulty === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-red-900/50 text-red-400'
                          }`}>
                            {event.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{event.date}</div>
                      <div className="text-sm text-gray-400">{event.time}</div>
                      <button 
                        onClick={() => joinEvent(event.id)}
                        className="mt-2 bg-white text-black px-4 py-1 rounded-lg text-sm hover:bg-gray-200 transition-colors font-medium"
                      >
                        Join Run
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Calendar Preview */}
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">This Week's Schedule</h3>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-sm font-medium text-gray-400 mb-2">{day}</div>
                    <div className={`h-20 rounded-xl border-2 border-dashed p-2 ${
                      index === 0 || index === 1 || index === 5 
                        ? 'border-white/30 bg-white/5' 
                        : 'border-white/10'
                    }`}>
                      {(index === 0 || index === 1 || index === 5) && (
                        <div className="h-full flex flex-col items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full mb-1"></div>
                          <div className="text-xs text-white font-medium">Run</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsPage;