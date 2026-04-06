const express = require("express"); // vai a pasta node_modules, encontra express e traz
const mysql = require("mysql2"); // faz a mesma coisa que o express mas com mysql
const cors = require("cors"); // faz a mesma coisa que o express mas com cors

const app = express(); // criação do servidor a variavel app é o servidor
app.use(cors()); // permite requisições do front-end
app.use(express.json()); // permite que o servidor receba dados em formato json

const db = mysql.createConnection({ // criação da conexão com o banco de dados
    host: "localhost",
    user: "root",
    password: "Fittuning250!",
    database: "amatravel"
});

db.connect(err => {  // retorno do banco quando testar conexão
    if (err) console.log("Erro ao conectar:", err);
    else console.log("Conectado ao MySQL!");
});

app.get("/pessoas", (req, res) => { // quando acessado, rodar essa function
    db.query("SELECT * FROM pessoa WHERE ativo = 1", (err, resultado) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(resultado);
    });
});

app.listen(3000, () => { // inicia o servidor na porta 3000
    console.log("Servidor rodando em http://localhost:3000");
});