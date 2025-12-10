import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import EventDetail from '@/components/EventDetail';
import CreateEventModal from '@/components/CreateEventModal';
import MapPlaceholder from '@/components/MapPlaceholder';
import { User, LogOut } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  description?: string;
  category: string;
  latitude: number;
  longitude: number;
  media_url?: string;
  start_time?: string;
  end_time?: string;
  price?: number;
}

const Index: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Set a default location (São Paulo)
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
        }
      );
    }
  }, []);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
    toast.success('Até logo!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 px-4 pt-12 pb-4">
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSignOut}
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center
                       shadow-lg hover:bg-card transition-colors"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-12 h-12 rounded-full vibe-gradient flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Map area */}
      <main className="flex-1 relative">
        <MapPlaceholder
          events={events}
          userLocation={userLocation}
          onEventClick={setSelectedEvent}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation onAddEvent={() => setShowCreateModal(true)} />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userLocation={userLocation}
        onEventCreated={fetchEvents}
      />
    </div>
  );
};

export default Index;
