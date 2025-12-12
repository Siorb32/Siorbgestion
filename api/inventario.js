// siorbhtml/api/inventario.js
const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({ success: false, message: "Solo se permite GET" });
        return;
    }

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            // 🔒 ESTA LÍNEA ES LA QUE ARREGLA EL ERROR:
            ssl: {
                rejectUnauthorized: false
            }
        });

        // Consultamos la tabla 'productos' que creaste en TiDB
        const [rows] = await connection.execute('SELECT * FROM productos');
        
        res.status(200).json({ success: true, data: rows });

    } catch (error) {
        console.error('Error de DB:', error);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        if (connection) await connection.end();
    }
};
