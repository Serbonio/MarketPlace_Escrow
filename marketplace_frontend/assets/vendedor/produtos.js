async function loadProdutosVendedor() {
    const produtos = await apiGet("/vendedor/produtos");
    const table = document.getElementById("produtos-list");
    table.innerHTML = produtos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nome}</td>
            <td>${p.preco} Kz</td>
            <td>
                <button class="btn btn-warning" onclick="editarProduto(${p.id})">Editar</button>
                <button class="btn btn-danger" onclick="removerProduto(${p.id})">Remover</button>
            </td>
        </tr>
    `).join('');
}

async function editarProduto(id){ /* Implementar modal ou redirecionamento */ }
async function removerProduto(id){
    await apiDelete(`/vendedor/produtos/${id}`);
    loadProdutosVendedor();
}