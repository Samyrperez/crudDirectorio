<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $sql = "SELECT * FROM contactos ORDER BY nombre";
    $result = $conexion->query($sql);

    $contactos = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $contactos[] = $row;
        }
    }

    echo json_encode($contactos);
} else {
    echo json_encode("error en la petición");
}


