<?php
header("Access-Control-Allow-Origin: *"); // Permite que cualquier dominio pueda acceder a este recurso. Es útil cuando trabajamos con APIs y queremos evitar problemas de CORS
header("Content-Type: application/json; charset=UTF-8"); // Indica que la respuesta estará en formato JSON y codificada en UTF-8.
include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $sql = "SELECT * FROM contactos WHERE id = ?";
        $stmt = $conexion->prepare($sql); 
        $stmt->bind_param("i", $id); // Asocia el valor de $id a la consulta preparada.

        if ($stmt->execute()) {
            $result = $stmt->get_result(); //Resultado de la consulta
    
            // Verifico si se encontró el contacto
            if ($row = $result->fetch_assoc()) { // Obtengo la fila de la base de datos como un array asociativo .
                echo json_encode($row); // Si el contacto existe, se devuelve en formato JSON.
            } else {
                echo json_encode(["error" => "Contacto no encontrado"]); // Si el idno existe, se devuelve un mensaje de error en JSON.
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

