<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

include "db.php";

$nombre = $_GET["nombre"] ?? "";

if (empty($nombre)) {
    echo json_encode([]); // Devuelve un array vacío si no hay búsqueda
    exit;
}

$sql = "SELECT id, nombre, telefono FROM contactos WHERE nombre LIKE ?"; // LIKE permite buscar coincidencias parciales en lugar de exigir que el nombre sea exacto.
$stmt = $conexion->prepare($sql);
$searchTerm ="%{$nombre}%"; // LIKE usa % como comodín, permitiendo buscar coincidencias parciales.
$stmt->bind_param("s", $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$contactos = [];

while ($row = $result->fetch_assoc()) {
    $contactos[] = $row;
}

echo json_encode($contactos);

$stmt->close();
$conexion->close();

