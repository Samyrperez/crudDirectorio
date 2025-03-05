<?php
include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $nombre = $_GET["nombre"];
    $telefono = $_GET["telefono"];
    $email = $_GET["email"];
    $profesion = $_GET["profesion"];

    $sql = "SELECT * FROM contactos ORDER BY nombre";

    if ($conexion->query($sql) == TRUE) {
        echo "Consulta exitosa";
    } else {
        echo "Error en la consulta:" . $conexion->error;
    }

} else {
    echo "error en la petición";
}