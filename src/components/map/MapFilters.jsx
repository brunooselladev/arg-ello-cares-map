import { MAP_POINT_LABELS } from '@/types/database';
import { cn } from '@/lib/utils';
import { MapPin, Headphones, Users } from 'lucide-react';
const filterConfig = {
    nodo: { icon: MapPin, colorClass: 'bg-nodo' },
    centro_escucha: { icon: Headphones, colorClass: 'bg-centro-escucha' },
    comunidad_practicas: { icon: Users, colorClass: 'bg-comunidad-practicas' },
};
export function MapFilters({ activeFilter, onFilterChange, counts }) {
    const filters = [null, 'nodo', 'centro_escucha', 'comunidad_practicas'];
    return (<div className="flex flex-wrap gap-2 p-3 glass rounded-lg">
      {filters.map((filter) => {
            const isActive = activeFilter === filter;
            const config = filter ? filterConfig[filter] : null;
            const Icon = config?.icon;
            const count = filter ? counts[filter] : Object.values(counts).reduce((a, b) => a + b, 0);
            return (<button key={filter ?? 'all'} onClick={() => onFilterChange(filter)} className={cn('flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all', isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-background/80 text-foreground hover:bg-background')}>
            {Icon ? (<span className={cn('w-3 h-3 rounded-full', config.colorClass)}/>) : (<span className="w-3 h-3 rounded-full bg-gradient-to-r from-nodo via-centro-escucha to-comunidad-practicas"/>)}
            <span className="hidden sm:inline">
              {filter ? MAP_POINT_LABELS[filter] : 'Todos'}
            </span>
            <span className="text-xs opacity-70">({count})</span>
          </button>);
        })}
    </div>);
}
