import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Index from './pages/Index';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminMapPoints from './pages/AdminMapPoints';
import AdminNews from './pages/AdminNews';
import AdminCampaigns from './pages/AdminCampaigns';
import AdminBanners from './pages/AdminBanners';
import AdminTheme from './pages/AdminTheme';
import AdminVolunteers from './pages/AdminVolunteers';
import AdminMessages from './pages/AdminMessages';
import AdminSettings from './pages/AdminSettings';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/map-points" element={<AdminMapPoints />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/campaigns" element={<AdminCampaigns />} />
          <Route path="/admin/banners" element={<AdminBanners />} />
          <Route path="/admin/theme" element={<AdminTheme />} />
          <Route path="/admin/volunteers" element={<AdminVolunteers />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
