<?php
error_reporting(E_ALL); //  Habilita la notificación de todos los errores en PHP.
ini_set('display_errors', 1); // → Muestra los errores en la pantalla. 📌 Esto es útil en desarrollo, pero en producción es mejor desactivarlo 
header("Content-Type: application/json"); // Asegurar respuesta JSON

include 'db.php';


$data = json_decode(file_get_contents("php://input")); // json_decode: Convierte el JSON recibido en un objeto PHP.

if (!$data || !isset($data->id)) { // !isset($data->id)→ Comprueba si el objeto $data tiene la propiedad id.
    echo json_encode(["error" => "ID no proporcionado"]);
    exit;
}

$id = intval($data->id); // Convierto el id a un número entero, Si id es nullo no es un número válido, se convierte en 0.

if ($id <= 0) { // Si id <= 0, significa que está inválido y se devuelve un error.
    echo json_encode(["error" => "ID inválido"]);
    exit;
}

$stmt = $conexion->prepare("DELETE FROM contactos WHERE id = ?");
$stmt->bind_param("i", $id); // Asigna el valor de $id a la consulta preparada.
$stmt->execute();

if ($stmt->affected_rows > 0) { // Retorna el número de filas afectadas por la consulta DELETE.
    echo json_encode(["message" => "Contacto eliminado"]);
} else {
    echo json_encode(["error" => "No se encontró el contacto con ID: " . $id]);
}

// Cerrar conexión
$stmt->close();
$conexion->close();
exit; // Finaliza el script



