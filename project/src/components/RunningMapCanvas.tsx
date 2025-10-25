import React, { useEffect, useRef, useState } from 'react';

interface Position {
  lat: number;
  lng: number;
  timestamp: number;
}

interface RunningMapCanvasProps {
  currentPosition: Position | null;
  route: Position[];
  isTracking: boolean;
  gpsError: string | null;
  gpsAccuracy: number | null;
}

const RunningMapCanvas: React.FC<RunningMapCanvasProps> = ({
  currentPosition,
  route,
  isTracking,
  gpsError,
  gpsAccuracy
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7829, lng: -73.9654 });
  const [zoom] = useState(15);
  const [tileCache] = useState<Map<string, HTMLImageElement>>(new Map());
  const [useRealMap, setUseRealMap] = useState(true);

  const latLngToTile = (lat: number, lng: number, zoom: number) => {
    const x = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    return { x, y };
  };

  const gpsToCanvas = (lat: number, lng: number, canvasWidth: number, canvasHeight: number) => {
    const centerTile = latLngToTile(mapCenter.lat, mapCenter.lng, zoom);
    const pointTile = latLngToTile(lat, lng, zoom);
    
    const x = (pointTile.x - centerTile.x) * 256 + canvasWidth / 2;
    const y = (pointTile.y - centerTile.y) * 256 + canvasHeight / 2;
    
    return { x, y };
  };

  const loadTile = (x: number, y: number, z: number): Promise<HTMLImageElement> => {
    const tileKey = `${z}-${x}-${y}`;
    
    if (tileCache.has(tileKey)) {
      return Promise.resolve(tileCache.get(tileKey)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        tileCache.set(tileKey, img);
        resolve(img);
      };
      
      img.onerror = () => {
        setUseRealMap(false);
        reject(new Error('Tile load failed'));
      };
      
      img.src = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    });
  };

  const drawGridFallback = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1f1f1f';
    ctx.lineWidth = 1;
    const gridSize = 30;
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    if (!useRealMap) {
      drawGridFallback(ctx, width, height);
    } else {
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, width, height);

      const centerTile = latLngToTile(mapCenter.lat, mapCenter.lng, zoom);
      const tilesX = Math.ceil(width / 256) + 2;
      const tilesY = Math.ceil(height / 256) + 2;
      
      const startX = centerTile.x - Math.floor(tilesX / 2);
      const startY = centerTile.y - Math.floor(tilesY / 2);

      for (let x = 0; x < tilesX; x++) {
        for (let y = 0; y < tilesY; y++) {
          const tileX = startX + x;
          const tileY = startY + y;
          
          if (tileX >= 0 && tileY >= 0 && tileX < Math.pow(2, zoom) && tileY < Math.pow(2, zoom)) {
            const pixelX = (tileX - centerTile.x) * 256 + width / 2;
            const pixelY = (tileY - centerTile.y) * 256 + height / 2;
            
            loadTile(tileX, tileY, zoom)
              .then(img => {
                ctx.drawImage(img, pixelX, pixelY, 256, 256);
              })
              .catch(() => {
                ctx.fillStyle = '#e5e5e5';
                ctx.fillRect(pixelX, pixelY, 256, 256);
              });
          }
        }
      }
    }

    if (route.length > 1) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      
      ctx.beginPath();
      const startPoint = useRealMap 
        ? gpsToCanvas(route[0].lat, route[0].lng, width, height)
        : { x: width/2, y: height/2 };
      
      ctx.moveTo(startPoint.x, startPoint.y);
      
      for (let i = 1; i < route.length; i++) {
        const point = useRealMap
          ? gpsToCanvas(route[i].lat, route[i].lng, width, height)
          : { x: width/2 + i * 10, y: height/2 + Math.sin(i) * 20 };
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, 8, 0, 2 * Math.PI);
      ctx.fill();
    }

    if (currentPosition) {
      const pos = useRealMap
        ? gpsToCanvas(currentPosition.lat, currentPosition.lng, width, height)
        : { x: width/2, y: height/2 };
      
      if (isTracking) {
        const time = Date.now() / 1000;
        const pulseRadius = 15 + Math.sin(time * 3) * 5;
        
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pulseRadius, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    if (currentPosition && isTracking) {
      setMapCenter({ lat: currentPosition.lat, lng: currentPosition.lng });
    }
  }, [currentPosition, route, isTracking, mapCenter, zoom, useRealMap, tileCache]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      <div className="absolute top-4 left-4">
        <div className="flex items-center space-x-2 text-xs text-gray-400 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className={`w-2 h-2 rounded-full ${
            currentPosition && !gpsError ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`}></div>
          <span className="uppercase tracking-wide">
            {useRealMap ? 'LIVE MAP' : 'GPS GRID'}
          </span>
        </div>
      </div>

      {gpsAccuracy && (
        <div className="absolute top-4 right-4">
          <div className="text-xs text-gray-400 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
            ±{Math.round(gpsAccuracy)}m
          </div>
        </div>
      )}

      {route.length > 0 && (
        <div className="absolute bottom-4 right-4">
          <div className="text-xs text-gray-400 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
            {route.length} POINTS
          </div>
        </div>
      )}
    </div>
  );
};

export default RunningMapCanvas;