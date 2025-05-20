import pool from "../config/db.js";

export const getAllAnalytics = async (req, res) => {
    try {
        // Execute all analytics queries in parallel
        const [
            salesTrends,
            productSales,
            orderStatus,
            reservationStatus,
            paymentStatuses,
            customerGrowth,
            tableUtilization,
            popularCategories
        ] = await Promise.all([
            // Sales trends by month
            pool.query(`
                SELECT 
                    DATE_FORMAT(order_date, '%Y-%m') as month,
                    SUM(total_amount) as total_sales,
                    COUNT(*) as order_count
                FROM orders
                GROUP BY DATE_FORMAT(order_date, '%Y-%m')
                ORDER BY month
            `),
            
            // Top selling products
            pool.query(`
                SELECT 
                    p.name,
                    p.category,
                    SUM(oi.quantity) as total_sold,
                    SUM(oi.quantity * oi.unit_price) as revenue
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                GROUP BY p.product_id
                ORDER BY total_sold DESC
                LIMIT 5
            `),
            
            // Order status distribution
            pool.query(`
                SELECT 
                    current_status as status,
                    COUNT(*) as count
                FROM orders
                GROUP BY current_status
            `),
            
            // Reservation status distribution
            pool.query(`
                SELECT 
                    status,
                    COUNT(*) as count
                FROM reservations
                GROUP BY status
            `),
            
            // Payment status distribution
            pool.query(`
                SELECT 
                    payment_status,
                    COUNT(*) as count,
                    SUM(total_amount) as total_amount
                FROM orders
                GROUP BY payment_status
            `),
            
            // Customer growth over time
            pool.query(`
                SELECT 
                    DATE_FORMAT(join_date, '%Y-%m') as month,
                    COUNT(*) as new_customers
                FROM customers
                GROUP BY DATE_FORMAT(join_date, '%Y-%m')
                ORDER BY month
            `),
            
            // Table utilization
            pool.query(`
                SELECT 
                    t.table_number,
                    t.table_type,
                    t.capacity,
                    COUNT(r.reservation_id) as reservation_count
                FROM tables t
                LEFT JOIN reservations r ON t.table_id = r.table_id
                GROUP BY t.table_id
                ORDER BY reservation_count DESC
            `),
            
            // Popular product categories
            pool.query(`
                SELECT 
                    p.category,
                    COUNT(oi.order_item_id) as order_count,
                    SUM(oi.quantity) as total_quantity
                FROM products p
                JOIN order_items oi ON p.product_id = oi.product_id
                GROUP BY p.category
                ORDER BY order_count DESC
            `)
        ]);

        res.json({
            salesTrends: salesTrends[0],
            productSales: productSales[0],
            orderStatus: orderStatus[0],
            reservationStatus: reservationStatus[0],
            paymentStatuses: paymentStatuses[0],
            customerGrowth: customerGrowth[0],
            tableUtilization: tableUtilization[0],
            popularCategories: popularCategories[0]
        });
        
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            message: "Failed to fetch analytics data"
        });
    }
};