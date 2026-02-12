import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import newsRoutes from './routes/news';

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
  res.send('Arg-Ello Cares API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});