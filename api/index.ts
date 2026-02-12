import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import newsRoutes from './routes/news';
import bannersRoutes from './routes/banners';
import configRoutes from './routes/config';
import mapPointsRoutes from './routes/mapPoints';
import campaignsRoutes from './routes/campaigns';
import formsRoutes from './routes/forms';

const app = express();
const port = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json({ limit: '12mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/config', configRoutes);
app.use('/api/map-points', mapPointsRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/forms', formsRoutes);

app.get('/', (_req, res) => {
  res.send('Arg-Ello Cares API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
