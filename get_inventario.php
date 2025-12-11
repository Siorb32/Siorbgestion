<?php
require_once 'db_connection.php'; // Incluye la conexión

header('Content-Type: application/json');

$sql = "SELECT sku, nombre, rubro, stock, fecha_creacion, fecha_ultima_venta 
        FROM inventario 
        ORDER BY sku ASC";

$resultado = $conn->query($sql);
$inventario = [];

if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $inventario[] = $fila;
    }
}

$conn->close();
echo json_encode(['success' => true, 'data' => $inventario]);

if (!$resultado) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al ejecutar la consulta: ' . $conn->error]);
}
?>