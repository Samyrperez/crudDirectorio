export async function searchContacts(nombre) {
    const lista = document.getElementById("tablaBody");

    if (!nombre || typeof nombre !== "string") return; // Evita errores si el valor es null o undefined

    try {
        const response = await fetch(`search.php?nombre=${encodeURIComponent(nombre)}`);
        const data = await response.json();
        // console.log(data);

        lista.innerHTML = "";
        if (!Array.isArray(data) || data.length === 0) {
            lista.innerHTML = `<tr><td colspan="3" >No se encontraron contactos</td></tr>`;
            return;
        }

        data.forEach(contacto => {
            lista.innerHTML += `
                <tr>
                    <td>${contacto.nombre}</td>
                    <td>${contacto.telefono}</td>
                    <td>${contacto.profesion}</td>
                </tr>
            `;
        });


    } catch (error) {
        console.log(error);
    }
}
