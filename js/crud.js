
document.getElementById("btnAgregar").addEventListener("click", function () {
    openCreateForm();
});


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
                // sta función se encarga de cargar el formulario con la información del contacto seleccionado.
            }
        });

    } catch (error) {
        console.log(error);
    }

}

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



