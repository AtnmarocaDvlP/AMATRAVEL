const express = require("express");
const router = express.Router();
const db = require("../db"); // importa a conexão do db.js

// Responsabilidade única: definir todas as rotas relacionadas a /historico

// GET /historico — busca histórico de viagens com filtros opcionais
router.get("/", (req, res) => {
    const { data_inicio, data_fim, pessoa_id, ida, volta } = req.query;

    let query = `
        SELECT
            vp.id AS id_viagem_passageiro,
            p.nome AS nome_passageiro,
            v.data_viagem,
            v.ida,
            v.volta,
            p.valor_ida,
            p.valor_volta,
            vp.pago
        FROM viagem_passageiro vp
        JOIN pessoa p ON vp.pessoa_id = p.id
        JOIN viagens v ON vp.viagem_id = v.id
        WHERE v.ativo = 1`;

    let valores = [];

    if (pessoa_id) { query += " AND vp.pessoa_id = ?";    valores.push(pessoa_id); }
    if (data_inicio) { query += " AND v.data_viagem >= ?"; valores.push(data_inicio); }
    if (data_fim)    { query += " AND v.data_viagem <= ?"; valores.push(data_fim); }
    if (ida)         { query += " AND v.ida = ?";          valores.push(ida); }
    if (volta)       { query += " AND v.volta = ?";        valores.push(volta); }

    db.query(query, valores, (err, resultado) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(resultado);
    });
});

// PUT /historico/:id — atualiza o status de pagamento de um registro viagem_passageiro
// O :id aqui é o id da tabela viagem_passageiro (id_viagem_passageiro)
router.put("/:id", (req, res) => {
    const { pago } = req.body; // pago: 1 (pago) ou 0 (pendente)
    db.query(
        "UPDATE viagem_passageiro SET pago = ? WHERE id = ?",
        [pago, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ sucesso: true });
        }
    );
});

module.exports = router;
