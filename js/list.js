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