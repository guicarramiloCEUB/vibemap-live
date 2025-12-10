import React from 'react';
import { MapPin } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  media_url?: string;
}

interface MapPlaceholderProps {
  events: Event[];
  userLocation: { lat: number; lng: number } | null;
  onEventClick: (event: Event) => void;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ 
  events, 
  userLocation,
  onEventClick 
}) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-green-100 to-green-50 overflow-hidden">
      {/* Map background pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#a3a3a3" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Fake streets */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 right-0 h-8 bg-gray-200/60" />
        <div className="absolute top-1/2 left-0 right-0 h-12 bg-gray-300/60" />
        <div className="absolute top-3/4 left-0 right-0 h-6 bg-gray-200/60" />
        <div className="absolute left-1/4 top-0 bottom-0 w-6 bg-gray-200/60" />
        <div className="absolute left-1/2 top-0 bottom-0 w-10 bg-gray-300/60" />
        <div className="absolute left-3/4 top-0 bottom-0 w-8 bg-gray-200/60" />
      </div>

      {/* User location */}
      {userLocation && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          {/* Pulse effect */}
          <div className="absolute inset-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 pulse-animation" />
          {/* Blue dot */}
          <div className="w-6 h-6 rounded-full bg-primary border-4 border-primary-foreground shadow-lg" />
        </div>
      )}

      {/* Heat map effect for events cluster */}
      {events.length > 0 && (
        <div 
          className="absolute w-32 h-32 rounded-full opacity-60"
          style={{
            top: '35%',
            left: '40%',
            background: 'radial-gradient(circle, hsl(142 76% 36% / 0.6) 0%, hsl(38 92% 50% / 0.4) 40%, transparent 70%)',
          }}
        />
      )}

      {/* Event markers */}
      {events.slice(0, 5).map((event, index) => {
        // Position events around the map
        const positions = [
          { top: '30%', left: '60%' },
          { top: '55%', left: '25%' },
          { top: '70%', left: '70%' },
          { top: '20%', left: '35%' },
          { top: '65%', left: '45%' },
        ];
        const pos = positions[index] || positions[0];

        return (
          <button
            key={event.id}
            onClick={() => onEventClick(event)}
            className="absolute transform -translate-x-1/2 -translate-y-full z-10 group"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="relative">
              {/* Shadow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm" />
              
              {/* Pin */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full vibe-gradient flex items-center justify-center shadow-lg 
                              transform transition-transform group-hover:scale-110">
                  {event.media_url ? (
                    <img 
                      src={event.media_url} 
                      alt={event.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <MapPin className="w-5 h-5 text-accent-foreground" />
                  )}
                </div>
                {/* Pin tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 
                              border-l-[6px] border-l-transparent 
                              border-r-[6px] border-r-transparent 
                              border-t-[8px] border-t-accent" />
              </div>
            </div>
          </button>
        );
      })}

      {/* Location info overlay */}
      {!userLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Ative sua localização
            </h3>
            <p className="text-sm text-muted-foreground">
              Para ver eventos próximos, permita o acesso à sua localização
            </p>
          </div>
        </div>
      )}

      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />
    </div>
  );
};

export default MapPlaceholder;
