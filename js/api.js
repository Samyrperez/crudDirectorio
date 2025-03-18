import { openEditForm } from "./formHandler.js";
export async function list() {
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
                    <span class="nameTable" data-id="${contacto.id}">
                        ${contacto.nombre}
                    </span>
                    </td>
                    <td>${contacto.telefono}</td>
                    <td>${contacto.profesion}</td>
                </tr>
                `;
            lista.innerHTML += row;
        });
        document.getElementById("tablaBody").addEventListener("click", function(event) {
            const target = event.target.closest(".nameTable"); // Busca el elemento más cercano con la clase "nameTable"
            if (target) {
                const contactId = target.getAttribute("data-id");
                find(contactId);
            }
        });
        


    } catch (error) {
        console.log(error);
    }
}

export async function find(id) {

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
                    <button class="btn-upDate" data-id="${data.id}">Editar</button>
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
        document.addEventListener("click", function (event) {
            if (event.target.classList.contains("btn-upDate")) {
                // Se verifica si el elemento clicado (event.target) tiene la clase "btn-upDate", si la tiene devuelve true
                const contactID = event.target.getAttribute("data-id");
                // Se obtiene el valor del atributo data-id del botón que fue clicado
                openEditForm(contactID);
                // Se llama a la función openEditForm(contactID), enviando el ID del contacto.
                // Esta función se encarga de cargar el formulario con la información del contacto seleccionado.
            }
        });

    } catch (error) {
        console.log(error);
    }

}
// Función para eliminar un contacto por ID
export async function remove(id) {
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

export async function updateContact(id) {
    const nombre = document.getElementById("editNombre").value;
    const telefono = document.getElementById("editTelefono").value;
    const email = document.getElementById("editEmail").value;
    const profesion = document.getElementById("editProfesion").value;

    const response = await fetch("update.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nombre, telefono, email, profesion })
    });

    const data = await response.json();
    console.log(data);

    if (data.message) {
        alert(data.message);
        location.reload(); // Recargar la página con los datos actualizados
    } else {
        alert("Error: " + data.error);
    }
}