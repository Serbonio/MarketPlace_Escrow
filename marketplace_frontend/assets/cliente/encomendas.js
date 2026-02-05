async function loadEncomendas() {
    const encomendas = await apiGet("/cliente/encomendas");
    const table = document.getElementById("encomendas-list");
    table.innerHTML = encomendas.map(e => `
        <tr>
            <td>${e.id}</td>
            <td>${e.total} Kz</td>
            <td>${e.estado}</td>
            <td>${e.data}</td>
        </tr>
    `).join('');
}