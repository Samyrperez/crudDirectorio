<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json"); // La respuesta será JSON

include 'db.php';

$data = json_decode(file_get_contents("php://input")); // json_decode: Convierte el JSON recibido en un objeto PHP.

if (!$data || !isset($data->id, $data->nombre, $data->telefono, $data->email)) {
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}

// Validar y limpiar los datos
$id = intval($data->id);
$nombre = trim($data->nombre);
$telefono = trim($data->telefono);
$email = trim($data->email);

// Verificar si el ID es válido
if ($id <= 0 || empty($nombre) || empty($telefono) || empty($email)) {
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

// Preparar la consulta UPDATE
$stmt = $conexion->prepare("UPDATE contactos SET nombre = ?, telefono = ?, email = ? WHERE id = ?");
$stmt->bind_param("sssi", $nombre, $telefono, $email, $id);
$stmt->execute();

// Verificar si se actualizó el registro
if ($stmt->affected_rows > 0) {
    echo json_encode(["message" => "Contacto actualizado Correctamente"]);
} else {
    echo json_encode(["error" => "No se encontró el contacto o no hubo cambios"]);
}

// Cerrar conexión
$stmt->close();
$conexion->close();
exit;