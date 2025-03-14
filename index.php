<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/crud.css">
    <link rel="stylesheet" href="./css/crud.css?v=2<?php echo time();?>"> 
    <title>Directorio</title>
</head>

<body>

    <h1 id="titulo">Directorio</h1>
    <div id="container">

        <div class="top-bar">
            <input type="text" id="buscador" placeholder="Buscar contacto...">
            <button id="btnAgregar">Agregar Contacto</button>
        </div>

        <div id="lista">
            <table id="tablaContactos">
    
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Oficio</th>
                    </tr>
                </thead>
                
    
                <tbody id="tablaBody">
                    <!-- Aquí irán los contactos desde la BD -->
                </tbody>
            </table>
        </div>
        

    </div>

    <script src="./js/crud.js?v=2"></script>



</body>

</html>
