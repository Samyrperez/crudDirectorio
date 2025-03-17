import {searchContacts } from "./seacrh.js"
import {list} from "./list.js"
import { find } from "./find.js";

document.getElementById("btnAgregar").addEventListener("click", function () {
    openCreateForm();
});

function showContainer() {
    document.getElementById("container").style.display = "block";
}

function hideContainer() {
    document.getElementById("container").style.display = "none";
}

// Capturar la búsqueda desde el input
document.getElementById("buscador").addEventListener("input", function () {
    const valor = this.value.trim();

    if (valor.length >= 1) {
        searchContacts(valor);
    } else {
        console.log("Escribe al menos 3 caracteres para buscar");
    }

    if(valor.length === 0){
        list();
    }
});

list();


// ---------------------------------------------------
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

// ---------------------------------------------------
// Función para crear el formulario de edición con id del contacto que se quiere editar
async function openEditForm(contactID) {
    console.log("Abriendo formulario de edición para ID:", contactID);

    // 🚀 1. Verifico si el contenedor ya existe, si no, crearlo dinámicamente
    let editFormContainer = document.getElementById("editFormContainer");
    let container = document.getElementById("container");

    if (!editFormContainer) {
        editFormContainer = document.createElement("div");
        editFormContainer.id = "editFormContainer";
        document.body.appendChild(editFormContainer); // Agregarlo al cuerpo de la página o donde corresponda

        // Esto evita que se creen múltiples formularios cada vez que se edita un contacto.
    }

    //  2. Obtener los datos del contacto desde la base de datos
    try {
        const response = await fetch(`get_contact.php?id=${contactID}`);
        const data = await response.json();

        if (data.error) {
            alert("Error: " + data.error);
            return;
        }

        container.innerHTML = "";
        hideContainer();
        // 🚀 3. Insertar el formulario en el contenedor
        editFormContainer.innerHTML = `
            <form id="editForm">
                    <div class="containerFormEdit">
                    <label>Nombre: <input type="text" id="editNombre" value="${data.nombre}" required></label>
                    <br>
                    <label>Teléfono: <input type="text" id="editTelefono" value="${data.telefono}" required></label>
                    <br>
                    <label>Email: <input type="email" id="editEmail" value="${data.email}" required></label>
                    <br>
                    <label>Profesion: <input type="text" id="editProfesion" value="${data.profesion}" required></label>
                    <br>
                </div>
                <div class="containerButttonForm">
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" id="cancelEdit">Cancelar</button>
                </div>
            </form>
        `;

        // 4. Manejo el envío del formulario
        document.getElementById("editForm").addEventListener("submit", function (event) {
            event.preventDefault();
            updateContact(contactID);
        });

        // 🚀 5. Manejar el botón "Cancelar"
        document.getElementById("cancelEdit").addEventListener("click", function () {
            editFormContainer.innerHTML = "";
            find(contactID); // Volver a mostrar los datos del contacto
            showContainer();
        });

    } catch (error) {
        console.error("Error al obtener los datos del contacto:", error);
        alert("Hubo un problema al cargar los datos.");
    }
}

// ---------------------------------------------------
async function updateContact(id) {
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


// --------------------------------------------------
async function openCreateForm() {
    console.log("Abriendo formulario de creación de contacto");

    let createFormContainer = document.getElementById("createFormContainer");
    let container = document.getElementById("container");

    if (!createFormContainer) {
        createFormContainer = document.createElement("div");
        createFormContainer.id = "createFormContainer";
        document.body.appendChild(createFormContainer);
    }

    container.innerHTML = "";
    hideContainer();
    createFormContainer.innerHTML = `
        <form id="createForm">
            <div class="containerFormCreate">
                <label>Nombre: <input type="text" id="createNombre" required></label>
                <br>
                <label>Teléfono: <input type="text" id="createTelefono" required></label>
                <br>
                <label>Email: <input type="email" id="createEmail" required></label>
                <br>
                <label>Profesion: <input type="text" id="createProfesion" required></label>
                <br>
            </div>
            <div class="containerButttonFormCreate">
                <button type="submit" id="btnGuardar">Guardar Contacto</button>
                <button type="button" id="cancelCreate">Cancelar</button>
            </div>
        </form>
    `;

    document.getElementById("createForm").addEventListener("submit", async function (event) {
        console.log("Guardando contacto...");

        const nuevoContacto = {
            nombre: document.getElementById("createNombre").value,
            telefono: document.getElementById("createTelefono").value,
            email: document.getElementById("createEmail").value,
            profesion: document.getElementById("createProfesion").value
        };

        try {
            const response = await fetch("create.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoContacto)
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (data.success) {
                alert("Contacto creado exitosamente.");
                createFormContainer.innerHTML = "";
                list(); 
            } else {
                alert("Error: " + (data.error || "Error desconocido"));
                console.error("Error en servidor:", data);
            }
        } catch (error) {
            console.error("Error al guardar contacto:", error);
            alert("Hubo un problema al guardar el contacto. Revisa la consola.");
        }
    });

    document.getElementById("cancelCreate").addEventListener("click", function () {
        console.log("Cancelando creación...");
        createFormContainer.innerHTML = "";
        location.reload();
    });
}



