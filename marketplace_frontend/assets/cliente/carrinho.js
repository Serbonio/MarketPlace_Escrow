let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function addToCart(produto){
    carrinho.push(produto);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
}

function removeFromCart(index){
    carrinho.splice(index,1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderCart();
}

function renderCart(){
    const container = document.getElementById("carrinho-list");
    container.innerHTML = carrinho.map((p, i) => `
        <tr>
            <td>${p.nome}</td>
            <td>${p.preco} Kz</td>
            <td><button onclick="removeFromCart(${i})" class="btn btn-sm btn-danger">Remover</button></td>
        </tr>
    `).join('');
}