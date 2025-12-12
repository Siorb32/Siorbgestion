// siorbhtml/api/inventario.js
const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({ success: false, message: "Método no permitido." });
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
            // 🔒 SSL obligatorio para TiDB Cloud
            ssl: {
                rejectUnauthorized: false
            }
        });

        // 📊 Consulta ajustada a tus columnas reales: id, nombre, cantidad, precio
        const [rows] = await connection.execute(
            'SELECT id, nombre, cantidad, precio, descripcion FROM productos'
        );
        
        res.status(200).json({ 
            success: true, 
            data: rows 
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: `Error: ${error.message}`
        });
    } finally {
        if (connection) await connection.end();
    }
};
