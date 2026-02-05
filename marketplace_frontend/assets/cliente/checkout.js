async function finalizarCompra(dados){
    const res = await apiPost("/encomendas", { carrinho, dados });
    if(res.success){
        localStorage.removeItem("carrinho");
        alert("Compra realizada com sucesso!");
        window.location.href = "encomendas.html";
    } else {
        alert("Erro: " + res.message);
    }
}