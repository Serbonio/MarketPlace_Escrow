const { listarLojas, buscarLoja, criarLoja } = require("./lojaService");


    async function listaLojas(){
        try {
            const lojas = await buscarLoja(4);
            console.log(lojas);
        } catch (error) {
            console.error('Erro ao listar lojas:', error);
        }finally{
            sequilize.close();
        }
        
    }
    async function criaLoja(){
        try {
            const novaLoja = await criarLoja(53, {
                nome: 'Walmart', 
                descricao: 'Temos tudo para você', 
                status: 'ativa', 
                reputacao: 4.5
            });
            console.log('Loja criada:', novaLoja);
        } catch (error) {
            console.error('Erro ao criar loja:', error);
        }finally
        {
            sequilize.close();
        }
    }

criaLoja();