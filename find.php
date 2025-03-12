<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $sql = "SELECT * FROM contactos WHERE id = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
    
            if ($row = $result->fetch_assoc()) {
                echo json_encode($row);
            } else {
                echo json_encode(["error" => "Contacto no encontrado"]);
            }

        } else {
            echo json_encode(["error" => "Error al ejecutar: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["error" => "ID no proporcionado"]);
    }
} else {
    echo json_encode(["error" => "Error en la petición"]);
}

$conexion->close();

