async function loadVendedores() {
    const vendedores = await apiGet("/admin/vendedores");
    const table = document.getElementById("vendedores-list");
    table.innerHTML = vendedores.map(v => `
        <tr>
            <td>${v.id}</td>
            <td>${v.loja}</td>
            <td>${v.email}</td>
            <td>${v.estado}</td>
            <td><button class="btn btn-success" onclick="aprovarVendedor(${v.id})">Aprovar</button></td>
        </tr>
    `).join('');
}

async function aprovarVendedor(id){
    await apiPut(`/admin/vendedores/${id}/aprovar`);
    loadVendedores();
}