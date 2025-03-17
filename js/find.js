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
                // sta función se encarga de cargar el formulario con la información del contacto seleccionado.
            }
        });

    } catch (error) {
        console.log(error);
    }

}