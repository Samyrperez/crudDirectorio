import { showContainer, hideContainer } from "./ui.js";
import { list, find, remove, updateContact } from "./api.js";
import { openEditForm, openCreateForm } from "./formHandler.js";
import { searchContacts } from "./search.js";

document.getElementById("btnAgregar").addEventListener("click", openCreateForm);

document.getElementById("buscador").addEventListener("input", function () {
    const valor = this.value.trim();
    if (valor.length >= 1) {
        searchContacts(valor);
    } else {
        console.log("Escribe al menos 3 caracteres para buscar");
    }
    if (valor.length === 0) list();
});

list();
