import React from 'react';
import { X, MapPin, Clock, DollarSign, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventDetailProps {
  event: {
    id: string;
    name: string;
    description?: string;
    category: string;
    media_url?: string;
    start_time?: string;
    end_time?: string;
    price?: number;
  };
  onClose: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose }) => {
  const formatTime = (time?: string) => {
    if (!time) return null;
    const date = new Date(time);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'music':
      case 'música':
        return <Music className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-vibe-overlay/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-card rounded-t-[2rem] slide-up safe-area-inset-bottom">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-border rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center
                     hover:bg-muted/80 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Event Image */}
        <div className="relative px-6 pb-4">
          <div className="flex flex-col items-center">
            {/* Location pin icon */}
            <div className="relative -mt-2 mb-2">
              <div className="w-16 h-16 rounded-full vibe-gradient flex items-center justify-center shadow-lg">
                <MapPin className="w-8 h-8 text-accent-foreground" />
              </div>
            </div>

            {/* Event photo */}
            {event.media_url ? (
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-card shadow-xl -mt-4">
                <img 
                  src={event.media_url} 
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-card shadow-xl -mt-4">
                {getCategoryIcon(event.category)}
              </div>
            )}

            {/* Event name and category */}
            <h2 className="text-xl font-bold text-foreground mt-4">{event.name}</h2>
            <p className="text-sm text-muted-foreground">{event.category}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mx-6" />

        {/* Event details */}
        <div className="px-6 py-4 space-y-3">
          {event.description && (
            <div className="flex items-start gap-3">
              <Music className="w-5 h-5 text-muted-foreground mt-0.5" />
              <p className="text-foreground">{event.description}</p>
            </div>
          )}

          {(event.start_time || event.end_time) && (
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <p className="text-foreground">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </p>
            </div>
          )}

          {event.price !== undefined && event.price !== null && (
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <p className="text-foreground">
                {event.price > 0 ? `R$ ${event.price.toFixed(2)}` : 'Gratuito'}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-6 pt-2">
          <Button className="w-full rounded-full" size="lg">
            Ver mais detalhes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
