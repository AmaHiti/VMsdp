import multer from 'multer';
import path from 'path';
import pool from "../config/db.js";

// Configure multer for table images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images (JPEG/JPG/PNG) are allowed'));
  }
}).array('images', 5); // Allow up to 5 images

// Add new table (Admin)
export const addTable = async (req, res) => {
  try {
    // First handle the file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }

      // Then process the form data
      const { table_number, table_type, capacity, description } = req.body;

      // Validate required fields
      if (!table_number || !table_type || !capacity) {
        return res.status(400).json({
          success: false,
          message: 'Table number, type, and capacity are required'
        });
      }

      // Insert table
      const [result] = await pool.query(
        `INSERT INTO tables 
         (table_number, table_type, capacity, description)
         VALUES (?, ?, ?, ?)`,
        [table_number, table_type, capacity, description]
      );

      const tableId = result.insertId;

      // Save images if any
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          await pool.query(
            `INSERT INTO table_images 
             (table_id, file_name, file_path, is_primary)
             VALUES (?, ?, ?, ?)`,
            [
              tableId, 
              req.files[i].filename, 
              req.files[i].path,
              i === 0 // First image as primary
            ]
          );
        }
      }

      res.status(201).json({
        success: true,
        message: 'Table added successfully!',
        tableId
      });
    });

  } catch (error) {
    console.error('Error adding table:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add table',
      error: error.message
    });
  }
};
// Get all tables (Customer)
export const getAllTables = async (req, res) => {
  try {
    const [tables] = await pool.query(
      `SELECT 
        t.*,
        (SELECT file_name FROM table_images WHERE table_id = t.table_id AND is_primary = 1 LIMIT 1) as primary_image_name,
        (SELECT file_path FROM table_images WHERE table_id = t.table_id AND is_primary = 1 LIMIT 1) as primary_image_path
      FROM tables t
      WHERE status = 'available'
      ORDER BY table_type, capacity`
    );

    res.json({
      success: true,
      tables: tables.map(table => ({
        ...table,
        primary_image: {
          name: table.primary_image_name,
          path: table.primary_image_path
        }
      }))
    });

  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tables',
      error: error.message
    });
  }
};
// Book table (Customer)
export const bookTable = async (req, res) => {
  try {

    const customer_id = req.body.userId
    const { 
      table_id, 
     
      customer_name, 
      phone, 
      email, 
      reservation_date, 
      reservation_time, 
      guests, 
      special_requests 
    } = req.body;

    // Validate required fields
    if (!table_id || !customer_id || !customer_name || !phone || !reservation_date || !reservation_time || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Table ID, Customer ID, Name, Phone, Date, Time and Guests are required.'
      });
    }

    // Check table availability
    const [existing] = await pool.query(
      `SELECT * FROM reservations 
       WHERE table_id = ? 
       AND reservation_date = ? 
       AND reservation_time = ? 
       AND status != 'cancelled'`,
      [table_id, reservation_date, reservation_time]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Table already booked for this time'
      });
    }

    // Create reservation
    const [result] = await pool.query(
      `INSERT INTO reservations 
       (table_id, customer_id, customer_name, phone, email, reservation_date, reservation_time, guests, special_requests)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [table_id, customer_id, customer_name, phone, email, reservation_date, reservation_time, guests, special_requests]
    );

    res.status(201).json({
      success: true,
      message: 'Table booked successfully!',
      reservationId: result.insertId
    });

  } catch (error) {
    console.error('Error booking table:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book table',
      error: error.message
    });
  }
};
export const getAllReservations = async (req, res) => {
  try {
    const { customer_id } = req.body;
    let query;
    let params = [];

    if (customer_id) {
      // Get reservations for specific customer
      query = `
        SELECT 
          r.*,
          t.table_number,
          t.table_type,
          t.capacity
        FROM reservations r
        JOIN tables t ON r.table_id = t.table_id
        WHERE r.customer_id = ?
        ORDER BY r.reservation_date DESC, r.reservation_time DESC`;
      params = [customer_id];
    } else {
      // Admin view - get all reservations
      query = `
        SELECT 
          r.*,
          t.table_number,
          t.table_type,
          t.capacity
        FROM reservations r
        JOIN tables t ON r.table_id = t.table_id
        ORDER BY r.reservation_date DESC, r.reservation_time DESC`;
    }

    const [reservations] = await pool.query(query, params);

    res.json({
      success: true,
      reservations
    });

  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservations',
      error: error.message
    });
  }
};
export const getAllReservation = async (req, res) => {
  try {
    const [reservations] = await pool.query(
      `SELECT 
        r.*,
        t.table_number,
        t.table_type,
        t.capacity
      FROM reservations r
      JOIN tables t ON r.table_id = t.table_id
      ORDER BY r.reservation_date DESC, r.reservation_time DESC`
    );

    res.json({
      success: true,
      reservations
    });

  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservations',
      error: error.message
    });
  }
};
export const updateReservationStatus = async (req, res) => {
  try {
    const { reservation_id } = req.body;
    const { status } = req.body;

    const [result] = await pool.query(
      `UPDATE reservations SET status = ? WHERE reservation_id = ?`,
      [status, reservation_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      message: 'Reservation updated successfully'
    });

  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reservation',
      error: error.message
    });
  }
};