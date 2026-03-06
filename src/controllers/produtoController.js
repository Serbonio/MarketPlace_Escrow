const produtoService = require('../services/produtoService');

class ProdutoController {
    async create(req, res) {
        try {
            const { loja_id } = req.params; // Mantido: Loja vem da URL
         if (!req.body) {
             return res.status(400).json({ error: "Corpo da requisição vazio. Verifique o Form-Data no Postman." });
            }
        
        let specs = {};
        try {
            specs = req.body.especificacoes ? JSON.parse(req.body.especificacoes) : {};
        } catch (e) {
            console.error("Erro ao processar especificações JSON:", e);
            specs = {};
        }
            // Mapeamos o que o Front envia para o que o Service novo espera
            // O Front envia 'precoVenda', mas o banco usa 'preco'
            const dadosProduto = {
                ...req.body,
                loja_id,
                userId: req.userId,
                especificacoes: specs,
                // Garante que o preço seja um número para o Sequelize (Decimal)
                preco: parseFloat(req.body.preco) || 0, 
                preco_promocional: req.body.preco_promocional ? parseFloat(req.body.preco_promocional) : null,
                estoque: parseInt(req.body.estoque) || 0
            };

            // Verifica se req.files existe antes de mapear
        console.log("DEBUG MULTER:", req.files.map(f => ({ original: f.originalname, gerado: f.filename })));

        let imagens = [];

if (req.files && req.files.length > 0) {
    imagens = req.files.map((file, index) => {
        // Log para você ver no terminal exatamente o que está sendo pego
        console.log("PROPRIEDADES DO ARQUIVO:", Object.keys(req.files[0]));
        return {
            // Se file.filename por algum motivo falhar, tentamos pegar o que o Multer gravou
            url: `/uploads/${file.filename || file.path.split(path.sep).pop()}`,
            principal: index === 0
        };
    });
}
            const produto = await produtoService.criarProdutoCompleto(dadosProduto, imagens);
            
            res.status(201).json(produto);
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async index(req, res) {
        try {
            // Mantém a funcionalidade de filtros via query string
            const produtos = await produtoService.listarProdutos(req.query);
            res.json(produtos);
        } catch (error) {
            console.error(error)
            res.status(400).json({ error: error.message });
        }
    }

    async show(req, res) {
        try {
            const produto = await produtoService.buscarProduto(req.params.id);
            res.json(produto);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async produtosDaLoja(req,res){
        try{const loja_id= req.params.loja_id;
        const produtosLoja = await produtoService.produtosDaLoja(loja_id);
    
        res.status(200).json(produtosLoja)
    }
        catch(error){
            console.error(error)
            res.status(500).json({error:error.message})
        }
    }

    async update(req, res) {
    try {
        const { id } = req.params;

        // 1. Processar especificações JSON (igual ao Create)
        let specs = {};
        if (req.body.especificacoes) {
            try {
                specs = typeof req.body.especificacoes === 'string' 
                    ? JSON.parse(req.body.especificacoes) 
                    : req.body.especificacoes;
            } catch (e) {
                console.error("Erro no parse de specs:", e);
                specs = {};
            }
        }
        try {
            specs = req.body.especificacoes ? JSON.parse(req.body.especificacoes) : {};
        } catch (e) {
            specs = req.body.especificacoes || {}; // fallback
        }

        // 2. Preparar dados (Parse numérico)
        const dadosActualizados = {
            ...req.body,
            especificacoes: specs,
            preco: req.body.preco ? parseFloat(req.body.preco) : undefined,
            preco_promocional: req.body.preco_promocional ? parseFloat(req.body.preco_promocional) : null,
            estoque: req.body.estoque ? parseInt(req.body.estoque) : undefined
        };

        // 3. Processar novas imagens (se houver)
        let novasImagens = [];
        if (req.files && req.files.length > 0) {
            novasImagens = req.files.map((file, index) => ({
                url: `/uploads/${file.filename}`,
                principal: false // Na edição, geralmente as novas fotos não apagam a principal antiga automaticamente
            }));
        }

        // 4. Chamar o service passando os dois parâmetros
        const produto = await produtoService.actualizarProdutoCompleto(id, dadosActualizados, novasImagens);
        
        res.json(produto);
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(400).json({ error: error.message });
    }
}

    async alterarStatus(req, res) {
        try {
            const { status } = req.body; 
            // O service agora valida se é 'ativo', 'inativo' ou 'pausado'
            // Se o seu front envia true/false, fazemos a conversão rápida aqui:
            const novoStatus = status === true || status === 'ativo' ? 'ativo' : 'inativo';
            
            const produto = await produtoService.alterarStatus(req.params.id, novoStatus);
            res.json(produto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await produtoService.removerProduto(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new ProdutoController(); 