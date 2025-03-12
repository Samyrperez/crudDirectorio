
document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll(".btn-delete").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            
            if (confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
                remove(id);
            }
        });
    });
    
    
})

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
                    <span style="cursor:pointer; color:blue;" onclick="find(${contacto.id})">
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
        // console.log(data);

        const container = document.getElementById("container");

        container.innerHTML = "";
        container.innerHTML = `
            <div class="title-btn">
                <h2>Editar contacto</h2>
                <button id="btn-upDate">Actualizar</button>
                <button class="btn-delete" data-id="<?php echo $contacto['id']; ?>">Eliminar</button>
            </div>
            <div class="data"> 
                <p>Nombre: ${data.nombre}</p>
                <p>Teléfono: ${data.telefono}</p>
                <p>Email: ${data.email}</p>
                <p>Profesión: ${data.profesion}</p>
            </div>
            <button id="volver">Volver</button>
            
        `;

        // Seleccionar el botón ya insertado y agregarle el evento
        document.getElementById("volver").addEventListener("click", () => {
            location.reload(); // Recarga la página para volver al estado original
        });

        

    } catch (error) {
        console.log(error);
    }

}


async function remove(id) {
    try {
        const response = await fetch("delete.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        
        const data = await response.json();
        console.log(data);

        if (data.message) {
            alert(data.message);
            location.reload();
        } else {
            alert("Error: " + data.error);
        }


    } catch (error) {
        console.error("Error en la eliminación:", error);
        alert("Hubo un problema al eliminar el contacto.");
    }

}

