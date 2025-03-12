<?php
header("Content-Type: application/json"); // Asegurar que la respuesta sea JSON
include 'db.php';

// Leer los datos JSON recibidos
$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->id)) {
    echo json_encode(["error" => "ID no proporcionado"]);
    exit;
}

$id = intval($data->id); 

// Preparar la consulta
$stmt = $conexion->prepare("DELETE FROM contactos WHERE id = ?");
$stmt->bind_param("i", $id);

// Ejecutar la consulta
if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["message" => "Contacto eliminado"]);
} else {
    echo json_encode(["error" => "No se encontró el contacto con ID: " . $id]);
}

// Cerrar conexión
$stmt->close();
$conexion->close();
?>
