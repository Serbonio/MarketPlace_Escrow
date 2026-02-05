async function loadPagamentos() {
    const pagamentos = await apiGet("/admin/pagamentos");
    const table = document.getElementById("pagamentos-list");
    table.innerHTML = pagamentos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.cliente}</td>
            <td>${p.vendedor}</td>
            <td>${p.total} Kz</td>
            <td>${p.comissao} Kz</td>
            <td>${p.status}</td>
            <td>
                ${p.status === "Em Escrow" ? `<button class="btn btn-success" onclick="liberarPagamento(${p.id})">Liberar</button>` : ''}
            </td>
        </tr>
    `).join('');
}

async function liberarPagamento(id){
    await apiPut(`/admin/pagamentos/${id}/liberar`);
    loadPagamentos();
}