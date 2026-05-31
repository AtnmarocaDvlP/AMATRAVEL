const express = require("express");
const router = express.Router();
const db = require("../db"); // importa a conexão do db.js

// Responsabilidade única: definir todas as rotas relacionadas a /viagens

// GET /viagens — lista todas as viagens ativas com seus passageiros
router.get("/", (req, res) => {
    db.query(`
        SELECT
            v.id AS id_viagem,
            v.ida,
            v.volta,
            v.data_viagem,
            p.nome AS nome_passageiro,
            p.id AS id_passageiro
        FROM viagens v
        JOIN viagem_passageiro vp ON v.id = vp.viagem_id
        JOIN pessoa p ON vp.pessoa_id = p.id
        WHERE v.ativo = 1
        `, (err, resultado) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(resultado);
    });
});

// POST /viagens — registra uma nova viagem com seus passageiros
router.post("/", (req, res) => {
    const { data_viagem, ida, volta, ids_passageiros } = req.body;
    db.query(
        "INSERT INTO viagens (data_viagem, ida, volta, ativo) VALUES (?, ?, ?, 1)",
        [data_viagem, ida, volta],
        (err, resultado) => {
            if (err) return res.status(500).json({ erro: err });

            const nova_viagem_id = resultado.insertId;

            ids_passageiros.forEach(id_da_pessoa => {
                db.query(
                    "INSERT INTO viagem_passageiro (viagem_id, pessoa_id, pago) VALUES (?, ?, 0)",
                    [nova_viagem_id, id_da_pessoa]
                );
            });

            res.json({ id: nova_viagem_id, sucesso: true });
        }
    );
});

// DELETE /viagens/:id — desativa uma viagem (soft delete)
router.delete("/:id", (req, res) => {
    db.query(
        "UPDATE viagens SET ativo = 0 WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ sucesso: true });
        }
    );
});

module.exports = router;
