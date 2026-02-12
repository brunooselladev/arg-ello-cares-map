export type MapPointType = 'nodo' | 'centro_escucha' | 'comunidad_practicas';
export type NewsCategory = 'nodos' | 'campanas' | 'centros' | 'comunidad';
export type AppRole = 'admin' | 'user';

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
  summary: string;
  image: string | null;
  category: NewsCategory;
  videoUrl: string | null;
  date: string | null;
  author: string | null;
  tags: string[] | null;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
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
  primaryColor: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: AppRole;
}

export const MAP_POINT_LABELS: Record<MapPointType, string> = {
  nodo: 'Nodo',
  centro_escucha: 'Centro de escucha',
  comunidad_practicas: 'Comunidad de practicas',
};

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  nodos: 'Nodos',
  campanas: 'Campanas',
  centros: 'Centros',
  comunidad: 'Comunidad',
};

export const MAP_POINT_COLORS: Record<MapPointType, string> = {
  nodo: 'bg-nodo',
  centro_escucha: 'bg-centro-escucha',
  comunidad_practicas: 'bg-comunidad-practicas',
};
