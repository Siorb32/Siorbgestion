// siorbhtml/api/inventario.js

// Importar el módulo de MySQL
const mysql = require('mysql2/promise');

// Definir la función Serverless que Vercel ejecutará
module.exports = async (req, res) => {
    // 1. Verificar el método (solo permitimos GET para consultar datos)
    if (req.method !== 'GET') {
        res.status(405).json({ success: false, message: "Método no permitido. Solo GET." });
        return;
    }

    let connection;
    try {
        // 2. Conexión a la base de datos
        // NOTA: 'process.env.XXX' lee las Variables de Entorno que configurarás en Vercel
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            // 🚨 SOLUCIÓN: Agregamos la configuración SSL/TLS obligatoria para TiDB Cloud.
            ssl: {
                rejectUnauthorized: false
            },
            timezone: 'Z', // Esto es útil para manejar fechas correctamente
        });

        // 3. Consulta SQL: Obtener el inventario
        const [rows] = await connection.execute(
            'SELECT sku, nombre, rubro, stock, fecha_ultima_venta FROM productos'
        );
        
        // 4. Devolver los resultados en el formato JSON
        res.status(200).json({ 
            success: true, 
            data: rows 
        });

    } catch (error) {
        // Manejo de errores de conexión o consulta
        console.error('Error en Serverless Function:', error);
        res.status(500).json({ 
            success: false, 
            message: `Error interno del servidor. Verifique credenciales de DB. Detalle: ${error.message}`
        });
    } finally {
        // 5. Cerrar la conexión
        if (connection) await connection.end();
    }
};
