<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "directorio";

$conexion = new mysqli($servername, $username, $password, $dbname);

if ($conexion->connect_error) {
    die ("Error en la conexión: " . $conexion->error);
}


