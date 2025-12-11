<?php
require_once 'db_connection.php'; 

header('Content-Type: application/json');

$sql = "SELECT nombre FROM rubros ORDER BY nombre ASC";
$resultado = $conn->query($sql);
$rubros = [];

if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $rubros[] = $fila['nombre'];
    }
}

$conn->close();
echo json_encode(['success' => true, 'data' => $rubros]);
?>