import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AddressAutocomplete
 * Usa Nominatim (OpenStreetMap) — 100% gratuito, sin API key.
 *
 * Props:
 *   value        {string}   — dirección visible en el input
 *   onChange     {fn}       — se llama con el texto mientras el usuario escribe
 *   onSelect     {fn}       — se llama con { address, latitude, longitude } al elegir sugerencia
 *   placeholder  {string}
 *   className    {string}
 */
export function AddressAutocomplete({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Buscar dirección...',
  className,
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);
  const abortRef = useRef(null);

  // Sync cuando el valor externo cambia (ej: al editar un punto existente)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Cierra el dropdown al hacer click afuera
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchSuggestions = useCallback(async (text) => {
    if (!text || text.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Cancela el request anterior si existe
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        format: 'json',
        q: text,
        limit: '6',
        addressdetails: '1',
        'accept-language': 'es',
      });
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          signal: abortRef.current.signal,
          headers: { 'Accept-Language': 'es' },
        }
      );
      if (!res.ok) throw new Error('Error Nominatim');
      const data = await res.json();
      setSuggestions(data);
      setIsOpen(data.length > 0);
      setActiveIndex(-1);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setSuggestions([]);
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    onChange?.(text);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 400);
  };

  const handleSelect = (item) => {
    const address = item.display_name;
    setQuery(address);
    setSuggestions([]);
    setIsOpen(false);
    onSelect?.({
      address,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    });
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Input
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="pr-8"
        />
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md overflow-hidden">
          {suggestions.map((item, idx) => (
            <li
              key={item.place_id}
              onMouseDown={(e) => {
                // mousedown en vez de click para que no dispare el blur del input antes
                e.preventDefault();
                handleSelect(item);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                'flex cursor-pointer items-start gap-2 px-3 py-2 text-sm transition-colors',
                idx === activeIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="line-clamp-2 leading-snug">{item.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
