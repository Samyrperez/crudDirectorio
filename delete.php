<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json"); // Asegurar respuesta JSON

include 'db.php';

// Leer JSON recibido
$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->id)) {
    echo json_encode(["error" => "ID no proporcionado"]);
    exit;
}

$id = intval($data->id);

if ($id <= 0) {
    echo json_encode(["error" => "ID inválido"]);
    exit;
}

// Preparar y ejecutar la consulta DELETE
$stmt = $conexion->prepare("DELETE FROM contactos WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["message" => "Contacto eliminado"]);
} else {
    echo json_encode(["error" => "No se encontró el contacto con ID: " . $id]);
}

// Cerrar conexión
$stmt->close();
$conexion->close();
exit; // Finaliza el script



