import {
  addTable,
  bookTable,
  getAllReservation,
  getAllReservations,
  getAllTables,
  updateReservationStatus
} from '../controllers/reservationController.js';

import authMiddleware from '../middleware/auth.js';
import express from 'express';

const ReservationRouter = express.Router();


ReservationRouter.post('/tables', addTable); 
ReservationRouter.get('/reservation_id', getAllReservations);  
ReservationRouter.get('/get_tables', getAllTables);  
ReservationRouter.post('/book',authMiddleware, bookTable); 
ReservationRouter.get('/reservations', getAllReservation); 
ReservationRouter.put('/table-update', updateReservationStatus); 

export default ReservationRouter;