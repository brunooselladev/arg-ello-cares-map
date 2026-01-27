-- ===========================================
-- RED DE CUIDADOS DEL GRAN ARGÜELLO - SCHEMA
-- ===========================================

-- Enum para tipos de puntos del mapa
CREATE TYPE public.map_point_type AS ENUM ('nodo', 'centro_escucha', 'comunidad_practicas');

-- Enum para secciones de novedades
CREATE TYPE public.news_section AS ENUM ('nodos', 'centros_escucha', 'comunidad_practicas', 'app_mappa', 'campanas');

-- Enum para roles de usuario
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- ===========================================
-- TABLA: Puntos del Mapa
-- ===========================================
CREATE TABLE public.map_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  point_type map_point_type NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- TABLA: Novedades / Noticias
-- ===========================================
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  image_caption TEXT,
  section news_section NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- TABLA: Campañas
-- ===========================================
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- TABLA: Voluntarios (formulario de registro)
-- ===========================================
CREATE TABLE public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  availability TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- TABLA: Mensajes de Contacto
-- ===========================================
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- TABLA: Configuración del sitio (contador de usuarios, etc.)
-- ===========================================
CREATE TABLE public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insertar configuración inicial del contador de usuarios
INSERT INTO public.site_config (key, value, description) 
VALUES ('app_user_count', '0', 'Contador total de usuarios de la app MAPPA');

-- ===========================================
-- TABLA: Roles de Usuario (para admin)
-- ===========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- ===========================================
-- FUNCIÓN: Verificar rol de usuario
-- ===========================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- ===========================================
-- FUNCIÓN: Verificar si es admin
-- ===========================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- ===========================================
-- TRIGGER: Actualizar updated_at
-- ===========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_map_points_updated_at
  BEFORE UPDATE ON public.map_points
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at
  BEFORE UPDATE ON public.site_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================
-- RLS: Habilitar Row Level Security
-- ===========================================
ALTER TABLE public.map_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- RLS POLICIES: Lectura pública (datos activos/visibles)
-- ===========================================

-- Map Points: lectura pública de puntos activos
CREATE POLICY "Public can view active map points"
  ON public.map_points FOR SELECT
  USING (is_active = true);

-- News: lectura pública de noticias visibles
CREATE POLICY "Public can view visible news"
  ON public.news FOR SELECT
  USING (is_visible = true);

-- Campaigns: lectura pública de campañas activas
CREATE POLICY "Public can view active campaigns"
  ON public.campaigns FOR SELECT
  USING (is_active = true);

-- Site Config: lectura pública
CREATE POLICY "Public can view site config"
  ON public.site_config FOR SELECT
  USING (true);

-- ===========================================
-- RLS POLICIES: Escritura pública (formularios)
-- ===========================================

-- Volunteers: cualquiera puede registrarse
CREATE POLICY "Anyone can submit volunteer form"
  ON public.volunteers FOR INSERT
  WITH CHECK (true);

-- Contact Messages: cualquiera puede enviar mensaje
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- ===========================================
-- RLS POLICIES: Admin - acceso completo
-- ===========================================

-- Map Points: admin CRUD completo
CREATE POLICY "Admins can manage map points"
  ON public.map_points FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- News: admin CRUD completo
CREATE POLICY "Admins can manage news"
  ON public.news FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Campaigns: admin CRUD completo
CREATE POLICY "Admins can manage campaigns"
  ON public.campaigns FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Volunteers: admin puede ver
CREATE POLICY "Admins can view volunteers"
  ON public.volunteers FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Contact Messages: admin puede ver y actualizar
CREATE POLICY "Admins can manage contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Site Config: admin puede actualizar
CREATE POLICY "Admins can update site config"
  ON public.site_config FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- User Roles: admin puede ver roles
CREATE POLICY "Admins can view user roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.is_admin() OR user_id = auth.uid());

-- ===========================================
-- STORAGE: Bucket para imágenes
-- ===========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

-- Storage policies
CREATE POLICY "Public can view media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admins can update media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admins can delete media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());