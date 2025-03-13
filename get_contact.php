<?php
header("Content-Type: application/json"); // Asegura que la respuesta sea JSON
include "db.php"; // Conexión a la base de datos

// Validar que se envió un ID válido
if (!isset($_GET["id"]) || !is_numeric($_GET["id"])) {
    echo json_encode(["error" => "ID no válido"]);
    exit;
}

$id = intval($_GET["id"]);

// Consulta para obtener los datos del contacto
$sql = "SELECT * FROM contactos WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si se encontró el contacto
if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error" => "Contacto no encontrado"]);
}

// Cerrar conexión
$stmt->close();
$conexion->close();
?>
