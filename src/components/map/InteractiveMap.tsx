import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapPoints } from '@/hooks/useMapPoints';
import { MapPointType, MAP_POINT_LABELS } from '@/types/database';
import { MapFilters } from './MapFilters';
import { MapPin, Phone, Mail, MapPinned } from 'lucide-react';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const markerColors: Record<MapPointType, string> = {
  nodo: 'hsl(168, 60%, 40%)',
  centro_escucha: 'hsl(200, 55%, 45%)',
  comunidad_practicas: 'hsl(280, 40%, 50%)',
};

// Gran Argüello center coordinates (approximate)
const CENTER: [number, number] = [-31.3856, -64.2325];
const DEFAULT_ZOOM = 13;

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

export function InteractiveMap() {
  const [activeFilter, setActiveFilter] = useState<MapPointType | null>(null);
  const { data: points = [], isLoading } = useMapPoints();

  const filteredPoints = useMemo(() => {
    if (!activeFilter) return points;
    return points.filter((p) => p.point_type === activeFilter);
  }, [points, activeFilter]);

  const filterCounts = useMemo(() => {
    return {
      nodo: points.filter((p) => p.point_type === 'nodo').length,
      centro_escucha: points.filter((p) => p.point_type === 'centro_escucha').length,
      comunidad_practicas: points.filter((p) => p.point_type === 'comunidad_practicas').length,
    };
  }, [points]);

  return (
    <div className="relative w-full h-[600px] md:h-[700px] rounded-xl overflow-hidden shadow-lg">
      {/* Filters */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <MapFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
        />
      </div>

      {/* Map */}
      <MapContainer
        center={CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={CENTER} zoom={DEFAULT_ZOOM} />

        {filteredPoints.map((point) => (
          <Marker
            key={point.id}
            position={[Number(point.latitude), Number(point.longitude)]}
            icon={createCustomIcon(markerColors[point.point_type])}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-start gap-2 mb-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: markerColors[point.point_type] }}
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{point.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {MAP_POINT_LABELS[point.point_type]}
                    </p>
                  </div>
                </div>

                {point.description && (
                  <p className="text-sm text-muted-foreground mb-3">{point.description}</p>
                )}

                <div className="space-y-1 text-xs text-muted-foreground">
                  {point.address && (
                    <div className="flex items-center gap-1">
                      <MapPinned className="h-3 w-3" />
                      <span>{point.address}</span>
                    </div>
                  )}
                  {point.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{point.phone}</span>
                    </div>
                  )}
                  {point.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{point.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-[1001]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
    </div>
  );
}
