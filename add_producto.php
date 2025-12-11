<?php
require_once 'db_connection.php'; 

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['sku'], $data['nombre'], $data['rubro'])) {
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos (SKU, nombre, rubro).']);
    $conn->close();
    exit();
}

// Limpieza y preparación de variables
$sku = $conn->real_escape_string($data['sku']); 
$nombre = $conn->real_escape_string($data['nombre']);
$rubro = $conn->real_escape_string($data['rubro']);
$timestamp = date('Y-m-d H:i:s'); 

// Iniciar inserción en INVENTARIO
$sql_inventario = "INSERT INTO inventario (sku, nombre, rubro, stock, fecha_creacion, fecha_ultima_venta) 
                   VALUES ('$sku', '$nombre', '$rubro', 0, '$timestamp', '$timestamp')";

if ($conn->query($sql_inventario) === TRUE) {
    
    // Registrar el movimiento de CREACION
    $conn->query("INSERT INTO movimientos (sku_producto, tipo, cantidad, nota, responsable, timestamp) 
                  VALUES ('$sku', 'CREACION', 0, 'Creación de producto nuevo.', 'Sistema', '$timestamp')");

    // Agregar el Rubro si no existe
    $conn->query("INSERT IGNORE INTO rubros (nombre) VALUES ('$rubro')"); 

    echo json_encode(['success' => true, 'message' => 'Producto agregado con éxito.']);

} else {
    // Manejar error de SKU duplicado
    if ($conn->errno == 1062) { 
        http_response_code(409); 
        echo json_encode(['success' => false, 'message' => 'Error: El SKU ya existe.']);
    } else {
        http_response_code(500); 
        echo json_encode(['success' => false, 'message' => 'Error al agregar producto: ' . $conn->error]);
    }
}

$conn->close();
?>