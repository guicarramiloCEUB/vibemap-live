import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = async () => {
      try {
        // Fetch Mapbox token from edge function
        const { data, error: fnError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (fnError || !data?.token) {
          throw new Error('Não foi possível carregar o token do Mapbox');
        }

        mapboxgl.accessToken = data.token;

        const initialCenter: [number, number] = userLocation 
          ? [userLocation.lng, userLocation.lat] 
          : [-46.6333, -23.5505]; // São Paulo default

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: initialCenter,
          zoom: 14,
          pitch: 45,
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({ visualizePitch: true }),
          'top-right'
        );

        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true,
          }),
          'top-right'
        );

        map.current.on('load', () => {
          setMapLoaded(true);
          setLoading(false);
        });

      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar mapa');
        setLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (map.current && userLocation && mapLoaded) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 14,
        duration: 1500,
      });

      // Add/update user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
      } else {
        const el = document.createElement('div');
        el.className = 'user-marker';
        el.innerHTML = `
          <div class="relative">
            <div class="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/30 animate-ping"></div>
            <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
          </div>
        `;
        
        userMarkerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map.current);
      }
    }
  }, [userLocation, mapLoaded]);

  // Add event markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for each event
    events.forEach(event => {
      const el = document.createElement('div');
      el.className = 'event-marker cursor-pointer';
      el.innerHTML = `
        <div class="relative group">
          <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg 
                      transform transition-transform hover:scale-110"
               style="background: linear-gradient(135deg, hsl(280, 80%, 50%), hsl(330, 80%, 50%));">
            ${event.media_url 
              ? `<img src="${event.media_url}" alt="${event.name}" class="w-10 h-10 rounded-full object-cover" />`
              : `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                         d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>`
            }
          </div>
          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 
                      border-l-[8px] border-l-transparent 
                      border-r-[8px] border-r-transparent 
                      border-t-[10px]"
               style="border-top-color: hsl(330, 80%, 50%);"></div>
        </div>
      `;

      el.addEventListener('click', () => onEventClick(event));

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([event.longitude, event.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [events, mapLoaded, onEventClick]);

  if (error) {
    return (
      <div className="relative w-full h-full bg-card flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Erro ao carregar mapa
          </h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/50 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default MapPlaceholder;
