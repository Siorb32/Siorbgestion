// /api/inventario.js - CÓDIGO CORREGIDO PARA VERCEL/TIDB

const mysql = require('mysql2/promise');

// 1. CREAR EL POOL DE CONEXIONES FUERA DEL HANDLER (SOLUCIÓN SERVERLESS)
// Este pool se reutiliza entre ejecuciones de la función, haciendo las consultas mucho más rápidas.

// Verifica si el pool ya existe para no crearlo múltiples veces en caliente.
let connectionPool;

if (!connectionPool) {
    // Usamos el nombre 'DB_DATABASE' por convención, pero si usas 'DB_NAME'
    // en Vercel, asegúrate de que el nombre coincida.
    connectionPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE || process.env.DB_NAME, // Usar DB_DATABASE o el DB_NAME si es el que tienes configurado.
        port: process.env.DB_PORT,
        
        // 🔒 CONFIGURACIÓN SSL CRÍTICA PARA TI DB CLOUD
        ssl: {
            rejectUnauthorized: false
        },
        
        // Limita el tamaño del pool para no sobrecargar TiDB
        connectionLimit: 5, 
        waitForConnections: true
    });
}

// 2. EXPORTAR EL HANDLER DE VERCEL
module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({ success: false, message: "Método no permitido." });
        return;
    }

    try {
        // 3. USAR EL POOL PARA EJECUTAR LA CONSULTA
        // El pool gestiona automáticamente la conexión.
        const [rows] = await connectionPool.execute(
            'SELECT id, nombre, cantidad, precio, descripcion FROM productos'
        );
        
        res.status(200).json({ 
            success: true, 
            data: rows 
        });

    } catch (error) {
        console.error('Error al consultar TiDB:', error);
        // Si hay un error, indica que es un fallo del servidor
        res.status(500).json({ 
            success: false, 
            message: `Error de Servidor: No se pudo conectar a la base de datos. ${error.message}`
        });
    }
    // NOTA: No usamos connection.end() ni connection.release() aquí. 
    // El Pool se mantiene vivo y reutiliza las conexiones automáticamente.
};
