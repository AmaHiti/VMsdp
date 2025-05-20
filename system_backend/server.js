import 'dotenv/config';

import AnalyticsRouter from './routes/analyticsRoutes.js';
import OrderRoutes from './routes/orderRoutes.js';
import ProductRouter from './routes/productRoutes.js';
import ReservationRouter from './routes/reservationRoutes.js';
import adminRouter from './routes/adminRouter.js';
import cors from 'cors';
import express from 'express';
import machineRouter from './routes/machineRouter.js';
import pool from './config/db.js';
import quotationRouter from './routes/addquotation.js';
import reportRouter from './routes/reportRouter.js';
import userRouter from './routes/userRouter.js';

// ✅ Move this up
const app = express();
const port = process.env.PORT || 4000;

// Configure CORS

const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:3002','http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
// Middleware
app.use(cors(corsOptions));        // ✅ Now safe to use
app.options('*', cors(corsOptions));
app.use(express.json());

// Serve static images
app.use('/images', express.static('uploads'));

// API routes
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/report', reportRouter);
app.use('/api/quotation', quotationRouter);
app.use('/api/product', ProductRouter);
app.use('/api/machine', machineRouter);
app.use('/api/order', OrderRoutes);
app.use('/api/analytics', AnalyticsRouter);
app.use('/api', ReservationRouter);

// DB test route
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ success: true, message: 'Database connected!', result: rows[0] });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ success: false, message: 'Error connecting to the database', error });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('API WORKING');
});

// Start server
app.listen(port, () => {
    console.log(`Server starting on http://localhost:${port}`);
});
