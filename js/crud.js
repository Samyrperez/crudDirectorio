
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
        console.log(data);

        const container = document.getElementById("container");

        container.innerHTML = "";
        container.innerHTML = `
            <h2>Editar contacto</h2>
            <p>Nombre: ${data.nombre}</p>
            <p>Teléfono: ${data.telefono}</p>
            <p>Email: ${data.email}</p>
            <p>Profesión: ${data.profesion}</p>
        `;

    } catch (error) {
        console.log(error);
    }

}
