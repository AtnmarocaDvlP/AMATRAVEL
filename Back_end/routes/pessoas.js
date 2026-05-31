const express = require("express");
const router = express.Router();
const db = require("../db"); // importa a conexão do db.js

// Responsabilidade única: definir todas as rotas relacionadas a /pessoas

// GET /pessoas — lista todas as pessoas ativas
router.get("/", (req, res) => {
    db.query("SELECT * FROM pessoa WHERE ativo = 1", (err, resultado) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(resultado);
    });
});

// POST /pessoas — cadastra uma nova pessoa
router.post("/", (req, res) => {
    const { nome, ida, volta } = req.body;
    db.query(
        "INSERT INTO pessoa (nome, valor_ida, valor_volta, ativo) VALUES (?, ?, ?, 1)",
        [nome, ida, volta],
        (err, resultado) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ id: resultado.insertId });
        }
    );
});

// PUT /pessoas/:id — edita uma pessoa existente
router.put("/:id", (req, res) => {
    const { nome, ida, volta } = req.body;
    db.query(
        "UPDATE pessoa SET nome = ?, valor_ida = ?, valor_volta = ? WHERE id = ?",
        [nome, ida, volta, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ sucesso: true });
        }
    );
});

// DELETE /pessoas/:id — desativa uma pessoa (soft delete)
router.delete("/:id", (req, res) => {
    db.query(
        "UPDATE pessoa SET ativo = 0 WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ sucesso: true });
        }
    );
});

module.exports = router;
