// Types for Red de Cuidados del Gran Argüello

export type MapPointType = 'nodo' | 'centro_escucha' | 'comunidad_practicas';
export type NewsSection = 'nodos' | 'centros_escucha' | 'comunidad_practicas' | 'app_mappa' | 'campanas';
export type AppRole = 'admin' | 'editor';

export interface MapPoint {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  point_type: MapPointType;
  address: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  image_caption: string | null;
  section: NewsSection;
  is_visible: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  availability: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteConfig {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

// UI Helper types
export const MAP_POINT_LABELS: Record<MapPointType, string> = {
  nodo: 'Nodo',
  centro_escucha: 'Centro de Escucha',
  comunidad_practicas: 'Comunidad de Prácticas',
};

export const NEWS_SECTION_LABELS: Record<NewsSection, string> = {
  nodos: 'Nodos',
  centros_escucha: 'Centros de Escucha',
  comunidad_practicas: 'Comunidad de Prácticas',
  app_mappa: 'App MAPPA',
  campanas: 'Campañas',
};

export const MAP_POINT_COLORS: Record<MapPointType, string> = {
  nodo: 'bg-nodo',
  centro_escucha: 'bg-centro-escucha',
  comunidad_practicas: 'bg-comunidad-practicas',
};
