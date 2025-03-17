<?php
error_reporting(E_ALL); //  Habilita la notificación de todos los errores en PHP.
ini_set('display_errors', 1); // → Muestra los errores en la pantalla. 📌 Esto es útil en desarrollo, pero en producción es mejor desactivarlo 
header("Content-Type: application/json"); // Asegurar respuesta JSON

include 'db.php';

$data = json_decode(file_get_contents("php://input")); // file_get_contents("php://input") obtiene los datos sin procesar.
// json_decode(...) convierte el JSON recibido en un objeto PHP.

// Validación de los datos recibidos, si no recibo todos los datos ó los campos esten vacios
if (!$data || !isset($data->id, $data->nombre, $data->telefono, $data->email, $data->profesion)) {
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}


// Validar y limpiar los datos
$id = intval($data->id); // Convierto el id en un entero
$nombre = trim($data->nombre); //  trim(...): Elimina espacios en blanco al inicio y al final de cada campo.
$telefono = trim($data->telefono);
$email = trim($data->email);
$profesion = trim($data->profesion);

// Verificar si el ID es válido o si estan vacios los campos
if ($id <= 0 || empty($nombre) || empty($telefono) || empty($email) || empty($profesion)) {
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

// Obtengo los datos actuales del contacto
$stmt = $conexion->prepare("SELECT nombre, telefono, email, profesion FROM contactos WHERE id = ?");
// Se usa prepare(...) para evitar inyecciones SQL
$stmt->bind_param("i", $id); // bind_param("i", $id): Asigna el id a la consulta como un entero (i → integer).
$stmt->execute();
$result = $stmt->get_result();
$currentData = $result->fetch_assoc();
$stmt->close();

if (!$currentData) { // Si no obtengo resultados, significa que el contacto no existe
    echo json_encode(["error" => "El contacto no existe"]);
    exit;
}

// 🔄 Comparar datos actuales con los nuevos
if ($nombre === $currentData['nombre'] && 
    $telefono === $currentData['telefono'] && 
    $email === $currentData['email'] && 
    $profesion === $currentData['profesion']) {
    echo json_encode(["message" => "No se hicieron cambios en el contacto."]);
    exit;
}

// Actualizar solo si hay cambios
$stmt = $conexion->prepare("UPDATE contactos SET nombre = ?, telefono = ?, email = ?, profesion = ? WHERE id = ?");
$stmt->bind_param("ssssi", $nombre, $telefono, $email, $profesion, $id);
$stmt->execute();

// Verificar si la actualización fue exitosa
if ($stmt->affected_rows > 0) { // affected_rows > 0 verifica si se modificó algún registro
    echo json_encode(["message" => "Contacto actualizado correctamente"]);
} else {
    echo json_encode(["error" => "No se pudo actualizar el contacto"]);
}

// Cerrar conexión
$stmt->close();
$conexion->close();
exit;
