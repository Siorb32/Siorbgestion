<?php
// ¡TUS CREDENCIALES REALES!
// Hostname de MySQL de InfinityFree (el Hostname que aparece en tu panel)
define('DB_SERVER', 'sql202.infinityfree.com');  

// Nombre de Usuario de la BD (el Username que aparece en tu panel)
define('DB_USERNAME', 'if0_40640632'); 

// Contraseña de tu cuenta de Hosting/MySQL
define('DB_PASSWORD', 'TU_CLAVE_DE_HOSTING'); 

// Nombre completo de la BD que creaste
define('DB_NAME', 'if0_40640632_sga_db'); 

// Intenta conectar a la Base de Datos MySQL
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Chequea la conexión
if ($conn->connect_error) {
    // Si la conexión falla, devuelve un error JSON
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la Base de Datos: ' . $conn->connect_error]);
    exit();
}

// Establecer el juego de caracteres a utf8
$conn->set_charset("utf8");
?>