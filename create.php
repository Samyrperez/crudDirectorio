<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

include 'db.php';

// 🔥 1. Recibir y decodificar JSON correctamente
$data = json_decode(file_get_contents("php://input"), true);

// 🔍 2. Verifica si los datos llegan correctamente
if (!$data) {
    echo json_encode(["error" => "No se recibieron datos"]);
    exit;
}

// 3️⃣ Validar que los campos existan
if (!isset($data["nombre"], $data["telefono"], $data["email"], $data["profesion"])) {
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}

// 4️⃣ Asignar y limpiar datos
$nombre = trim($data["nombre"]);
$telefono = trim($data["telefono"]);
$email = trim($data["email"]);
$profesion = trim($data["profesion"]);

if (empty($nombre) || empty($telefono) || empty($email) || empty($profesion)) {
    echo json_encode(["error" => "Todos los campos son obligatorios"]);
    exit;
}

// 5️⃣ Preparar y ejecutar la consulta
$stmt = $conexion->prepare("INSERT INTO contactos (nombre, telefono, email, profesion) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombre, $telefono, $email, $profesion);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Contacto agregado correctamente"]);
} else {
    echo json_encode(["error" => "Error al guardar: " . $conexion->error]);
}

// 6️⃣ Cerrar conexión
$stmt->close();
$conexion->close();
