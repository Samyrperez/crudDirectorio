

async function list() {
    const lista = document.getElementById("tablaBody");


    try {
        const response = await fetch("read.php");
        const data = await response.json();
        // console.log(data);

        lista.innerHTML = "";

        data.forEach(contacto => {
            const row = `
                <tr>
                    <td>
                    <span id="nameTable" onclick="find(${contacto.id})">
                    ${contacto.nombre}
                    </span>
                    </td>
                    <td>${contacto.telefono}</td>
                    <td>${contacto.profesion}</td>
                </tr>
                `;
            lista.innerHTML += row;
        });


    } catch (error) {
        console.log(error);
    }


}

list();

async function find(id) {

    try {
        const response = await fetch("find.php?id=" + id);
        const data = await response.json();
        console.log(data);

        const container = document.getElementById("container");

        container.innerHTML = "";
        container.innerHTML = `
            <div class="header-btn">
                <h2>Información de contacto</h2>
                <div class="btns">
                    <button id="btn-upDate">Editar</button>
                    <button class="btn-delete" data-id="${data.id}">Eliminar</button>
                </div>
            </div>
            <div class="data">

                <table id="tableInfoUser">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Oficio</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                        <td>${data.nombre}</td>
                        <td>${data.telefono}</td>
                        <td>${data.email}</td>
                        <td>${data.profesion}</td>
                    </tr>
                    </tbody>

                </table>
            </div>
            <button id="return">Volver</button>
            
        `;

        // Selecciono el botón y le agrego el evento
        document.getElementById("return").addEventListener("click", () => {
            location.reload(); // Recarga la página para volver al estado original
        });

         // Agregar evento al botón "Eliminar"
        document.querySelector(".btn-delete").addEventListener("click", function () {
            const contactId = this.getAttribute("data-id");
            if (confirm("¿Estás seguro de eliminar este contacto?")) {
                remove(contactId);
            }
            console.log(contactId)
        });

    } catch (error) {
        console.log(error);
    }

}


// Función para eliminar un contacto por ID
async function remove(id) {
    console.log("Intentando eliminar ID:", id); 

    if (!id || isNaN(id)) { // isNaN(id) → Comprueba si el id no es un número.
        alert("Error: ID inválido");
        return;
    }

    try {
        const response = await fetch("delete.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // indica que el cuerpo de la solicitud está en formato JSON
            },
            body: JSON.stringify({ id: parseInt(id) }), // JSON.stringify({ id: parseInt(id) })convierte un objeto de JavaScript a una cadena JSON.
            //{ id: parseInt(id) } crea un objeto con una clave id, cuyo valor es el número entero resultante de parseInt(id).
        });

        const data = await response.json();
        console.log(data);

        if (data.message) {
            alert(data.message);
            location.reload(); // Recargar la página para actualizar la lista
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error en la eliminación:", error);
        alert("Hubo un problema al eliminar el contacto.");
    }
}



