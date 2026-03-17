class Pedido{

    calcularTotal(itens){
        let total=0
        for(let i=0;i<itens.length; i++){
             total+=itens[i].quantidade*itens[i].preco;
             
        }
        return total;
    }
    verificarUsuario(usuarioComprou, usuarioPedido){
        return (usuarioComprou===usuarioPedido)?true:false;
    }
    criarPedido(usuario_id, total, status){
        
    }
}

describe("funcoes relacionadas ao pedido",()=>{
    const usuarioComprou=100;

    const dadosIniciais = {
        usuario_id:100,
        itens:[
            {
                produto_id:1,
                quantidade:3,
                preco: 100
            },
            {
                produto_id:3,
                quantidade:2,
                preco: 250
            },
            {
                produto_id:2,
                quantidade:4,
                preco: 200
            },
            ]
    }
    const {itens} = dadosIniciais
    test('calcular todo pedido',()=>{
        const pedido = new Pedido();
        const total = pedido.calcularTotal(itens);

        expect(1600).toBe(total);
    }
    )
    test('pedido pertence a ?',()=>{
        const pedido = new Pedido();

        const usuario_comprou=usuarioComprou;
        const usuario_id = dadosIniciais.usuario_id
        const isComprador=pedido.verificarUsuario(usuarioComprou, usuario_id)

        expect(isComprador).toBe(true)
    })
    test.todo('alterar status do pedido', )
})