async function loadProdutos() {
    const produtos = await apiGet("/produtos");
    const container = document.getElementById("produtos-list");
    container.innerHTML = produtos.map(p => `
        <div class="card m-2 p-2" style="width: 18rem;">
            <img src="../assets/images/produtos/${p.imagem}" class="card-img-top">
            <div class="card-body">
                <h5>${p.nome}</h5>
                <p>${p.preco} Kz</p>
                <button class="btn btn-primary" onclick='addToCart(${JSON.stringify(p)})'>Adicionar ao Carrinho</button>
            </div>
        </div>
    `).join('');
}