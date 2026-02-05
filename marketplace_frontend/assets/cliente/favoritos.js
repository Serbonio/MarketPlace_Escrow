let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function addFavorito(produto){
    favoritos.push(produto);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    alert("Produto adicionado aos favoritos!");
}

function renderFavoritos(){
    const container = document.getElementById("favoritos-list");
    container.innerHTML = favoritos.map(f => `<li>${f.nome} - ${f.preco} Kz</li>`).join('');
}