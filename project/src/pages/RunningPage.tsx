import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Settings, Mic } from 'lucide-react';
import RunningMapCanvas from '../components/RunningMapCanvas';
import { aiService, type RunData, type AIFeedback } from '../services/aiService';

const RunningPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null);
  const [route, setRoute] = useState<{lat: number, lng: number, timestamp: number}[]>([]);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [vapiApiKey, setVapiApiKey] = useState('');
  const [targetPace, setTargetPace] = useState(6.0); // minutes per km
  const [realtimeFeedback, setRealtimeFeedback] = useState('');
  
  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<{lat: number, lng: number, timestamp: number} | null>(null);

  // Calculate distance between two GPS coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate speed based on distance and time
  const calculateSpeed = (distanceKm: number, timeSeconds: number): number => {
    if (timeSeconds === 0) return 0;
    return (distanceKm / timeSeconds) * 3600; // Convert to km/h
  };

  // Real GPS tracking
  useEffect(() => {
    if (isRunning && !isPaused) {
      if ('geolocation' in navigator) {
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000
        };

        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, accuracy, speed } = position.coords;
            const timestamp = Date.now();
            
            setCurrentPosition({ lat: latitude, lng: longitude });
            setGpsAccuracy(accuracy);
            setGpsError(null);
            
            // Calculate speed from GPS or fallback to manual calculation
            if (speed !== null && speed >= 0) {
              const speedKmh = speed * 3.6;
              setCurrentSpeed(speedKmh);
              setMaxSpeed(prev => Math.max(prev, speedKmh));
            }
            
            // Add to route if position changed significantly
            if (lastPositionRef.current) {
              const distanceFromLast = calculateDistance(
                lastPositionRef.current.lat,
                lastPositionRef.current.lng,
                latitude,
                longitude
              );
              
              // Only add point if moved more than 5 meters
              if (distanceFromLast > 0.005) {
                const newPoint = { lat: latitude, lng: longitude, timestamp };
                setRoute(prev => [...prev, newPoint]);
                
                // Update total distance
                setDistance(prev => prev + distanceFromLast);
                
                // Calculate speed if GPS doesn't provide it
                if (speed === null || speed < 0) {
                  const timeDiff = (timestamp - lastPositionRef.current.timestamp) / 1000; // seconds
                  if (timeDiff > 0) {
                    const calculatedSpeed = calculateSpeed(distanceFromLast, timeDiff);
                    setCurrentSpeed(calculatedSpeed);
                    setMaxSpeed(prev => Math.max(prev, calculatedSpeed));
                  }
                }
                
                lastPositionRef.current = newPoint;
              }
            } else {
              // First position
              const firstPoint = { lat: latitude, lng: longitude, timestamp };
              setRoute([firstPoint]);
              lastPositionRef.current = firstPoint;
            }
          },
          (error) => {
            console.error('GPS Error:', error);
            setGpsError(error.message);
            
            // Fallback for demo purposes if GPS fails
            if (route.length === 0) {
              setCurrentPosition({ lat: 40.7829, lng: -73.9654 });
            }
          },
          options
        );
      } else {
        setGpsError('Geolocation not supported');
      }
    } else {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isRunning, isPaused]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  // Real-time AI feedback
  useEffect(() => {
    if (isRunning && !isPaused && currentSpeed > 0) {
      const getFeedback = async () => {
        const feedback = await aiService.getRealtimeFeedback(currentSpeed, targetPace);
        setRealtimeFeedback(feedback);
      };
      
      const feedbackInterval = setInterval(getFeedback, 30000); // Every 30 seconds
      return () => clearInterval(feedbackInterval);
    }
  }, [isRunning, isPaused, currentSpeed, targetPace]);
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePace = (): string => {
    if (distance === 0) return '--:--';
    const paceInSeconds = (time / 60) / distance;
    const mins = Math.floor(paceInSeconds);
    const secs = Math.floor((paceInSeconds - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRun = () => {
    setIsRunning(true);
    setIsPaused(false);
    setRoute([]);
    setTime(0);
    setDistance(0);
    setCurrentSpeed(0);
    lastPositionRef.current = null;
    setGpsError(null);
  };

  const pauseRun = () => {
    setIsPaused(!isPaused);
  };

  const stopRun = () => {
    if (window.confirm('Finish run?')) {
      // Prepare run data for AI analysis
      const runData: RunData = {
        duration: time,
        distance: distance,
        averageSpeed: distance > 0 ? (distance / (time / 3600)) : 0,
        maxSpeed: maxSpeed,
        route: route,
        averagePace: calculatePace(),
        calories: Math.round(distance * 65), // Rough estimate
        date: new Date().toISOString()
      };
      
      // Get AI feedback
      if (geminiApiKey) {
        aiService.setApiKeys(geminiApiKey, vapiApiKey);
        aiService.analyzeRun(runData).then(feedback => {
          setAiFeedback(feedback);
          // Speak the feedback
          aiService.speakFeedback(feedback);
        });
      }
      
      setIsRunning(false);
      setIsPaused(false);
    }
  };

  const resetRun = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setDistance(0);
    setCurrentSpeed(0);
    setRoute([]);
    setCurrentPosition(null);
    setGpsError(null);
    setMaxSpeed(0);
    setAiFeedback(null);
    setRealtimeFeedback('');
    lastPositionRef.current = null;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">AI Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Gemini API Key</label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter your Gemini API key"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">VAPI API Key (Optional)</label>
                <input
                  type="password"
                  value={vapiApiKey}
                  onChange={(e) => setVapiApiKey(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter your VAPI API key"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Target Pace (min/km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetPace}
                  onChange={(e) => setTargetPace(parseFloat(e.target.value))}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-20 pb-8 text-center relative">
        <h1 className="text-2xl font-light tracking-wide">RUN</h1>
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-20 right-8 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Main Stats */}
      <div className="px-8 mb-12">
        <div className="text-center mb-16">
          <div className="text-8xl font-light tracking-tight mb-2">
            {formatTime(time)}
          </div>
          <div className="text-gray-400 text-sm uppercase tracking-widest">
            DURATION
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-4xl font-light mb-1">
              {distance.toFixed(2)}
            </div>
            <div className="text-gray-400 text-xs uppercase tracking-widest">
              KM
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-light mb-1">
              {calculatePace()}
            </div>
            <div className="text-gray-400 text-xs uppercase tracking-widest">
              /KM
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-light mb-1">
              {currentSpeed.toFixed(1)}
            </div>
            <div className="text-gray-400 text-xs uppercase tracking-widest">
              KM/H
            </div>
          </div>
        </div>
        
        {/* Real-time AI Feedback */}
        {realtimeFeedback && isRunning && (
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Mic className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">AI COACH</span>
              </div>
              <p className="text-white text-sm">{realtimeFeedback}</p>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Map */}
      <div className="px-8 mb-12">
        <div className="h-64 bg-gray-900 border border-gray-800 relative overflow-hidden">
          <RunningMapCanvas 
            currentPosition={currentPosition}
            route={route}
            isTracking={isRunning && !isPaused}
            gpsError={gpsError}
            gpsAccuracy={gpsAccuracy}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 pb-12">
        <div className="flex justify-center items-center space-x-8">
          {!isRunning ? (
            <button
              onClick={startRun}
              className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Play className="h-8 w-8 ml-1" />
            </button>
          ) : (
            <>
              <button
                onClick={pauseRun}
                className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                {isPaused ? <Play className="h-6 w-6 ml-0.5" /> : <Pause className="h-6 w-6" />}
              </button>
              
              <button
                onClick={stopRun}
                className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Square className="h-8 w-8" />
              </button>
            </>
          )}
        </div>

        {!isRunning && (time > 0 || distance > 0) && (
          <div className="text-center mt-8">
            <button
              onClick={resetRun}
              className="text-gray-400 text-sm uppercase tracking-widest hover:text-white transition-colors"
            >
              RESET
            </button>
          </div>
        )}
      </div>

      {/* AI Feedback Modal */}
      {aiFeedback && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-4">Run Analysis</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">SUMMARY</h4>
                <p className="text-white">{aiFeedback.summary}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">PERFORMANCE</h4>
                <p className="text-white">{aiFeedback.performance}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">SUGGESTIONS</h4>
                <ul className="space-y-1">
                  {aiFeedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-white text-sm">• {suggestion}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-300 font-medium">{aiFeedback.motivation}</p>
              </div>
            </div>
            
            <button
              onClick={() => setAiFeedback(null)}
              className="w-full mt-6 bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Status */}
      {isRunning && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-gray-900 border border-gray-700 rounded-full px-6 py-2">
            <div className="flex items-center space-x-3 text-sm">
              <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'}`}></div>
              <span className="text-gray-300 uppercase tracking-wide">
                {isPaused ? 'PAUSED' : 'RUNNING'}
              </span>
              {currentSpeed > 0 && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-300">{currentSpeed.toFixed(1)} KM/H</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunningPage;