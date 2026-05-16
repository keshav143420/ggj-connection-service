import express from 'express';
import connectionRoutes from './routes/connection.routes';

const app = express();

app.use(express.json());

app.use('/users', connectionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;
