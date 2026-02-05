async function loadEncomendasRecebidas() {
    const encomendas = await apiGet("/vendedor/encomendas");
    const table = document.getElementById("encomendas-list");
    table.innerHTML = encomendas.map(e => `
        <tr>
            <td>${e.id}</td>
            <td>${e.cliente}</td>
            <td>${e.total} Kz</td>
            <td>${e.estado}</td>
            <td><button class="btn btn-primary">Ver</button></td>
        </tr>
    `).join('');
}