const mysql = require("mysql2");

// Responsabilidade única: criar e exportar a conexão com o banco de dados.
// Qualquer arquivo que precisar do banco faz: const db = require('./db')

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Fittuning250!",
    database: "amatravel"
});

db.connect(err => {
    if (err) console.log("Erro ao conectar:", err);
    else console.log("Conectado ao MySQL!");
});

module.exports = db;
