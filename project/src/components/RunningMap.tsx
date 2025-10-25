import React, { useEffect, useRef, useState } from 'react';

interface Position {
  lat: number;
  lng: number;
  timestamp: number;
}

interface RunningMapProps {
  currentPosition: Position | null;
  route: Position[];
  isTracking: boolean;
}

const RunningMap: React.FC<RunningMapProps> = ({
  currentPosition,
  route,
  isTracking
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7829, lng: -73.9654 });
  const [zoom, setZoom] = useState(15);

  // Simple tile-based map rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas with dark background
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw grid pattern for map feel
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let x = 0; x < rect.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < rect.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Convert lat/lng to canvas coordinates
    const latLngToCanvas = (lat: number, lng: number) => {
      const x = ((lng - mapCenter.lng) * 100000 * zoom) + rect.width / 2;
      const y = ((mapCenter.lat - lat) * 100000 * zoom) + rect.height / 2;
      return { x, y };
    };

    // Draw route
    if (route.length > 1) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      const startPoint = latLngToCanvas(route[0].lat, route[0].lng);
      ctx.moveTo(startPoint.x, startPoint.y);
      
      for (let i = 1; i < route.length; i++) {
        const point = latLngToCanvas(route[i].lat, route[i].lng);
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();

      // Draw start marker
      const start = latLngToCanvas(route[0].lat, route[0].lng);
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(start.x, start.y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw current position
    if (currentPosition) {
      const pos = latLngToCanvas(currentPosition.lat, currentPosition.lng);
      
      // Outer glow for tracking
      if (isTracking) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Main marker
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Update map center to follow current position
    if (currentPosition && isTracking) {
      setMapCenter({ lat: currentPosition.lat, lng: currentPosition.lng });
    }
  }, [currentPosition, route, isTracking, mapCenter, zoom]);

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Minimal GPS indicator */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="uppercase tracking-wide">GPS</span>
        </div>
      </div>

      {/* Route info */}
      {route.length > 0 && (
        <div className="absolute bottom-4 right-4 text-xs text-gray-400">
          <span className="uppercase tracking-wide">{route.length} POINTS</span>
        </div>
      )}
    </div>
  );
};

export default RunningMap;