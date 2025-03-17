<?php
error_reporting(E_ALL); //  Habilita la notificación de todos los errores en PHP.
ini_set('display_errors', 1); // → Muestra los errores en la pantalla. 📌 Esto es útil en desarrollo, pero en producción es mejor desactivarlo 
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
$stmt = $conexion->prepare($sql); //  Prepara la consulta para evitar inyecciones SQL.
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

